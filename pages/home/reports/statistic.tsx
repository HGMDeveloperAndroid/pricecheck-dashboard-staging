import React, { PureComponent } from 'react'
import Router, { useRouter } from 'next/router';
import Head from 'next/head'
import { format } from 'date-fns';
import Loader from '../../../components/loader/Loader';

import { IsCustomTheme, getDarkTheme, getTheme, getLocale, validateSession, getHeader } from '../../../utils/session-management';
import { buildTheme } from '../../../utils/theme';
import { getI18nLabel } from '../../../i18n';

import { Header } from '../../../components/header';
import { PrimaryButton, SecondaryButton } from '../../../components/buttons';
import FormTable from './component/statistic.form-table';
import Datepicker from '../../../components/datepicker/datepicker'

import api from '../../../utils/api';

import styles from './statistic.module.scss';

class StatisticReport extends PureComponent<any, any> {
    state = {
        chains: [],
        products: [],
        differences: [],
        equivalences: {},
        showFormTable: false,
        from: '',
        to: '',
        chainFilter: [],
        hasUploadedReport: false,
        lastUploadedReportDate: false,
        onFileChangeMessage: '',
        onFileChangeError: false,
        showLoader: false,
    }

    timeout = null

    componentDidMount() {
        const hasDarkTheme = getDarkTheme() === '1' ? true : false;
        const isCustom = IsCustomTheme();

        if (hasDarkTheme) {
            document.querySelector('body').classList.remove('custom')
            document.querySelector('body').classList.add('darkmode')
        }

        if(isCustom) {
            const theme = getTheme();
            const currentTheme = buildTheme(theme);
            const style = document.createElement('style');

            style.innerHTML = currentTheme;

            document.body.appendChild(style);
            document.querySelector('body').classList.add('custom');
        }

        this.getReportStatus();
        validateSession()
    }

    emptyEquivalences = (chains, products) => {
        if (products.length && chains.length) {
            let equivalences = {};

            for (let i = 0; i < products.length; i++) {
                const product = products[i];

                equivalences[product.barcode] = [...new Array(chains.length)].fill(-1)
            }

            return equivalences;
        }
    }

    barcodeFieldHandler = (event) => {
        const { dataset, value } = event.target;
        const { index, barcode } = dataset;
        const equivalences = this.state.equivalences;

        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            equivalences[barcode][parseInt(index)] = parseInt(value);
            this.setState({equivalences});
        }, 1200);
    }

    clearBarcodes = () => {
        const {chains, products} = this.state;
        const equivalences = this.emptyEquivalences(chains, products);
        const inputs = document.querySelectorAll('.barcode-input');

        for (let i = 0; i < inputs.length; i++) {
            const input: any = inputs[i];

            input.value = '';
        }

        this.setState({equivalences});
    }

    onFileChange = async (event) => {
        try {
            event.preventDefault();

            const { files } = event.target;
            const selectedFile = files.length && files[0];

            const endpoint = 'api/master-file/import';
            const request = new FormData();

            const headers = {
                'Content-Type': 'multipart/form-data',
                headers: getHeader(),
            };

            request.append('csv', selectedFile);

            const response = await api.post(endpoint, request, headers);
            const { data: { chains, products } } = response;

            const equivalences = this.emptyEquivalences(chains, products);

            this.setState({
                chains,
                products: [],
                differences: [],
                equivalences: {},
                from: '',
                to: '',
                selectedFile,
                showFormTable: false,
                onFileChangeMessage: 'Archivo CSV correcto',
            }, () => {
                const chainCheckbox: any = document.querySelectorAll('.chain-checkbox');

                for (let checkbox of chainCheckbox) {
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                    }
                }
            });
        } catch(error) {
            console.log('aaa - error: ', error);
            this.setState({
                onFileChangeMessage: 'Archivo incorrecto, adjunta un CSV válido',
                onFileChangeError: true,
            });
        }
    }

    getReportStatus = async () => {
        try {
            const endpoint = 'api/master-file/import';

            const headers = {
                'Content-Type': 'application/json',
                headers: getHeader(),
            };

            const response = await api.get(endpoint, headers);
            const { data } = response;

            let lastUploadedReportDate = data && data.data ? new Date(data.data.date).toDateString() : '';
            lastUploadedReportDate = this.formatDate(lastUploadedReportDate);

            this.setState({
                hasUploadedReport: data.status,
                lastUploadedReportDate: data && data.data ? format(new Date(data.data.date), 'MM/dd/yyyy') : '',
                chains: data && data.data ? data.data.chains : [],
            }, () => {
                const chainCheckbox: any = document.querySelectorAll('.chain-checkbox');

                for (let checkbox of chainCheckbox) {
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                    }
                }
            });
        } catch(error) {
            console.log('aaa - error: ', error);
        }
    }

    getEquivalences = async () => {
        try {
            event.preventDefault();

            const {chains, chainFilter, equivalences, from, to} = this.state;
            const endpoint = 'api/master-file/compare';

            let request = {
                fromDate: this.formatDate(from),
                toDate: this.formatDate(to),
                chains: chainFilter.length ? chainFilter : chains.map((chain) => chain.id),
                equivalences,
            };

            for (let barcode in equivalences) {
                request.equivalences[barcode] = equivalences[barcode].filter((barcode) => barcode)

                if (!request.equivalences[barcode].length) {
                    delete request.equivalences[barcode];
                }

            }

            const headers = {
                'Content-Type': 'application/json',
                headers: getHeader(),
            };

            delete request.equivalences;
            const response = await api.post(endpoint, request, headers);
            const {data: { count, product_differences, resume }} = response;

            this.setState({
                count,
                differences: product_differences,
                resume,
                chainFilter: request.chains,
                showFormTable: false,
            });
        } catch(error) {
            console.log('aaa - error: ', error);
        }
    }

    download(res: any, type = 'text/csv;charset=utf-8;', extension = 'csv') {
        const url = window.URL.createObjectURL(
            new Blob(["\ufeff", res], {
              type,
            }),
        );

        const date = format(new Date(), 'MM-dd-yyyy-HH:mm');
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', `statistic-report-${date}.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }

    downloadReport = async (disableDateFilter = false) => {
        try {
            event.preventDefault();

            const {chains, chainFilter, equivalences, from, to} = this.state;
            const endpoint = 'api/master-file/compare';

            let request = {
                fromDate: disableDateFilter ? '' : this.formatDate(from),
                toDate: disableDateFilter ? '' : this.formatDate(to),
                csv: true,
                chains: chainFilter.length ? chainFilter : chains.map((chain) => chain.id),
                equivalences,
            };

            for (let barcode in equivalences) {
                request.equivalences[barcode] = equivalences[barcode].filter((barcode) => barcode)

                if (!request.equivalences[barcode].length) {
                    delete request.equivalences[barcode];
                }

            }

            const headers = {
                'Content-Type': 'application/json',
                headers: getHeader(),
            };

            delete request.equivalences;

						this.setState({
              showLoader: true,
						});

            const response = await api.post(endpoint, request, headers);

						this.setState({
              showLoader: false,
						});

            this.download(response.data);
        } catch(error) {
            console.log('aaa - error: ', error);
        }
    }

    formatDate(date) {
        if (date) {
            date = new Date(date);

            let month = '' + (date.getMonth() + 1);
            let day = '' + date.getDate();
            let year = date.getFullYear();

            if (month.length < 2) {
                month = '0' + month;
            }

            if (day.length < 2) {
                day = '0' + day;
            }

            return `${year}-${month}-${day}`;
        }

        return ''
    }

    fromDateHandler = (date: any) => {
        this.setState({
            from: date,
        });
    }

    toDateHandler = (date: any) => {
        this.setState({
            to: date,
        });
    }

    chainCheckboxHandler = (event: any) => {
        const { value, checked } = event.target;
        const { chainFilter } = this.state;
        const chainIndex = chainFilter.findIndex((chainId) => chainId == value);

        if (!checked) {
            chainFilter.splice(chainIndex, 1);
        }

        if (checked) {
            chainFilter.push(parseInt(value));
        }
    }

    render() {
			const {
				onFileChangeMessage,
				onFileChangeError,
				products,
				chains,
				differences,
				showFormTable,
				from,
				to,
				hasUploadedReport,
				lastUploadedReportDate,
				showLoader,
			} = this.state;

        const locale = getLocale()

        const formTableProps = {
            barcodeFieldHandler: this.barcodeFieldHandler,
            clearBarcodes: this.clearBarcodes,
            getEquivalences: this.getEquivalences,
            chains,
            products,
        }

        return (
            <React.Fragment>
                <Header locale={locale}/>

                <Head>
                    <title>
                        {getI18nLabel(locale, 'statisticReport.title')}
                    </title>
                </Head>

                <div className='container-fluid'>
                    <h1>{getI18nLabel(locale, 'statisticReport.title')}</h1>

                    {hasUploadedReport && (
                        <div className={styles.reportStatus}>
                            <br/>
                            <br/>
                            <h3> 1) Selección de lista de productos</h3>
                            <div className='update-info'>
                                <h4 className='update-info-title'>
                                    Última actualización del listado: {lastUploadedReportDate}
                                </h4>
                                <SecondaryButton
                                    label={getI18nLabel(locale, 'advancedSearch.actions.getCurrentReport')}
                                    onClick={() => this.downloadReport(true)}
                                />
                            </div>
                        </div>
                    )}

                    <div className={ styles.fileUpload }>
                        <h4>¿Desea subir una lista nueva?</h4>

                        <div className='input-file-container'>
                            <input className='input-file' type='file' onChange={ this.onFileChange }/>
                            {onFileChangeMessage && (
                                <p className={ onFileChangeError ? 'input-file-error' : 'input-file-success' }>
                                    {onFileChangeMessage}
                                </p>
                            )}
                        </div>
                    </div>

                    {chains.length ? (
                        <React.Fragment>
                            <div className='row'>
                                <div className='col-md-5'>
                                    <h4>2) Selecciona un periodo para comparar precios</h4>
                                </div>

                                <div className='col-md-7'>
                                    <div className='fromDate'>
                                        <Datepicker
                                            label={getI18nLabel(locale, 'captures.filters.startDate')}
                                            selected={from}
                                            inlineLabel={true}
                                            onSelect={this.fromDateHandler}
                                            placeholder='dd/mm/yyyy'
                                            dateFormat='dd/MM/yyyy'
                                        />
                                    </div>
                                    <div className='toDate'>
                                        <Datepicker
                                            label={getI18nLabel(locale, 'captures.filters.endDate')}
                                            selected={to}
                                            inlineLabel={true}
                                            onSelect={this.toDateHandler}
                                            placeholder='dd/mm/yyyy'
                                            dateFormat='dd/MM/yyyy'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-5'>
                                </div>

                                <div className='col-md-7 search-button-container'>
                                    <PrimaryButton
                                        label={getI18nLabel(locale, 'advancedSearch.actions.generateReport')}
                                        onClick={() => this.getEquivalences()}
                                    />
                                    &nbsp;&nbsp;
                                    <PrimaryButton
                                        label={getI18nLabel(locale, 'advancedSearch.actions.download')}
                                        onClick={() => this.downloadReport()}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    ): null}

                    {products.length && showFormTable ? (<FormTable {...formTableProps} />): false}

                    {differences.length ? (
                        <div className='report-table-container'>
                            <table className={styles.reportTable}>
                                <thead className='report-table-sticky-header'>
                                    <tr>
                                        <th className='chain-3b item-col'>
                                            Item
                                        </th>
                                        <th className='chain-3b code-col'>
                                            Clave de producto 3B
                                        </th>
                                        <th className='chain-3b barcode-col'>
                                            Código de barras
                                        </th>
                                        <th className='chain-3b description-col'>
                                            Descripción 3B
                                        </th>
                                        <th className='chain-3b content-col'>
                                            Contenido
                                        </th>
                                        <th className='chain-3b unit-col'>
                                            Unidad
                                        </th>
                                        <th className='chain-3b type-col'>
                                            Tipo
                                        </th>
                                        <th className='chain-3b status-col'>
                                            Estatus
                                        </th>
                                        <th className='chain-3b price-col'>
                                            Precio de venta 3B
                                        </th>
                                        {chains.map((chain, index) => (
                                            <React.Fragment key={index}>
                                                <th className='chain-header-container'>
                                                    <div className='chain-header'>
                                                        <h1> {chain.name} </h1>
                                                        <table className='chain-header-table'>
                                                            <thead>
                                                                <tr>
                                                                    <th> Precio de venta {chain.name} </th>
                                                                    <th> Gramaje </th>
                                                                    <th> Unidad </th>
                                                                    <th> Descripción </th>
                                                                    <th> Código de barras </th>
                                                                    <th> Precio comparado </th>
                                                                    <th> Diferencia en pesos </th>
                                                                    <th> Porcentaje de diferencia </th>
                                                                    <th> Capturas </th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                    </div>
                                                </th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {differences.map((difference, index) => (
                                        <tr key={index}>
                                            <td>
                                                {difference.item}
                                            </td>
                                            <td>
                                                {difference.keycode}
                                            </td>
                                            <td>
                                                {difference.barcode}
                                            </td>
                                            <td>
                                                {difference.description}
                                            </td>
                                            <td>
                                                {difference.unit_quantity}
                                            </td>
                                            <td>
                                                {difference.unit}
                                            </td>
                                            <td>
                                                {difference.type}
                                            </td>
                                            <td>
                                                {difference.status}
                                            </td>
                                            <td>
                                                {difference.price ? `$${difference.price}` : ''}
                                            </td>
                                            {difference.comparations.map((comparation, index) => (
                                                <td key={index}>
                                                    <table className={styles.reportTable}>
                                                        <tbody>
                                                            <tr>
                                                                <td className='field field-barcode'> {comparation.chain_price ? `$${comparation.chain_price}` : ''} </td>
                                                                <td className='field field-grammage'> {comparation.grammage} </td>
                                                                <td className='field field-unit'> {comparation.unit} </td>
                                                                <td className='field field-unit_price'> {comparation.description} </td>
                                                                <td className='field field-price'> {comparation.barcode} </td>
                                                                <td className='field field-barcode'> {comparation.compared_price ? `$${comparation.compared_price}` : ''} </td>
                                                                <td className='field field-difference'> {comparation.difference ? `$${comparation.difference}` : ''} </td>
                                                                <td className='field field-percentage'> {comparation.percentage} </td>
                                                                <td className='field field-total_of_scans'> {comparation.total_of_scans} </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : false}
                </div>

                <Loader show={showLoader} />
            </React.Fragment>
        )
    }
}

const withRouter = (props) => {
    const router = useRouter()
    return <StatisticReport {...props} router={router} />
}

export default withRouter;

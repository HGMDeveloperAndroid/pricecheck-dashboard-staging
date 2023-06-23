import React, { PureComponent } from 'react'
import Router, { useRouter } from 'next/router';

import Head from 'next/head'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

import styles from './products.module.scss'

import { Header } from '../../../components/header'
import AdvanceSearch from '../../../components/search/AdvanceSearch'
import { TableComplex } from '../../../components/table'
import api from '../../../utils/api'
import { Input } from '../../../components/input'
import Filter from '../../../components/search/Filter'
import { Checkbox } from '../../../components/checkbox'
import DialogModal from '../../../components/modal/DialogModal'
import { PrimaryButtonVariant } from '../../../components/buttons/PrimaryButton'
import { getDarkTheme, getHeader, getTheme, IsCustomTheme, getLocale} from '../../../utils/session-management'
import { Select } from '../../../components/select'
import { getUnitsCatalog, getBrandsCatalog, getStoresCatalog, getLinesCatalog, getGroupsCatalog } from '../../../utils/catalogs'
import PageTitle from '../../../components/pageTitle/PageTitle'
import Loader from '../../../components/loader/Loader'
import { format } from 'date-fns';
import Datepicker from '../../../components/datepicker/datepicker'
import { getI18nLabel, translateTableComplexHeader } from '../../../i18n';
import { buildTheme } from '../../../utils/theme';

class ProductsPage extends PureComponent<any, any> {
    state = {
        actions: [
            {
                icon: faTrash,
                color: '#DE4747',
                action: (product: { barcode: string }) => this.openModalDelete(product.barcode),
            },
            {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: (product: { barcode: string }) => this.openEdit(product.barcode),
            },
        ],
        currentPage: 1,
        totalPage: 1,
        total: 0,
        count: 0,
        products: [],
        productDeleteBarcode: '',
        isOpen: false,
        header: [
            {
                title: 'Seleccionar',
                name: 'selected',
                type: 'checkbox',
                isHidedable: false,
            },

            {
                title: 'Foto del producto',
                name: 'photo',
                type: 'img',
                isHidedable: false,
            },

            {
                title: 'Nombre',
                name: 'product',
                type: 'text',
                isHidedable: false,
            },

            {
                title: 'Código',
                name: 'barcode',
                type: 'id',
                isHidedable: false,
            },
            {
                title: 'Marca',
                name: 'brand',
                type: 'text',
                isHidedable: false,
            },
            {
                title: 'Tipo',
                name: 'type',
                type: 'text',
                isHidedable: false,
            },
            {
                title: 'Fecha de alta',
                name: 'created_at',
                type: 'date',
                isHidedable: true,
            },

            {
                title: 'Fecha de modificación',
                name: 'updated_at',
                type: 'date',
                isHidedable: true,
            },

            {
                title: 'Cantidad',
                name: 'grammage_quantity',
                type: 'number',
                isHidedable: false,
            },

            {
                title: 'Unidad',
                name: 'unit',
                type: 'text',
                isHidedable: false,
            },
            {
                title: 'Grupo',
                name: 'group',
                type: 'text',
                isHidedable: true,
            },
            {
                title: 'Linea',
                name: 'line',
                type: 'text',
                isHidedable: true,
            },
            {
                title: 'Precio más alto',
                name: 'highest_price',
                type: 'money',
                isHidedable: false,
            },

            {
                title: 'Precio más bajo',
                name: 'lower_price',
                type: 'money',
                isHidedable: false,
            },
            {
                title: 'Precio más bajo con promoción',
                name: 'promotion_lower_price',
                type: 'money',
                isHidedable: false,
            },
            {
                title: 'Último precio capturado',
                name: 'last_price',
                type: 'money',
                isHidedable: false,
            },
            {
                title: 'Acciones',
                name: '',
                type: 'actions',
                isHidedable: false,
            },
        ],
        textSearch: '',
        from: '',
        to: '',
        isModification: null,
        type: null,
        filters: null,
        unitsCatalog: [],
        brandsCatalog: [],
        storesCatalog: [],
        linesCatalog: [],
        groupsCatalog: [],
        selectedCatalog: [],
        optionsCatalog: [
            {
                value: 'brandsCatalog',
                label: 'Marca',
            },
            {
                value: 'groupsCatalog',
                label: 'Grupo',
            },
            {
                value: 'linesCatalog',
                label: 'Linea',
            },
            {
                value: 'unitsCatalog',
                label: 'Unidad',
            },
        ],
        filterSelected: '0',
        filterListSelected: [],
        selectedProductsId: [],
        selectedProductsBarcodes: [],
        showLoader: false,
    }

    componentDidMount = async () => {
        const isCustom = IsCustomTheme();
        const hasDarkTheme = getDarkTheme() === '1' ? true : false;
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

        const currentPage = localStorage.getItem('productsPage') ?
            parseInt(localStorage.getItem('productsPage')) :
            this.state.currentPage

        // Show loader first
        this.setState({ showLoader: true })

        // Asynchronously get all this data without blocking everything else
        const {
            unitsCatalog,
            brandsCatalog,
            storesCatalog,
            linesCatalog,
            groupsCatalog,
        } = await this.loadCatalogs()

        this.setState({
            unitsCatalog,
            brandsCatalog,
            storesCatalog,
            linesCatalog,
            groupsCatalog,
            from: localStorage.getItem('productsFrom') || '',
            to: localStorage.getItem('productsTo') || '',
            textSearch: localStorage.getItem('productsTextSearch') || '',
            type: localStorage.getItem('productsType') || '',
            isModification: localStorage.getItem('productsIsModification') ? localStorage.getItem('productsIsModification') === 'true' : null,
            filterListSelected: localStorage.getItem('productsFilterListSelected') ? JSON.parse(localStorage.getItem('productsFilterListSelected')) : [],
        }, () => {
            this.loadData(currentPage)
            this.clearStorageData()
        })
    }

    loadCatalogs = async () => {
        const fetchers = [
            getUnitsCatalog(),
            getBrandsCatalog(),
            getStoresCatalog(),
            getLinesCatalog(),
            getGroupsCatalog(),
        ]

        const catalogResponse = await Promise.all(fetchers)

        const catalogs = {
            unitsCatalog: catalogResponse[0],
            brandsCatalog: catalogResponse[1],
            storesCatalog: catalogResponse[2],
            linesCatalog: catalogResponse[3],
            groupsCatalog: catalogResponse[4],
        }

        return catalogs
    }

    loadData = async (page: number = 1) => {
        this.setState({ showLoader: true })

        try {
            const response = await api.post(`api/reports/products?page=${page}`, this.createData(), { headers: getHeader() })

            if (response.status === 200) {
                const total = response.data.pagination.total
                const count = response.data.pagination.count
                const currentPage = response.data.pagination.current_page
                const totalPage = response.data.pagination.total_pages
                const products = this.getCheckedProducts(response.data.data)

                this.setState({
                    products,
                    total,
                    count,
                    currentPage,
                    totalPage,
                })
            }
        } catch (e) {
            // TODO: Mostrar mensaje de error
            throw new Error(e)
        } finally {
            this.setState({ showLoader: false })
        }
    }

    getCheckedProducts = (products: any[]) => {
        if (this.state.selectedProductsId.length > 0) {
            products.forEach(el => {
                const productChecked = this.state.selectedProductsId.find(
                    item => item === el.id
                )

                el.checked = productChecked ? true : false
            })
        }

        return products
    }

    createData = () => {
        const data: {
            textSearch?: string,
            from?: any,
            to?: any,
            modifyFrom?: string | null,
            modifyTo?: string | null,
            type?: string | null,
            brand?: Array<string>,
            group?: Array<string>,
            line?: Array<string>,
            chain?: Array<string>,
            unit?: Array<string>,
            items?: any,
        } = {}

        if (this.state.textSearch.length > 0) {
            data.textSearch = this.state.textSearch
        }

        if (this.state.from) {
            const field = this.state.isModification ? 'modifyFrom' : 'from'
            data[field] = this.formatDate(this.state.from)
        }

        if (this.state.to) {
            const field = this.state.isModification ? 'modifyTo' : 'to'
            data[field] = this.formatDate(this.state.to)
        }

        if (this.state.type) {
            data.type = this.state.type
        }


        const brandList = this.state.filterListSelected.filter(
            (e: any) => e.option === 'brandsCatalog'
        )

        if (brandList.length > 0) {
            data.brand = brandList.map(b => b.value)
        }

        const groupList = this.state.filterListSelected.filter(
            (e: any) => e.option === 'groupsCatalog'
        )

        if (groupList.length > 0) {
            data.group = groupList.map(b => b.value)
        }

        const lineList = this.state.filterListSelected.filter(
            (e: any) => e.option === 'linesCatalog'
        )

        if (lineList.length > 0) {
            data.line = lineList.map(b => b.value)
        }

        const storeList = this.state.filterListSelected.filter(
            (e: any) => e.option === 'storesCatalog'
        )

        if (storeList.length > 0) {
            data.chain = storeList.map(b => b.value)
        }

        const unitList = this.state.filterListSelected.filter(
            (e: any) => e.option === 'unitsCatalog'
        )

        if (unitList.length > 0) {
            data.unit = unitList.map(b => b.value)
        }

        return data
    }

    compareProducts = () => {
        Router.push(`/home/products/products-compare?barcodes=${this.state.selectedProductsBarcodes.join(',')}`)
    }

    clearParams = () => {
        this.setState({
            textSearch: '',
            from: '',
            to: '',
            isModification: null,
            type: null,
            filterListSelected: [],
            filterSelected: '0',
        }, () => this.loadData())
    }

    deleteProduct = async () => {
        try {
            const response = await api.delete(
                `api/product/${this.state.productDeleteBarcode}`,
                { headers: getHeader() }
            )

            if (response.status === 204) {
                this.loadData()
            }
        } catch (e) {
            // TODO: Mandar mensaje de error
            throw new Error(e)
        } finally {
            this.setState({
                isOpen: false,
                productDeleteBarcode: ''
            })
        }
    }

    openEdit = (barcode: string) => {
        this.saveData()
        Router.push(`/home/products/${barcode}?optionRender=detail`)
    }

    openDetail = (barcode: string) => {
        this.saveData()
        Router.push(`/home/products/${barcode}`)
    }
    saveData = () => {
        const {
            currentPage,
            textSearch,
            from,
            to,
            isModification,
            type,
            filterListSelected,
        } = this.state

        localStorage.setItem('productsPage', `${currentPage}`)

        if (textSearch && textSearch.length > 0) {
            localStorage.setItem('productsTextSearch', textSearch)
        }

        if (from && from.length > 0) {
            localStorage.setItem('productsFrom', from)
        }

        if (to && to.length > 0) {
            localStorage.setItem('productsTo', to)
        }

        if (type && type.length > 0) {
            localStorage.setItem('productsType', type)
        }

        if (isModification !== null) {
            localStorage.setItem('productsIsModification', isModification)
        }

        if (filterListSelected && filterListSelected.length > 0) {
            localStorage.setItem('productsFilterListSelected', JSON.stringify(filterListSelected))
        }
    }

    clearStorageData = () => {
        const items = [
            'productsPage',
            'productsFrom',
            'productsTo',
            'productsTextSearch',
            'productsType',
            'productsIsModification',
            'productsFilterListSelected',
        ]

        items.forEach(i => localStorage.removeItem(i))
    }

    /**
  * Función para descargar información
  */
     download(res: any, type = 'text/csv;charset=utf-8;', extension = 'csv') {
        const url = window.URL.createObjectURL(
            new Blob(["\ufeff", res], {
              type,
            }),
          );
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `products-report-${format(new Date(), 'MM-dd-yyyy-HH:mm')}.${extension}`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
    }

    downloadData = async () => {
        try {
            const getDownloadData = this.createData()

            if (this.state.selectedProductsId.length > 0) {
                getDownloadData.items = this.state.selectedProductsId
            }

            const response = await api.post(
                `api/reports/products-csv`,
                getDownloadData,
                {
                    headers: getHeader(),
                    responseType: 'arraybuffer',
                }
            )

            if (response.status === 200) {
                this.download(response.data)
            }
        } catch (e) {
            // TODO: Mostrar mensaje de error
            throw new Error(e)
        }
    }

    openModalDelete = (barcode: string) => {
        this.setState({
            isOpen: true,
            productDeleteBarcode: barcode
        })
    }

    getCorrectCatalog = (optionSelected: string) => {
        let selectedCatalog: Array<{ value: any, label: string }> = this.state[optionSelected]
        const filterSelected = optionSelected || '0';

        this.setState({
            selectedCatalog,
            filterSelected,
        })
    }

    getCorrectOption = (value: string) => {
        const filterListSelected: Array<{
            option: string,
            value: string,
            label: string
        }> = this.state.filterListSelected

        const optionSelected = this.state.selectedCatalog.filter(
            (e: { value: string }) => e.value == value
        )

        if (optionSelected.length > 0) {
            filterListSelected.push({
                option: this.state.filterSelected,
                value,
                label: optionSelected[0].label
            })
        }

        this.setState({
            filterListSelected,
            filterSelected: '0',
            selectedCatalog: [],
        })
    }

    deleteDynamicFilter = (value: any) => {
        const filterListSelected = this.state.filterListSelected.filter(
            (el: { value: any }) => value != el.value
        )

        this.setState({ filterListSelected })
    }

    setCheckedProducts = (row: { id: number, barcode: string }) => {
        const selectedProductsId: number[] = [...this.state.selectedProductsId]
        const selectedProductsBarcodes: string[] = [...this.state.selectedProductsBarcodes]
        const indexSelectedItem = selectedProductsId.indexOf(row.id)
        const products = [...this.state.products]
        const selectedProduct = products.find(product => product.id === row.id)

        if (indexSelectedItem > -1) {
            selectedProductsId.splice(indexSelectedItem, 1)
            selectedProduct.checked = false
        }

        else {
            selectedProductsId.push(row.id)
            selectedProductsBarcodes.push(row.barcode)
            selectedProduct.checked = true
        }

        this.setState({ selectedProductsId, products, selectedProductsBarcodes })
    }

    goToCompareProducts = () => {}

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
        })
    }

    toDateHandler = (date: any) => {
        this.setState({
            to: date,
        })
    }

    render() {
        const {
            actions,
            products,
            currentPage,
            total,
            totalPage,
            count,
            from,
            to,
            type,
            textSearch,
            isModification,
            filterSelected,
            filterListSelected,
            selectedCatalog,
            isOpen,
            showLoader,
        } = this.state


        const locale = getLocale()

        const header = translateTableComplexHeader(locale, this.state.header, 'products.table.head')

        let optionsCatalog = this.state.optionsCatalog.map((option) => {
            option.label = getI18nLabel(locale, `products.optionsCatalog.${option.value}`)

            return option
        })

        selectedCatalog.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);

        return (
            <>
                <Head>
                    <title>Productos</title>
                </Head>

                <Header locale={locale}/>

                <Loader show={showLoader} />

                <AdvanceSearch
                    showCompare
                    onCompare={() => this.compareProducts()}
                    onDownload={() => this.downloadData()}
                    inputSearchValue={textSearch}
                    onChangeInputSearch={(e: any) => this.setState({ textSearch: e.target.value })}
                    onSearch={() => this.loadData(1)}
                    onClear={() => this.clearParams()}
                    locale={locale}
                >
                    <div className={styles.filterCon}>
                        <Filter label="" showFilters={true} floatWindow={false}>
                            <div className={styles.filter}>
                                <div className={styles.inputCon}>
                                    <div className={styles.inputs}>
                                        <Datepicker
                                            label={getI18nLabel(locale, 'products.filters.startDate')}
                                            selected={from}
                                            onSelect={this.fromDateHandler}
                                            placeholder='dd/mm/yyyy'
                                            dateFormat='dd/MM/yyyy'
                                        />

                                        <Datepicker
                                            label={getI18nLabel(locale, 'products.filters.endDate')}
                                            selected={to}
                                            onSelect={this.toDateHandler}
                                            placeholder='dd/mm/yyyy'
                                            dateFormat='dd/MM/yyyy'
                                        />
                                    </div>

                                    <div className={styles.dates}>
                                        <Checkbox
                                            label={getI18nLabel(locale, 'products.filters.updatedAt')}
                                            checked={isModification === true}
                                            onChange={() => this.setState((prevState: { isModification: boolean | null }) => { return { isModification: prevState.isModification === true ? null : true } })}
                                        />

                                        <Checkbox
                                            label={getI18nLabel(locale, 'products.filters.createdAt')}
                                            checked={isModification === false}
                                            onChange={() => this.setState((prevState: { isModification: boolean | null }) => { return { isModification: prevState.isModification === false ? null : false } })}
                                        />
                                    </div>
                                </div>

                                <div className={styles.checkboxContainer}>
                                    <Checkbox
                                        label="MC"
                                        checked={type === 'MC'}
                                        onChange={() => this.setState((prevState: { type: string | null }) => { return { type: prevState.type === 'MC' ? null : 'MC' } })}
                                    />

                                    <Checkbox
                                        label="MP"
                                        checked={type === 'MP'}
                                        onChange={() => this.setState((prevState: { type: string | null }) => { return { type: prevState.type === 'MP' ? null : 'MP' } })}
                                    />
                                </div>

                                <div className={styles.inputCon}>
                                    <Select
                                        defaultOption={filterSelected}
                                        label={getI18nLabel(locale, 'products.filters.param')}
                                        onChange={(e: any) => this.getCorrectCatalog(e.target.value)}
                                        options={optionsCatalog}
                                    />

                                    <br />

                                    <Select
                                        defaultOption='0'
                                        label={getI18nLabel(locale, 'products.filters.value')}
                                        onChange={(e: any) => this.getCorrectOption(e.target.value)}
                                        options={selectedCatalog}
                                    />

                                    <br />

                                    <div className={styles.tags}>
                                        {filterListSelected.map((
                                            f: { option: string, value: string, label: string },
                                        ) => {
                                            const optionObj = optionsCatalog.filter(
                                                (o) => o.value === f.option
                                            )

                                            return (
                                                <div key={f.value} className={styles.tag}>
                                                    <span>
                                                        {optionObj[0].label} - {f.label}
                                                    </span>
                                                    <FontAwesomeIcon
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => this.deleteDynamicFilter(f.value)}
                                                        icon={faTimes}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Filter>
                    </div>
                </AdvanceSearch>

                <div className={styles.tableComplexContainer}>
                    <PageTitle title={getI18nLabel(locale, 'products.title')} />

                    <br />

                    <TableComplex
                        actions={actions}
                        content={products}
                        header={header}
                        changePageNext={() => this.loadData(currentPage + 1)}
                        changePagePrev={() => this.loadData(currentPage - 1)}
                        total={total}
                        currentPage={currentPage}
                        totalPage={totalPage}
                        onClickDetails={(id: string) => this.openDetail(id)}
                        onChecked={(row: any) => { this.setCheckedProducts(row) }}
                        count={count}
                        checkboxStyles={styles.checkbox}
                        textNotData=''
                        customClassName='fixed-header'
                    />
                </div>

                <DialogModal
                    btnAcceptLabel={getI18nLabel(locale, 'products.modal.delete.buttonAcceptLabel')}
                    isOpen={isOpen}
                    message={getI18nLabel(locale, 'products.modal.delete.message')}
                    onClose={() => this.setState({ isOpen: false })}
                    btnAcceptType={PrimaryButtonVariant.Error}
                    onAccept={() => this.deleteProduct()} />
            </>
        )
    }
}

const withRouter = (props) => {
    const router = useRouter();

    return <ProductsPage {...props} router={router}/>
}

export default withRouter;

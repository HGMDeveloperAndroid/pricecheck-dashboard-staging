import React, { Component } from 'react';
import Router from 'next/router'
import { Line } from 'react-chartjs-2'
import { Input } from '../input';

import s from './productDetails.module.scss'
import api from '../../utils/api';
import { getDarkTheme, getHeader } from '../../utils/session-management';

import Datepicker from '../datepicker/datepicker'
import { photoUrl } from '../../utils/photo_url'

import { TableComplex } from '../table'
import { faTrash, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import styles from '../../pages/home/products/products.module.scss'
import DialogModal from '../../components/modal/DialogModal'
import { PrimaryButtonVariant } from '../../components/buttons/PrimaryButton'
import { format, parse } from 'date-fns';

import { getLocale } from '../../utils/session-management'
import { getI18nLabel } from '../../i18n';

type Props = {
    id: string,
    priceField: string,
    locale?: string,
}

const groupBy = (key, array) => {
    return array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);

        return objectsByKeyValue;
    }, {});
}

class GraphTab extends Component<Props> {
    colors = [
        '#1B998B',
        '#A7A7A9',
        '#2D3047',
        '#E84855',
        '#BDBF09',
        '#D96C06',
        '#b26c90',
        '#88665D',
        '#C2B97F',
        '#80ED99',
        '#322A26',
        '#3185FC',
        '#EFBCD5',
        '#931621',
        '#44344F',
        '#FF6F59',
        '#95B8D1',
        '#EB4B98',
        '#02394A',
        '#ea00c8',
        '#f1f96d',
    ]

    state = {
        hasDarkTheme: false,
        labels: [],
        datasets: [],
        minDate: '',
        maxDate: '',
        currentPage: 1,
        totalPage: 1,
        total: 0,
        count: 0,
        editableScans: [],
        isOpen: false,
        scanDeleteId: '',
        actions: [
            {
                icon: faTrash,
                color: '#DE4747',
                action: scan => this.openModalDelete(scan.id),
            },
            {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: scan => this.openEdit(scan.id, this.props.id),
            },
        ],
        header: [
            {
                title: 'ID',
                name: 'id',
                type: 'id',
                isHidedable: false,
            },
            {
                title: 'Foto principal',
                name: 'product_picture',
                type: 'img',
                isHidedable: true,
            },
            {
                title: 'Foto del precio',
                name: 'shelf_picture',
                type: 'img',
                isHidedable: true,
            },
            {
                title: 'Cadena comercial',
                name: 'storeName',
                type: 'text',
                isHidedable: false,
            },
            {
                title: 'Código de barras',
                name: 'barcode',
                type: 'number',
                isHidedable: false,
            },
            {
                title: 'Precio',
                name: 'price',
                type: 'string',
                isHidedable: false,
            },
            {
                title: 'Fecha de captura',
                name: 'capture_date',
                type: 'string',
                isHidedable: false,
            },
            {
                title: 'Acciones',
                name: '',
                type: 'actions',
                isHidedable: false,
            },
        ]
    }

    componentDidMount() {
        const hasDarkTheme = getDarkTheme() === '1' ? true : false;

        setTimeout(async () => {
            try {
                await this.loadData()
            } catch (error) {
                // TODO: Mensaje de error
                console.log(error);
            }
        }, 50)

        this.setState({hasDarkTheme})
    }

    componentDidUpdate() {
        if (document) {
            const table = document.querySelector('.product-details-table')

            if (table) {
                table.scrollIntoView(true)
            }
        }
    }

    tooltipOptions = {
        interactions: {
            mode: 'dataset'
        },
        tooltips: {
            callbacks: {
                title: (params) => params.map((param) => {
                    const dataset = this.state.datasets[param.datasetIndex];
                    const capture_day = dataset.data[param.index].capture_day;
                    return capture_day
                }),
                label: (tooltip, data) => {
                    const dataset = this.state.datasets[tooltip.datasetIndex];

                    let label = dataset.label || '';

                    if (label) {
                        label += `: $`;
                    }

                    label += tooltip.yLabel;

                    return label;
                },
                footer: (params) => {
                    let output = []

                    params.map((param) => {
                        const dataset = this.state.datasets[param.datasetIndex];
                        const scan = dataset.data[param.index]
                        const scanId = scan.scanId;


                        for (let i = 0; i < scan.group.length; i++) {
                            output.push(`Id de captura: ${scan.group[i].scanId}`)
                        }
                    })

                    return output
                },
            },
        },
    };

    openModalDelete = (id: string) => {
        this.setState({
            isOpen: true,
            scanDeleteId: id
        })
    }

    openEdit = (id : string, productId: string,) => {
        Router.push(`/home/scans/${id}?product=${productId}`)
    }

    handleDatasetClick = async (event, elements) => {
        if (elements.length > 0) {
            const datasets = []

            for (let index = 0; index < elements.length; index++) {
                const datasetIndex = elements[index]._datasetIndex;
                const scanIndex = elements[index]._index;
                const dataset = this.state.datasets[datasetIndex]
                const clickedScan = dataset.data[scanIndex]

                let scans = dataset.data.filter(scan => (
                    scan.x === clickedScan.x && scan.y === clickedScan.y
                ))

                for (let j = 0; j < scans.length; j++) {
                    const scan = scans[j]

                    datasets.push(scan.group)
                }

            }

            const requestOptions = {
                headers: getHeader(),
            };

            const relatedScans = []

            for (let i = 0; i < datasets.length; i++) {
                const scans = datasets[i]

                for (let j = 0; j < scans.length; j++) {
                    const scan = scans[j]
                    const endpoint = `api/scan/${scan.scanId}/show`
                    const {data: {scan: response}} = (await api.get(endpoint, requestOptions))

                    relatedScans.push(response)
                }
            }

            this.setState({
                editableScans: relatedScans,
            })
        }
    }

    sortLabels(labels) {

        labels = Array.from(new Set(labels))
        labels = labels.sort(function (a, b) {
            a = a.split('-');
            b = b.split('-');
            return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
        })
        labels = Array.from(new Set(labels))

        return labels;
    }

    parseDataset(store) {
        const randomNumber = (max) => max ? Math.floor(Math.random() * max) : 0;
        const randomColor = this.colors[randomNumber(this.colors.length)]

        return {
            borderCapStyle: 'butt',
            fill: false,
            lineTension: 0.1,
            showLine: false,
            label: store.name,
            backgroundColor: randomColor,
            borderColor: randomColor,
            pointBorderColor: randomColor,
            data: store.data,
            scans: store.scans,
            groupedByCaptureDay: [],
        }
    }

    loadData = async () => {
        try {
            const request = {
                from: this.formatDate(this.state.minDate) || null,
                to: this.formatDate(this.state.maxDate) || null,
            };

            const { priceField } = this.props

            const requestOptions = {
                headers: getHeader(),
            };

            const response = await api.post(`api/reports/history-summary/${this.props.id}`, request, requestOptions)
            const requests = [];
            const promises = [];
            const datasets = [];
            let labels = [];


            if (response.status === 200) {
                for (let i = 0; i < response.data.length; i++) {
                    const {summary} = response.data[i];
                    const {storeId, storeName} = summary;

                    const requestExists = requests.find((request) => {
                        const sameStoreName = request.store.toLowerCase() === storeName.toLowerCase();
                        const sameBarcode = request.barcode === this.props.id;

                        return sameStoreName && sameBarcode;
                    });

                    if (!requestExists) {
                        const request = {
                            store: storeName,
                            barcode: this.props.id,
                        }

                        requests.push(request);
                    }
                }

                for (let i = 0; i < requests.length; i++) {
                    const request = {
                        ...requests[i],
                        from: this.formatDate(this.state.minDate) || null,
                        to: this.formatDate(this.state.maxDate) || null,
                    };
                    const promise = new Promise((resolve, reject) => (
                        api.post('api/reports/history-details', request, requestOptions)
                            .then((response) => resolve({...response, storeName: request.store}))
                            .catch((error) => reject(error))
                    ));

                    promises.push(promise);
                }

                const responses = await Promise.all(promises)
                let stores = [];

                for (let i = 0; i < responses.length; i++) {
                    const response = responses[i];
                    let { data } = response.data;

                    data = data.sort((a, b) => new Date(b.capture_day).getTime() - new Date(a.capture_day).getTime())

                    const store = {
                        name: response.storeName,
                        data: data.map((scan: any) => {
                            return {
                                scanId: scan.scan,
                                capture_day: format(new Date(scan.capture_day), "dd-MM-yyyy").split(" ")[0],
                                x: format(new Date(scan.capture_day), "dd-MM-yyyy").split(" ")[0],
                                y: scan[priceField],
                            }
                        }),
                    };

                    stores.push(store);

                    for (let i = 0; i < data.length; i++) {
                        const scan = data[i];

                        const hasValidPrice = Math.ceil(parseFloat(scan.price)) > 0;

                        if (hasValidPrice) {
                            labels.push(format(new Date(scan.capture_day), "dd-MM-yyyy").split(" ")[0],);

                        }
                    }
                }

                labels = this.sortLabels(labels);

                for (let i = 0; i < stores.length; i++) {
                    const dataset = this.parseDataset(stores[i]);
                    let groupedByCaptureDay = groupBy('capture_day', dataset.data)

                    groupedByCaptureDay = labels.map((label) => ({
                        storeName: dataset.label,
                        capture_day: label,
                        x: label,
                        group: groupedByCaptureDay[label] || [],
                    }))

                    for (let j = 0 ; j < dataset.data.length; j++) {
                        const scan = dataset.data[j]

                        const scanIndex = groupedByCaptureDay.findIndex(item => item.capture_day === scan.capture_day)
                        groupedByCaptureDay[scanIndex] = {
                            ...groupedByCaptureDay[scanIndex],
                            ...scan,
                        }
                    }

                    groupedByCaptureDay = groupedByCaptureDay.map(item => {
                        if (!item.group.length) {
                            return {
                                capture_day: '',
                                storeName: '',
                                scanId: 0,
                                group: [],
                                x: null,
                                y: null,
                            }
                        }

                        return item
                    })

                    dataset.data = groupedByCaptureDay
                    datasets.push(dataset);
                }

                this.setState({
                    labels,
                    datasets,
                    editableScans: [],
                });
            }
        } catch (error) {
            // TODO: Mensaje de error
            console.log(error);
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


    minDateHandler = (date: any) => {
        const {minDate, maxDate} = this.state;

        this.setState({
            minDate: date,
        }, () => {
            if (maxDate) {
                this.loadData()
            }
        })
    }

    maxDateHandler = (date: any) => {
        const {minDate, maxDate} = this.state;

        this.setState({
            maxDate: date,
        }, () => {
            if (minDate) {
                this.loadData()
            }
        })
    }

    getChart = () => {
        const {hasDarkTheme} = this.state
        const fillStyle = 'rgba(255, 255, 255, 0)';

        Object.assign(this.tooltipOptions, {
            onClick: this.handleDatasetClick,
        })

        const plugins = (() => ({
            id: 'canvas_background_color',
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.fillStyle = fillStyle;
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }))()

        return (
            <div className={s.graphContainer}>
                <Line height={100} data={this.state} options={this.tooltipOptions} plugins={[plugins]}/>
            </div>
        )
    }

    deleteScan = async () => {
        try {
            const response = await api.delete(
                `api/scan/${this.state.scanDeleteId}`,
                { headers: getHeader() }
            )

            if (response.status === 204) {
                this.setState({
                    isOpen: false,
                    scanDeleteId: ''
                })
                this.loadData()
            }
        } catch (e) {
            // TODO: Mandar mensaje de error
            throw new Error(e)
        }
    }

    render() {
        const {
            minDate,
            maxDate,
            editableScans,
            actions,
            header,
            currentPage,
            count,
            total,
            totalPage,
            isOpen,
        } = this.state;

        const { locale } = this.props

        const scans = editableScans.map((scan) => {
            const {id, barcode, pictures, store, price, status, capture_date} = scan
            const {product_picture, shelf_picture} =  (pictures && pictures.length) && pictures[0]
            const storeName = store && (store.name || '')

            return {
                id,
                barcode,
                product_picture,
                shelf_picture,
                storeName,
                price,
                status,
                capture_date,
            }
        })

        return (
            <div className={s.graphPage}>
                <div className={s.inputsContainer}>
                    <div>
                        <Datepicker
                            label={getI18nLabel(locale, 'graphTab.startDate')}
                            selected={minDate}
                            onSelect={this.minDateHandler}
                            placeholder='dd/mm/yyyy'
                            dateFormat='dd/MM/yyyy'
                        />
                    </div>

                    <div>
                        <Datepicker
                            label={getI18nLabel(locale, 'graphTab.endDate')}
                            selected={maxDate}
                            onSelect={this.maxDateHandler}
                            placeholder='dd/mm/yyyy'
                            dateFormat='dd/MM/yyyy'
                        />
                    </div>
                </div>

                {this.getChart()}

                {scans.length && (
                    <TableComplex
                        actions={actions}
                        content={scans}
                        header={header}
                        changePageNext={() => false}
                        changePagePrev={() => false}
                        total={total}
                        currentPage={currentPage}
                        totalPage={totalPage}
                        onClickDetails={(id: string) => this.openEdit(id, this.props.id)}
                        count={count}
                        checkboxStyles={styles.checkbox}
                        textNotData=''
                        customClassName='fixed-header product-details-table'
                    />
                )}
                <DialogModal
                    btnAcceptLabel={getI18nLabel(locale, 'graphTab.modal.delete.buttonAcceptLabel')}
                    isOpen={isOpen}
                    message={getI18nLabel(locale, 'graphTab.modal.delete.message')}
                    onClose={() => this.setState({ isOpen: false })}
                    btnAcceptType={PrimaryButtonVariant.Error}
                    onAccept={() => this.deleteScan()}
                />
            </div>
        );
    }
}

export default GraphTab;

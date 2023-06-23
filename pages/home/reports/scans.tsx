// LIBS
import React, { Component } from 'react'
import Router, { useRouter } from 'next/router'
import Head from 'next/head'
import groupby from 'lodash.groupby'
import { Bar } from 'react-chartjs-2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns';

// UTILS
import { IsCustomTheme, getDarkTheme, getTheme, getLocale, validateSession, getHeader } from '../../../utils/session-management'
import { buildTheme } from '../../../utils/theme';
import { ADVANCE_SEARCH_TYPE } from '../../../constants/advance-search.const';
import { getI18nLabel, translateTableComplexHeader } from '../../../i18n'
import {
    getGeolocationCatalog,
} from '../../../utils/catalogs'
import {baseURLGeoref, georefApiKey} from '../../../utils/baseUrl';
import { textNotData } from '../../../utils/texts'

// COMPONENTS
import { PrimaryButton, SecondaryButton } from '../../../components/buttons'
import Datepicker from '../../../components/datepicker/datepicker'
import { Checkbox } from '../../../components/checkbox'
import { Input } from '../../../components/input'
import { Select } from '../../../components/select'
import { Header } from '../../../components/header'
import { TableComplex } from '../../../components/table'
import { PrimaryButtonVariant } from '../../../components/buttons/PrimaryButton'
import { ToggleSwitch} from '../../../components/toggleSwitch';
import CreateGeoLocation from '../../../components/GeoLocation/CreateGeoLocation';
import { Dropdown } from '../../../components/dropdown';

// API
import api from '../../../utils/api'

// STYLES
import styles from './scans.module.scss';

enum REPORT_TYPE {
    SCANS_REPORTS = 'SCANS_REPORTS',
    SCANS_CSV_ANALYST_REPORTS = 'SCANS_CSV_ANALYST_REPORTS',
}

enum REPORT_STATUS {
    VALID = 'valid',
    REJECTED = 'rejected',
    PENDING = 'pending',
}

type State = {
    hasDarkTheme?: any,
    currentPage?: number,
    totalPages?: number,
    total?: number,
    count?: number,
    isOpen?: boolean,
    reports?: any,
    regions?: any,
    scanners?: any,
    missions?: any,
    actions?: Array<any>,
    textSearch?: string,
    from?: any,
    to?: any,
    selectedCatalog?: Array<any>,
    optionsCatalog?: Array<any>,
    filterSelected?: string,
    filterListSelected?: Array<any>,
    unitsCatalog?: Array<any>,
    brandsCatalog?: Array<any>,
    storesCatalog?: Array<any>,
    linesCatalog?: Array<any>,
    groupsCatalog?: Array<any>
    type?: string | null,
    status?: string | null,
    isPromotion?: boolean | null,
    withPhoto?: boolean | null,
    selectedRegion?: any,
    selectedRegionLabel?: any,
    selectedUserScanner?: any,
    selectedUserScannerLabel?: any,
    selectedMission?: any,
    selectedMissionLabel?: any,
    labels?: any,
    datasets?: any,
    totalByStatus?: any,
    checkedGeo?:boolean,
    showLoader: boolean,
    nameGeoLocation:String,
    optionsGeoCatalog: Array<any>,
    geolocationCatalog: Array<any>,
    showReportDetails: boolean,
    selectedReportInfo: any,
    detailReadOnly: boolean,
    textNotData: string,
    geolocationIdToggle: string,
    geoReports: any,
    filterDownloadGeo: any,
    baseReports: any,
}

type Props = {
    nameLocation: string,
    geolocationId: string,
    router: any,
}

type ScansReports = {
    mission?: number,
    region?: number,
    from?: any,
    to?: any,
    status?: REPORT_STATUS,
    scanned_by?: number,
}

const emptyFilter = {
    value: 0,
    label: '',
}

class ScansReport extends Component<Props, State> {
    state: State = {
        hasDarkTheme: false,
        currentPage: 1,
        totalPages: 1,
        total: 0,
        count: 0,
        isOpen: false,
        reports: [],
        textSearch: '',
        from: '',
        to: '',
        withPhoto: null,
        isPromotion: null,
        status: null,
        type: null,
        regions: [],
        selectedRegion: '0',
        selectedRegionLabel: '',
        selectedUserScanner: '0',
        selectedUserScannerLabel: '',
        selectedMission: '0',
        selectedMissionLabel: '',
        scanners: [],
        missions: [],
        labels: [],
        datasets: [],
        totalByStatus: {
            Validada: '0',
            Rechazada: '0',
            Pendiente: '0',
        },
        checkedGeo: undefined,
        showLoader: false,
        nameGeoLocation: this.props.nameLocation,
        optionsGeoCatalog: [],
        geolocationCatalog: [],
        showReportDetails: false,
        selectedReportInfo: [],
        detailReadOnly: false,
        textNotData: '',
        geolocationIdToggle: '0',
        geoReports: [],
        filterDownloadGeo: [],
        baseReports: [],
    };

    colors = {
        Validada: 'rgba(255, 99, 132, 1)',
        Pendiente: 'rgba(255, 153, 32, 1)',
        Rechazada: 'rgba(55, 253, 232, 1)',
    }

    header = [
        {
            title: 'Seleccionar',
            name: 'selected',
            type: 'checkbox',
            isHidedable: false,
        },
        {
            title: 'Captura',
            name: 'scan',
            type: 'id',
            isHidedable: false,
        },
        {
            title: 'Foto principal',
            name: 'photo_main',
            type: 'img',
            isHidedable: true,
        },
        {
            title: 'Foto precio',
            name: 'photo_price',
            type: 'img',
            isHidedable: true,
        },
        {
            title: 'Código de barras',
            name: 'barcode',
            type: 'text',
            isHidedable: false,
        },
        {
            title: 'Producto',
            name: 'product',
            type: 'text',
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
            title: 'Cadena comercial',
            name: 'chain',
            type: 'text',
            isHidedable: false,
        },
        {
            title: 'Sucursal',
            name: 'branch',
            type: 'text',
            isHidedable: true,
        },
        {
            title: 'Capturista',
            name: 'scanned_by',
            type: 'text',
            isHidedable: false,
        },
        {
            title: 'Validador',
            name: 'reviewed',
            type: 'text',
            isHidedable: false,
        },
        {
            title: 'Estado',
            name: 'status',
            type: 'text',
            isHidedable: false,
        },
        {
            title: 'Cantidad',
            name: 'grammage_quantity',
            type: 'number',
            isHidedable: true,
        },
        {
            title: 'Unidad',
            name: 'unit',
            type: 'text',
            isHidedable: true,
        },
        {
            title: 'Precio unitario',
            name: 'unit_price',
            type: 'money',
            isHidedable: false,
        },
        {
            title: 'Grupo',
            name: 'group',
            type: 'text',
            isHidedable: false,
        },
        {
            title: 'Línea',
            name: 'line',
            type: 'text',
            isHidedable: false,
        },
        {
            title: 'Fecha de alta de producto',
            name: 'product_created_date',
            type: 'date',
            isHidedable: false,
        },
        {
            title: 'Precio mínimo',
            name: 'lower_price',
            type: 'money',
            isHidedable: false,
        },
        {
            title: 'Precio máximo',
            name: 'highest_price',
            type: 'money',
            isHidedable: false,
        },
        {
            title: 'Fecha de captura',
            name: 'capture_date',
            type: 'date',
            isHidedable: false,
        },
        {
            title: 'Precio de captura',
            name: 'capture_price',
            type: 'money',
            isHidedable: false,
        },
    ]

    async componentDidMount() {
        const hasDarkTheme = getDarkTheme() === '1' ? true : false;
        const isCustom = IsCustomTheme();
        let reports = []

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

        validateSession()

        this.loadData()
    }

    loadData = async () => {
        try {
            this.getGeoCatalogs()
            const regions = await this.fetchRegions({search: ''})
            this.setState({ regions: regions || [] })
        } catch(error) {
            console.log(error)
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.reports.length !== this.state.reports.length) {

            const totalByStatus = {
                Validada: 0,
                Pendiente: 0,
                Rechazada: 0,
            }

            const groupedByStatus = groupby(this.state.reports, 'status')

            for (let status in groupedByStatus) {
                totalByStatus[status] = groupedByStatus[status].length ? groupedByStatus[status].length : 0
            }

            this.setState({
                totalByStatus,
            })
        }
    }

    download(res: any, type = 'text/csv;charset=utf-8;', extension = 'csv') {
        const url = window.URL.createObjectURL(
            new Blob(["\ufeff", res], {
              type,
            }),
          );
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `scan-report-${format(new Date(), 'MM-dd-yyyy-HH:mm')}.${extension}`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
    }

    search = async () => {
        try {
            const {selectedRegion, selectedUserScanner, selectedMission, from, to, status} = this.state
            const params: any = {}

            if(selectedRegion != '0') {
                params.region = selectedRegion
            }

            if(selectedUserScanner != '0') {
                params.scanned_by = selectedUserScanner
            }

            if(selectedMission != '0') {
                params.mission = selectedMission
            }

            if(from) {
                params.from = this.formatDate(from)
            }

            if(to) {
                params.to = this.formatDate(to)
            }

            if(status) {
                params.status = status
            }

            const scansReports = await this.fetchReports(REPORT_TYPE.SCANS_REPORTS, params) || []
            const reports = scansReports.reports || []
            const pagination = scansReports.pagination || {}

            this.setState({
                reports,
                total: pagination.total,
                currentPage: pagination.current_page,
                totalPages: pagination.total_pages,
                count: pagination.count,
            })
        } catch(error) {
            console.log('eee - error: ', error)
        }
    }

    async fetchMissionsRegion(params) {
        try {
            const request = {
                headers: getHeader(),
                params: {},
            }

            if (params) {
                request.params = params
            }

            let response: any = await api.get('/api/reports/missions-region', request)

            response = response && response.data ? response.data : []

            response = response.map((item) => ({
                value: item.id,
                label: item.title,
            }))
            return response
        } catch (error) {
            console.log(error)
        }
    }

    async fetchUsersScanners(params) {
        try {
            const request = {
                headers: getHeader(),
                params: {},
            }

            if (params) {
                request.params = params
            }

            let response: any = await api.get('/api/reports/users-scanner', request)

            response = response && response.data ? response.data : []

            response = response.map((item) => ({
                value: item.id,
                label: item.first_name,
            }))

            return response
        } catch (error) {
            console.log(error)
        }
    }

    async fetchRegions(params) {
        try {
            const request = {
                headers: getHeader(),
                params: {},
            }

            if (params) {
                request.params = params
            }

            let response: any = await api.get('/api/regions/search', request)
            response = response && response.data ? response.data : []
            response = response && response.data ? response.data : []
            response = response && response.data ? response.data : []

            response = response.map((item) => ({
                value: item.id.toString(),
                label: item.name,
            }))

            return response
        } catch (error) {
            console.log(error)
        }
    }

    async fetchCSVReport() {
        try {
            const {selectedRegion, selectedUserScanner, selectedMission, from, to, status} = this.state
            const params = {
                region: selectedRegion || '',
                scanned_by: selectedUserScanner || '',
                mission: selectedMission || '',
                from: this.formatDate(from) || '',
                to: this.formatDate(to) || '',
                status: status || ''
            }
            const scansCsvAnalystReports = await this.fetchReports(REPORT_TYPE.SCANS_CSV_ANALYST_REPORTS, params)

            this.download(scansCsvAnalystReports)
        } catch(error) {
            console.log(error)
        }
    }

    async fetchReports(reportType: REPORT_TYPE, params: any) {
        try {
            const request: any = {
                headers: getHeader(),
                params: {},
            }

            let reportsEndpoint: string = ''
            let output: any

            if (params) {
                request.params = params
            }

            switch(reportType) {
                case REPORT_TYPE.SCANS_REPORTS:
                    reportsEndpoint = '/api/reports/scans-analyst';
                    break;
                case REPORT_TYPE.SCANS_CSV_ANALYST_REPORTS:
                    reportsEndpoint = '/api/reports/scans-csv-analyst';
                    request.responseType = 'blob'
                    break;
                default:
                    console.error('empty report');
            }

            const response = await api.get(reportsEndpoint, request)

            if (response && response.data && response.data.data) {
                const reports = response.data.data || []
                const pagination = response.data.pagination

                output = {reports, pagination}
            }

            if (response && response.data && !response.data.data) {
                const reports = response.data || []

                output = reports
            }

            return output

        } catch(error) {
            console.log(error)
        }
    }

    selectRegion = async (event: any) => {
        try {
            const selectedRegion = event?.target?.value
            const scanners = await this.fetchUsersScanners({region: selectedRegion})
            const missions = await this.fetchMissionsRegion({region: selectedRegion})

            let selectedRegionLabel = this.state.regions.find((region) => region.value === selectedRegion)
            selectedRegionLabel = selectedRegionLabel && selectedRegionLabel.label ? selectedRegionLabel.label : ''

            this.setState({
                selectedRegion,
                selectedRegionLabel,
                scanners,
                missions,
            });
        } catch(error) {
            console.log(error);
        }
    }

    selectUserScanner = async (event: any) => {
        try {
            const selectedUserScanner = event?.target?.value

            let selectedUserScannerLabel = this.state.scanners.find((userScanner) => userScanner.value.toString() === selectedUserScanner)
            selectedUserScannerLabel = selectedUserScannerLabel && selectedUserScannerLabel.label ? selectedUserScannerLabel.label : ''

            this.setState({
                selectedUserScanner,
                selectedUserScannerLabel,
            });
        } catch(error) {
            console.log(error);
        }
    }

    selectMission = async (event: any) => {
        try {
            const selectedMission = event?.target?.value

            let selectedMissionLabel = this.state.missions.find((mission) => mission.value.toString() === selectedMission)
            selectedMissionLabel = selectedMissionLabel && selectedMissionLabel.label ? selectedMissionLabel.label : ''

            this.setState({
                selectedMission,
                selectedMissionLabel,
            });
        } catch(error) {
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

    fromDateHandler = (date: any) => {
        this.setState({
            from: date,
        })

    }

    toDateHandler = (date: any) => {
        this.setState({
            to: date,
        });
    }

    changeStateFilter = (stateIndex :string) =>{
        switch (stateIndex) {
            case 'statusValid':
                this.setState((prevState) => ({status: prevState.status === 'valid' ? null : 'valid'}))
                break;
            case 'statusRejected':
                this.setState((prevState) => ({status: prevState.status === 'rejected' ? null : 'rejected'}))
                break;
            case 'statusPending':
                this.setState((prevState) => ({status: prevState.status === 'pending' ? null : 'pending'}))
                break;
            default:
                break
        }
    }

    clearParams = () => {
        this.setState({
            from: '',
            to: '',
            status: null,
            selectedRegion: '0',
            selectedRegionLabel: '',
            selectedUserScanner: '0',
            selectedUserScannerLabel: '',
            selectedMission: '0',
            reports: [],
            selectedMissionLabel: '',
        })
    }

    getDatasets(reports) {
        let datasets = []
        const labels = {
            'Jan': 'Ene',
            'Feb': 'Feb',
            'Mar': 'Mar',
            'Apr': 'Abr',
            'May': 'May',
            'Jun': 'Jun',
            'Jul': 'Jul',
            'Aug': 'Ago',
            'Sep': 'Sep',
            'Oct': 'Oct',
            'Nov': 'Nov',
            'Dic': 'Dec'
        };

        const groupedByStatus = groupby(reports, 'status')

        for (let status in groupedByStatus) {
            const backgroundColor= this.colors[status]
            groupedByStatus[status] = groupby(groupedByStatus[status], 'capture_date')
            const template = [{x: 'Ene', y: 0}, {x: 'Feb', y: 0}, {x: 'Mar', y: 0}, {x: 'Abr', y: 0}, {x: 'May', y: 0}, {x: 'Jun', y: 0}, {x: 'Jul', y: 0}, {x: 'Ago', y: 0}, {x: 'Sep', y: 0}, {x: 'Oct', y: 0}, {x: 'Nov', y: 0}, {x: 'Dic', y: 0}];

            for (let date in groupedByStatus[status]) {
                const monthIndex = template.findIndex((month) => month.x === labels[this.getMonthName(date)])
                template[monthIndex] = {
                    x: labels[this.getMonthName(date)],
                    y: groupedByStatus[status][date].length
                }
            }

            datasets.push({
                label: status,
                data: template,
                backgroundColor
            })
        }

        return datasets
    }

    getMonthName(label) {
        return label.split('/')[1]
    }

    getChart = () => {
        const {hasDarkTheme, reports} = this.state
        const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const datasets = this.getDatasets(reports);

        const data = {
            labels,
            datasets,
        }

        const options = {
            legend: {
              position: 'bottom',
            },
        };

        return (
            <Bar height={200} width={300} options={options} data={data} />
        )
    }

    sortLabels(labels) {
        labels = labels.sort(function (a, b) {
            a = a.split('/');
            b = b.split('/');
            return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
        })
        labels = Array.from(new Set(labels))

        return labels;
    }

    getMonthNames(labels) {
        const months = []

        for (let i = 0; i < labels.length; i++) {
            const label = this.getMonthName(labels[i])

            months.push(label)
        }

        return months
    }

    setCheckedGeo = (e: any) => {
        this.setState({
            textSearch: '',
            showLoader: true
        });
        const value = !!e;

        this.setState({ checkedGeo: value }, () => {

            if(value){ //Si se enciende busca los filtrados del primer registro
                this.setState({
                    nameGeoLocation: "Georeportes",
                    showLoader: false,
                })
            } else { //Si se apaga busca los generales
                    this.loadData()
            }
        })
    }

    getGeoCatalogs = async () => {
        const fetch = getGeolocationCatalog();
        const catalogs  = await Promise.resolve(fetch);
        const formatedGeoCatalog =  catalogs.map( (item: any, index:any) => {
            return {value:item.id,label:item.name};
        });

        this.setState({
            optionsGeoCatalog: formatedGeoCatalog,
            geolocationCatalog: catalogs,
        });
    }

    setShowLoader = (isActive) => {
        this.setState({
            showLoader: isActive,
        })
    }

    setDetailReadOnly = (detailReadOnly) => {
        this.setState({
            detailReadOnly,
        })
    }

    setShowReportDetails = (showReportDetails) => {
        this.setState({
            showReportDetails,
        })
    }

    setSelectedReportInfo = (report) => {
        this.setState({
            selectedReportInfo: report,
        })
    }

    getGeoReports = async () => {
        this.setShowLoader(true)

        try {
            const response = await api({
                url: 'api/places',
                baseURL: baseURLGeoref,
                headers: { Authorization: `Api-Key ${georefApiKey}` }
            })

            this.transformReportsData(response.data.data)
        } catch (e) {
            throw new Error(e)
        } finally {
            this.setShowLoader(false)
        }
    };

    transformReportsData = (reports: any[]) => {
        const newReportsArray = reports.map(report => ({
            id: report.id,
            location: report.name,
            position1: {
                coordinates: report.point1,
                latitude: report.point1.split(',', 1),
                longitude: report.point1.split(',', 2)[1]
            },
            position2: {
                coordinates: report.point2,
                latitude: report.point2.split(',', 1),
                longitude: report.point2.split(',', 2)[1]
            },
            position3: {
                coordinates: report.point3,
                latitude: report.point3.split(',', 1),
                longitude: report.point3.split(',', 2)[1]
            },
            position4: {
                coordinates: report.point4,
                latitude: report.point4.split(',', 1),
                longitude: report.point4.split(',', 2)[1]
            },
        }))

        this.setGeoReports(newReportsArray)
    }

    deleteReport = async (id: number) => {
        try {
            await api({
                method: 'delete',
                url: `api/places/${id}`,
                baseURL: baseURLGeoref,
                headers: { Authorization: `Api-Key ${georefApiKey}` }
            })
        } catch (e) {

        }finally{
            this.getGeoCatalogs();
            this.getGeoReports();
        }
    };

    showDetailReport = (id: number) => {
        this.getGeoReports();
        const selectedReport = this.state.geoReports.filter(report => report.id == id);

        selectedReport.length > 0 ? this.setSelectedReportInfo(selectedReport[0]) : this.setSelectedReportInfo(this.state.geoReports[0]);

        this.setShowReportDetails(true)
        this.setDetailReadOnly(false)
        this.getGeoCatalogs();
    };

    setGeolocationIdToggle = (id: Number) => {
        this.setState({ showLoader: true })
        // const { value } = e.target as HTMLInputElement
        this.setState({geolocationIdToggle:`${id}`}, () => {
            const resultado = this.state.geolocationCatalog.find((element: any) => element.value === id );
            this.getFilterGeolocated()
            this.setState({ textSearch: '' });
        })
    }

    getFilterGeolocated = () => {
        let selectedGeolocatedId = ''
        if(this.state.geolocationIdToggle !== '0' ){
            selectedGeolocatedId = this.state.geolocationIdToggle;
        } else {
                selectedGeolocatedId = this.state.geolocationIdToggle !== '0'  ?
                this.state.geolocationIdToggle :
                this.state.geolocationCatalog[0].id
        }

        const selectedLocation: any = this.state.geolocationCatalog.filter(
            location => location.id === parseInt(selectedGeolocatedId)
        );
        this.setState({nameGeoLocation:selectedLocation[0].name});
        const selectedGeolocatedData = {
            point1: selectedLocation[0].point1,
            point2: selectedLocation[0].point2,
            point3: selectedLocation[0].point3,
            point4: selectedLocation[0].point4,
        }
        // Obtener datos de geolocalizacion de la API
        api({
            url: 'api/scans',
            baseURL: baseURLGeoref,
            headers: { Authorization: `Api-Key ${georefApiKey}` },
            params: selectedGeolocatedData,
        })
        .then(response => {
            const transformedData = this.transformData(response.data.data)
            const dataDownloadGeo = this.getFilterGeo(transformedData);

            this.setState({
                showLoader: false,
                filterDownloadGeo: dataDownloadGeo,
                reports: transformedData,
                baseReports: transformedData
            })

            if (response.data.data.length === 0) {
                this.setState({ textNotData })
            }else{
                this.setState({ textNotData:'' })
            }
        })
        .catch((e) => {
            throw new Error(e)
        });

        this.setState({
            currentPage: 1,
            totalPages: 1,
        })
    }

    transformData = (data: any[]) => {
        const locale = getLocale()

        return data.map(item => {
            return {
                id: item.id,
                photo_main: item.productPicture,
                photo_price: item.shelfPicture,
                barcode: item.barcode,
                product: item.productName,
                brand: item.brandName,
                scanned_by: item.capturist,
                reviewed:item.validator,
                product_created_date: item.productCreation,
                chain: item.storeName,
                branch: item.storeAddress,
                capture_date: item.captureDate,
                unit_price: item.unitPrice,
                grammage_quantity: item.productUnitQuantity,
                capture_price: item.price,
                unit: getI18nLabel(locale, `captures.units.${item.productUnit}`),
                type: item.productType,
                group: item.groupName,
                line: item.lineName,
                highest_price: item.productMaxPrice,
                lower_price: item.productMinPrice,
                status: item.isValid ? getI18nLabel(locale, `captures.status.validated`) : getI18nLabel(locale, `captures.status.pending`),
                coments: item.comments,
                capturist_id: item.capturistId,
                region: item.region,
                product_price: item.productPrice, //Precio de alta
            }
        })
    }

    getFilterGeo = (data:any) => {
        const options:{} = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatData =  data.map((register:any, index:any) => {
                let obj = {
                    "ID Captura":register.id,
                    // foto_principal:register.photo_main,
                    "Codigo de Barras":register.barcode,
                    "Producto":register.product,
                    "Marca":register.brand,
                    "Tipo":register.type,
                    "Cadena Comercial":register.chain,
                    "Direccion":register.branch,
                    "ID Capturista": register.capturist_id,
                    "Capturista":register.scanned_by,
                    "Region": register.region,
                    "Validador":register.reviewed,
                    "Estatus":register.status,
                    "Comentarios": register.comments,
                    "Cantidad":register.grammage_quantity,
                    "Unidad":register.unit,
                    "Precio Unitario":register.unit_price,
                    "Grupo":register.group,
                    "Linea":register.line,
                    "Fecha de Alta":new Date(register.product_created_date).toLocaleDateString('es',options).replace(RegExp(' de ', 'g'),'/'),
                    "Precio de Alta": register.product_price,
                    "Precio Minimo":register.lower_price,
                    "Precio Maximo":register.highest_price,
                    "Fecha de Captura":new Date(register.capture_date).toLocaleDateString('es',options).replace(RegExp(' de ', 'g'),'/'),
                    "Precio de Captura":register.capture_price,
                    "Promocion": " - ",
                };
                return obj;
        });

        return formatData;
    }

    setGeoReports(geoReports) {
        try {
            this.setState({geoReports})
        } catch(error) {
            console.log(error)
        }
    }

    render() {
        const locale = getLocale()
        const {
            total,
            currentPage,
            totalPages,
            count,
            isOpen,
            reports,
            actions,
            textSearch,
            from,
            to,
            selectedCatalog,
            optionsCatalog,
            filterSelected,
            filterListSelected,
            unitsCatalog,
            brandsCatalog,
            storesCatalog,
            linesCatalog,
            groupsCatalog,
            type,
            status,
            isPromotion,
            withPhoto,
            regions,
            selectedRegion,
            selectedRegionLabel,
            selectedUserScanner,
            selectedUserScannerLabel,
            selectedMission,
            selectedMissionLabel,
            scanners,
            missions,
            totalByStatus,
            showLoader,
            checkedGeo,
            optionsGeoCatalog,
            showReportDetails,
            selectedReportInfo,
            detailReadOnly,
            geoReports,
        } = this.state

        return this.state && (
            <>
                <Header locale={locale}/>

                <Head>
                    <title>
                        {getI18nLabel(locale, 'scansReport.title')}
                    </title>
                </Head>

                <div className={styles.filters}>
                    <div className={styles.leftContainer}>
                        <ul className={styles.filterOptions}>
                            <li>
                                <Select
                                    defaultOption={selectedRegion}
                                    label={getI18nLabel(locale, 'scansReport.filters.region')}
                                    onChange={(e: any) => this.selectRegion(event)}
                                    options={regions}
                                />
                            </li>
                            <li>
                                <Select
                                    defaultOption={selectedUserScanner}
                                    label={getI18nLabel(locale, 'scansReport.filters.scanner')}
                                    onChange={(e: any) => this.selectUserScanner(event)}
                                    options={scanners}
                                />
                            </li>
                            <li>
                                <Select
                                    defaultOption={selectedMission}
                                    label={getI18nLabel(locale, 'scansReport.filters.mission')}
                                    onChange={(e: any) => this.selectMission(event)}
                                    options={missions}
                                />
                            </li>
                        </ul>
                        <ul className={styles.filterOptions}>
                            <li>
                                <Datepicker
                                    label={getI18nLabel(locale, 'captures.filters.startDate')}
                                    selected={from}
                                    onSelect={this.fromDateHandler}
                                    placeholder='dd/mm/yyyy'
                                    dateFormat='dd/MM/yyyy'
                                />
                            </li>
                            <li>
                                <Datepicker
                                    label={getI18nLabel(locale, 'captures.filters.endDate')}
                                    selected={to}
                                    onSelect={this.toDateHandler}
                                    placeholder='dd/mm/yyyy'
                                    dateFormat='dd/MM/yyyy'
                                />
                            </li>
                        </ul>
                        <ul className={styles.filterOptions}>
                            <li>
                                    <Checkbox
                                        className={styles.checkbox}
                                        label={getI18nLabel(locale, 'captures.filters.statusValidated')}
                                        checked={status === 'valid'}
                                        onChange={() => this.changeStateFilter('statusValid')}
                                    />
                            </li>
                            <li>
                                    <Checkbox
                                        className={styles.checkbox}
                                        label={getI18nLabel(locale, 'captures.filters.statusRejected')}
                                        checked={status === 'rejected'}
                                        onChange={() => this.changeStateFilter('statusRejected')}
                                    />
                            </li>
                            <li>
                                    <Checkbox
                                        className={styles.checkbox}
                                        label={getI18nLabel(locale, 'captures.filters.statusPending')}
                                        checked={status === 'pending'}
                                        onChange={() => this.changeStateFilter('statusPending')}
                                    />
                            </li>
                            <li>
                            </li>
                            <li>
                                <ToggleSwitch optionLabels={[
                                    getI18nLabel(locale, 'advancedSearch.actions.georeference'),
                                    getI18nLabel(locale, 'advancedSearch.actions.georeference'),
                                ]} name="switch" id="switch" checked={checkedGeo} onChange={this.setCheckedGeo} />

                                {
                                    checkedGeo &&
                                        <div className={styles.geoSelect}>
                                            <Dropdown title={"Geolocalizaciones"}
                                                options={optionsGeoCatalog}
                                                showReport={this.setGeolocationIdToggle}
                                                deleteReport={this.deleteReport}
                                                showDetailReport= {this.showDetailReport}
                                            />
                                        </div>
                                }
                            </li>
                        </ul>
                        <ul className={styles.filterOptions}>
                            <li>
                                <SecondaryButton
                                    label={getI18nLabel(locale, 'advancedSearch.actions.cleanFilter')}
                                    onClick={this.clearParams}
                                />
                            </li>
                            <li>
                                <SecondaryButton
                                    label={getI18nLabel(locale, 'advancedSearch.actions.search')}
                                    onClick={this.search}
                                />
                            </li>
                            <li>
                                <PrimaryButton
                                    label={getI18nLabel(locale, 'advancedSearch.actions.download')}
                                    onClick={() => this.fetchCSVReport()}
                                />
                            </li>
                        </ul>
                    </div>

                    <div className={styles.rightContainer}>
                        <div className={ styles.graphBlock }>

                            <div className={ styles.resume }>
                                {reports.length > 0 && (
                                    <ul className={styles.info}>
                                        {totalByStatus.Pendiente != 0 && <li>Pendientes: {totalByStatus.Pendiente}</li>}
                                        {totalByStatus.Validada != 0 && <li>Validadas: {totalByStatus.Validada}</li>}
                                        {totalByStatus.Rechazada != 0 && <li>Rechazadas: {totalByStatus.Rechazada}</li>}
                                    </ul>
                                )}
                            </div>

                            <div className={ styles.graph }>

                                <div className={ styles.scannerResume }>
                                    {reports.length > 0 && this.getChart()}
                                    {reports.length > 0 && (
                                        <ul className={styles.info}>
                                            {selectedRegionLabel && <li>Región: {selectedRegionLabel}</li>}
                                            {selectedUserScannerLabel && <li>Capturista: {selectedUserScannerLabel}</li>}
                                            {selectedMissionLabel && <li>Misión: {selectedMissionLabel}</li>}
                                            {(from && to) && <li>Periodo: {format(from, 'MM-dd-yyyy')} a {format(to, 'MM-dd-yyyy')}</li>}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {reports.length && (
                        <TableComplex
                            actions={[]}
                            content={reports || []}
                            header={this.header || []}
                            changePageNext={() => this.fetchReports(REPORT_TYPE.SCANS_CSV_ANALYST_REPORTS, {page: currentPage + 1})}
                            changePagePrev={() => this.fetchReports(REPORT_TYPE.SCANS_CSV_ANALYST_REPORTS, {page: currentPage - 1})}
                            total={total}
                            currentPage={currentPage}
                            totalPage={totalPages}
                            onClickDetails={() => true}
                            onChecked={() => true}
                            count={count}
                            checkboxStyles={''}
                            textNotData={''}
                            reportDetails={true}
                            customClassName='fixed-header'
                        />
                    )}
                </div>
            </>
        )
    }
}

const withRouter = (props) => {
    const router = useRouter()
    return <ScansReport {...props} router={router} />
}

export default withRouter;

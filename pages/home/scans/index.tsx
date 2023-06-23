import React, { Component, SyntheticEvent } from 'react'
import Router, { useRouter } from 'next/router';
import { format } from 'date-fns';
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

import { Header } from '../../../components/header'
import { getDarkTheme, getHeader, getTheme, IsCustomTheme, getLocale } from '../../../utils/session-management'
import AdvanceSearch from '../../../components/search/AdvanceSearch'
import { TableComplex } from '../../../components/table'
import api from '../../../utils/api'
import Filter from '../../../components/search/Filter'
import { Checkbox } from '../../../components/checkbox'
import { Input } from '../../../components/input'
import DialogModal from '../../../components/modal/DialogModal'
import { PrimaryButtonVariant } from '../../../components/buttons/PrimaryButton'
import {
    getUnitsCatalog,
    getBrandsCatalog,
    getStoresCatalog,
    getLinesCatalog,
    getGroupsCatalog,
    getGeolocationCatalog,
} from '../../../utils/catalogs'
import { Select } from '../../../components/select'
import PageTitle from '../../../components/pageTitle/PageTitle'
import Loader from '../../../components/loader/Loader'
import { textNotData } from '../../../utils/texts'

import styles from './scans.module.scss';

import {baseURLGeoref, georefApiKey} from '../../../utils/baseUrl';

import Datepicker from '../../../components/datepicker/datepicker'
import { getI18nLabel, translateTableComplexHeader } from '../../../i18n';

//ELIMINAR import ExportButton from '../../../components/exportButton/ExportButton';
import { buildTheme } from '../../../utils/theme';

type Props = {
    geolocationId: string,
    nameLocation: string,
    router: any,
}

type State = {
    currentPage: number,
    totalPage: number,
    total: number,
    count: number,
    scans: Array<Object>,
    baseScans:Array<Object>,
    isOpen: boolean,
    scanDeleteId: string,
    header: Array<Object>,
    actions: Array<Object>,
    textSearch: string,
    from: any,
    to: any,
    selectedCatalog: Array<Object>,
    geolocationCatalog: Array<Object>,
    optionsGeoCatalog: Array<Object>,
    optionsCatalog: Array<Object>,
    filterSelected: string,
    filterListSelected: Array<Object>,
    unitsCatalog: Array<Object>,
    brandsCatalog: Array<Object>,
    storesCatalog: Array<Object>,
    linesCatalog: Array<Object>,
    groupsCatalog: Array<Object>
    type: string | null,
    status: string | null,
    isPromotion: boolean | null,
    withPhoto: boolean | null,
    selectedGeolocated: number,
    selectedScansId: Array<number>,
    showLoader: boolean,
    textNotData: string,
    filterDownloadGeo:Array<Object>,
    checkedGeo:boolean,
    geolocationIdToggle:string,
    nameGeoLocation:String,
}

class ScansPage extends Component<Props, State> {
    state = {
        currentPage: 1,
        totalPage: 1,
        total: 0,
        count: 0,
        scans: [],
        baseScans:[],
        isOpen: false,
        scanDeleteId: '',
        showLoader: false,
        textNotData: '',
        header: [
            {
                title: 'Seleccionar',
                name: 'selected',
                type: 'checkbox',
                isHidedable: false,
            },
            {
                title: 'Captura',
                name: 'id',
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
                title: 'Linea',
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
            {
                title: 'Acciones',
                name: '',
                type: 'actions',
                isHidedable: false,
            },
        ],
        actions: [
            {
                icon: faTrash,
                color: '#DE4747',
                action: (scan: { scan: string }) => this.openModalDelete(scan.scan),
            },
            {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: (scan: { scan: string }) => this.openEdit(scan.scan),
            },
        ],
        textSearch: '',
        from: '',
        to: '',
        withPhoto: null,
        isPromotion: null,
        status: null,
        type: null,
        filters: null,
        unitsCatalog: [],
        brandsCatalog: [],
        storesCatalog: [],
        linesCatalog: [],
        groupsCatalog: [],
        selectedCatalog: [],
        geolocationCatalog: [],
        optionsGeoCatalog:[],
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
                value: 'storesCatalog',
                label: 'Cadena',
            },
            {
                value: 'unitsCatalog',
                label: 'Unidad',
            },
        ],
        filterSelected: '0',
        filterListSelected: [],
        selectedScansId: [],
        selectedGeolocated: -1,
        filterDownloadGeo:[],
        checkedGeo:false,
        geolocationIdToggle:'0', //Lleva el id de la geolocalizacion seleccioanda
        nameGeoLocation:this.props.nameLocation,
    }

    units = {
        cm: 'Centimetro',
        m: 'Metro',
        ml: 'Mililitro',
        lt: 'Litro',
        mg: 'Miligramo',
        g: 'Gramo',
        kg: 'Kilogramo',
        pieza: 'Pieza',
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

        this.getGeoCatalogs();
        let currentPageSaved = localStorage.getItem('scansPage') ? parseInt(localStorage.getItem('scansPage')) : this.state.currentPage

        // Show loader first
        this.setState({ showLoader: true })

        // Asynchronously get all this data without blocking everything else

        const {
            geolocationCatalog,
            unitsCatalog,
            brandsCatalog,
            storesCatalog,
            linesCatalog,
            groupsCatalog,
        } = await this.loadCatalogs()


        this.setState({
            // optionsGeoCatalog:formatedGeoCatalog,
            geolocationCatalog,
            unitsCatalog,
            brandsCatalog,
            storesCatalog,
            linesCatalog,
            groupsCatalog,
            from: localStorage.getItem('scansFrom') || '',
            to: localStorage.getItem('scansTo') || '',
            textSearch: localStorage.getItem('scansTextSearch') || '',
            status: localStorage.getItem('scansStatus') || '',
            type: localStorage.getItem('scansType') || '',
            withPhoto: localStorage.getItem('scansWithPhoto') ?
                localStorage.getItem('scansWithPhoto') === 'true' :
                null,
            isPromotion: localStorage.getItem('scansWithPhoto') ?
                localStorage.getItem('scansIsPromotion') === 'true' :
                null,
            filterListSelected: localStorage.getItem('scansFilterListSelected') ?
                JSON.parse(localStorage.getItem('scansFilterListSelected')) :
                [],
        }, () => {
            this.state.geolocationIdToggle != '0' ? this.getFilterGeolocated() : this.loadData(currentPageSaved)
            this.clearStorageData()
        })
    }

    // Get all catalogs asynchronously and concurrently
    loadCatalogs = async () => {
        const fetchers = [
            getGeolocationCatalog(),
            getUnitsCatalog(),
            getBrandsCatalog(),
            getStoresCatalog(),
            getLinesCatalog(),
            getGroupsCatalog(),
        ]

        const catalogResponse = await Promise.all(fetchers)

        const catalogs = {
            geolocationCatalog: catalogResponse[0],
            unitsCatalog: catalogResponse[1],
            brandsCatalog: catalogResponse[2],
            storesCatalog: catalogResponse[3],
            linesCatalog: catalogResponse[4],
            groupsCatalog: catalogResponse[5],
        }

        return catalogs
    }
    getGeoCatalogs = async () => {
        const fetch = getGeolocationCatalog();
        const catalogs  = await Promise.resolve(fetch);
        const formatedGeoCatalog =  catalogs.map( (item: any, index:any) => {
            return {value:item.id,label:item.name};
        });

        this.setState({
            optionsGeoCatalog:formatedGeoCatalog,
            geolocationCatalog:catalogs,
        });
    }

    loadData = async (page: number = 1) => {
        this.setState({ showLoader: true })

        try {
            const response = await api.post(
                `api/reports/scans?page=${page}`,
                this.createData(),
                { headers: getHeader() },
            )

            if (response.status === 200) {

                const scans = this.getCheckedScans(response.data.data)
                const total = response.data.pagination.total
                const count = response.data.pagination.count
                const currentPage = response.data.pagination.current_page
                const totalPage = response.data.pagination.total_pages

                this.setState({
                    scans,
                    total,
                    count,
                    currentPage,
                    totalPage,
                    showLoader: false,
                })
            }
        } catch (e) {
            // TODO: Mostrar mensaje de error
            throw new Error(e)
        } finally {
            this.setState({ showLoader: false })
        }
    }

    getCheckedScans = (scans: any[]) => {
        const scan = scans.map(scan => {
            return {
                ...scan, id: scan.scan
            }
        })

        if (this.state.selectedScansId.length > 0) {
            scan.forEach((element: any) => {
                const scanChecked = this.state.selectedScansId.find(item => item === element.id)
                element.checked = scanChecked ? true : false
            })
        }

        return scan
    }

    createData = () => {
        const data: {
            textSearch?: string,
            from?: any,
            to?: any,
            is_promotion?: string | null,
            withPhoto?: string | null,
            status?: string | null,
            type?: string | null,
            brand?: Array<string>,
            group?: Array<string>,
            line?: Array<string>,
            chain?: Array<string>,
            unit?: Array<string>,
        } = {}

        if (this.state.textSearch.length > 0) {
            data.textSearch = this.state.textSearch
        }

        if (this.state.from) {
            data.from = this.formatDate(this.state.from)
        }

        if (this.state.to) {
            data.to = this.formatDate(this.state.to)
        }

        if (this.state.withPhoto !== null) {
            data.withPhoto = this.state.withPhoto ? 'yes' : 'no'
        }

        if (this.state.isPromotion !== null) {
            data.is_promotion = this.state.isPromotion ? 'yes' : 'no'
        }

        if (this.state.status) {
            data.status = this.state.status
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


    clearParams = () => {
        this.setState({
            textSearch: '',
            from: '',
            to: '',
            withPhoto: null,
            isPromotion: null,
            status: null,
            type: null,
            filterListSelected: [],
            filterSelected: '0',
        }, () => this.makeFilter() )
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
                this.loadData(1)
            }
        } catch (e) {
            // TODO: Mandar mensaje de error
            throw new Error(e)
        }
    }

    openEdit = (id: string) => {
        this.saveData()
        Router.push(`/home/scans/${id}`)
    }

    saveData = () => {
        const {
            currentPage,
            textSearch,
            from,
            to,
            withPhoto,
            isPromotion,
            status,
            type,
            filterListSelected
        } = this.state

        localStorage.setItem('scansPage', `${currentPage}`)

        if (textSearch && textSearch.length > 0) {
            localStorage.setItem('scansTextSearch', textSearch)
        }

        if (from && from.length > 0) {
            localStorage.setItem('scansFrom', from)
        }

        if (to && to.length > 0) {
            localStorage.setItem('scansTo', to)
        }

        if (withPhoto !== null) {
            localStorage.setItem('scansWithPhoto', withPhoto)
        }

        if (isPromotion !== null) {
            localStorage.setItem('scansIsPromotion', isPromotion)
        }

        if (status && status.length > 0) {
            localStorage.setItem('scansStatus', status)
        }

        if (type && type.length > 0) {
            localStorage.setItem('scansType', type)
        }

        if (filterListSelected && filterListSelected.length > 0) {
            localStorage.setItem('scansFilterListSelected', JSON.stringify(filterListSelected))
        }
    }

    clearStorageData() {
        const items = [
            'scansPage',
            'scansFrom',
            'scansTo',
            'scansWithPhoto',
            'scansIsPromotion',
            'scansStatus',
            'scansType',
            'scansFilterListSelected',
        ]

        items.forEach(i => localStorage.removeItem(i))
    }

    // Función para descargar información

    download(res: any, type = 'text/csv;charset=utf-8;', extension = 'csv') {
        console.log('aaa - res: ', res)
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

    downloadData = async () => {
        try {
            const getDownloadData: { [key: string]: any } = this.createData()

            if (this.state.selectedScansId.length > 0) {
                getDownloadData.items = this.state.selectedScansId
            }

            const response = await api.post(
                `api/reports/scans-csv`,
                getDownloadData,
                {
                    headers: getHeader(),
                    responseType: 'blob',
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

    openModalDelete = (scan: string) => {
        this.setState({
            isOpen: true,
            scanDeleteId: scan,
        })
    }

    getCorrectCatalog = (optionSelected: string) => {
        let selectedCatalog: Array<{ value: any, label: string }> = this.state[optionSelected]
        const filterSelected = optionSelected

        this.setState({
            selectedCatalog,
            filterSelected,
        })
    }

    getCorrectOption = (value: string) => {
        const filterListSelected: Array<{
            option: string,
            value: string,
            label: string,
        }> = this.state.filterListSelected

        const optionSelected: any = this.state.selectedCatalog.filter(
            // Cast e.value to string because of API shenanigans
            (e: { value: string }) => `${e.value}` === value
        )

        if (optionSelected.length > 0) {
            filterListSelected.push({
                option: this.state.filterSelected,
                value,
                label: optionSelected[0].label,
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
            (e: { value: any }) => value != e.value
        )

        this.setState({ filterListSelected })
    }

    setCheckedScans = (id: any) => {
        const selectedScansId: number[] = [...this.state.selectedScansId]

        const indexSelectedItem = selectedScansId.indexOf(id)

        const scans = [...this.state.scans]
        const selectedScan: any = scans.find((scans: any) => scans.id === id)

        if (indexSelectedItem > -1) {
            selectedScansId.splice(indexSelectedItem, 1)
            selectedScan.checked = false
        }

        else {
            selectedScansId.push(id)
            selectedScan.checked = true
        }

        this.setState({ selectedScansId, scans })
    }
// Filtra las columnas que se mostraran junto con la la creacion del state
// Si se quieren agregar mas datos provenientes de la API agregar aqui
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

    // Obtiene los datos para las geolocalizaciones
    getFilterGeolocated = () => {
        let selectedGeolocatedId = ''
        if(this.state.geolocationIdToggle !== '0' ){
            selectedGeolocatedId = this.state.geolocationIdToggle;
        } else {
                selectedGeolocatedId = this.state.geolocationIdToggle !== '0'  ?
                this.state.geolocationIdToggle :
                this.state.geolocationCatalog[0].id
        }

        const selectedLocation = this.state.geolocationCatalog.filter(
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

                this.setState({ showLoader: false })
                this.setState({filterDownloadGeo:dataDownloadGeo});
                this.setState({ scans: transformedData });
                this.setState({baseScans:transformedData});
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
                currentPage:1,
                totalPage:1,
            })
    }

    setAdvancedSearchText = (e: SyntheticEvent) => {
        const { value } = e.target as HTMLInputElement

        this.setState({ textSearch: value })


    }
    // Se ejecuta cuando el toggle es activado/desactivado
    setCheckedGeo = (e: SyntheticEvent) => {
        this.setState({ textSearch: '' });
        this.setState({ showLoader: true })
        const value = !!e;

        this.setState({ checkedGeo: value }, () => {

            if(value){ //Si se enciende busca los filtrados del primer registro
                this.setState({
                    nameGeoLocation: "Georeportes",
                    scans: [],
                    total: 0,
                    count: 0,
                    currentPage: 0,
                    totalPage:0,
                    showLoader: false,
                })
            }else{ //Si se apaga busca los generales
                    this.loadData()
            }
        })
    }
    // Guarda el id del Geolocalización
    // setGeolocationIdToggle = (e: SyntheticEvent) => {
    setGeolocationIdToggle = (id: Number) => {
        this.setState({ showLoader: true })
        // const { value } = e.target as HTMLInputElement
        this.setState({geolocationIdToggle:`${id}`}, () => {
            const resultado = this.state.geolocationCatalog.find( element => element.value === id );
            this.getFilterGeolocated()
            this.setState({ textSearch: '' });
        })
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
    getFilterGeo = (data:any) => {
        console.log("map",data);
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
    filterOnGeolocation = async ()=> {
        const { textSearch,baseScans, from, to, withPhoto, isPromotion, status,type, selectedCatalog,filterSelected, filterListSelected} = this.state;


        const statusArray = {'valid':'Validado','rejected':'Rechazado','pending':'Pendiente'};
        const parametrosArray = {'brandsCatalog':'brand','groupsCatalog':'group','linesCatalog':'line','storesCatalog':'chain','unitsCatalog':'unit'};
        const desde = Date.parse(from);
        const hasta = Date.parse(to);
            let newArray = baseScans.filter(function (el) {
                return  textSearch !=="" ? el.product.toLowerCase().indexOf(textSearch.toLowerCase()) > -1  : true
            });
            if(!Number.isNaN(desde)){
                newArray = newArray.filter(function (el) {
                    return  Date.parse(el.capture_date) > desde
                });
            }
            if(!Number.isNaN(hasta)){
                newArray = newArray.filter(function (el) {
                    return  Date.parse(el.capture_date) < hasta
                });
            }
            if(isPromotion===true || isPromotion===false){
                newArray = newArray.filter(function (el) {
                    if(el.isPromotion){
                    return  isPromotion===true ? el.isPromotion === 1  : el.isPromotion == 0
                    }else
                    {return true}
                });
            }
            if(isPromotion===true || isPromotion===false){
                newArray = newArray.filter(function (el) {
                    if(el.isPromotion){
                    return  isPromotion===true ? el.isPromotion === 1  : el.isPromotion == 0
                    }else
                    {return true}
                });
            }
            if(status){
                newArray = newArray.filter(function (el) {
                    return  statusArray[status]===el.status
                });
            }
            if(type){
                newArray = newArray.filter(function (el) {
                    return  el.type === type
                });
            }
            if(filterListSelected.length>0){
                newArray = newArray.filter(function (el) {
                    let resp = filterListSelected.every((element, index) => {

                        if(parametrosArray[element.option] === 'line' || parametrosArray[element.option] === 'group'){

                            let match = element.label.slice(-4);
                            const regex = new RegExp(match,'i');
                            return  regex.test(el[parametrosArray[element.option]])
                        }else{
                            return el[parametrosArray[element.option]].toLowerCase() === element.label.toLowerCase();
                        }

                    })
                    return  resp;
                });
            }
            const dataDownloadGeo = this.getFilterGeo(newArray);
            this.setState({filterDownloadGeo:dataDownloadGeo});
            this.setState({
                scans:newArray
            })
    }
    makeFilter = () => {
        this.state.checkedGeo ? this.filterOnGeolocation() : this.loadData();
    }
    changeStateFilter = (stateIndex :string) =>{

            switch (stateIndex) {
                case 'isPromotionFalse':
                    this.setState(
                        (prevState: { isPromotion: boolean | null }) => {
                            return { isPromotion: prevState.isPromotion === false ? null : false }
                        }
                    )

                    break;
                case 'isPromotionTrue':
                    this.setState(
                        (prevState: { isPromotion: boolean | null }) => {
                            return { isPromotion: prevState.isPromotion ? null : true }
                        }
                    )
                    break;
                case 'statusValid':
                    this.setState((prevState: { status: string | null }) => { return { status: prevState.status === 'valid' ? null : 'valid' } })
                    break;
                case 'statusRejected':
                    this.setState((prevState: { status: string | null }) => { return { status: prevState.status === 'rejected' ? null : 'rejected' }})
                    break;
                case 'statusPending':
                    this.setState((prevState: { status: string | null }) => { return { status: prevState.status === 'pending' ? null : 'pending' } })
                    break;
                case 'typeMc':
                    this.setState((prevState: { type: string | null }) => { return { type: prevState.type === 'MC' ? null : 'MC' } })
                    break;
                case 'typeMp':
                    this.setState((prevState: { type: string | null }) => { return { type: prevState.type === 'MP' ? null : 'MP' } })
                    break;
                case 'withPhotoTrue':
                    this.setState((prevState: { withPhoto: boolean | null }) => { return { withPhoto: prevState.withPhoto ? null : true } })
                    break;
                case 'withPhotoFalse':
                    this.setState((prevState: { withPhoto: boolean | null }) => { return { withPhoto: prevState.withPhoto === false ? null : false } })
                    break;
                default:
                    break
            }
    }
    render() {
        const {
            currentPage,
            total,
            totalPage,
            count,
            scans,
            actions,
            textSearch,
            withPhoto,
            isPromotion,
            status,
            type,
            from,
            to,
            selectedCatalog,
            filterListSelected,
            filterSelected,
            isOpen,
            showLoader,
            filterDownloadGeo
        } = this.state

        selectedCatalog.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);

        const locale = getLocale()

        let optionsCatalog = this.state.optionsCatalog.map((option) => {
            option.label = getI18nLabel(locale, `captures.optionsCatalog.${option.value}`)

            return option
        })

        const header = translateTableComplexHeader(locale, this.state.header, 'captures.table.head')
        return (
            <>
                <Head>
                    <title>Scans</title>
                </Head>

                <Header />

                <Loader show={showLoader} />

                {

                    <AdvanceSearch
                        onDownload={() => this.downloadData()}
                        inputSearchValue={textSearch}
                        onChangeInputSearch={this.setAdvancedSearchText}
                        onSearch={() => this.makeFilter()}
                        onClear={() => this.clearParams()}
                        checkedGeo={this.state.checkedGeo}
                        setCheckedGeo = {this.setCheckedGeo}
                        geolocationIdToggle = {this.state.geolocationIdToggle}
                        setGeolocationIdToggle = {this.setGeolocationIdToggle}
                        optionsGeoCatalog = {this.state.optionsGeoCatalog}
                        filterDownloadGeo = {this.state.filterDownloadGeo}
                        getGeoCatalogs = {this.getGeoCatalogs}
                        showGeoref={true}
                        locale={locale}
                    >
                        <div className={styles.filterCon}>
                            <Filter
                                label=""
                                showFilters={true}
                                floatWindow={false}
                            >
                                <div className={`${styles.filter} row`}>
                                    <div className={`${styles.inputCon} col-2 m-0 p-2`}>
                                        <Datepicker
                                            label={getI18nLabel(locale, 'captures.filters.startDate')}
                                            selected={from}
                                            onSelect={this.fromDateHandler}
                                            placeholder='dd/mm/yyyy'
                                            dateFormat='dd/MM/yyyy'
                                        />

                                        <Datepicker
                                            label={getI18nLabel(locale, 'captures.filters.endDate')}
                                            selected={to}
                                            onSelect={this.toDateHandler}
                                            placeholder='dd/mm/yyyy'
                                            dateFormat='dd/MM/yyyy'
                                        />
                                    </div>

                                    <div className={`${styles.checkboxesContainer} col-8 m-0 p-2`}>
                                        <div className="row justify-content-start">
                                            <div className={`${styles.checkboxContainer} col-3 m-0 p-2`}>
                                                <Checkbox
                                                    className={styles.checkbox}
                                                    label={getI18nLabel(locale, 'captures.filters.withImage')}
                                                    checked={withPhoto === true}
                                                    onChange={() => this.changeStateFilter('withPhotoTrue')}
                                                />
                                            </div>

                                            <div className={`${styles.checkboxContainer} col-3 m-0 p-2`}>
                                                <Checkbox
                                                    className={styles.checkbox}
                                                    label={getI18nLabel(locale, 'captures.filters.withoutImage')}
                                                    checked={withPhoto === false}
                                                    onChange={() => this.changeStateFilter('withPhotoFalse')}
                                                />
                                            </div>

                                            <div className={`${styles.checkboxContainer} col-3 m-0 p-2`}>
                                                <Checkbox
                                                    className={styles.checkbox}
                                                    label={getI18nLabel(locale, 'captures.filters.normalPrice')}
                                                    checked={isPromotion === false}
                                                    onChange={() => this.changeStateFilter('isPromotionFalse')}
                                                />
                                            </div>

                                            <div className={`${styles.checkboxContainer} col-3 m-0 p-2`}>
                                                <Checkbox
                                                    className={styles.checkbox}
                                                    label={getI18nLabel(locale, 'captures.filters.priceWithPromotion')}
                                                    checked={isPromotion === true}
                                                    onChange={() => this.changeStateFilter('isPromotionTrue')}
                                                />
                                            </div>
                                        </div>

                                        <div className="row justify-content-start pb-4">
                                            <div className={`${styles.checkboxContainer} col-3 m-0 p-2`}>
                                                <Checkbox
                                                    className={styles.checkbox}
                                                    label={getI18nLabel(locale, 'captures.filters.statusValidated')}
                                                    checked={status === 'valid'}
                                                    onChange={ () => this.changeStateFilter('statusValid')}
                                                />
                                            </div>

                                            <div className={`${styles.checkboxContainer} col-3 m-0 p-2`}>
                                                <Checkbox
                                                    className={styles.checkbox}
                                                    label={getI18nLabel(locale, 'captures.filters.statusRejected')}
                                                    checked={status === 'rejected'}
                                                    onChange={ () => this.changeStateFilter('statusRejected')}
                                                />
                                            </div>

                                            <div className={`${styles.checkboxContainer} col-3 m-0 p-2`}>
                                                <Checkbox
                                                    className={styles.checkbox}
                                                    label={getI18nLabel(locale, 'captures.filters.statusPending')}
                                                    checked={status === 'pending'}
                                                    onChange={ () => this.changeStateFilter('statusPending')}
                                                />
                                            </div>
                                        </div>
                                        <div className="row justify-content-start">
                                            <div className={`${styles.checkboxContainer} col-3 m-0 p-2`}>
                                                <Checkbox
                                                    className={styles.checkbox}
                                                    label="MC" checked={type === 'MC'}
                                                    onChange={ () => this.changeStateFilter('typeMc')}
                                                />
                                            </div>

                                            <div className={`${styles.checkboxContainer} col-3 m-0 p-2`}>
                                                <Checkbox
                                                    className={styles.checkbox}
                                                    label="MP"
                                                    checked={type === 'MP'}
                                                    onChange={ () => this.changeStateFilter('typeMp')}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`${styles.inputCon} col-2 m-0 p-2`}>
                                        <Select
                                            defaultOption={filterSelected}
                                            label={getI18nLabel(locale, 'captures.filters.param')}
                                            onChange={(e: any) => this.getCorrectCatalog(e.target.value)}
                                            options={optionsCatalog}
                                        />
                                        <br />

                                        <Select
                                            defaultOption='0'
                                            label={getI18nLabel(locale, 'captures.filters.value')}
                                            onChange={(e: any) => this.getCorrectOption(e.target.value)}
                                            options={selectedCatalog}
                                        />

                                        <br />

                                        <div className={styles.tags}>
                                            {filterListSelected.map((
                                                f: { option: string, value: string, label: string }
                                            ) => {
                                                const optionObj = optionsCatalog.filter((o) => o.value === f.option)

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
                }

                <div className={styles.tableComplexContainer}>
                    <PageTitle
                        title={this.state.checkedGeo ?
                            `${this.state.nameGeoLocation}` :
                            getI18nLabel(locale, 'captures.title')
                        }
                    />
                    <br />

                    <TableComplex
                        actions={actions}
                        content={scans}
                        header={header}
                        changePageNext={() => this.loadData(currentPage + 1)}
                        changePagePrev={() => this.loadData(currentPage - 1)}
                        total={total}
                        currentPage={currentPage}
                        totalPage={totalPage}
                        onClickDetails={(id: string) => this.openEdit(id)}
                        onChecked={({ id }) => { this.setCheckedScans(id) }}
                        count={count}
                        checkboxStyles={styles.checkbox}
                        textNotData={this.state.textNotData}
                        reportDetails={true}
                        customClassName='fixed-header'
                    />
                </div>

                <DialogModal
                    btnAcceptLabel={getI18nLabel(locale, 'captures.modal.delete.buttonAcceptLabel')}
                    isOpen={isOpen}
                    message={getI18nLabel(locale, 'captures.modal.delete.message')}
                    onClose={() => this.setState({ isOpen: false })}
                    btnAcceptType={PrimaryButtonVariant.Error}
                    onAccept={() => this.deleteScan()}
                />
            </>
        )
    }
}

const withRouter = (props) => {
    const router = useRouter();

    return <ScansPage {...props} router={router}/>
}

export default withRouter;

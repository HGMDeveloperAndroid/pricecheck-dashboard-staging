import React, { PureComponent } from 'react'
import Router, { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { Header } from '../../components/header'
import { getDarkTheme, getId, validateSession, getHeader, getTheme, IsCustomTheme, getLocale } from '../../utils/session-management'
import Head from 'next/head'
import styles from './home.module.scss'
import { Select } from '../../components/select'
import { PrimaryButton, SecondaryButton } from '../../components/buttons'
import { Autocomplete } from '../../components/autocomplete'
import { SecondaryButtonVariant } from '../../components/buttons/SecondaryButton'
import { Input } from '../../components/input'
import { Checkbox } from '../../components/checkbox'
import Square from '../../components/square/Square'
import api from '../../utils/api'

import {
    getGroupsCatalog,
    getMissionsCatalog,
    getMissionsValidation,
    getBrandsCatalog,
    getUnitsCatalog,
    getStoresCatalog,
    getLinesCatalog,
} from '../../utils/catalogs'

import { photoUrl } from '../../utils/photo_url'
import Modal from '../../components/modal/Modal'
import formatDate from '../../utils/format-date'
import Loader from '../../components/loader/Loader'
import Map from '../../components/map/Map'
import PageTitle from '../../components/pageTitle/PageTitle'
import { ToastContainer, toast } from 'react-nextjs-toast';
import {getI18nLabel} from '../../i18n'
import { buildTheme } from '../../utils/theme';

type Scan = {
    id: number,
    barcode: string,
    id_mission: number,
    product: ProductId[]
}

type FullScan = {
    id: number,
    barcode: string,
    price: string,
    special_price: boolean,
    comments?: string,
    capture_date: string,
    reception_date: string,
    mission?: Mission,
    product: Product,
    scanned_by: User,
    reviewed?: boolean,
    store: Store,
    pictures: Picture[],
    history: History,
    [keys: string]: any,
}

type ScanData = {
    barcode: string,
    is_valid: boolean,
    price: string,
    special_price: boolean,
    comments?: string,
    [keys: string]: any,
}

type Option = {
    value: string,
    label: string,
}
type Group = {
    id: number,
    name: string,
}

type Unit = {
    id: number,
    name: string,
}

type Line = {
    id: number,
    name: string,
    id_group: number,
}

type Brand = {
    id: number,
    name: string,
}

type ProductId = {
    id: number
}

type Product = {
    id: number,
    name: string,
    quantity: number,
    barcode: string,
    unit: Unit,
    group: Group,
    line: Line,
    brand: Brand,
    type: string,
    is_enable: boolean,
    picture_path: string,
    [keys: string]: any,
}

type ProductData = {
    id: number,
    name: string,
    quantity: number,
    unit: number,
    group: number,
    line: number,
    brand: number,
    type: string,
    picture_path: string,
    [keys: string]: any,
}

type User = {
    id: number,
    first_name: string,
    last_name: string,
    mother_last_name?: string,
    employee_number?: number,
}

type Store = {
    id: number,
    name: string,
    address: string,
    location: Location,
    chain: string[],
}

type StoreData = {
    id: number,
    name: string,
    address?: string,
    lat: number,
    lng: number,
    [keys: string]: any,
}

type Location = {
    type: string,
    coordinates: number[]
}

type Mission = {
    id: number,
    title: string,
    description?: string,
    points: number
}

type Picture = {
    product_picture: string,
    shelf_picture?: string,
    promo_picture?: string,
}

type HistoryData = {
    price: number,
    capture_date: string,
}

type History = {
    recent_price: HistoryData,
    max_price: HistoryData,
    min_price: HistoryData,
    min_price_with_promotion: HistoryData,
}

const emptyLocation = {
    type: '',
    coordinates: [90, -90]
}

const emptyStore = {
    id: 0,
    name: '',
    address: '',
    location: emptyLocation,
    chain: [],
    storeId: 0,
}

const emptyMission = {
    id: 1,
    title: '',
    description: '',
    points: 0,
}

const emptyCatalog = {
    id: 0,
    name: '',
}

const emptyGroup = {
    id: 0,
    name: '',
}

const emptyLine = {
    id: 0,
    name: '',
    id_group: 0,
}

const emptyProduct = {
    id: 0,
    name: '',
    quantity: 1,
    barcode: '',
    unit: emptyCatalog,
    group: emptyCatalog,
    line: emptyLine,
    brand: emptyCatalog,
    type: '',
    is_enable: false,
    picture_path: '',
}

const emptyUser = {
    id: 1,
    first_name: '',
    last_name: '',
    mother_last_name: '',
    employee_number: 0,
}

const emptyPicture = {
    product_picture: '',
    shelf_picture: '',
    promo_picture: '',
}

const emptyHistoryData = {
    price: 0,
    capture_date: '',
}

const emptyHistory = {
    recent_price: emptyHistoryData,
    max_price: emptyHistoryData,
    min_price: emptyHistoryData,
    min_price_with_promotion: emptyHistoryData,
}

const emptyScan = {
    id: 0,
    barcode: '',
    price: '',
    special_price: false,
    comments: '',
    capture_date: '',
    reception_date: '',
    mission: emptyMission,
    product: emptyProduct,
    scanned_by: emptyUser,
    reviewed: false,
    store: emptyStore,
    pictures: [emptyPicture],
    history: emptyHistory,
}

const tabOrder = {
    viewPicture: -1,
    productName: 0,
    productImage: 1,
    productBarcode: -1,
    productBrand: 2,
    productQuantity: 3,
    productUnit: 4,
    productGroup: 5,
    productLine: 6,
    productType: 7,
    barcode: 8,
    price: 9,
    special_price: 10,
    store: 11,
    reject: 12,
    validate: 13,
    address: -1,
    comments: -1,
};

const tabOrderBlockedProduct = {
    viewPicture: -1,
    productName: -1,
    productImage: -1,
    productBarcode: -1,
    productBrand: -1,
    productQuantity: -1,
    productUnit: -1,
    productGroup: -1,
    productLine: -1,
    productType: -1,
    barcode: -1,
    price: 0,
    special_price: 1,
    store: 2,
    reject: 3,
    validate: 4,
    address: -1,
    comments: -1,
};

const tabOrderSpecial = {
    viewPicture: 11,
    productName: 0,
    productImage: 1,
    productBarcode: -1,
    productBrand: 2,
    productQuantity: 3,
    productUnit: 4,
    productGroup: 5,
    productLine: 6,
    productType: 7,
    barcode: 8,
    price: 9,
    special_price: 10,
    store: 12,
    reject: 13,
    validate: 14,
    address: -1,
    comments: -1,
};

const tabOrderBlockedProductSpecial = {
    viewPicture: 2,
    productName: -1,
    productImage: -1,
    productBarcode: -1,
    productBrand: -1,
    productQuantity: -1,
    productUnit: -1,
    productGroup: -1,
    productLine: -1,
    productType: -1,
    barcode: -1,
    price: 0,
    special_price: 1,
    store: 3,
    reject: 4,
    validate: 5,
    address: -1,
    comments: -1,
};

class HomePage extends PureComponent<any, any> {
    productRef: any

    typeFilter = [
        {
            value: 'MC',
            label: 'MC',
        },
        {
            value: 'MP',
            label: 'MP',
        },
    ]

    state = {
        scans: [],
        loadedScan: emptyScan,
        nextScanId: null,
        productFilter: null,
        missionFilter: null,
        groupList: [],
        missionList: [],
        brandList: [],
        unitList: [],
        storeList: [],
        lineList: [],
        lineListFilter: [],
        loadedProduct: emptyProduct,
        loadedStore: emptyStore,
        loadedBrand: null,
        loadedGroup: emptyCatalog,
        loadedUnit: emptyCatalog,
        loadedLine: emptyLine,
        loadedRecentPrice: emptyHistoryData,
        loadedMaxPrice: emptyHistoryData,
        loadedMinPrice: emptyHistoryData,
        loadedMinPricePromotion: emptyHistoryData,
        isValid: false,
        showModal: false,
        showRejectModal: false,
        selectedRadio: null,
        isImageModal: false,
        showLoader: false,
        disabledFilterBtn: false,
        barcodeErrorMsg: '',
        priceErrorMsg: '',
        productNameErrorMsg: '',
        productTypeErrorMsg: '',
        productBrandErrorMsg: '',
        productLineErrorMsg: '',
        productUnitErrorMsg: '',
        productGroupErrorMsg: '',
        showMessageNoElements: true,
        selectedPicture: '',
        existProduct: false,
        imageVis: '',
        selectedScanId: 0,
        lat: '',
        lng: '',
        address: '',
        currentScanVerifiedId: 0,
        currentScanWasVerified: false,
        isBeingValidated: false,
        isBeingValidatedByCurrentUser: false,
        userId: 0,
        validatorId: 0,
        scansTotal: 0,
        scansTotalWithProduct: 0,
        scansTotalWithoutProduct: 0,
        scanFilter: [
            {
                value: '',
                label: 'Todos',
                key: 'all',
            },
            {
                value: 'yes',
                label: 'Con producto',
                key: 'withProduct',
            },
            {
                value: 'no',
                label: 'Sin producto',
                key: 'withoutProduct',
            },
        ],
        resetLine: false,
    }

    constructor(props) {
        super(props);

        Router.events.on('beforeHistoryChange', async (url) => {
            try {
                const { isBeingValidatedByCurrentUser, selectedScanId } = this.state;

                if (selectedScanId) {
                    const isNextUrlHome = url == '/home';

                    if (isBeingValidatedByCurrentUser && !isNextUrlHome) {
                        await this.updateBeingValidatedStatus('disable', selectedScanId);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        });

    }

    handleWindowClose = async (event) => {
        event.preventDefault();
        const { isBeingValidatedByCurrentUser, selectedScanId } = this.state;

        if (isBeingValidatedByCurrentUser) {
            await this.updateBeingValidatedStatus('disable', selectedScanId);
        }

        return null;
    }
    async componentDidMount() {
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
        validateSession()
        const groupList = await getGroupsCatalog()
        const missionList = await getMissionsValidation()
        const brandList = await getBrandsCatalog()
        const unitList = await getUnitsCatalog()
        const storeList = await getStoresCatalog()
        const lineList = await getLinesCatalog()
        const lineListFilter = await getLinesCatalog()

        missionList.unshift({ value: '', label: 'Todas' })

        this.setState({
            groupList,
            brandList,
            unitList,
            missionList,
            storeList,
            lineList,
            lineListFilter,
            showLoader: true,
        })

        await this.getScanList(true)

        document.addEventListener('keydown', this.handleTab);
        document.addEventListener('click', this.handleInputClick);
        window.addEventListener("beforeunload", this.handleWindowClose);

    }

    handleInputClick(event: any) {
        const { target } = event

        if (target.classList.contains('indexed-element')) {
            if (target.select) {
                target.select()
            }
        }
    }

    async componentDidUpdate() {
        const { selectedScanId, isBeingValidated, isBeingValidatedByCurrentUser, currentScanWasVerified } = this.state;

        if (this.state.selectedScanId) {
            document.addEventListener('keydown', this.handleCommands);
        } else {
            document.removeEventListener('keydown', this.handleCommands);
        }
    }

    updateBeingValidatedStatus = async (status, scanId) => {
        try {
            const { selectedScanId } = this.state;

            if (status === 'enable') {
                status = '1';
            } else if (status === 'disable') {
                status = '0';
            }
            const endpoint = 'api/scan/being-validated';
            const request = {
                id_scan: scanId,
                status,
            };

            const headers = {
                headers: getHeader(),
            };

            const response = await api.post(endpoint, request, headers);
            const { isBeingValidated, validatorId } = response.data;

            let userId: any = await getId();
            userId = parseInt(userId);

            const isBeingValidatedByCurrentUser = validatorId === userId;

            this.setState({
                currentScanWasVerified: true,
                currentScanVerifiedId: selectedScanId,
                isBeingValidated,
                isBeingValidatedByCurrentUser,
                validatorId,
                userId,
            });
        } catch (error) {
            console.error('HomePage.updateBeingValidatedStatus[error]: ', error);
        }
    }

    handleTab(event) {
        const keyCode = event.which ? event.which : event.keyCode;
        const key = event.code ? event.code : event.key;
        const isTabKey = keyCode === 9 && key === 'Tab';

        if (document && isTabKey) {
            event.preventDefault();
            event.stopPropagation();

            let indexedElements: any = [];
            indexedElements = document.querySelectorAll('.indexed-element:not([tabindex="-1"])');
            indexedElements = [...indexedElements].sort((a, b) => a.tabIndex - b.tabIndex);

            if (indexedElements.length) {
                const currentElement = event.target;
                const nextElementIndex = currentElement.tabIndex + 1;
                const nextElement = indexedElements.find((element) => element.tabIndex === nextElementIndex);

                if (nextElement) {
                    nextElement.focus();
                    if (nextElement.select) {
                        nextElement.select()
                    }
                } else {
                    if (indexedElements.length && indexedElements[0] && indexedElements[0].select) {
                        indexedElements[0].focus();
                        indexedElements[0].select()
                    }
                }
            }
        }
    }

    handleCommands = (event: any) => {
        const keyCode = event.which ? event.which : event.keyCode;
        const key = event.code ? event.code : event.key;
        const isControlKey = event.ctrlKey;
        const isShiftKey = event.shiftKey;
        const isPlusKey = keyCode === 187 || keyCode === 107 || key === '*';
        const isLessKey = keyCode === 189 || keyCode === 109;

        if (isControlKey && isShiftKey) {
            if (isLessKey) {
                event.preventDefault();
                this.openReject();
            }

            if (isPlusKey) {
                event.preventDefault();
                this.validateScanButtonHandler();
            }
        }
    }
    getScanList = async (isFirstRun: boolean = false) => {
        const params: {
            textSearch?: string,
            withProduct?: string,
        } = {}

        const locale = getLocale()

        if (this.state.productFilter) {
            params.withProduct = `${this.state.productFilter}`
        }

        if (this.state.missionFilter) {
            params.textSearch = `${this.state.missionFilter}`
        }

        try {
            const res = await api.get(
                '/api/scan/all',
                {
                    headers: getHeader(),
                    params,
                },
            )

            if (res.data.scans.data.length > 0) {
                const { data, total_pending, with_product, without_product } = res.data.scans
                const scans = data.map((scan: Scan[]) => ({ ...scan }))


                const scansCounts = {
                    all: total_pending,
                    withProduct: with_product,
                    withoutProduct: without_product,
                }

                const scanFilter = this.state.scanFilter.map(filter => {
                    filter.label = getI18nLabel(locale, `home.sidebar.scanFilter.${filter.key}`)
                    filter.label = filter.label.replace(/ *\([^)]*\) */g, '')
                    filter.label = `${filter.label} (${scansCounts[filter.key]})`

                    return filter
                })

                this.setState({
                    scans,
                    showMessageNoElements: isFirstRun,
                    scanFilter,
                })

                const { nextScanId } = this.state

                if (!isFirstRun) {
                    if (nextScanId) {
                        await this.scanSelectedHandler(nextScanId)
                        await this.updateBeingValidatedStatus('enable', nextScanId)
                    } else {
                        await this.scanSelectedHandler(scans[0].id)
                        await this.updateBeingValidatedStatus('enable', scans[0].id)
                    }
                }
            }

            if (res.data.scans.data.length === 0 || isFirstRun) {
                this.setState({
                    loadedScan: emptyScan,
                    showMessageNoElements: true,
                    disabledFilterBtn: false,
                    showLoader: false,
                })
            }
        } catch (err) {
            // TODO: enviar notificación cuando falla al obtener los scans
        }
    }

    scanSelectedHandler = async (scanId: number, barcode?: string) => {
        try {
            this.cleanScan()

            const { scans, isBeingValidatedByCurrentUser, resetLine} = this.state
            let { selectedScanId } = this.state

            if (selectedScanId) {
                if (isBeingValidatedByCurrentUser) {
                    await this.updateBeingValidatedStatus('disable', selectedScanId)
                }
            }

            const nextIndex = scans.findIndex(s => s.id === scanId)
            const nextScanId = scans[nextIndex + 1]?.id || null

            this.setState({
                showLoader: true,
                showMessageNoElements: false,
            })

            let res;

            if (!barcode) {
                res = await api.get(`api/scan/${scanId}`, { headers: getHeader() })
            } else {
                res = await api.get(`api/scan/${selectedScanId}/barcode/${barcode}`, { headers: getHeader() });
            }

            await this.updateBeingValidatedStatus('enable', scanId)

            const loadedScan = {
                ...res.data.scan,
                pictures: res.data.scan.pictures.map((p: any) => {
                    return {
                        ...p,
                        product_picture: p.product_picture ? `${photoUrl}/${p.product_picture}` : null,
                        shelf_picture: p.shelf_picture ? `${photoUrl}/${p.shelf_picture}` : null,
                        promo_picture: p.promo_picture ? `${photoUrl}/${p.promo_picture}` : null,
                    }
                })
            }

            const productExists = Boolean(res.data.scan.product)

            const productImage = productExists &&
                `${photoUrl}/${res.data.scan.product.picture_path}`

            const loadedStore = res.data.scan.store ? res.data.scan.store : emptyStore;

            const selectedStore = this.state.storeList.find((store) => {
                return store.label === loadedStore.name;
            });

            loadedStore.storeId = selectedStore.value;

            selectedScanId = res.data.scan.id;

            const nextState = {
                loadedScan,
                nextScanId,
                selectedScanId,
                loadedProduct: res.data.scan.product ? res.data.scan.product : emptyProduct,
                loadedStore,
                loadedBrand: res.data.scan.product ? res.data.scan.product.brand : '',
                loadedUnit: res.data.scan.product ? res.data.scan.product.unit : emptyCatalog,
                loadedGroup: res.data.scan.product ? res.data.scan.product.group : emptyGroup,
                loadedGroupName: '',
                loadedLine: res.data.scan.product ? res.data.scan.product.line : emptyLine,
                existProduct: productExists,
                imageVis: productImage || (
                    loadedScan.pictures.length > 0 ?
                        loadedScan.pictures[0].product_picture :
                        ''
                ),
                loadedRecentPrice: res.data.scan.product && Object.keys(res.data.scan.history.recent_price).length !== 0 ? res.data.scan.history.recent_price : emptyHistoryData,
                loadedMaxPrice: res.data.scan.product && Object.keys(res.data.scan.history.max_price).length !== 0 ? res.data.scan.history.max_price : emptyHistoryData,
                loadedMinPrice: res.data.scan.product && Object.keys(res.data.scan.history.min_price).length !== 0 ? res.data.scan.history.min_price : emptyHistoryData,
                loadedMinPricePromotion: res.data.scan.product && Object.keys(res.data.scan.history.min_price_with_promotion).length !== 0 ? res.data.scan.history.min_price_with_promotion : emptyHistoryData,
                showLoader: false,
                disabledFilterBtn: false,
                lat: res.data.scan.store !== null ? res.data.scan.store.location.coordinates[1] : '',
                lng: res.data.scan.store !== null ? res.data.scan.store.location.coordinates[0] : '',
                resetLine: !barcode ? true : false,
            }

            this.setState(nextState, () => {
                if (selectedScanId) {
                    const firstTabindex: any = document.querySelector('input[tabindex="0"]');

                    if (firstTabindex) {
                        firstTabindex.focus();
                        firstTabindex.select();
                    }
                }
            });
        } catch (err) {
            // TODO: enviar notificación cuando falla al obtener un scan
        }
    }

    cleanScan = () => {
        this.setState({
            loadedScan: emptyScan,
            loadedStore: emptyStore,
            loadedProduct: emptyProduct,
            loadedBrand: emptyCatalog,
            loadedGroup: emptyGroup,
            loadedUnit: emptyCatalog,
            loadedLine: emptyLine,
            loadedRecentPrice: emptyHistoryData,
            loadedMaxPrice: emptyHistoryData,
            loadedMinPrice: emptyHistoryData,
            loadedMinPricePromotion: emptyHistoryData,
            barcodeErrorMsg: '',
            priceErrorMsg: '',
            productNameErrorMsg: '',
            productTypeErrorMsg: '',
            productBrandErrorMsg: '',
            productLineErrorMsg: '',
            productUnitErrorMsg: '',
            productGroupErrorMsg: '',
            resetLine: false,
            lat: 0,
            lng: 0
        })
    }

    changeProductHandler = (e: any) => {
        const productFilter = e.target.value
        this.setState({ productFilter }, () => this.filterButtonHandler())
    }

    changeMissionFilterHandler = (e: any) => {
        const missionFilter = e.target.value
        this.setState({ missionFilter }, () => this.filterButtonHandler())
    }

    filterButtonHandler = () => {
        this.setState({
            disabledFilterBtn: true,
            nextScanId: null,
        }, () => this.getScanList())
    }

    priceHandler = (event: any) => {
        const price = event.target.value;

        const loadedScan = {
            ...this.state.loadedScan,
            price,
        };

        this.setState({ loadedScan });
    }

    addressHandler = (e: any) => {
        const address = e.target.value

        const store = {
            ...this.state.loadedStore,
            address,
        }

        this.setState({ loadedStore: store })
    }

    commentHandler = (e: any) => {
        const comments = e.target.value

        const scan = {
            ...this.state.loadedScan,
            comments,
        }

        this.setState({ loadedScan: scan })
    }

    changeStoreHandler = (e: any) => {
        const { storeList } = this.state;
        const storeId = e.target.value
        const store = storeList.find(store => store.value === storeId)

        const loadedStore = {
            ...this.state.loadedStore,
            id: parseInt(storeId),
            storeId: parseInt(storeId),
            name: store.label,
        }

        this.setState({ loadedStore })
    }

    productNameHandler = (e: any) => {
        const name = e.target.value

        const product = {
            ...this.state.loadedProduct,
            name,
        }

        this.setState({ loadedProduct: product })
    }
    changeBrandHandler = (e: any) => {
        const brandId = e.target.value

        const brand = {
            ...this.state.loadedBrand,
            id: parseInt(brandId),
        }

        this.setState({ loadedBrand: brand })
    }
    changeUnitHandler = (e: any) => {
        const unitId = e.target.value

        const unit = {
            ...this.state.loadedUnit,
            id: parseInt(unitId),
        }

        this.setState({ loadedUnit: unit })
    }
    quantityHandler = (e: any) => {
        const quantity = e.target.value

        const product = {
            ...this.state.loadedProduct,
            quantity,
        }

        this.setState({ loadedProduct: product })
    }

    changeTypeHandler = (e: any) => {
        const type = e.target.value

        const product = {
            ...this.state.loadedProduct,
            type,
        }

        this.setState({ loadedProduct: product })
    }

    specialPriceCheckHandler = () => {
        const scan = {
            ...this.state.loadedScan,
            special_price: !this.state.loadedScan.special_price
        }

        this.setState({ loadedScan: scan })
    }

    selectProductImageHandler = () => {
        this.setState({ showModal: true })
    }

    validateScanButtonHandler = () => {
        const { loadedStore, loadedScan, existProduct } = this.state;
        const selectedStoreName = loadedStore.name.toLowerCase()
        const storeInput = document.querySelector('.store-input')
        const options = Array.from(storeInput.querySelectorAll('option'))

        const selectedOption = options.find(option => option.selected)

        if (selectedStoreName === 'no store') {
            if (!storeInput.classList.contains('input-error')) {
                storeInput.classList.add('input-error')
            }

        } else {
            storeInput.classList.remove('input-error')

            if (existProduct) {
                this.validateScan();
            } else {
                this.validateScanAndProduct();
            }
        }
    }

    validateScan = async () => {
        const scanData = this.checkAndDeleteUnusedFields(this.state.loadedScan, true)
        const storeData = this.checkAndDeleteUnusedFiledsForStore(
            this.state.loadedStore,
            this.state.loadedStore.location,
        )

        if (this.validateRequiredFieldsForScan(scanData)) {
            try {
                const headers = {
                    ...getHeader(),
                    'content-type': 'multipart/form-data'
                }

                let form_data = new FormData();

                for (let key in scanData) {
                    form_data.append(`scan[${key}]`, scanData[key])
                }

                for (let key in storeData) {
                    form_data.append(`store[${key}]`, storeData[key])
                }

                const response = await api.post(
                    `api/scan/${this.state.loadedScan.id}`,
                    form_data,
                    { headers }
                )

                if (response.status === 200) {
                    await this.cleanScan()
                    await this.getScanList()
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    validateScanAndProduct = async () => {
        const scanData = this.checkAndDeleteUnusedFields(this.state.loadedScan, true)
        const productData = this.checkAndDeleteUnusedFieldsForProduct(
            this.state.loadedProduct,
            this.state.loadedScan,
            this.state.loadedBrand,
            this.state.loadedGroup,
            this.state.loadedLine,
            this.state.loadedUnit,
        )

        const storeData = this.checkAndDeleteUnusedFiledsForStore(
            this.state.loadedStore,
            this.state.loadedStore.location,
        )

        if (this.validateRequiredFields(scanData, productData)) {
            try {
                const headers = {
                    ...getHeader(),
                    'content-type': 'multipart/form-data'
                }

                let form_data = new FormData();

                for (let key in productData) {
                    form_data.append(`product[${key}]`, productData[key])
                }

                for (let key in scanData) {
                    form_data.append(`scan[${key}]`, scanData[key])
                }

                for (let key in storeData) {
                    form_data.append(`store[${key}]`, storeData[key])
                }

                const response = await api.post(
                    `api/scan/${this.state.loadedScan.id}`,
                    form_data,
                    { headers }
                )

                if (response.status === 200) {
                    this.cleanScan()
                    this.getScanList()
                    this.setState({
                        ...this.setState,
                        loadedGroup: {
                            id: 0,
                            name: "",
                        }
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    checkAndDeleteUnusedFields = (object: FullScan, isValid: boolean): ScanData => {
        const scan = {
            barcode: object.barcode,
            is_valid: isValid,
            price: object.price,
            special_price: object.special_price,
            comments: '',
        }

        if (!object.comments || object.comments.length === 0) {
            delete scan.comments
        } else {
            scan.comments = object.comments
        }

        return scan
    }

    checkAndDeleteUnusedFieldsForProduct = (
        object: Product,
        scan: FullScan,
        brand: Brand,
        group: Group,
        line: Line,
        unit: Unit,
    ): ProductData => {
        const product = {
            id: object.id,
            name: object.name,
            quantity: object.quantity,
            unit: unit.id,
            group: group.id,
            line: line.id,
            brand: brand.id,
            type: object.type,
            picture_path: ((object.picture_path as any) instanceof File) ?
                object.picture_path :
                '',
        }

        return product
    }

    checkAndDeleteUnusedFiledsForStore = (object: Store, location: Location): StoreData => {
        const store = {
            id: object.id,
            name: object.name,
            address: '',
            lat: location.coordinates[1],
            lng: location.coordinates[0],
        }

        if (!object.address || object.address.length === 0) {
            delete store.address
        } else {
            store.address = object.address
        }

        return store
    }

    validateRequiredFields = (scan: ScanData, product: ProductData): boolean => {
        const locale = getLocale()

        let isValid = true

        let barcodeErrorMsg = ''
        let priceErrorMsg = ''
        let productNameErrorMsg = ''
        let productTypeErrorMsg = ''
        let productBrandErrorMsg = ''
        let productGroupErrorMsg = ''
        let productUnitErrorMsg = ''
        let productLineErrorMsg = ''

        if (!scan.barcode.trim()) {
            barcodeErrorMsg = getI18nLabel(locale, 'home.scan.input.barcode.error')
            isValid = false
        }

        const hasValidPrice = Math.ceil(parseFloat(scan.price)) > 0;

        if (!scan.price.trim() || !hasValidPrice) {
            priceErrorMsg = getI18nLabel(locale, 'home.scan.input.price.error')
            isValid = false
        }

        if (!product.name.trim()) {
            productNameErrorMsg = getI18nLabel(locale, 'home.product.input.name.error')
            isValid = false
        }

        if (!product.type.trim() || product.type == '0') {
            productTypeErrorMsg = getI18nLabel(locale, 'home.product.input.type.error')
            isValid = false
        }

        if (!product.brand) {
            productBrandErrorMsg = getI18nLabel(locale, 'home.product.input.brand.error')
            isValid = false
        }

        if (!product.group) {
            productGroupErrorMsg = getI18nLabel(locale, 'home.product.input.group.error')
            isValid = false
        }

        if (!product.unit) {
            productUnitErrorMsg = getI18nLabel(locale, 'home.product.input.unit.error')
            isValid = false
        }

        if (!product.line) {
            productLineErrorMsg = getI18nLabel(locale, 'home.product.input.line.error')
            isValid = false
        }

        this.setState({
            barcodeErrorMsg,
            priceErrorMsg,
            productNameErrorMsg,
            productTypeErrorMsg,
            productBrandErrorMsg,
            productLineErrorMsg,
            productUnitErrorMsg,
            productGroupErrorMsg,
        })

        return isValid
    }

    validateRequiredFieldsForScan = (scan: ScanData): boolean => {
        const locale = getLocale()

        let isValid = true
        let barcodeErrorMsg = '';
        let priceErrorMsg = '';

        if (!scan.barcode.trim() || scan.barcode.length === 0) {
            barcodeErrorMsg = getI18nLabel(locale, 'home.scan.input.barcode.error')
            isValid = false
        }

        const hasValidPrice = Math.ceil(parseFloat(scan.price)) > 0;

        if (!scan.price.trim() || !hasValidPrice) {
            priceErrorMsg = getI18nLabel(locale, 'home.scan.input.price.error')
            isValid = false
        }

        this.setState({
            barcodeErrorMsg,
            priceErrorMsg,
        })

        return isValid
    }

    rejectedButtonHandler = async () => {
        try {
            const response = await api.get(
                `api/scan/${this.state.loadedScan.id}/rejected`,
                { headers: getHeader() },
            )
            if (response.status === 201) {
                this.cleanScan()
                this.getScanList()
            }
        } catch (error) {
            // TODO: Mandar mensaje de error.
        }
    }

    openReject = async () => {
        this.setState({ showRejectModal: true })
    }

    closeReject = async () => {
        this.setState({ showRejectModal: false })
        this.setState({ selectedRadio: null })
    }

    onChangeRadio = async (e: any) => {
        await this.setState({ selectedRadio: parseInt(e.currentTarget.value, 10) })
        await this.sendCriterion()
    }
    sendCriterion = async () => {
        const locale = getLocale()
        const endpoint = `/api/criterion/scan/${this.state.loadedScan.id}`;
        const request = {
            id_criterion: this.state.selectedRadio + 1,
        };
        const headers = {
            headers: getHeader(),
        };

        api.post(endpoint, request, headers)
            .then(async () => {
                await this.rejectedButtonHandler();
                await toast.notify(getI18nLabel(locale, 'home.toast.sendCriterion.success.message'), {
                    title: getI18nLabel(locale, 'home.toast.sendCriterion.success.title'),
                    duration: 6,
                    type: "success"
                })
                this.closeReject();
            })
            .catch(() => {
                toast.notify(getI18nLabel(locale, 'home.toast.sendCriterion.error.message'), {
                    title: getI18nLabel(locale, 'home.toast.sendCriterion.error.title'),
                    duration: 6,
                    type: "error"
                })
            })
    };

    selectImage = (selectedPicture: string) => {
        if (selectedPicture != null) {
            this.setState({
                selectedPicture,
                showModal: true,
                isImageModal: true,
            })
        }
    }

    changeProductPicture = (e: any) => {
        if (e.target.files.length > 0) {
            const photo = e.target.files[0]

            const loadedProduct = {
                ...this.state.loadedProduct,
                picture_path: photo,

            }
            this.setState({
                imageVis: URL.createObjectURL(photo),
                loadedProduct,
            })
        }
    }

    handleCloseModal = () => {
        this.setState({
            showModal: false,
        });
    }

    getProductDetail = async (productId: string) => {
        try {
            this.setState({ showLoader: true, })
            const res = await api.get(`api/product/${productId}`, { headers: getHeader() })

            const loadedProduct = {
                ...res.data.product,
                picture_path: res.data.product.picture_path ? `${photoUrl}/${res.data.product.picture_path}` : null
            }

            this.setState({
                loadedProduct,
                loadedScan: {
                    ...this.state.loadedScan,
                    product: {
                        ...loadedProduct,
                    }
                },
                imageVis: res.data.product.picture_path ? `${photoUrl}/${res.data.product.picture_path}` : null,
                showLoader: false,
                loadedUnit: res.data.product.unit,
                loadedGroup: res.data.product.group,
                loadedLine: res.data.product.line,
                loadedBrand: res.data.product.brand
            })
        } catch (err) {
            await this.scanSelectedHandler(this.state.selectedScanId)
        }
    }

    findScan = async (barcode) => {
        try {
            const { selectedScanId } = this.state;

            if (selectedScanId && barcode) {
                await this.scanSelectedHandler(selectedScanId, barcode);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    timeout = null;

    barcodeHandler = (e: any) => {
        const barcode = e.target.value

        if (!isNaN(barcode)) {
            const loadedScan = {
                ...this.state.loadedScan,
                barcode,
            }

            this.setState({ loadedScan })

            clearTimeout(this.timeout)
            this.timeout = setTimeout(async () => {
                try {
                    await this.findScan(barcode);
                } catch (error) {
                    console.log(error);
                }
            }, 2000);
        }
    }

    getSuggestions = (value, data) => {
        
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? data.filter(item => {
            return true;
        })
            : data.filter(item => {
                const query = inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regexp = new RegExp(query, 'ig')
                const itemExist = item.label.search(regexp) != -1
                return itemExist
            });
    };

    getSuggestionValue = suggestion => {
        return suggestion.label
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            groupList: [],
        })
    }

    renderSuggestion = suggestion => {
        return (<div> {suggestion.label} </div>)
    };

    onSelectGroup = (event, { suggestion }) => {
        const groupId = suggestion.value
        let lineId = 0
        let lineName = ''

        const updateFilterLineList = this.state.lineList.filter(
            line => (
                Number(groupId) === line.group
            )
        )

        if (updateFilterLineList.length > 0) {
            lineId = updateFilterLineList[0].value
            lineName = updateFilterLineList[0].label
        }

        const group = {
            ...this.state.loadedGroup,
            id: parseInt(groupId),
        }

        const line = {
            ...this.state.loadedLine,
            name: lineName,
            id: lineId,
            id_group: groupId,
        }

        this.setState({
            loadedGroup: group,
            lineListFilter: updateFilterLineList,
            loadedLine: line,
        })
    }

    onSelectType = (event, { suggestion }) => {
        const type = suggestion.value

        const product = {
            ...this.state.loadedProduct,
            type,
        }

        this.setState({ loadedProduct: product })
    }

    onSelectBrand = (event, { suggestion }) => {
        const brandId = suggestion.value

        const brand = {
            ...this.state.loadedBrand,
            id: parseInt(brandId),
        }

        this.setState({ loadedBrand: brand })
    }

    onSelectUnit = (event, { suggestion }) => {
        const unitId = suggestion.value

        const unit = {
            ...this.state.loadedUnit,
            id: parseInt(unitId),
        }

        this.setState({ loadedUnit: unit })
    }

    onSelectLIne = (event, { suggestion }) => {
        const lineId = suggestion.value

        const line = {
            ...this.state.loadedLine,
            id: parseInt(lineId),
            name: suggestion.label,
            id_group: suggestion.group,
        }

        this.setState({ loadedLine: line })
    }

    render() {
        const {
            scans,
            loadedScan,
            groupList,
            missionList,
            brandList,
            unitList,
            storeList,
            lineListFilter,
            loadedStore,
            loadedProduct,
            loadedMaxPrice,
            loadedMinPricePromotion,
            loadedMinPrice,
            loadedRecentPrice,
            lat,
            lng,
            loadedBrand,
            loadedLine,
            loadedGroup,
            loadedUnit,
            showModal,
            isImageModal,
            selectedScanId,
            showLoader,
            disabledFilterBtn,
            barcodeErrorMsg,
            priceErrorMsg,
            productNameErrorMsg,
            productTypeErrorMsg,
            productBrandErrorMsg,
            productLineErrorMsg,
            productUnitErrorMsg,
            productGroupErrorMsg,
            showRejectModal,
            selectedRadio,
            showMessageNoElements,
            selectedPicture,
            imageVis,
            isBeingValidated,
            isBeingValidatedByCurrentUser,
            resetLine,
        } = this.state

        const locale = getLocale()

        brandList.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        unitList.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);

        const existProduct = loadedScan.product ? true : false

        const captureDate = formatDate(loadedScan.capture_date)

        const fullName = `${loadedScan.scanned_by.first_name} ${loadedScan.scanned_by.last_name}`

        const recentPriceDate = existProduct && loadedRecentPrice.capture_date.length > 0 ?
            formatDate(loadedRecentPrice.capture_date) :
            null

        const maxPriceDate = existProduct && loadedMaxPrice.capture_date.length > 0 ?
            formatDate(loadedMaxPrice.capture_date) :
            null

        const minPriceDate = existProduct && loadedMinPrice.capture_date.length > 0 ?
            formatDate(loadedMinPrice.capture_date) :
            null

        const minPricePromoDate = existProduct && loadedMinPricePromotion.capture_date.length > 0 ?
            formatDate(loadedMinPricePromotion.capture_date) :
            null

        const tabs = existProduct ? tabOrderBlockedProduct : tabOrder;
        const specialAndExist = existProduct && loadedScan.special_price;
        const tabsSpecial = existProduct ? tabOrderBlockedProductSpecial : tabOrderSpecial

        const loadedGroupName = loadedGroup && loadedGroup.name ? loadedGroup.name : ''
        const loadedBrandName = loadedBrand && loadedBrand.name ? loadedBrand.name : ''
        const loadedProductType = loadedProduct && loadedProduct.type ? loadedProduct.type : ''
        const loadedUnitName = loadedUnit && loadedUnit.name ? loadedUnit.name : '';
        const loadedLineName = loadedLine && loadedLine.name ? loadedLine.name : '';

        const radioMapFirst = [
            {
                id: 'blurry',
                value: 0,
                label: getI18nLabel(locale, 'home.radioMapFirst.blurry'),
                checked: selectedRadio === 0,
            },
            {
                id: 'farAway',
                value: 1,
                label: getI18nLabel(locale, 'home.radioMapFirst.farAway'),
                checked: selectedRadio === 1,
            },
            {
                id: 'dark',
                value: 2,
                label: getI18nLabel(locale, 'home.radioMapFirst.dark'),
                checked: selectedRadio === 2,
            },
            {
                id: 'incomplete',
                value: 3,
                label: getI18nLabel(locale, 'home.radioMapFirst.incomplete'),
                checked: selectedRadio === 3,
            },
            {
                id: 'doesntMatch',
                value: 4,
                label: getI18nLabel(locale, 'home.radioMapFirst.doesntMatch'),
                checked: selectedRadio === 4,
            },
        ];
        const radioSecond = [
            {
                id: 'outsideShop',
                value: 5,
                label: getI18nLabel(locale, 'home.radioSecond.outsideShop'),
                checked: selectedRadio === 5,
            },
            {
                id: 'shopTicket',
                value: 6,
                label: getI18nLabel(locale, 'home.radioSecond.shopTicket'),
                checked: selectedRadio === 6,
            },
            {
                id: 'anotherCell',
                value: 7,
                label: getI18nLabel(locale, 'home.radioSecond.anotherCell'),
                checked: selectedRadio === 7,
            },
            {
                id: 'testScan',
                value: 8,
                label: getI18nLabel(locale, 'home.radioSecond.testScan'),
                checked: selectedRadio === 8,
            },
        ];

        return (
            <>
                <Header locale={locale}/>

                <Head>
                    <title>
                        {getI18nLabel(locale, 'home.title')}
                    </title>
                </Head>

                <Modal
                    noPadding={true}
                    containerWidth="40%"
                    showModal={showModal}
                    isImageModal={isImageModal}
                    closeModal={this.handleCloseModal}>
                    <span
                        onClick={() => this.handleCloseModal()}
                        className={styles.modalImageClose}
                    >
                        <img className={styles.closeButton} src="/img/close-button.svg" />
                    </span>

                    <img src={selectedPicture} className={styles.modalImage} />
                </Modal>

                <Modal
                    noPadding={false}
                    containerWidth="60%"
                    showModal={showRejectModal}
                    isImageModal={false}
                    closeModal={this.closeReject}>
                    <span
                        onClick={() => this.closeReject()}
                        className={styles.modalImageClose}
                    >
                        <img className={styles.closeButton} src="/img/close-button.svg" />
                    </span>
                    <h3>
                        {getI18nLabel(locale, 'home.modal.reject.subject')}
                    </h3>
                    <div className={styles.containerRadio}>
                        <div className={styles.displayRadio}>
                            {
                                radioMapFirst.map((item: any) => (
                                    <div key={`id-${item.id}-${item.value}`} className={styles.formContainer}>
                                        <input
                                            id={item.id}
                                            className={styles.labelRadio}
                                            value={item.value}
                                            checked={item.checked}
                                            style={{ padding: '7px' }}
                                            name={item.id}
                                            type="radio"
                                            onChange={this.onChangeRadio} />
                                        <label style={{ padding: '7px' }} className={styles.labelRadio}>{item.label}</label>
                                    </div>
                                ))
                            }
                        </div>
                        <div className={styles.displayRadio}>
                            {
                                radioSecond.map((item: any) => (
                                    <div key={`id-${item.id}-${item.value}`} className={styles.formContainer}>
                                        <input
                                            id={item.id}
                                            className={styles.labelRadio}
                                            value={item.value}
                                            checked={item.checked}
                                            style={{ padding: '7px' }}
                                            name={item.id}
                                            type="radio"
                                            onChange={this.onChangeRadio} />
                                        <label style={{ padding: '7px' }} className={styles.labelRadio}>{item.label}</label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Modal>
                <Loader show={showLoader} />

                <div className={styles.container}>
                    <div className={styles.itemList}>
                        <PageTitle title={getI18nLabel(locale, 'home.sidebar.title')} />

                        <div className={styles.formContainer}>
                            <Select
                                bgColor="transparent"
                                options={missionList}
                                onChange={this.changeMissionFilterHandler}
                                label={getI18nLabel(locale, 'home.sidebar.input.mission.label')}
                            />
                        </div>

                        <div className={styles.formContainer}>
                            <Select
                                bgColor="transparent"
                                options={this.state.scanFilter}
                                onChange={this.changeProductHandler}
                                label={getI18nLabel(locale, 'home.sidebar.input.product.label')}
                            />
                        </div>

                        <hr />

                        <div className={styles.capturesList}>
                            {scans.map((scan: Scan) => (
                                <p
                                    className={`${scan.product.length === 0 ? '' : styles.withProduct}${scan.id === selectedScanId ? ` current-product ${styles.currentProduct}` : ''}`}
                                    onClick={() => this.scanSelectedHandler(scan.id)}
                                    key={scan.id}
                                >
                                    {scan.id}
                                </p>
                            ))}
                        </div>
                    </div>

                    {!showMessageNoElements && (
                        <div className={styles.productScan}>
                            {
                                isBeingValidated && !isBeingValidatedByCurrentUser
                                && (
                                    <h5 className='text-danger'>
                                        {getI18nLabel(locale, 'home.scan.topBar.beingValidated')}
                                    </h5>
                                )
                            }
                            <div className={styles.scannerDataContainer}>
                                <div className={styles.element}>
                                    {loadedScan.scanned_by.employee_number ?
                                        loadedScan.scanned_by.employee_number :
                                        getI18nLabel(locale, 'home.scan.topBar.withoutNumber')
                                    }
                                </div>

                                <div className={styles.elementBold}>
                                    {fullName}
                                </div>

                                <div className={styles.element}>
                                    {captureDate}
                                </div>

                                <div className={styles.element}>
                                    {loadedScan.mission ? loadedScan.mission.title : getI18nLabel(locale, 'home.scan.topBar.withoutMission')}
                                </div>
                            </div>

                            <div className={styles.dataContainer}>
                                <div className="row">
                                    <div className="width50">
                                        <div
                                            className={styles.imageLeft}
                                            style={{
                                                backgroundImage: `url("${loadedScan.pictures.length > 0 ? loadedScan.pictures[0].product_picture : ''}")`,
                                                backgroundPosition: 'center',
                                                backgroundSize: 'cover',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => this.selectImage(loadedScan.pictures[0].product_picture)}
                                        />

                                        <p>
                                            {getI18nLabel(locale, 'home.scan.productImage.label')}
                                        </p>
                                    </div>

                                    <div className="width50">
                                        <div
                                            className={styles.imageRight}
                                            style={{
                                                backgroundImage: `url("${loadedScan.pictures.length > 0 ? loadedScan.pictures[0].shelf_picture : ''}")`,
                                                backgroundPosition: 'center',
                                                backgroundSize: 'cover',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => this.selectImage(loadedScan.pictures[0].shelf_picture)}
                                        />

                                    <p className={styles.priceText}>
                                            {getI18nLabel(locale, 'home.scan.priceImage.label')}
                                    </p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="width30">
                                        <Input
                                            defaultValue={loadedScan.barcode}
                                            placeholderColor="#6d1515"
                                            type="text"
                                            placeholder={getI18nLabel(locale, 'home.scan.input.barcode.label')}
                                            onChange={this.barcodeHandler}
                                            errorMessage={barcodeErrorMsg}
                                            tabindex={loadedScan.special_price ? tabsSpecial.barcode : tabs.barcode}
                                            className='indexed-element'
                                        />
                                    </div>

                                    <div className="width30">
                                        <Input
                                            defaultValue={loadedScan.price}
                                            type="text"
                                            placeholder={getI18nLabel(locale, 'home.scan.input.price.label')}
                                            onChange={this.priceHandler}
                                            errorMessage={priceErrorMsg}
                                            tabindex={tabs.price}
                                            className='indexed-element'
                                        />
                                    </div>

                                    <div className="width30">
                                        <Checkbox
                                            onChange={this.specialPriceCheckHandler}
                                            checked={loadedScan.special_price}
                                            label={getI18nLabel(locale, 'home.scan.input.promotionPrice.label')}
                                            tabindex={loadedScan.special_price ? tabsSpecial.special_price : tabs.special_price}
                                            checkboxClassName='indexed-element'
                                        />

                                        {loadedScan.special_price ? (
                                            <SecondaryButton
                                                label={getI18nLabel(locale, 'home.scan.option.showPicture')}
                                                tabindex={loadedScan.special_price ? tabsSpecial.viewPicture : tabs.viewPicture}
                                                className='indexed-element'
                                                onClick={() => this.selectImage(loadedScan.pictures[0].promo_picture)}
                                            />) :
                                            ''
                                        }
                                    </div>
                                </div>

                                <div className={styles.separator}></div>

                                <div className="row">
                                    <div className="width45">
                                        <Select
                                            defaultOption={loadedStore.storeId}
                                            label={getI18nLabel(locale, 'home.scan.input.store.label')}
                                            options={storeList}
                                            onChange={this.changeStoreHandler}
                                            tabindex={loadedScan.special_price ? tabsSpecial.store : tabs.store}
                                            className='store-input indexed-element'
                                        />
                                    </div>
                                </div>

                                <div className={styles.separator}></div>

                                <div className="row">
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <SecondaryButton
                                            variant={SecondaryButtonVariant.Error}
                                            label={getI18nLabel(locale, 'home.scan.option.reject')}
                                            tabindex={loadedScan.special_price ? tabsSpecial.reject : tabs.reject}
                                            onClick={this.openReject}
                                            className='indexed-element'
                                        />
                                    </div>
                                    <div>
                                        <PrimaryButton
                                            label={this.state.existProduct ? getI18nLabel(locale, 'home.scan.option.validate') : getI18nLabel(locale, 'home.scan.option.validateAndAdd')}
                                            tabindex={loadedScan.special_price ? tabsSpecial.validate : tabs.validate}
                                            onClick={this.validateScanButtonHandler}
                                            className='indexed-element'
                                        />
                                    </div>
                                </div>
                                <div className={styles.separator}></div>

                                <div className="row"></div>

                                <div className={styles.separator}></div>

                                {loadedStore.address && (
                                    <div className="row">
                                        <div
                                            className="width100"
                                            style={{ position: 'relative', height: '12rem' }}
                                        >
                                            <Map lat={lat} lng={lng}></Map>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.separator}></div>
                                <div className="row">
                                    <div className="width100">
                                        <Input
                                            defaultValue={loadedStore.address}
                                            type="text"
                                            placeholder={getI18nLabel(locale, 'home.scan.input.address.label')}
                                            onChange={this.addressHandler}
                                            tabindex={loadedScan.special_price ? tabsSpecial.address : tabs.address}
                                            className='indexed-element'
                                        />
                                    </div>

                                    <div className="width100"></div>
                                </div>

                                <div className={styles.separator}></div>

                                <div className="row">
                                    <div className="width100">
                                        <Input
                                            defaultValue={loadedScan.comments}
                                            type="text"
                                            placeholder={getI18nLabel(locale, 'home.scan.input.aditionalComments.label')}
                                            tabindex={loadedScan.special_price ? tabsSpecial.comments : tabs.comments}
                                            onChange={this.commentHandler}
                                            className='indexed-element'
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {!showMessageNoElements && (
                        <div className={styles.productData}>
                            <div className={existProduct ? styles.productDataContainerCompleted : styles.productDataContainer}>

                                <p className={styles.title}>
                                    {existProduct ? "" : getI18nLabel(locale, 'home.product.title')}
                                </p>

                                <div className="row">
                                    <div className="width100">
                                        <Input
                                            defaultValue={loadedProduct.name}
                                            type="text"
                                            isBlack
                                            placeholder={getI18nLabel(locale, 'home.product.input.name.label')}
                                            bgColor={existProduct ? "Black" : ""}
                                            placeholderColor={existProduct ? "#FFF" : ""}
                                            color={existProduct ? "White" : ""}
                                            onChange={this.productNameHandler}
                                            disabled={existProduct}
                                            errorMessage={productNameErrorMsg}
                                            tabindex={loadedScan.special_price ? tabsSpecial.productName : tabs.productName}
                                            className='indexed-element'
                                        />
                                    </div>

                                    <div className="width100" style={{ marginTop: '5%' }}>
                                        {
                                            imageVis && <img className={styles.image} src={imageVis} onClick={() => this.selectImage(imageVis)} />
                                        }

                                        {!existProduct && (
                                            <div style={{ margin: '1em 0em 3em 0em' }}>
                                                <SecondaryButton
                                                    label={getI18nLabel(locale, 'home.product.option.changeImage')}
                                                    tabindex={loadedScan.special_price ? tabsSpecial.productImage : tabs.productImage}
                                                    className='indexed-element'
                                                    onClick={() => { this.productRef.click() }}
                                                />

                                                <input
                                                    style={{ display: 'none' }}
                                                    type="file"
                                                    onChange={this.changeProductPicture}
                                                    ref={ref => this.productRef = ref}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.separator}></div>

                                <div className="row">
                                    <div className="width45">
                                        <Input
                                            defaultValue={existProduct ? loadedProduct.barcode : loadedScan.barcode}
                                            type="text"
                                            isBlack={existProduct}
                                            placeholderColor={existProduct ? 'White' : ''}
                                            bgColor={existProduct ? 'Black' : ''}
                                            color={existProduct ? 'White' : ''}
                                            placeholder={getI18nLabel(locale, 'home.product.input.barcode.label')}
                                            disabled
                                            onChange={this.barcodeHandler}
                                            tabindex={loadedScan.special_price ? tabsSpecial.productBarcode : tabs.productBarcode}
                                        />

                                        <div className={styles.separator}></div>

                                        <Input
                                            defaultValue={loadedProduct.quantity}
                                            isBlack
                                            type="text"
                                            placeholderColor={existProduct ? 'White' : ''}
                                            bgColor={existProduct ? 'Black' : ''}
                                            color={existProduct ? 'White' : ''}
                                            placeholder={getI18nLabel(locale, 'home.product.input.amount.label')}
                                            onChange={this.quantityHandler}
                                            disabled={existProduct}
                                            tabindex={loadedScan.special_price ? tabsSpecial.productQuantity : tabs.productQuantity}
                                            className='indexed-element'
                                        />

                                        <div className={styles.separator}></div>
                                        <Autocomplete
                                            getSuggestions={(value) => this.getSuggestions(value, groupList)}
                                            getSuggestionValue={this.getSuggestionValue}
                                            renderSuggestion={this.renderSuggestion}
                                            onSuggestionSelected={this.onSelectGroup}
                                            tabindex={loadedScan.special_price ? tabsSpecial.productGroup : tabs.productGroup}
                                            disabled={existProduct}
                                            useWhiteText={existProduct}
                                            placeholder={getI18nLabel(locale, 'home.product.input.group.label')}
                                            defaultValue={loadedGroupName}
                                            resetLine={resetLine}
                                        />
                                        <div className={styles.separator}></div>
                                        <Select
                                            defaultOption={loadedProduct.type || '0'}
                                            label={getI18nLabel(locale, 'home.product.input.type.label')}
                                            bgColor={existProduct ? 'Black' : ''}
                                            color={existProduct ? 'White' : '#565656'}
                                            placeholderColor={existProduct ? 'White' : ''}
                                            options={this.typeFilter}
                                            onChange={this.changeTypeHandler}
                                            isDisabled={existProduct}
                                            errorMessage={productTypeErrorMsg}
                                            tabindex={loadedScan.special_price ? tabsSpecial.productType : tabs.productType}
                                            className='indexed-element'
                                        />

                                    </div>

                                    <div className="width45">
                                        <Select
                                            defaultOption={loadedBrand && loadedBrand.id || '0'}
                                            label={getI18nLabel(locale, 'home.product.input.brand.label')}
                                            bgColor={existProduct ? 'Black' : ''}
                                            color={existProduct ? 'White' : '#565656'}
                                            placeholderColor={existProduct ? 'White' : ''}
                                            options={brandList}
                                            onChange={this.changeBrandHandler}
                                            isDisabled={existProduct}
                                            errorMessage={productBrandErrorMsg}
                                            tabindex={loadedScan.special_price ? tabsSpecial.productBrand : tabs.productBrand}
                                            className='indexed-element'
                                        />
                                        <div className={styles.separator}></div>
                                        <Select
                                            defaultOption={loadedUnit.id || '0'}
                                            label={getI18nLabel(locale, 'home.product.input.unit.label')}
                                            bgColor={existProduct ? 'Black' : ''}
                                            color={existProduct ? 'White' : '#565656'}
                                            placeholderColor={existProduct ? 'White' : ''}
                                            options={unitList}
                                            onChange={this.changeUnitHandler}
                                            isDisabled={existProduct}
                                            errorMessage={productUnitErrorMsg}
                                            tabindex={loadedScan.special_price ? tabsSpecial.productUnit : tabs.productUnit}
                                            className='indexed-element'
                                        />
                                        <div className={styles.separator}></div>

                                        <Autocomplete
                                            getSuggestions={(value) => this.getSuggestions(value, lineListFilter)}
                                            getSuggestionValue={this.getSuggestionValue}
                                            renderSuggestion={this.renderSuggestion}
                                            onSuggestionSelected={this.onSelectLIne}
                                            tabindex={loadedScan.special_price ? tabsSpecial.productLine : tabs.productLine}
                                            disabled={existProduct}
                                            useWhiteText={existProduct}
                                            placeholder={getI18nLabel(locale, 'home.product.input.line.label')}
                                            defaultValue={loadedLineName}
                                            resetLine={resetLine}
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className={styles.title}>Historial</p>

                            <div
                                className={`${styles.historyContainer} ${existProduct ? 'productHistoryContainer' : ''}`}
                                style={existProduct ? { backgroundColor: 'black' } : { backgroundColor: 'white' }}
                            >
                                <div className={styles.squareContainer}>
                                    <Square
                                        date={recentPriceDate}
                                        title={getI18nLabel(locale, 'home.history.recent')}
                                        value={existProduct && loadedRecentPrice.price !== 0 ? loadedRecentPrice.price : null}
                                        bgColor={existProduct && loadedRecentPrice.price !== 0 ? '#3f4d5e' : ''}
                                        color={existProduct && loadedRecentPrice.price !== 0 ? 'white' : ''}
                                    />
                                </div>

                                <div className={styles.squareContainer}>
                                    <Square
                                        date={maxPriceDate}
                                        title={getI18nLabel(locale, 'home.history.mostExpensive')}
                                        value={existProduct && loadedMaxPrice.price !== 0 ? loadedMaxPrice.price : null}
                                        bgColor={existProduct && loadedMaxPrice.price !== 0 ? '#f55d5d' : ''}
                                        color={existProduct && loadedMaxPrice.price !== 0 ? 'white' : ''}
                                    />
                                </div>

                                <div className={styles.squareContainer}>
                                    <Square
                                        date={minPriceDate}
                                        title={getI18nLabel(locale, 'home.history.cheapest')}
                                        value={existProduct && loadedMinPrice.price !== 0 ? loadedMinPrice.price : null}
                                        bgColor={existProduct && loadedMinPrice.price !== 0 ? '#71a4e4' : ''}
                                        color={existProduct && loadedMinPrice.price !== 0 ? 'white' : ''}
                                    />
                                </div>

                                <div className={styles.squareContainer}>
                                    <Square
                                        date={minPricePromoDate}
                                        title={getI18nLabel(locale, 'home.history.cheapestWithPromotion')}
                                        value={existProduct && loadedMinPricePromotion.price !== 0 ? loadedMinPricePromotion.price : null}
                                        bgColor={existProduct && loadedMinPricePromotion.price !== 0 ? '#48a858' : ''}
                                        color={existProduct && loadedMinPricePromotion.price !== 0 ? 'white' : ''}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {showMessageNoElements && (
                        <div className={styles.messageNoElementsContainer}>
                            <h2>{getI18nLabel(locale, 'home.welcome')}</h2>
                        </div>
                    )}
                </div>
                <ToastContainer align="left" position="bottom" />
            </>
        )
    }
}

const withRouter = (props) => {
    const router = useRouter()
    return <HomePage {...props} router={router} />
}

export default withRouter;

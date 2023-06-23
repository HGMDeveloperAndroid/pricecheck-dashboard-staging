import React, { PureComponent, SyntheticEvent } from 'react'
import Router, { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faDollarSign } from '@fortawesome/free-solid-svg-icons'

import DetailsContainer from '../detailsContainer/DetailsContainer'
import { SecondaryButton, PrimaryButton } from '../buttons'
import Modal from '../modal/Modal'
import { Input } from '../input'
import { validateSession, getHeader, validateIsAnalyst, getLocale } from '../../utils/session-management'
import api from '../../utils/api'
import { photoUrl } from '../../utils/photo_url'
import { Select } from '../select'
import {
    getGroupsCatalog,
    getMissionsCatalog,
    getBrandsCatalog,
    getUnitsCatalog,
    getStoresCatalog,
    getLinesCatalog,
} from '../../utils/catalogs'
import formatDate from '../../utils/format-date'
import Loader from '../loader/Loader'
import TextArea from '../textArea/TextArea'

import s from './scanDetails.module.scss'
import { Checkbox } from '../checkbox'
import GoBackSpecific from '../goBackSpecificRoute'
import { getI18nLabel } from '../../i18n';

type Props = {
    id: string
    router: any
}

type Scan = {
    barcode: string,
    price: string,
    special_price: number,
    comments?: string,
    id_chain?: number | string,
    capture_date: string,
    reception_date: string,
    pictures: Array<Picture>,
    status: string
}

type Store = {
    id: number,
    name: string,
    address: string,
    chain: Array<string>,
}

type Picture = {
    product_picture: string,
    shelf_picture?: string,
    promo_picture?: string,
}

type Product = {
    id: number,
    name: string,
    quantity: number,
    barcode: string,
    type: string,
    is_enable: boolean,
    picture_path: string,
    [keys: string]: any,
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

const emptyStore = {
    id: 1,
    name: '',
    address: '',
    chain: []
}

const emptyMission = {
    id: 1,
    title: '',
    description: '',
    points: 0,
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

const emptyCatalog = {
    id: 1,
    name: '',
}

const emptyLine = {
    id: 1,
    name: '',
    id_group: 0,
}

const emptyProduct = {
    id: 0,
    name: '',
    quantity: 0,
    barcode: '',
    unit: emptyCatalog,
    group: emptyCatalog,
    line: emptyLine,
    brand: emptyCatalog,
    type: '',
    is_enable: false,
    picture_path: '',
}

const emptyScan = {
    id: 0,
    barcode: '',
    id_chain: 0,
    price: '',
    special_price: 0,
    comments: '',
    capture_date: '',
    reception_date: '',
    mission: emptyMission,
    product: '',
    pictures: [emptyPicture],
    status: '',
}

class ScanDetails extends PureComponent<Props> {
    productImgRef: any
    priceImgRef: any

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

    stateFilter = [
        {
            value: 'Validada',
            label: 'Validada',
        },
        {
            value: 'Rechazada',
            label: 'Rechazada',
        },
        {
            value: 'Pendiente',
            label: 'Pendiente',
        }
    ]

    state = {
        showModal: false,
        showLoader: false,
        isEditable: false,
        selectedImage: '',
        loadedScan: emptyScan,
        loadedProduct: emptyProduct,
        loadedStore: emptyStore,
        loadedBrand: emptyCatalog,
        loadedUnit: emptyCatalog,
        loadedGroup: emptyCatalog,
        loadedLine: emptyLine,
        loadedReviewed: emptyUser,
        loadedScanned: emptyUser,
        loadedMaxPrice: emptyHistoryData,
        loadedMinPrice: emptyHistoryData,
        loadedMinPricePromo: emptyHistoryData,
        groupList: [],
        brandList: [],
        unitList: [],
        missionList: [],
        storeList: [],
        lineList: [],
        lineListFilter: [],
        scanIdSelected: '',
        nameErrorMsg: '',
        quantityErrorMsg: '',
        priceErrorMsg: '',
        priceImg: '',
        priceImgUp: '',
        productImg: '',
        productImgUp: '',
        promoImg: null,
        isAnalyst: false,
    }


    async componentDidMount() {
        validateSession()
        const isAnalyst = validateIsAnalyst();
        const groupList = await getGroupsCatalog()
        const missionList = isAnalyst ? null : await getMissionsCatalog();
        const brandList = await getBrandsCatalog()
        const unitList = await getUnitsCatalog()
        const storeList = await getStoresCatalog()
        const lineList = await getLinesCatalog()
        const lineListFilter = await getLinesCatalog()

        const scanIdSelected = this.props.id
        this.getScanDetail(scanIdSelected)

        this.setState({
            groupList,
            brandList,
            unitList,
            missionList,
            storeList,
            lineList,
            lineListFilter,
            scanIdSelected,
            isEditable: false,
            isAnalyst: isAnalyst,
        })
    }

    getScanDetail = async (scanId: string) => {
        try {
            this.setState({ showLoader: true, })
            const res = await api.get(`api/scan/${scanId}/show`, { headers: getHeader() })
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

            const hasPromoPicture = (res.data.scan.pictures[0]?.promo_picture) as string | null;

            this.setState({
                loadedScan,
                loadedProduct: res.data.scan.product,
                priceImg: res.data.scan.pictures.length > 0 ?
                    `${photoUrl}/${res.data.scan.pictures[0].shelf_picture}` :
                    null,
                productImg: res.data.scan.pictures.length > 0 ?
                    `${photoUrl}/${res.data.scan.pictures[0].product_picture}` :
                    null,
                promoImg: hasPromoPicture ?
                    `${photoUrl}/${res.data.scan.pictures[0].promo_picture}` :
                    null,
                loadedStore: res.data.scan.store,
                loadedBrand: res.data.scan.product.brand,
                loadedUnit: res.data.scan.product.unit,
                loadedGroup: res.data.scan.product.group,
                loadedLine: res.data.scan.product.line,
                loadedReviewed: res.data.scan.reviewed,
                loadedScanned: res.data.scan.scanned_by,
                loadedMaxPrice: Object.keys(res.data.scan.history.max_price).length !== 0 ?
                    res.data.scan.history.max_price :
                    emptyHistoryData,
                loadedMinPrice: Object.keys(res.data.scan.history.min_price).length !== 0 ?
                    res.data.scan.history.min_price :
                    emptyHistoryData,
                loadedMinPricePromo: Object.keys(res.data.scan.history.min_price_with_promotion).length !== 0 ?
                    res.data.scan.history.min_price_with_promotion :
                    emptyHistoryData,
                showLoader: false,
            })
        } catch (err) {
            // TODO: enviar notificación cuando falla al obtener un scan
        }
    }

    selectImage = (selectedImage: string) => {
        if (selectedImage !== null && selectedImage !== '') {
            this.setState({ selectedImage, showModal: true })
        }
    }

    updateScan = () => {
        this.setState({ isEditable: true })
        this.getScanDetail(this.state.scanIdSelected)
    }

    storeHandler = (e: any) => {
        const storeId = e.target.value

        const store = {
            ...this.state.loadedStore,
            id: parseInt(storeId)
        }

        this.setState({ loadedStore: store })
    }

    statusHandler = (e: any) => {
        const status = e.target.value

        const scan = {
            ...this.state.loadedScan,
            status,
        }

        this.setState({ loadedScan: scan })
    }

    priceHandler = (e: any) => {
        const price = e.target.value

        const scan = {
            ...this.state.loadedScan,
            price,
        }

        this.setState({ loadedScan: scan })
    }

    quantityHandler = (e: any) => {
        const quantity = e.target.value

        const product = {
            ...this.state.loadedProduct,
            quantity,
        }

        this.setState({ loadedProduct: product })
    }

    nameHandler = (e: any) => {
        const name = e.target.value

        const product = {
            ...this.state.loadedProduct,
            name,
        }

        this.setState({ loadedProduct: product })
    }

    brandHandler = (e: any) => {
        const brandId = e.target.value

        const brand = {
            ...this.state.loadedBrand,
            id: parseInt(brandId)
        }

        this.setState({ loadedBrand: brand })
    }

    unitHandler = (e: any) => {
        const unitId = e.target.value

        const unit = {
            ...this.state.loadedUnit,
            id: parseInt(unitId)
        }

        this.setState({ loadedUnit: unit })
    }

    groupHandler = (e: any) => {
        const groupId = e.target.value
        let lineId = 0

        const updateFilterLineList: { value: number, label: string }[] = this.state.lineList.filter(
            (line: { value: number, label: string, group: number }) => {
                return parseInt(groupId) === line.group
            },
        )

        if (updateFilterLineList.length > 0) {
            lineId = updateFilterLineList[0].value
        }

        const group = {
            ...this.state.loadedGroup,
            id: parseInt(groupId),
        }

        const line = {
            ...this.state.loadedLine,
            id: lineId,
        }

        this.setState({
            loadedGroup: group,
            lineListFilter: updateFilterLineList,
            loadedLine: line
        })
    }

    lineHandler = (e: any) => {
        const lineId = e.target.value

        const line = {
            ...this.state.loadedLine,
            id: parseInt(lineId)
        }

        this.setState({ loadedLine: line })
    }

    typeHandler = (e: any) => {
        const type = e.target.value

        const product = {
            ...this.state.loadedProduct,
            type,
        }

        this.setState({ loadedProduct: product })
    }

    isSpecialPriceHandler = () => {
        const { loadedScan, loadedMinPricePromo } = this.state;

        const isChecked = Boolean(loadedScan.special_price);

        this.setState({
            loadedScan: {
                ...loadedScan,
                special_price: isChecked ? 0 : 1, // invert the check
            },

            loadedMinPricePromo: {
                ...loadedMinPricePromo,
                price: '0.00',
            },
        });
    }

    specialPriceHandler = (e: SyntheticEvent) => {
        const value = (e.target as HTMLInputElement).value;

        const { loadedMinPricePromo } = this.state;

        this.setState({
            loadedMinPricePromo: {
                ...loadedMinPricePromo,
                price: value,
            },
        })
    }

    saveScanButtonHandler = () => {
        this.validateScan()
    }

    validateScan = async () => {
        const scan: Scan = this.state.loadedScan
        const product: Product = this.state.loadedProduct
        const store: Store = this.state.loadedStore
        const brand: Brand = this.state.loadedBrand
        const unit: Unit = this.state.loadedUnit
        const group: Group = this.state.loadedGroup
        const line: Line = this.state.loadedLine

        if (this.validateFields(scan, product)) {
            try {
                const headers = {
                    ...getHeader(),
                    'content-type': 'multipart/form-data'
                }

                let form_data = new FormData();

                form_data.append('scan[barcode]', scan.barcode)
                form_data.append('product[name]', product.name)
                form_data.append('scan[price]', scan.price)
                form_data.append('scan[special_price]', `${Boolean(scan.special_price)}`)
                form_data.append('product[id_brand]', brand.id.toString())
                form_data.append('scan[id_chain]', store.id.toString())
                form_data.append('store[branch]', store.address)
                form_data.append('product[quantity]', product.quantity.toString())
                form_data.append('product[id_unit]', unit.id.toString())
                form_data.append('product[type]', product.type)
                form_data.append('product[id_group]', group.id.toString())
                form_data.append('product[id_line]', line.id.toString())

                const response = await api.post(
                    `api/scan/${this.state.scanIdSelected}/update`,
                    form_data,
                    { headers },
                )

                if (response.status === 200) {
                    this.getScanDetail(this.state.scanIdSelected)
                    this.cleanScan()
                    this.setState({ isEditable: false })
                }

            } catch (error) {
            }
        }
    }

    validateFields = (scan: Scan, product: Product): boolean => {
        let isValid = true

        const REGULAR_EXP_AMOUNT = /(?:^\d{1,3}(?:,?\d{3})*(?:\.\d{2})?$)/
        let nameErrorMsg = ''
        let quantityErrorMsg = ''
        let priceErrorMsg = ''

        if (!product.name || product.name.length < 2) {
            nameErrorMsg = 'El campo debe contener al menos dos caracteres'
        }

        if (scan.price.match(REGULAR_EXP_AMOUNT) === null) {
            priceErrorMsg = 'El precio debe ser un número válido'
        }

        if (product.quantity.toString().match(REGULAR_EXP_AMOUNT) === null) {
            quantityErrorMsg = 'El gramaje o cantidad debe ser un número válido: Con dos decimales máximo'
        }

        if (nameErrorMsg.length > 0 || priceErrorMsg.length > 0 || quantityErrorMsg.length > 0) {
            isValid = false
        }

        this.setState({ nameErrorMsg, priceErrorMsg, quantityErrorMsg })

        return isValid
    }

    cleanScan = () => {
        this.setState({
            nameErrorMsg: '',
            priceErrorMsg: '',
            quantityErrorMsg: '',
        })
    }

    cancelButtonHandler = () => {
        this.getScanDetail(this.state.scanIdSelected)
        this.cleanScan()
        this.setState({ isEditable: false })
    }

    changePricePicture = (e: any) => {
        if (e.target.files.length > 0) {
            const photo = e.target.files[0]

            const loadedScan = {
                ...this.state.loadedScan,
                pictures: this.state.loadedScan.pictures.map((p: any) => (
                    {
                        ...p,
                        shelf_picture: photo,
                    }
                ))
            }

            this.setState({
                priceImg: URL.createObjectURL(photo),
                priceImgUp: photo,
                loadedScan,
            }, () => {
                this.updatePictures(false, true)
            })
        }
    }

    changeProductPicture = (e: any) => {
        if (e.target.files.length > 0) {
            const photo = e.target.files[0]

            const loadedScan = {
                ...this.state.loadedScan,
                pictures: this.state.loadedScan.pictures.map((p: any) => {
                    return {
                        ...p,
                        product_picture: photo,
                    }
                })
            }

            this.setState({
                productImgUp: photo,
                productImg: URL.createObjectURL(photo),
                loadedScan,
            }, () => {
                this.updatePictures(true, false)
            })
        }
    }

    updatePictures = async (updateProductPicture: boolean, updatePricePicture: boolean) => {
        try {
            const headers = {
                ...getHeader(),
                'content-type': 'multipart/form-data'
            }

            let form_data = new FormData();

            if (updateProductPicture) {
                form_data.append('product_picture', this.state.productImgUp)
            }

            if (updatePricePicture) {
                form_data.append('shelf_picture', this.state.priceImgUp)
            }

            const response = await api.post(
                `api/scan/${this.state.scanIdSelected}/updatePictureProduct`,
                form_data,
                { headers },
            )

            if (response.status === 200) {
                this.getScanDetail(this.state.scanIdSelected)
                this.cleanScan()
                this.setState({ isEditable: false })
            }
        } catch (error) {
        }
    }

    handleCloseModal = () => {
        this.setState({
            showModal: false,
        });
    }

    barcodeHandler = (e: any) => {
        const barcode = e.target.value

        if (!isNaN(barcode)) {
            const loadedScan = {
                ...this.state.loadedScan,
                barcode,
            }

            this.setState({ loadedScan })
        }
    }

    render() {
        const {
            selectedImage,
            showModal,
            loadedScan,
            loadedProduct,
            loadedBrand,
            loadedLine,
            loadedGroup,
            loadedStore,
            loadedUnit,
            groupList,
            brandList,
            unitList,
            storeList,
            lineListFilter,
            loadedReviewed,
            loadedScanned,
            showLoader,
            isEditable,
            nameErrorMsg,
            priceErrorMsg,
            quantityErrorMsg,
            priceImg,
            productImg,
            promoImg,
            isAnalyst,
        } = this.state

        const locale = getLocale()

        const captureDate = formatDate(loadedScan.capture_date)
        brandList.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
        return (
            <div className={s.container}>
                {
                    process.browser && Router && Router.query.barcodes ? (
                        <GoBackSpecific route={
                            process.browser && Router
                                && Router.query.barcodes ? `/home/products/products-compare?barcodes=${Router.query.barcodes}` : '/home/scans'
                        } />
                    ) : (
                        <GoBackSpecific route={
                            process.browser && Router
                                && Router.query.product ? `/home/products/${Router.query.product}` : '/home/scans'
                        } />
                    )
                }
                <br />

                <Loader show={showLoader} />

                <DetailsContainer title={getI18nLabel(locale, 'capture.title')}>
                    <div className={s.details}>
                        <div className={s.field}>
                            <Input
                                defaultValue={loadedScan.id}
                                disabled
                                onChange={() => { }}
                                placeholder={getI18nLabel(locale, 'capture.input.captureId.label')}
                                type="text"
                            />
                        </div>

                        <div className={s.field}>
                            <Input
                                defaultValue={loadedScan.price}
                                disabled={!isEditable}
                                onChange={this.priceHandler}
                                placeholder={getI18nLabel(locale, 'capture.input.price.label')}
                                type="text"
                                errorMessage={priceErrorMsg}
                                icon={faDollarSign}
                            />

                            <Checkbox
                                style={{ marginTop: '0.5rem' }}
                                label={getI18nLabel(locale, 'capture.input.priceWithPromotion.label')}
                                checked={Boolean(loadedScan.special_price)}
                                onChange={this.isSpecialPriceHandler}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={s.field}>
                            <Input
                                defaultValue={loadedScan.barcode}
                                disabled={!isEditable}
                                onChange={this.barcodeHandler}
                                placeholder={getI18nLabel(locale, 'capture.input.barcode.label')}
                                type="text"
                            />
                        </div>

                        <div className={s.field}>
                            <Input
                                defaultValue={loadedProduct.name}
                                disabled
                                onChange={this.nameHandler}
                                placeholder={getI18nLabel(locale, 'capture.input.name.label')}
                                type="text"
                                errorMessage={nameErrorMsg}
                            />
                        </div>

                        <div className={s.fieldSelect}>
                            <Select
                                defaultOption={loadedBrand.id}
                                label={getI18nLabel(locale, 'capture.input.brand.label')}
                                options={brandList}
                                onChange={this.brandHandler}
                                isDisabled
                            />
                        </div>

                        <div className={s.fieldSelect}>
                            <Select
                                defaultOption={loadedUnit.id}
                                onChange={this.unitHandler}
                                label={getI18nLabel(locale, 'capture.input.unit.label')}
                                options={unitList}
                                isDisabled
                            />
                        </div>

                        <div className={s.fieldSelect}>
                            <Select
                                defaultOption={loadedScan.id_chain}
                                onChange={this.storeHandler}
                                label={getI18nLabel(locale, 'capture.input.store.label')}
                                options={storeList}
                                isDisabled={!isEditable}
                            />
                        </div>

                        <div className={s.fieldSelect}>
                            <Select
                                defaultOption={loadedProduct.type}
                                onChange={this.typeHandler}
                                label={getI18nLabel(locale, 'capture.input.type.label')}
                                options={this.typeFilter}
                                isDisabled
                            />
                        </div>

                        <div className={s.fieldSelect}>
                            <Select
                                defaultOption={loadedGroup.id}
                                onChange={this.groupHandler}
                                label={getI18nLabel(locale, 'capture.input.group.label')}
                                options={groupList}
                                isDisabled
                            />
                        </div>

                        <div className={s.fieldSelect}>
                            <Select
                                defaultOption={loadedLine.id}
                                onChange={this.lineHandler}
                                label={getI18nLabel(locale, 'capture.input.line.label')}
                                options={lineListFilter}
                                isDisabled
                            />
                        </div>


                        <div className={s.field}>
                            <Input
                                defaultValue={loadedProduct.quantity}
                                disabled
                                onChange={this.quantityHandler}
                                placeholder={getI18nLabel(locale, 'capture.input.amount.label')}
                                type="text"
                                errorMessage={quantityErrorMsg}
                            />
                        </div>

                        <div className={s.field}>
                            <Input
                                defaultValue={captureDate}
                                disabled
                                onChange={() => { }}
                                placeholder={getI18nLabel(locale, 'capture.input.captureDate.label')}
                                type="text"
                            />
                        </div>

                        <div className={s.fieldSelect}>
                            <Select
                                defaultOption={loadedScan.status}
                                onChange={this.statusHandler}
                                label={getI18nLabel(locale, 'capture.input.status.label')}
                                options={this.stateFilter}
                                isDisabled
                            />
                        </div>

                        <div className={s.fieldScaned}>
                            <Input
                                defaultValue={`${loadedScanned.first_name} ${loadedScanned.last_name}`}
                                disabled
                                fontSize='12px'
                                onChange={() => { }}
                                placeholder={getI18nLabel(locale, 'capture.input.scannedBy.label')}
                                type="text"
                            />
                        </div>

                        <div className={s.fieldReviewed}>
                            {loadedReviewed && (
                                <Input
                                    defaultValue={`${loadedReviewed.first_name} ${loadedReviewed.last_name}`}
                                    disabled
                                    onChange={() => { }}
                                    placeholder={getI18nLabel(locale, 'capture.input.reviewed.label')}
                                    type="text"
                                />
                            )}
                        </div>

                        <div className={s.field}>
                            <TextArea
                                onChange={() => { }}
                                defaultValue={loadedStore.address}
                                placeholder={getI18nLabel(locale, 'capture.input.branchOffice.label')}
                                disabled
                            />
                        </div>
                    </div>
                    {
                        !isAnalyst ? (
                            <div className={isAnalyst ? s.buttonsConDisabled : s.buttonsCon}>
                                {!isEditable && (
                                    <div className={s.btnContainer}>
                                        <SecondaryButton
                                            className={isAnalyst ? s.disabledButton : null}
                                            label={getI18nLabel(locale, 'capture.options.editInformation')}
                                            onClick={this.updateScan}
                                        />
                                    </div>
                                )}

                                {isEditable && (
                                    <div className={s.btnContainer}>
                                        <PrimaryButton
                                            label={getI18nLabel(locale, 'capture.options.saveInformation')}
                                            onClick={this.saveScanButtonHandler}
                                        />
                                    </div>
                                )}

                                {isEditable && (
                                    <div className={s.btnContainer}>
                                        <SecondaryButton
                                            label={getI18nLabel(locale, 'capture.options.cancelInformation')}
                                            onClick={this.cancelButtonHandler}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : ''
                    }

                </DetailsContainer>

                <div className={s.images}>
                    <div className={s.imageContainer}>
                        <DetailsContainer title={getI18nLabel(locale, 'capture.input.mainImage.label')}>
                            <img
                                onClick={() => this.selectImage(productImg)}
                                className={s.image}
                                src={productImg ? productImg : null}
                            />
                            {
                                !isAnalyst ? (
                                    <SecondaryButton
                                        label={getI18nLabel(locale, 'capture.options.changeImage')}
                                        onClick={() => { this.productImgRef.click() }} />
                                ) : ''
                            }


                            <input
                                style={{ display: 'none' }}
                                type="file"
                                onChange={this.changeProductPicture}
                                ref={ref => this.productImgRef = ref}
                            />
                        </DetailsContainer>
                    </div>

                    <div className={s.imageContainer}>
                        <DetailsContainer title={getI18nLabel(locale, 'capture.input.priceImage.label')}>
                            <img
                                onClick={() => this.selectImage(priceImg !== null ? priceImg : '')}
                                className={s.image}
                                src={priceImg ? priceImg : null}
                            />
                            {
                                !isAnalyst ? (
                                    <SecondaryButton
                                        label={getI18nLabel(locale, 'capture.options.changeImage')}
                                        onClick={() => { this.priceImgRef.click() }} />
                                ) : ''
                            }

                            <input
                                style={{ display: 'none' }}
                                type="file"
                                onChange={this.changePricePicture}
                                ref={ref => this.priceImgRef = ref}
                            />
                        </DetailsContainer>
                    </div>

                    {promoImg && (
                        <div className={s.imageContainer}>
                            <DetailsContainer title={getI18nLabel(locale, 'capture.detailsContainer.title')}>
                                <img
                                    onClick={() => this.selectImage(promoImg)}
                                    className={s.image}
                                    src={promoImg}
                                />
                            </DetailsContainer>
                        </div>
                    )}
                </div>

                <Modal
                    noPadding={true}
                    containerWidth="40%"
                    showModal={showModal}
                    closeModal={() => this.handleCloseModal()}
                >
                    <span
                        onClick={() => this.handleCloseModal()}
                        className={s.modalImageClose}
                    >
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </span>

                    <img
                        src={selectedImage}
                        className={s.modalImage}
                    />
                </Modal>
            </div>
        )
    }
}

const withRouter = (props) => {
    const router = useRouter();

    return <ScanDetails {...props} router={router}/>
}

export default withRouter;

import React, { PureComponent } from 'react'
import GoBack from '../goBack/GoBack'
import DetailsContainer from '../detailsContainer/DetailsContainer'
import { Input } from '../input'
import Modal from '../modal/Modal'
import { SecondaryButton, PrimaryButton } from '../buttons'

import s from './productDetails.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { validateSession, getHeader, validateIsAnalyst } from '../../utils/session-management'
import api from '../../utils/api'
import { getGroupsCatalog, getBrandsCatalog, getUnitsCatalog, getStoresCatalog, getLinesCatalog } from '../../utils/catalogs'
import { Select } from '../select'
import { photoUrl } from '../../utils/photo_url'
import Loader from '../loader/Loader'
import { useRouter } from 'next/router'
import { getI18nLabel } from '../../i18n';


type Props = {
    id: string,
    router: any,
    locale?: string,
}

type Product = {
    id: number,
    name: string,
    picture_path: string,
    barcode: string,
    quantity: number,
    type: string,
    highest_price: string,
    lower_price: string,
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

type Option = {
    value: string,
    label: string,
}

type state = {
    loadedProduct: Product,
    loadedBrand: Brand,
    loadedUnit: Unit,
    loadedGroup: Group,
    loadedLine: Line,
    groupList: Array<Option>,
    brandList: Array<Option>,
    unitList: Array<Option>,
    lineList: Array<Option>,
    lineListFilter: Array<Option>,
    productImg: string,
    productBarcodeSelected: string,
    isEditable: boolean,
    showLoader: boolean,
    nameErrorMsg: string,
    quantityErrorMsg: string,
}
const emptyProduct = {
    id: 0,
    picture_path: '',
    name: '',
    barcode: '',
    quantity: 0,
    type: '',
    highest_price: '',
    lower_price: '',
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

class ProductTab extends PureComponent<Props> {

    productImgRef: any

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
        showModal: false,
        selectedImage: '',
        loadedProduct: emptyProduct,
        loadedBrand: emptyCatalog,
        loadedUnit: emptyCatalog,
        loadedGroup: emptyCatalog,
        loadedLine: emptyLine,
        groupList: [],
        brandList: [],
        unitList: [],
        lineListFilter: [],
        lineList: [],
        productImg: '',
        productBarcodeSelected: '',
        isEditable: false,
        showLoader: false,
        nameErrorMsg: '',
        quantityErrorMsg: '',
        isAnalyst: false,
    }

    async componentDidMount() {

        type Options = { value: string, label: string }

        validateSession()
        const groupList = await getGroupsCatalog()
        const brandList = await getBrandsCatalog()
        const unitList = await getUnitsCatalog()
        const storeList = await getStoresCatalog()
        const lineList = await getLinesCatalog()
        const lineListFilter = await getLinesCatalog()

        const productBarcodeSelected = this.props.id
        this.getProductDetail(productBarcodeSelected)

        this.setState({
            groupList,
            brandList,
            unitList,
            storeList,
            lineList,
            lineListFilter,
            productBarcodeSelected,
            isEditable: false,
            isAnalyst: validateIsAnalyst(),
        })
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
                productImg: res.data.product.picture_path ? `${photoUrl}/${res.data.product.picture_path}` : null,
                showLoader: false,
                loadedUnit: res.data.product.unit,
                loadedGroup: res.data.product.group,
                loadedLine: res.data.product.line,
                loadedBrand: res.data.product.brand
            })

        } catch (err) {
            this.props.router.push('/home/products')
            // TODO: enviar notificación cuando falla al obtener un product
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
                productImg: URL.createObjectURL(photo),
                loadedProduct,
            }, () => {
                this.updateProductPicture()
            })

        }
    }

    selectImage = (selectedImage: string) => {
        if (selectedImage !== null) {
            this.setState({ selectedImage, showModal: true })
        }
    }

    updateProductPicture = async () => {

        try {
            const headers = {
                ...getHeader(),
                'content-type': 'multipart/form-data'
            }

            let form_data = new FormData();
            form_data.append(`picture_path`, this.state.loadedProduct.picture_path)

            const response = await api.post(`api/product/${this.state.productBarcodeSelected}/updatePhoto`, form_data, { headers })


            if (response.status === 200) {
                this.getProductDetail(this.state.productBarcodeSelected)
            }

        } catch (error) {
        }

    }

    updateButtonHnalder = () => {
        this.setState({ isEditable: true })
        this.getProductDetail(this.state.productBarcodeSelected)
    }

    cancelButtonHandler = () => {
        this.getProductDetail(this.state.productBarcodeSelected)
        this.setState({ isEditable: false })
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

        const updateFilterLineList: Array<{ value: number, label: string }> = this.state.lineList.filter((line: { value: number, label: string, group: number }) => {
            return parseInt(groupId) === line.group
        })

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

    saveButtonHandler = (e: any) => {
        this.updateProduct()
    }

    updateProduct = async () => {
        const product: Product = this.state.loadedProduct
        const brand: Brand = this.state.loadedBrand
        const unit: Unit = this.state.loadedUnit
        const group: Group = this.state.loadedGroup
        const line: Line = this.state.loadedLine

        if (this.validateFileds(product)) {
            try {

                const headers = {
                    ...getHeader(),
                    'content-type': 'multipart/form-data'
                }

                let form_data = new FormData();

                form_data.append('product[barcode]', product.barcode)
                form_data.append('product[name]', product.name)
                form_data.append('product[quantity]', product.quantity.toString())
                form_data.append('product[id_unit]', unit.id.toString())
                form_data.append('product[type]', product.type)
                form_data.append('product[id_group]', group.id.toString())
                form_data.append('product[id_line]', line.id.toString())
                form_data.append('product[id_brand]', brand.id.toString())

                const response = await api.post(`api/product/${this.state.productBarcodeSelected}/update`, form_data, { headers })

                if (response.status === 200) {
                    this.getProductDetail(this.state.productBarcodeSelected)
                    this.cleanData()
                    this.setState({ isEditable: false })
                }
            } catch (error) {
            }
        }
    }

    validateFileds = (product: Product): boolean => {
        const { locale } = this.props

        let isValid = true

        const REGULAR_EXP_AMOUNT = /(?:^\d{1,3}(?:,?\d{3})*(?:\.\d{2})?$)/
        let nameErrorMsg = ''
        let quantityErrorMsg = ''


        if (!product.name || product.name.length < 2) {
            nameErrorMsg = getI18nLabel(locale, 'productTab.detail.input.name.validations.minLength')
        }

        if (product.quantity.toString().match(REGULAR_EXP_AMOUNT) === null) {
            quantityErrorMsg = getI18nLabel(locale, 'productTab.detail.input.amount.validations.valid')
        }

        if (nameErrorMsg.length > 0 || quantityErrorMsg.length > 0) {
            isValid = false
        }

        this.setState({ nameErrorMsg, quantityErrorMsg })

        return isValid
    }

    cleanData = () => {
        this.setState({ nameErrorMsg: '', quantityErrorMsg: '' })
    }

    handleCloseModal = () => {
        this.setState({
            showModal: false,
        });
    }

    barcodeHandler = (e: any) => {
        const barcode = e.target.value

        if (!isNaN(barcode)) {
            const loadedProduct = {
                ...this.state.loadedProduct,
                barcode,
            }

            this.setState({ loadedProduct })
        }
    }

    render() {

        const { selectedImage, showModal, loadedProduct, brandList, lineListFilter, unitList, groupList, productImg, isEditable, lineList, showLoader,
            loadedLine, loadedBrand, loadedGroup, loadedUnit, nameErrorMsg, quantityErrorMsg, isAnalyst } = this.state
        const { locale } = this.props

        brandList.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);

        return (
            <div>
                <Loader show={showLoader} />
                <DetailsContainer>
                    <div className={s.details}>
                        <div className={s.field}>
                            <Input defaultValue={loadedProduct.id} disabled onChange={() => { }} placeholder={getI18nLabel(locale, 'productTab.detail.input.productId.label')} type="text" />
                            <div className={s.separator}></div>
                            <Select defaultOption={loadedGroup.id} label={getI18nLabel(locale, 'productTab.detail.input.group.label')} options={groupList} onChange={this.groupHandler} isDisabled={isEditable ? false : true} />
                        </div>
                        <div className={s.field}>
                            <Input defaultValue={loadedProduct.barcode} disabled={!isEditable} onChange={this.barcodeHandler} placeholder={getI18nLabel(locale, 'productTab.detail.input.barcode.label')} type="text" />
                            <div className={s.separator}></div>
                            <Select defaultOption={loadedLine.id} label={getI18nLabel(locale, 'productTab.detail.input.line.label')} options={lineListFilter} onChange={this.lineHandler} isDisabled={isEditable ? false : true} />
                        </div>

                        <div className={s.field}>
                            <Input defaultValue={loadedProduct.name} disabled={isEditable ? false : true} onChange={this.nameHandler} placeholder={getI18nLabel(locale, 'productTab.detail.input.name.label')} type="text" errorMessage={nameErrorMsg} />
                            <div className={s.separator}></div>
                            <Input defaultValue={loadedProduct.quantity} disabled={isEditable ? false : true} onChange={this.quantityHandler} placeholder={getI18nLabel(locale, 'productTab.detail.input.amount.label')} type="text" errorMessage={quantityErrorMsg} />

                        </div>
                        <div className={s.field}>
                            <Select defaultOption={loadedBrand.id} label={getI18nLabel(locale, 'productTab.detail.input.brand.label')} options={brandList} onChange={this.brandHandler} isDisabled={isEditable ? false : true} />
                            <div className={s.separator}></div>
                            <Select defaultOption={loadedUnit.id} label={getI18nLabel(locale, 'productTab.detail.input.unit.label')} options={unitList} onChange={this.unitHandler} isDisabled={isEditable ? false : true} />
                        </div>
                        <div className={s.field}>
                            <Select defaultOption={loadedProduct.type} label={getI18nLabel(locale, 'productTab.detail.input.type.label')} options={this.typeFilter} onChange={this.typeHandler} isDisabled={isEditable ? false : true} />
                            <div className={s.separator}></div>
                            <Input defaultValue={loadedProduct.lower_price ? loadedProduct.lower_price : '0.0'} disabled onChange={() => { }} placeholder={getI18nLabel(locale, 'productTab.detail.input.minPrice.label')} type="text" />
                        </div>
                        <div className={s.field}>
                            <div style={{ marginBottom: '7em' }}></div>
                            <div className={s.separator}></div>
                            <Input defaultValue={loadedProduct.highest_price ? loadedProduct.highest_price : '0.0'} disabled onChange={() => { }} placeholder={getI18nLabel(locale, 'productTab.detail.input.maxPrice.label')} type="text" />
                        </div>
                    </div>
                    {
                        !isAnalyst && (
                            <div className={s.buttonsCon}>
                                {!isEditable && !isAnalyst && <div className={s.btnContainer}>
                                    <SecondaryButton label={getI18nLabel(locale, 'productTab.detail.options.editInformation')} onClick={this.updateButtonHnalder} />
                                </div>}
                                {isEditable && <div className={s.btnContainer}>
                                    <PrimaryButton label={getI18nLabel(locale, 'productTab.detail.options.saveInformation')} onClick={this.saveButtonHandler} />
                                </div>}
                                {isEditable && <div className={s.btnContainer}>
                                    <SecondaryButton label={getI18nLabel(locale, 'productTab.detail.options.cancel')} onClick={this.cancelButtonHandler} />
                                </div>}
                            </div>
                        )
                    }

                </DetailsContainer>
                <div className={s.images}>
                    <div className={s.imageContainer}>
                        <DetailsContainer title={getI18nLabel(locale, 'productTab.detail.detailsContainer.title')}>
                            <img onClick={() => this.selectImage(productImg)} className={s.image} src={productImg} />
                            {
                                !isAnalyst && (
                                    <SecondaryButton label={getI18nLabel(locale, 'productTab.detail.options.changeImage')} onClick={() => { this.productImgRef.click() }} />
                                )
                            }

                            <input style={{ display: 'none' }} type="file" onChange={this.changeProductPicture} ref={ref => this.productImgRef = ref} />
                        </DetailsContainer>
                    </div>
                </div>
                <Modal noPadding={true} containerWidth="40%" showModal={showModal} closeModal={this.handleCloseModal}>
                    <span onClick={() => this.handleCloseModal()} className={s.modalImageClose}><FontAwesomeIcon icon={faTimesCircle} /></span>
                    <img src={selectedImage} alt="this is a image" className={s.modalImage} />
                </Modal>
            </div>
        )
    }
}

const withRouter = (props) => {
    const router = useRouter()
    return <ProductTab {...props} router={router} />
}

export default withRouter;

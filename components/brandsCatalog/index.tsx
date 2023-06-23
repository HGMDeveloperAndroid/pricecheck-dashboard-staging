import React, { Component } from 'react'
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInfoCircle,
  faCaretDown,
  faSearch,
  faPencilAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { Input } from '../../components/input'
import { PrimaryButton, SecondaryButton } from '../../components/buttons'
import Modal from '../../components/modal/Modal'
import {
  validateSession,
  getHeader,
} from '../../utils/session-management'
import api from '../../utils/api'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { Table } from '../../components/table'
import styles from './brands.module.scss'
import EditCatalogForm from '../simpleCatalogForm'
import {getI18nLabel, translateTableHeader} from '../../i18n'

type BrandData = {
  id: number,
  name: string,
  description: string,
}

type BrandModalData = {
  name?: string,
  description?: string,
}

type State = {
  showModal: boolean,
  modalBrandId: null | number,
  brands: any,
  currentPage: number,
  totalPage: number,
  perPage: number,
  total: number,
  count: number,
  textSearch: null | string,
  role: null | string,
  brand: BrandModalData,
  brandEdited: BrandModalData,
  errorMes: string
}

const emptyBrand = {
  name: '',
  description: '',
}

export default class BrandsCatalog extends Component<any, State> {
  tableHead = [
    {
      key: 'name',
      label: 'Nombre',
    },
  ]

  state = {
    showModal: false,
    modalBrandId: null,
    brands: [],
    currentPage: 1,
    totalPage: 1,
    perPage: 50,
    total: 0,
    count: 0,
    textSearch: null,
    role: null,
    brand: emptyBrand,
    brandEdited: emptyBrand,
    showModalTags: false,
    errorMes: '',
  }


  async componentDidMount() {
    validateSession()
    this.getBrandList(1)
  }

  getBrandList = async (page: number) => {
    const params: { name?: string, page: number } = { page }
    const { locale } = this.props

    if (this.state.textSearch) {
      params.name = `${this.state.textSearch}`
    }

    try {
      const res = await api.get('api/brands/search?', { headers: getHeader(), params })
      if (res && res.data && res.data.data) {
        const pagination = res.data.data;
        const brands = res.data.data.data.map((brand: any) => {
          return {
            ...brand,
          }
        })
        this.setState({
          brands,
          total: pagination.total,
          currentPage: pagination.current_page,
          count: pagination.to,
          totalPage: pagination.last_page,
        })
      } else {
        this.setState({ brands: {} })
      }
    } catch (err) {
      toast.notify(getI18nLabel(locale, 'brandsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'brandsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  changeTextSearch = (e: any) => {
    const textSearch = e.target.value.length > 0 ? e.target.value : null
    this.setState({ textSearch }, () => {
      this.getBrandList(1)
    })
  }

  createBrand = async (data: BrandModalData) => {
    const { locale } = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      await api.post('api/brands/create', { ...data }, { headers })

      this.setState({
        brand: emptyBrand,
        showModal: false,
        modalBrandId: null,
        brandEdited: emptyBrand,
      })

      toast.notify(getI18nLabel(locale, 'brandsCatalog.toast.create.success.message'), {
        title: getI18nLabel(locale, 'brandsCatalog.toast.success.title'),
        duration: 6,
      })
      this.getBrandList(1)
    } catch (error) {
      toast.notify(getI18nLabel(locale, 'brandsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'brandsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  deleteBrand = async (id: number) => {
    const { locale } = this.props
    try {
      const response = await api.delete(`api/brands/delete/${id}`, { headers: getHeader() })
      if (response.status === 200) {
      toast.notify(getI18nLabel(locale, 'brandsCatalog.toast.delete.success.message'), {
        title: getI18nLabel(locale, 'brandsCatalog.toast.success.title'),
          duration: 6,
          type: "success"
        })
        this.setState({
          textSearch: ''
        })
        this.getBrandList(1)

      }
    } catch (error) {
      toast.notify(error.response.data.errors, {
        title: getI18nLabel(locale, 'brandsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  clearModal = () => {
    this.setState({
      showModal: false,
      modalBrandId: null,
      brand: emptyBrand,
      brandEdited: emptyBrand,
    })
  };

  editBrand = async (data: BrandModalData) => {
    const { locale } = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      const response = await api.put(`api/brands/update/${this.state.modalBrandId}`, { ...data }, { headers })
      if (response && response.status === 200) {
        toast.notify(getI18nLabel(locale, 'brandsCatalog.toast.edit.success.message'), {
            title: getI18nLabel(locale, 'brandsCatalog.toast.success.title'),
            duration: 6,
            type: "success"
        })
      }
      this.clearModal();
      this.getBrandList(1);
    } catch (error) {
      this.clearModal();
      toast.notify(getI18nLabel(locale, 'brandsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'brandsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  openModalEditBrand = (brandData: BrandData) => {
    const brand: BrandModalData = {
      name: brandData.name,
      description: brandData.description,
    }
    this.setState({ showModal: true, modalBrandId: brandData.id, brand, brandEdited: brand })
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      modalBrandId: null,
      brand: emptyBrand,
      brandEdited: emptyBrand,
      errorMes: '',
    })
  }

  download(res: any, type = 'text/csv;charset=utf-8;', extension = 'csv') {
    const url = window.URL.createObjectURL(
      new Blob(["\ufeff", res], {
        type,
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `brands-report-${format(new Date(), 'MM-dd-yyyy-HH:mm')}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  downloadData = async (page: any) => {
    const { locale } = this.props
    try {
      const params: { name?: string, page: number } = { page }

      if (this.state.textSearch) {
        params.name = `${this.state.textSearch}`
      }


      const response = await api.get(
        `api/brands/csv`,
        {
          headers: getHeader(),
          params,
          responseType: 'blob',
        }
      )

      if (response.status === 200) {
        this.download(response.data)
        toast.notify(getI18nLabel(locale, 'brandsCatalog.toast.downloadData.success.message'), {
            title: getI18nLabel(locale, 'brandsCatalog.toast.success.title'),
            duration: 6,
            type: "success"
        })
      }
    } catch (e) {
      toast.notify(getI18nLabel(locale, 'brandsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'brandsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  render() {
    const {
      showModal,
      modalBrandId,
      currentPage,
      totalPage,
      total,
      count,
      brand,
      textSearch,
      errorMes,
      brands,
    } = this.state
      const {locale} = this.props
      this.tableHead = translateTableHeader(locale, this.tableHead, 'brandsCatalog.table.headers')

    const modalTitle = modalBrandId ? getI18nLabel(locale, 'brandsCatalog.modal.editModal.title') : getI18nLabel(locale, 'brandsCatalog.modal.createModal.title')
    const modalButton = modalBrandId ? getI18nLabel(locale, 'brandsCatalog.modal.options.save') : getI18nLabel(locale, 'brandsCatalog.modal.options.create')

    return (
      <>

        <div className={styles.headContainer}>
          <div className={styles.rightContainer}>
            <div className={styles.titleCatalog}>
              <h2>{getI18nLabel(locale, 'brandsCatalog.title')}</h2>
            </div>
            <div className={styles.findUser}>
              <Input placeholderOverLabel={true} defaultValue={textSearch} onChange={this.changeTextSearch} placeholder={getI18nLabel(locale, 'brandsCatalog.modal.createModal.search')} icon={faSearch} type="text" bgColor="transparent" />
            </div>

            <span className={styles.label}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <div className={styles.message}>
                <p>{getI18nLabel(locale, 'brandsCatalog.modal.createModal.searchByName')}</p>
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
            </span>

            <div className={styles.buttonContainer}>
              <PrimaryButton
                label={getI18nLabel(locale, 'brandsCatalog.modal.actions.add')}
                onClick={() => this.setState({ showModal: true, modalBrandId: null, brandEdited: emptyBrand, brand: emptyBrand })}
              />
              <div style={{ paddingTop: '10px' }}>
                <SecondaryButton
                    label={getI18nLabel(locale, 'brandsCatalog.modal.actions.download')}
                  onClick={() => this.downloadData(currentPage)}
                />
              </div>
            </div>

          </div>
        </div>

        <div className={styles.tableContainer}>
          <Table
            bodyData={brands}
            header={this.tableHead}
            currentPage={currentPage}
            count={count}
            total={total}
            onNextPage={() => this.getBrandList(currentPage + 1)}
            onPrevPage={() => this.getBrandList(currentPage - 1)}
            actions={[
              {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: (brand: BrandData) => this.openModalEditBrand(brand),
              },
              {
                icon: faTrashAlt,
                color: '#DE4747',
                action: (brand: BrandData) => this.deleteBrand(brand.id),
              },
            ]}
            totalPage={totalPage}
          />
        </div>
        <ToastContainer align="left" position="bottom" />
        <Modal showModal={showModal} closeModal={this.closeModal}>
          <EditCatalogForm
            onAddForm={this.createBrand}
            onEditForm={this.editBrand}
            onClose={() => this.closeModal()}
            showClose
            title={modalTitle}
            formProp={brand}
            labelButton={modalButton}
            formId={modalBrandId}
            serverErrors={errorMes}
          />
        </Modal>
      </>
    )
  }
}

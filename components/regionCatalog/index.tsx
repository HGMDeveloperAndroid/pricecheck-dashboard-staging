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
import styles from './regions.module.scss'
import EditRegionForm from '../regionForm'
import {getI18nLabel, translateTableHeader} from '../../i18n'

type RegionData = {
  id: number,
  name: string,
  description: string,
  alias: string,
}

type RegionModalData = {
  name?: string,
  description?: string,
  alias?: string,
}

type Option = {
  value: any,
  label: string,
}

type State = {
  showModal: boolean,
  modalRegionId: null | number,
  regions: any,
  currentPage: number,
  totalPage: number,
  perPage: number,
  total: number,
  count: number,
  textSearch: null | string,
  role: null | string,
  groupList: Option[],
  region: RegionModalData,
  regionEdited: RegionModalData,
  errorMes: string
}

const emptyRegion = {
  name: '',
  description: '',
  group_id: 0,
}

export default class RegionCatalog extends Component<any, State> {
  tableHead = [
    {
      key: 'name',
      label: 'Nombre',
    },
  ]

  state = {
    showModal: false,
    modalRegionId: null,
    regions: [],
    currentPage: 1,
    totalPage: 1,
    perPage: 50,
    total: 0,
    count: 0,
    textSearch: null,
    role: null,
    groupList: [],
    region: emptyRegion,
    regionEdited: emptyRegion,
    showModalTags: false,
    errorMes: '',
  };

  async componentDidMount() {
    validateSession()
    this.getRegionList(1)
  }

  getRegionList = async (page: number) => {
      const {locale} = this.props
    const params: { name?: string, page: number } = { page }

    if (this.state.textSearch) {
      params.name = `${this.state.textSearch}`
    }

    try {
      const res = await api.get('api/regions/search?', { headers: getHeader(), params })
      if (res && res.data && res.data.data) {
        const pagination = res.data.data;
        const regions = res.data.data.data.map((region: any) => {
          return {
            ...region,
          }
        })
        this.setState({
          regions,
          total: pagination.total,
          currentPage: pagination.current_page,
          count: pagination.to,
          totalPage: pagination.last_page,
        })
      } else {
        this.setState({ regions: {} })
      }
    } catch (err) {
      toast.notify(getI18nLabel(locale, 'regionsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'regionsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  changeTextSearch = (e: any) => {
    const textSearch = e.target.value.length > 0 ? e.target.value : null
    this.setState({ textSearch }, () => {
      this.getRegionList(1)
    })
  }

  createRegion = async (data: RegionModalData) => {
      const {locale} = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      await api.post('api/regions/create', { ...data }, { headers })

      this.setState({
        region: emptyRegion,
        showModal: false,
        modalRegionId: null,
        regionEdited: emptyRegion,
      })

      toast.notify(getI18nLabel(locale, 'regionsCatalog.toast.create.success.message'), {
        title: getI18nLabel(locale, 'regionsCatalog.toast.success.title'),
        duration: 19,
        type: "success"
      })
      this.getRegionList(1)
    } catch (error) {
      toast.notify(getI18nLabel(locale, 'regionsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'regionsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  deleteRegion = async (id: number) => {
      const {locale} = this.props
    try {
      const response = await api.delete(`api/regions/delete/${id}`, { headers: getHeader() })
      if (response.status === 200) {
        toast.notify(getI18nLabel(locale, 'regionsCatalog.toast.delete.success.message'), {
            title: getI18nLabel(locale, 'regionsCatalog.toast.delete.success.title'),
          duration: 6,
          type: "success"
        })
        this.setState({
          textSearch: ''
        })
        this.getRegionList(1)

      }
    } catch (error) {
      toast.notify(error.response.data.errors, {
        title: getI18nLabel(locale, 'regionsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  clearModal = () => {
    this.setState({
      showModal: false,
      modalRegionId: null,
      region: emptyRegion,
      regionEdited: emptyRegion,
    })
  };

  editRegion = async (data: RegionModalData) => {
      const {locale} = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      const response = await api.put(`api/regions/update/${this.state.modalRegionId}`, { ...data }, { headers })
      if (response && response.status === 200) {
        toast.notify(getI18nLabel(locale, 'regionsCatalog.toast.edit.success.message'), {
            title: getI18nLabel(locale, 'regionsCatalog.toast.edit.success.title'),
          duration: 6,
          type: "success"
        })
      }
      this.clearModal();
      this.getRegionList(1);
    } catch (error) {
      this.clearModal();
      toast.notify(getI18nLabel(locale, 'regionsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'regionsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
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
    link.setAttribute('download', `region-report-${format(new Date(), 'MM-dd-yyyy-HH:mm')}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  downloadData = async (page: any) => {
      const {locale} = this.props
    try {
      const params: { name?: string, page: number } = { page }

      if (this.state.textSearch) {
        params.name = `${this.state.textSearch}`
      }


      const response = await api.get(
        `api/regions/csv`,
        {
          headers: getHeader(),
          params,
          responseType: 'blob',
        }
      )

      if (response.status === 200) {
        this.download(response.data)
        toast.notify(getI18nLabel(locale, 'regionsCatalog.toast.downloadData.success.message'), {
            title: getI18nLabel(locale, 'regionsCatalog.toast.success.title'),
          duration: 6,
          type: "success"
        })
      }
    } catch (e) {
      toast.notify(getI18nLabel(locale, 'regionsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'regionsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  openModalEditRegion = (regionData: RegionData) => {
    const region: RegionModalData = {
      name: regionData.name,
      alias: regionData.alias,
      description: regionData.description,
    }
    this.setState({ showModal: true, modalRegionId: regionData.id, region: region, regionEdited: region })
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      modalRegionId: null,
      region: emptyRegion,
      regionEdited: emptyRegion,
      errorMes: '',
    })
  }

  render() {
    const {
      showModal,
      modalRegionId,
      currentPage,
      totalPage,
      total,
      count,
      region,
      textSearch,
      errorMes,
      regions,
    } = this.state

      const {locale} = this.props

      this.tableHead = translateTableHeader(locale, this.tableHead, 'regionsCatalog.table.headers')
    const modalTitle = modalRegionId ? getI18nLabel(locale, 'regionsCatalog.modal.editModal.title') : getI18nLabel(locale, 'regionsCatalog.modal.createModal.title')
    const modalButton = modalRegionId ? getI18nLabel(locale, 'regionsCatalog.modal.options.save') : getI18nLabel(locale, 'regionsCatalog.modal.options.create')

    return (
      <>

        <div className={styles.headContainer}>
          <div className={styles.rightContainer}>
            <div className={styles.titleCatalog}>
              <h2>{getI18nLabel(locale, 'regionsCatalog.title')}</h2>
            </div>
            <div className={styles.findUser}>
              <Input placeholderOverLabel={true} defaultValue={textSearch} onChange={this.changeTextSearch} placeholder={getI18nLabel(locale, 'regionsCatalog.search')} icon={faSearch} type="text" bgColor="transparent" />
            </div>

            <span className={styles.label}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <div className={styles.message}>
                <p>{getI18nLabel(locale, 'regionsCatalog.searchByName')}</p>
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
            </span>

            <div className={styles.buttonContainer}>
              <PrimaryButton
                label={getI18nLabel(locale, 'regionsCatalog.actions.add')}
                onClick={() => this.setState({ showModal: true, modalRegionId: null, regionEdited: emptyRegion, region: emptyRegion })}
              />
              <div style={{ paddingTop: '10px' }}>
                <SecondaryButton
                  label={getI18nLabel(locale, 'regionsCatalog.actions.download')}
                  onClick={() => this.downloadData(currentPage)}
                />
              </div>
            </div>

          </div>
        </div>

        <div className={styles.tableContainer}>
          <Table
            bodyData={regions}
            header={this.tableHead}
            currentPage={currentPage}
            count={count}
            total={total}
            onNextPage={() => this.getRegionList(currentPage + 1)}
            onPrevPage={() => this.getRegionList(currentPage - 1)}
            actions={[
              {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: (group: RegionData) => this.openModalEditRegion(group),
              },
              {
                icon: faTrashAlt,
                color: '#DE4747',
                action: (group: RegionData) => this.deleteRegion(group.id),
              },
            ]}
            totalPage={totalPage}
          />
        </div>
        <ToastContainer align="left" position="bottom" />
        <Modal showModal={showModal} closeModal={this.closeModal}>
          <EditRegionForm
            onAddForm={this.createRegion}
            onEditForm={this.editRegion}
            onClose={() => this.closeModal()}
            showClose
            title={modalTitle}
            formProp={region}
            labelButton={modalButton}
            formId={modalRegionId}
            serverErrors={errorMes}
          />
        </Modal>
      </>
    )
  }
}

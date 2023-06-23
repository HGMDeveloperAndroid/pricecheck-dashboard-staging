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
import { Input, File } from '../../components/input'
import { PrimaryButton, SecondaryButton } from '../../components/buttons'
import Modal from '../../components/modal/Modal'
import {
  validateSession,
  getHeader,
} from '../../utils/session-management'
import api from '../../utils/api'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { Table } from '../../components/table'
import styles from './units.module.scss'
import EditCatalogForm from '../simpleCatalogForm'
import {getI18nLabel, translateTableHeader} from '../../i18n'

type GroupData = {
  id: number,
  name: string,
  description: string,
}

type GroupModalData = {
  name?: string,
  description?: string,
}

type State = {
  showModal: boolean,
  modalUnitId: null | number,
  units: any,
  currentPage: number,
  totalPage: number,
  perPage: number,
  total: number,
  count: number,
  textSearch: null | string,
  role: null | string,
  unit: GroupModalData,
  unitEdited: GroupModalData,
  errorMes: string
}

const emptyUnit = {
  name: '',
  description: '',
}

export default class GroupCatalog extends Component<any, State> {
  tableHead = [
    {
      key: 'name',
      label: 'Nombre',
    },
  ]

  state = {
    showModal: false,
    modalUnitId: null,
    units: [],
    currentPage: 1,
    totalPage: 1,
    perPage: 50,
    total: 0,
    count: 0,
    textSearch: null,
    role: null,
    unit: emptyUnit,
    unitEdited: emptyUnit,
    showModalTags: false,
    errorMes: '',
  }


  async componentDidMount() {
    validateSession()
    this.getGroupList(1)
  }

  getGroupList = async (page: number) => {
      const {locale} = this.props
    const params: { name?: string, page: number } = { page }

    if (this.state.textSearch) {
      params.name = `${this.state.textSearch}`
    }

    try {
      const res = await api.get('api/groups/search?', { headers: getHeader(), params })
      if (res && res.data && res.data.data) {
        const pagination = res.data.data;
        const units = res.data.data.data.map((unit: any) => {
          return {
            ...unit,
          }
        })
        this.setState({
          units,
          total: pagination.total,
          currentPage: pagination.current_page,
          count: pagination.to,
          totalPage: pagination.last_page,
        })
      } else {
        this.setState({ units: {} })
      }
    } catch (err) {
      toast.notify(getI18nLabel(locale, 'groupsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'groupsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  changeTextSearch = (e: any) => {
    const textSearch = e.target.value.length > 0 ? e.target.value : null
    this.setState({ textSearch }, () => {
      this.getGroupList(1)
    })
  }

  createGroup = async (data: GroupModalData) => {
      const {locale} = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      await api.post('api/groups/create', { ...data }, { headers })

      this.setState({
        unit: emptyUnit,
        showModal: false,
        modalUnitId: null,
        unitEdited: emptyUnit,
      })

      toast.notify(getI18nLabel(locale, 'groupsCatalog.toast.create.success.message'), {
        title: getI18nLabel(locale, 'groupsCatalog.toast.success.title'),
        duration: 19,
        type: "success"
      })
      this.getGroupList(1)
    } catch (error) {
      toast.notify(getI18nLabel(locale, 'groupsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'groupsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  deleteGroup = async (id: number) => {
      const {locale} = this.props
    try {
      const response = await api.delete(`api/groups/delete/${id}`, { headers: getHeader() })
      if (response.status === 200) {
        toast.notify(getI18nLabel(locale, 'groupsCatalog.toast.delete.success.message'), {
            title: getI18nLabel(locale, 'groupsCatalog.toast.success.title'),
          duration: 6,
          type: "success"
        })
        this.setState({
          textSearch: ''
        })
        this.getGroupList(1)

      }
    } catch (error) {
      toast.notify(error.response.data.errors, {
        title: getI18nLabel(locale, 'groupsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  clearModal = () => {
    this.setState({
      showModal: false,
      modalUnitId: null,
      unit: emptyUnit,
      unitEdited: emptyUnit,
    })
  };

  editGroup = async (data: GroupModalData) => {
      const {locale} = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      const response = await api.put(`api/groups/update/${this.state.modalUnitId}`, { ...data }, { headers })
      if (response && response.status === 200) {
        toast.notify(getI18nLabel(locale, 'groupsCatalog.toast.edit.success.message'), {
            title: getI18nLabel(locale, 'groupsCatalog.toast.edit.success.title'),
          duration: 6,
          type: "success"
        })
      }
      this.clearModal();
      this.getGroupList(1);
    } catch (error) {
      this.clearModal();
      toast.notify(getI18nLabel(locale, 'groupsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'groupsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  openModalEditGroup = (groupData: GroupData) => {
    const unit: GroupModalData = {
      name: groupData.name,
      description: groupData.description,
    }
    this.setState({ showModal: true, modalUnitId: groupData.id, unit, unitEdited: unit })
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      modalUnitId: null,
      unit: emptyUnit,
      unitEdited: emptyUnit,
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
    link.setAttribute('download', `groups-report-${format(new Date(), 'MM-dd-yyyy-HH:mm')}.${extension}`);
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
        `api/groups/csv`,
        {
          headers: getHeader(),
          params,
          responseType: 'blob',
        }
      )

      if (response.status === 200) {
        this.download(response.data)
        toast.notify(getI18nLabel(locale, 'groupsCatalog.toast.downloadData.success.message'), {
            title: getI18nLabel(locale, 'groupsCatalog.toast.success.title'),
          duration: 6,
          type: "success"
        })
      }
    } catch (e) {
      toast.notify(getI18nLabel(locale, 'groupsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'groupsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  render() {
    const {
      showModal,
      modalUnitId,
      currentPage,
      totalPage,
      total,
      count,
      unit,
      textSearch,
      errorMes,
      units,
    } = this.state
      const {locale} = this.props

      this.tableHead = translateTableHeader(locale, this.tableHead, 'groupsCatalog.table.headers')
    const modalTitle = modalUnitId ? getI18nLabel(locale, 'groupsCatalog.modal.editModal.title') : getI18nLabel(locale, 'groupsCatalog.modal.createModal.title')
    const modalButton = modalUnitId ? getI18nLabel(locale, 'groupsCatalog.modal.options.save') : getI18nLabel(locale, 'groupsCatalog.modal.options.create')

    return (
      <>

        <div className={styles.headContainer}>
          <div className={styles.rightContainer}>
            <div className={styles.titleCatalog}>
              <h2>{getI18nLabel(locale, 'groupsCatalog.title')}</h2>
            </div>
            <div className={styles.findUser}>
              <Input placeholderOverLabel={true} defaultValue={textSearch} onChange={this.changeTextSearch} placeholder={getI18nLabel(locale, 'groupsCatalog.search')} icon={faSearch} type="text" bgColor="transparent" />
            </div>

            <span className={styles.label}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <div className={styles.message}>
                <p>{getI18nLabel(locale, 'groupsCatalog.searchByName')}</p>
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
            </span>

            <div className={styles.buttonContainer}>
              <PrimaryButton
                label={getI18nLabel(locale, 'groupsCatalog.actions.add')}
                onClick={() => this.setState({ showModal: true, modalUnitId: null, unitEdited: emptyUnit, unit: emptyUnit })}
              />
              <div style={{ paddingTop: '10px' }}>
                <SecondaryButton
                  label={getI18nLabel(locale, 'groupsCatalog.actions.download')}
                  onClick={() => this.downloadData(currentPage)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <Table
            bodyData={units}
            header={this.tableHead}
            currentPage={currentPage}
            count={count}
            total={total}
            onNextPage={() => this.getGroupList(currentPage + 1)}
            onPrevPage={() => this.getGroupList(currentPage - 1)}
            actions={[
              {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: (group: GroupData) => this.openModalEditGroup(group),
              },
              {
                icon: faTrashAlt,
                color: '#DE4747',
                action: (group: GroupData) => this.deleteGroup(group.id),
              },
            ]}
            totalPage={totalPage}
          />
        </div>
        <ToastContainer align="left" position="bottom" />
        <Modal showModal={showModal} closeModal={this.closeModal}>
          <EditCatalogForm
            isGroup
            onAddForm={this.createGroup}
            onEditForm={this.editGroup}
            onClose={() => this.closeModal()}
            showClose
            title={modalTitle}
            formProp={unit}
            labelButton={modalButton}
            formId={modalUnitId}
            serverErrors={errorMes}
          />
        </Modal>
      </>
    )
  }
}

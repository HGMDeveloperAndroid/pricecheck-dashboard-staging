import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInfoCircle,
  faCaretDown,
  faSearch,
  faPencilAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { Input, File } from '../../components/input'
import { PrimaryButton } from '../../components/buttons'
import Modal from '../../components/modal/Modal'
import {
  validateSession,
  getHeader,
} from '../../utils/session-management'
import api from '../../utils/api'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { Table } from '../../components/table'
import styles from './units.module.scss'
import EditUnitForm from '../unitForm'
import {getI18nLabel, translateTableHeader} from '../../i18n'

type UnitData = {
  id: number,
  name: string,
  abbreviation: string,
}

type UnitModalData = {
  name?: string,
  abbreviation?: string,
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
  unit: UnitModalData,
  unitEdited: UnitModalData,
  errorMes: string
}

const emptyUnit = {
  name: '',
  description: '',
}

export default class UnitsCatalog extends Component<any, State> {
  tableHead = [
    {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'abbreviation',
      label: 'Abreviación',
    }
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
    this.getUnitList(1)
  }

  getUnitList = async (page: number) => {
    const params: { name?: string, page: number } = { page }
    const {locale} = this.props

    if (this.state.textSearch) {
      params.name = `${this.state.textSearch}`
    }

    try {
      const res = await api.get('api/units/search?', { headers: getHeader(), params })
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
      toast.notify(getI18nLabel(locale, 'unitsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'unitsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  changeTextSearch = (e: any) => {
    const textSearch = e.target.value.length > 0 ? e.target.value : null
    this.setState({ textSearch }, () => {
      this.getUnitList(1)
    })
  }

  createUnit = async (data: UnitModalData) => {
    const {locale} = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      await api.post('api/units/create', { ...data }, { headers })

      this.setState({
        unit: emptyUnit,
        showModal: false,
        modalUnitId: null,
        unitEdited: emptyUnit,
      })

      toast.notify(getI18nLabel(locale, 'unitsCatalog.toast.create.success.message'), {
        title: getI18nLabel(locale, 'unitsCatalog.toast.success.title'),
        duration: 6,
        type: "success"
      })
      this.getUnitList(1)
    } catch (error) {
      toast.notify(getI18nLabel(locale, 'unitsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'unitsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  deleteUnit = async (id: number) => {
    const {locale} = this.props
    try {
      const response = await api.delete(`api/units/delete/${id}`, { headers: getHeader() })
      if (response.status === 200) {
        toast.notify(getI18nLabel(locale, 'unitsCatalog.toast.delete.success.message'), {
            title: getI18nLabel(locale, 'unitsCatalog.toast.success.title'),
            duration: 6,
            type: "success"
        })
        this.setState({
          textSearch: ''
        })
        this.getUnitList(1)

      }
    } catch (error) {
      toast.notify(error.response.data.errors, {
        title: getI18nLabel(locale, 'unitsCatalog.toast.error.title'),
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

  editUnit = async (data: UnitModalData) => {
    const {locale} = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      const response = await api.put(`api/units/update/${this.state.modalUnitId}`, { ...data }, { headers })
      if (response && response.status === 200) {
        toast.notify(getI18nLabel(locale, 'unitsCatalog.toast.edit.success.message'), {
            title: getI18nLabel(locale, 'unitsCatalog.toast.edit.success.title'),
            duration: 22,
            type: "error"
        })
      }
      this.clearModal();
      this.getUnitList(1);
    } catch (error) {
      this.clearModal();
      toast.notify(getI18nLabel(locale, 'unitsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'unitsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  openModalEditUnit = (unitData: UnitData) => {
    const unit: UnitModalData = {
      name: unitData.name,
      abbreviation: unitData.abbreviation,
    }
    this.setState({ showModal: true, modalUnitId: unitData.id, unit, unitEdited: unit })
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

      this.tableHead = translateTableHeader(locale, this.tableHead, 'unitsCatalog.table.headers')
    const modalTitle = modalUnitId ? getI18nLabel(locale, 'unitsCatalog.modal.editModal.title') : getI18nLabel(locale, 'unitsCatalog.modal.createModal.title')
    const modalButton = modalUnitId ? getI18nLabel(locale, 'unitsCatalog.modal.options.save') : getI18nLabel(locale, 'unitsCatalog.modal.options.create')

    return (
      <>

        <div className={styles.headContainer}>
          <div className={styles.rightContainer}>
            <div className={styles.titleCatalog}>
              <h2>{getI18nLabel(locale, 'unitsCatalog.title')}</h2>
            </div>
            <div className={styles.findUser}>
              <Input placeholderOverLabel={true} defaultValue={textSearch} onChange={this.changeTextSearch} placeholder={getI18nLabel(locale, 'unitsCatalog.search')} icon={faSearch} type="text" bgColor="transparent" />
            </div>

            <span className={styles.label}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <div className={styles.message}>
                <p>Buscar por nombre </p>
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
            </span>

            <div className={styles.buttonContainer}>
              <PrimaryButton
                label={getI18nLabel(locale, 'unitsCatalog.actions.add')}
                onClick={() => this.setState({ showModal: true, modalUnitId: null, unitEdited: emptyUnit, unit: emptyUnit })}
              />
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
            onNextPage={() => this.getUnitList(currentPage + 1)}
            onPrevPage={() => this.getUnitList(currentPage - 1)}
            actions={[
              {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: (unit: UnitData) => this.openModalEditUnit(unit),
              },
              {
                icon: faTrashAlt,
                color: '#DE4747',
                action: (unit: UnitData) => this.deleteUnit(unit.id),
              },
            ]}
            totalPage={totalPage}
          />
        </div>
        <ToastContainer align="left" position="bottom" />
        <Modal showModal={showModal} closeModal={this.closeModal}>
          <EditUnitForm
            onAddUnit={this.createUnit}
            onEditUnit={this.editUnit}
            onClose={() => this.closeModal()}
            showClose
            title={modalTitle}
            unitProp={unit}
            labelButton={modalButton}
            unitId={modalUnitId}
            serverErrors={errorMes}
          />
        </Modal>
      </>
    )
  }
}

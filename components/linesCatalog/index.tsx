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
import styles from './lines.module.scss'
import EditLineForm from '../lineForm'
import {getI18nLabel, translateTableHeader} from '../../i18n'

type LineData = {
  id_line: number,
  name_line: string,
  description: string,
  id_group: [],
}

type LineModalData = {
  name?: string,
  description?: string,
  group_id?: any,
}

type Option = {
  value: any,
  label: string,
}

type State = {
  showModal: boolean,
  modalLinesId: null | number,
  lines: any,
  currentPage: number,
  totalPage: number,
  perPage: number,
  total: number,
  count: number,
  textSearch: null | string,
  role: null | string,
  groupList: Option[],
  line: LineModalData,
  lineEdited: LineModalData,
  errorMes: string
}

const emptyUnit = {
  name: '',
  description: '',
  group_id: 0,
}

export default class LineCatalog extends Component<any, State> {
  tableHead = [
    {
      key: 'name_line',
      label: 'línea',
    },
    {
      key: 'name_group',
      label: 'Grupo',
    },
  ]

  state = {
    showModal: false,
    modalLinesId: null,
    lines: [],
    currentPage: 1,
    totalPage: 1,
    perPage: 50,
    total: 0,
    count: 0,
    textSearch: null,
    role: null,
    groupList: [],
    line: emptyUnit,
    lineEdited: emptyUnit,
    showModalTags: false,
    errorMes: '',
  };

  getGroupList = async (): Promise<Array<Option>> => {
    const res = await api.get('api/groups/list', { headers: getHeader() })
    return res.data.group.map((group: { name: string, id: number }) => {
      return {
        value: group.id,
        label: group.name,
      }
    })
  };

  async componentDidMount() {
    validateSession()
    const groupList = await this.getGroupList()
    this.setState({
      groupList,
    })
    this.getLineList(1)
  }

  getLineList = async (page: number) => {
      const {locale} = this.props
    const params: { name?: string, page: number } = { page }

    if (this.state.textSearch) {
      params.name = `${this.state.textSearch}`
    }

    try {
      const res = await api.get('api/lines/search?', { headers: getHeader(), params })
      if (res && res.data && res.data.data) {
        const pagination = res.data.data;
        const lines = res.data.data.data.map((line: any) => {
          return {
            ...line,
          }
        })
        this.setState({
          lines,
          total: pagination.total,
          currentPage: pagination.current_page,
          count: pagination.to,
          totalPage: pagination.last_page,
        })
      } else {
        this.setState({ lines: {} })
      }
    } catch (err) {
      toast.notify(getI18nLabel(locale, 'linesCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'linesCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  changeTextSearch = (e: any) => {
    const textSearch = e.target.value.length > 0 ? e.target.value : null
    this.setState({ textSearch }, () => {
      this.getLineList(1)
    })
  }

  createLine = async (data: LineModalData) => {
      const {locale} = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      await api.post('api/lines/create', { ...data, id_group: data.group_id }, { headers })

      this.setState({
        line: emptyUnit,
        showModal: false,
        modalLinesId: null,
        lineEdited: emptyUnit,
      })

      toast.notify(getI18nLabel(locale, 'linesCatalog.toast.create.success.message'), {
        title: getI18nLabel(locale, 'linesCatalog.toast.success.title'),
        duration: 19,
        type: "success"
      })
      this.getLineList(1)
    } catch (error) {
      toast.notify(getI18nLabel(locale, 'linesCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'linesCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  deleteLine = async (id: number) => {
      const {locale} = this.props
    try {
      const response = await api.delete(`api/lines/delete/${id}`, { headers: getHeader() })
      if (response.status === 200) {
        toast.notify(getI18nLabel(locale, 'linesCatalog.toast.delete.success.message'), {
            title: getI18nLabel(locale, 'linesCatalog.toast.success.title'),
          duration: 6,
          type: "success"
        })
        this.setState({
          textSearch: ''
        })
        this.getLineList(1)

      }
    } catch (error) {
      toast.notify(getI18nLabel(locale, 'linesCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'linesCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  clearModal = () => {
    this.setState({
      showModal: false,
      modalLinesId: null,
      line: emptyUnit,
      lineEdited: emptyUnit,
    })
  };

  editLine = async (data: LineModalData) => {
      const {locale} = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      const response = await api.put(`api/lines/update/${this.state.modalLinesId}`, { ...data, id_group: data.group_id }, { headers })
      if (response && response.status === 200) {
        toast.notify(getI18nLabel(locale, 'linesCatalog.toast.edit.success.message'), {
            title: getI18nLabel(locale, 'linesCatalog.toast.edit.success.title'),
          duration: 6,
          type: "success"
        })
      }
      this.clearModal();
      this.getLineList(1);
    } catch (error) {
      this.clearModal();
      toast.notify(getI18nLabel(locale, 'linesCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'linesCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  openModalEditLine = (lineData: LineData) => {
    const line: LineModalData = {
      name: lineData.name_line,
      group_id: lineData.id_group,
      description: lineData.description,
    }
    this.setState({ showModal: true, modalLinesId: lineData.id_line, line: line, lineEdited: line })
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      modalLinesId: null,
      line: emptyUnit,
      lineEdited: emptyUnit,
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
    link.setAttribute('download', `line-report-${format(new Date(), 'MM-dd-yyyy-HH:mm')}.${extension}`);
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
        `api/lines/csv`,
        {
          headers: getHeader(),
          params,
          responseType: 'blob',
        }
      )

      if (response.status === 200) {
        this.download(response.data)
        toast.notify(getI18nLabel(locale, 'linesCatalog.toast.downloadData.success.message'), {
            title: getI18nLabel(locale, 'linesCatalog.toast.success.title'),
          duration: 6,
          type: "success"
        })
      }
    } catch (e) {
      toast.notify(getI18nLabel(locale, 'linesCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'linesCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  render() {
    const {
      showModal,
      modalLinesId,
      currentPage,
      totalPage,
      groupList,
      total,
      count,
      line,
      textSearch,
      errorMes,
      lines,
    } = this.state
      const {locale} = this.props

      this.tableHead = translateTableHeader(locale, this.tableHead, 'linesCatalog.table.headers')
    const modalTitle = modalLinesId ? getI18nLabel(locale, 'linesCatalog.modal.editModal.title') : getI18nLabel(locale, 'linesCatalog.modal.createModal.title')
    const modalButton = modalLinesId ? getI18nLabel(locale, 'linesCatalog.modal.options.save') : getI18nLabel(locale, 'linesCatalog.modal.options.create')

    return (
      <>

        <div className={styles.headContainer}>
          <div className={styles.rightContainer}>
            <div className={styles.titleCatalog}>
              <h2>{getI18nLabel(locale, 'linesCatalog.title')}</h2>
            </div>
            <div className={styles.findUser}>
              <Input placeholderOverLabel={true} defaultValue={textSearch} onChange={this.changeTextSearch} placeholder={getI18nLabel(locale, 'linesCatalog.search')} icon={faSearch} type="text" bgColor="transparent" />
            </div>

            <span className={styles.label}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <div className={styles.message}>
                <p>{getI18nLabel(locale, 'linesCatalog.searchByName')}</p>
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
            </span>

            <div className={styles.buttonContainer}>
              <PrimaryButton
                label={getI18nLabel(locale, 'linesCatalog.actions.add')}
                onClick={() => this.setState({ showModal: true, modalLinesId: null, lineEdited: emptyUnit, line: emptyUnit })}
              />
              <div style={{ paddingTop: '10px' }}>
                <SecondaryButton
                  label={getI18nLabel(locale, 'linesCatalog.actions.download')}
                  onClick={() => this.downloadData(currentPage)}
                />
              </div>
            </div>

          </div>
        </div>

        <div className={styles.tableContainer}>
          <Table
            bodyData={lines}
            header={this.tableHead}
            currentPage={currentPage}
            count={count}
            total={total}
            onNextPage={() => this.getLineList(currentPage + 1)}
            onPrevPage={() => this.getLineList(currentPage - 1)}
            actions={[
              {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: (group: LineData) => this.openModalEditLine(group),
              },
              {
                icon: faTrashAlt,
                color: '#DE4747',
                action: (group: LineData) => this.deleteLine(group.id_line),
              },
            ]}
            totalPage={totalPage}
          />
        </div>
        <ToastContainer align="left" position="bottom" />
        <Modal showModal={showModal} closeModal={this.closeModal}>
          <EditLineForm
            onAddLine={this.createLine}
            onEditLine={this.editLine}
            onClose={() => this.closeModal()}
            showClose
            title={modalTitle}
            groupList={groupList}
            lineProp={line}
            labelButton={modalButton}
            lineId={modalLinesId}
            serverErrors={errorMes}
          />
        </Modal>
      </>
    )
  }
}

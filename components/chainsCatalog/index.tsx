import React, { Component } from 'react'
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInfoCircle,
  faCaretDown,
  faSearch,
  faImage,
  faFile,
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
import styles from './chains.module.scss'
import EditChainForm from '../chainForm'
import { getI18nLabel, translateTableHeader } from '../../i18n'

type ChainData = {
  id: number,
  name: string,
  description: string,
  alias: string,
  logo_path?: string,
}

type ChainModalData = {
  name?: string,
  description?: string,
  alias?: string,
  logo?: string,
}

type Option = {
  value: any,
  label: string,
}

type State = {
  showModal: boolean,
  showSetImageModal: boolean,
  chainImage: any,
  chainNotificable: any,
  showSetNotificableModal: boolean,
  modalChainId: null | number,
  chains: any,
  currentPage: number,
  totalPage: number,
  perPage: number,
  total: number,
  count: number,
  textSearch: null | string,
  role: null | string,
  groupList: Option[],
  chain: ChainModalData,
  chainEdited: ChainModalData,
  errorMes: string,
  file: any,
}

const emptyUnit = {
  name: '',
  description: '',
  group_id: 0,
}

export default class ChainCatalog extends Component<any, State> {
  tableHead = [
    {
      key: 'id',
      label: 'Id',
    },
    {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'alias',
      label: 'Alias',
    },
  ]

  state = {
    showModal: false,
    showSetImageModal: false,
    chainImage: '',
    chainNotificable: false,
    showSetNotificableModal: false,
    modalChainId: null,
    chains: [],
    currentPage: 1,
    totalPage: 1,
    perPage: 50,
    total: 0,
    count: 0,
    textSearch: null,
    role: null,
    groupList: [],
    chain: emptyUnit,
    chainEdited: emptyUnit,
    showModalTags: false,
    errorMes: '',
    file: null,
  };

  async componentDidMount() {
    validateSession()
    this.getChainList(1)
  }

  getChainList = async (page: number) => {
    const { locale } = this.props
    const params: { name?: string, page: number } = { page }

    if (this.state.textSearch) {
      params.name = `${this.state.textSearch}`
    }

    try {
      const res = await api.get('api/chains/search?', { headers: getHeader(), params })
      if (res && res.data && res.data.data) {
        const pagination = res.data.data;
        const chains = res.data.data.data.map((chain: any) => {
          return {
            ...chain,
          }
        })
        this.setState({
          chains,
          total: pagination.total,
          currentPage: pagination.current_page,
          count: pagination.to,
          totalPage: pagination.last_page,
        })
      } else {
        this.setState({ chains: {} })
      }
    } catch (err) {
      toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'chainsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  changeTextSearch = (e: any) => {
    const textSearch = e.target.value.length > 0 ? e.target.value : null
    this.setState({ textSearch }, () => {
      this.getChainList(1)
    })
  }
  handleFile = (e: any) => {
    this.setState({
      ...this.state,
      file: e.target.files[0],
    })
  }

  dummyChain = async (data: ChainModalData) => {
    const { locale } = this.props

    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      await api.post('api/chains/create', { ...data }, { headers })

      this.setState({
        chain: emptyUnit,
        showModal: false,
        modalChainId: null,
        chainEdited: emptyUnit,
      })

      toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.create.success.message'), {
        title: getI18nLabel(locale, 'chainsCatalog.toast.success.title'),
        duration: 6,
        type: "success"
      })
      this.getChainList(1)
    } catch (error) {
      toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'chainsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  createChain = async (data: ChainModalData) => {
    const { locale } = this.props
    const headers = {
      ...getHeader(),
      'content-type': 'application/json'
    }
    const headersImg = {
      ...getHeader(),
      'content-type': 'multipart/form-data'
    }
    let formData = new FormData();
    formData.append("image", this.state.file)
    await api.post('api/chains/create', { ...data }, { headers }).then(async (res: any) => {
      const chainId = res?.data?.data?.id;
      if (this.state.file !== null) {
        await api.post(`/api/pics/chain/${chainId}`, formData, { headers: headersImg }).then((res) => {
          this.setState({
            chain: emptyUnit,
            showModal: false,
            modalChainId: null,
            chainEdited: emptyUnit,
          })

          toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.create.success.message'), {
            title: getI18nLabel(locale, 'chainsCatalog.toast.success.title'),
            duration: 6,
            type: "success"
          })
          this.getChainList(1)
        })
      }
    }).catch(() => {
      toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'chainsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    })
  }
  deleteChain = async (id: number) => {
    const { locale } = this.props
    try {
      const response = await api.delete(`api/chains/delete/${id}`, { headers: getHeader() })
      if (response.status === 200) {
        toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.delete.success.message'), {
          title: getI18nLabel(locale, 'chainsCatalog.toast.success.title'),
          duration: 6,
          type: "success"
        })
        this.setState({
          textSearch: ''
        })
        this.getChainList(1)

      }
    } catch (error) {
      toast.notify(error.response.data.errors, {
        title: getI18nLabel(locale, 'chainsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  clearModal = () => {
    this.setState({
      showModal: false,
      modalChainId: null,
      chain: emptyUnit,
      chainEdited: emptyUnit,
    })
  };

  editChain = async (data: ChainModalData) => {
    const { locale } = this.props
    try {
      const headers = {
        ...getHeader(),
        'content-type': 'application/json'
      }

      const response = await api.put(`api/chains/update/${this.state.modalChainId}`, { ...data }, { headers })
      if (response && response.status === 200) {
        toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.edit.success.message'), {
          title: getI18nLabel(locale, 'chainsCatalog.toast.edit.success.title'),
          duration: 6,
          type: "success"
        })
      }
      this.clearModal();
      this.getChainList(1);
    } catch (error) {
      this.clearModal();
      toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'chainsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

  openModalEditChain = (chainData: ChainData) => {
    const chain: ChainModalData = {
      name: chainData.name,
      alias: chainData.alias,
      description: chainData.description,
      logo: chainData.logo_path,
    }
    this.setState({ showModal: true, modalChainId: chainData.id, chain: chain, chainEdited: chain })
  }

  closeSetImageModal= () => {
    this.setState({
        showSetImageModal: false,
        chainImage: '',
    })
  }

  closeSetNotificableModal= () => {
    this.setState({
        showSetNotificableModal: false,
        chainNotificable: false,
    })
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      modalChainId: null,
      chain: emptyUnit,
      chainEdited: emptyUnit,
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
    link.setAttribute('download', `chain-report-${format(new Date(), 'MM-dd-yyyy-HH:mm')}.${extension}`);
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
        `api/chains/csv`,
        {
          headers: getHeader(),
          params,
          responseType: 'blob',
        }
      )

      if (response.status === 200) {
        this.download(response.data)
        toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.downloadData.success.message'), {
          title: getI18nLabel(locale, 'chainsCatalog.toast.success.title'),
          duration: 6,
          type: "success"
        })
      }
    } catch (e) {
      toast.notify(getI18nLabel(locale, 'chainsCatalog.toast.error.message'), {
        title: getI18nLabel(locale, 'chainsCatalog.toast.error.title'),
        duration: 6,
        type: "error"
      })
    }
  }

    setImage = async () => {
        const { modalChainId, chainImage } = this.state;

        try {
            const headers = {
                ...getHeader(),
                'content-type': 'multipart/form-data',
            }

            const request = new FormData();
            request.append('image', chainImage);

            const response = await api.post(`api/pics/chain/${modalChainId}`, request, { headers })

            if (response && response.status === 200) {
                toast.notify('Cadena actualizada con exito', {
                    title: 'Cadena actualizada con exito',
                    duration: 6,
                    type: "success"
                })
            }

            this.closeSetImageModal();
        } catch (error) {
            this.closeSetImageModal();

            toast.notify('Ocurrio un error', {
                title: 'Ocurrio un error',
                duration: 6,
                type: "error"
            })
        }
    }

    setNotificable = async (event) => {
        try {
            const { modalChainId, chainNotificable } = this.state;
            const { checked } = event.target;

            const headers = {
                ...getHeader(),
                'content-type': 'application/json'
            }

            const request = {
                is_notificable: chainNotificable,
            };

            const response = await api.put(`api/chains/update/${modalChainId}`, request, { headers })

            if (response && response.status === 200) {
                toast.notify('Cadena actualizada con exito', {
                    title: 'Cadena actualizada con exito',
                    duration: 6,
                    type: "success"
                })
            }


            this.closeSetNotificableModal();
        } catch (error) {
            this.closeSetNotificableModal();

            console.log('aaa - error: ', error);
            toast.notify('Ocurrio un error', {
                title: 'Ocurrio un error',
                duration: 6,
                type: "error"
            })
        }
    }

    onFileChange = (event) => {
        try {
            event.preventDefault();

            const { files } = event.target;
            const selectedFile = files.length && files[0];

            this.setState({
                chainImage: selectedFile,
            })

        } catch(error) {
            console.log('aaa - error: ', error);
        }
    }

    onNotificableChange = (event) => {
        try {
            event.preventDefault();

            const { checked } = event.target;

            this.setState({
                chainNotificable: checked,
            })

        } catch(error) {
            console.log('aaa - error: ', error);
        }
    }

  render() {
    const {
      showModal,
      showSetImageModal,
      showSetNotificableModal,
      modalChainId,
      currentPage,
      totalPage,
      total,
      count,
      chain,
      textSearch,
      errorMes,
      chains,
    } = this.state

    const { locale } = this.props

    this.tableHead = translateTableHeader(locale, this.tableHead, 'chainsCatalog.table.headers')
    const modalTitle = modalChainId ? getI18nLabel(locale, 'chainsCatalog.modal.editModal.title') : getI18nLabel(locale, 'chainsCatalog.modal.createModal.title')
    const modalButton = modalChainId ? getI18nLabel(locale, 'chainsCatalog.modal.options.save') : getI18nLabel(locale, 'chainsCatalog.modal.options.create')

    return (
      <>

        <div className={styles.headContainer}>
          <div className={styles.rightContainer}>
            <div className={styles.titleCatalog}>
              <h2>{getI18nLabel(locale, 'chainsCatalog.title')}</h2>
            </div>
            <div className={styles.findUser}>
              <Input placeholderOverLabel={true} defaultValue={textSearch} onChange={this.changeTextSearch} placeholder="Buscar una cadena" icon={faSearch} type="text" bgColor="transparent" />
            </div>

            <span className={styles.label}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <div className={styles.message}>
                <p>{getI18nLabel(locale, 'chainsCatalog.searchByName')}</p>
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
            </span>

            <div className={styles.buttonContainer}>
              <PrimaryButton
                label={getI18nLabel(locale, 'chainsCatalog.actions.add')}
                onClick={() => this.setState({ showModal: true, modalChainId: null, chainEdited: emptyUnit, chain: emptyUnit })}
              />
              <div style={{ paddingTop: '10px' }}>
                <SecondaryButton
                  label={getI18nLabel(locale, 'chainsCatalog.actions.download')}
                  onClick={() => this.downloadData(currentPage)}
                />
              </div>
            </div>

          </div>
        </div>

        <div className={styles.tableContainer}>
          <Table
            bodyData={chains}
            header={this.tableHead}
            currentPage={currentPage}
            count={count}
            total={total}
            onNextPage={() => this.getChainList(currentPage + 1)}
            onPrevPage={() => this.getChainList(currentPage - 1)}
            actions={[
              {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: (group: ChainData) => this.openModalEditChain(group),
                isBlocked: true,
              },
              {
                icon: faImage,
                color: '#DE4747',
                  action: (group: ChainData) => this.setState({
                      showSetImageModal: true,
                      modalChainId: group.id
                  }, () => {
                    const modal: any = document.querySelector('div[class^="modal_modal_"]')
                    modal.classList.add('modalEditableOptions')
                  }),
                isBlocked: false,
                enabled: true,
              },
              {
                icon: faFile,
                color: '#71A4E4',
                action: (group: ChainData) => this.setState({
                    showSetNotificableModal: true,
                    modalChainId: group.id
                }, () => {
                    const modal: any = document.querySelector('div[class^="modal_modal_"]')
                    modal.classList.add('modalEditableOptions')
                }),
                isBlocked: false,
                enabled: true,
              },
              {
                icon: faTrashAlt,
                color: '#DE4747',
                action: (group: ChainData) => this.deleteChain(group.id),
                isBlocked: true,
              },
            ]}
            totalPage={totalPage}
          />
        </div>
        <ToastContainer align="left" position="bottom" />
        <Modal showModal={showSetImageModal} closeModal={this.closeSetImageModal}>
            <h1>Agregar imágen</h1>

            <div className={styles.modalForm}>
                <input type='file' onChange={this.onFileChange}/>
            </div>

            <div className={ styles.modalOptions }>
                <PrimaryButton
                    label='cancelar'
                    onClick={this.closeSetImageModal}
                />
                <SecondaryButton
                    label='guardar'
                    onClick={this.setImage}
                />
            </div>
        </Modal>
        <Modal showModal={showSetNotificableModal} closeModal={this.closeSetNotificableModal}>
            <h1>Reporte estadistico</h1>

            <div className={styles.modalForm}>
                <label>Adjuntar cadena: &nbsp;</label>
                <input type='checkbox' onChange={this.onNotificableChange}/>
            </div>

            <div className={ styles.modalOptions }>
                <PrimaryButton
                    label='cancelar'
                    onClick={this.closeSetNotificableModal}
                />
                <SecondaryButton
                    label='guardar'
                    onClick={this.setNotificable}
                />
            </div>
        </Modal>
        <Modal showModal={showModal} closeModal={this.closeModal}>
          <EditChainForm
            onAddForm={this.createChain}
            onEditForm={this.editChain}
            onClose={() => this.closeModal()}
            showClose
            title={modalTitle}
            formProp={chain}
            handleFile={this.handleFile}
            labelButton={modalButton}
            formId={modalChainId}
            serverErrors={errorMes}
          />
        </Modal>
      </>
    )
  }
}

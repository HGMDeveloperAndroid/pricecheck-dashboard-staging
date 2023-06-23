import React, { Component } from 'react'
import Head from 'next/head'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faInfoCircle,
    faCaretDown,
    faSearch,
    faPencilAlt,
    faTrashAlt,
    faTags,
} from '@fortawesome/free-solid-svg-icons'

import { Header } from '../../../components/header'
import { Input, File } from '../../../components/input'
import { Select } from '../../../components/select'
import { PrimaryButton, SecondaryButton } from '../../../components/buttons'
import Modal from '../../../components/modal/Modal'
import {
    validateSession,
    getHeader,
    getToken,
    getId,
    createSession,
} from '../../../utils/session-management'
import api from '../../../utils/api'
import { getRolesCatalog, getRegionsCatalog, getLabelsCatalog } from '../../../utils/catalogs'
import Tags from '../../../components/input/Tags'
import { photoUrl } from '../../../utils/photo_url'
import { Table } from '../../../components/table'
import EditUserForm from '../../../components/editUserForm/EditUserForm'
import PageTitle from '../../../components/pageTitle/PageTitle'

import styles from './users.module.scss'

type UserData = {
    first_name: string,
    last_name: string,
    mother_last_name?: string,
    username: string,
    email: string,
    id: number,
    employee_number: number,
    cellphone: number,
    roles: string[],
    regions: string[],
    labels: string[],
    picture_path?: string,
    rolSelected?: string,
    completeName?: string,
}

type UserModalData = {
    first_name?: string,
    last_name?: string,
    mother_last_name?: string,
    username?: string,
    email?: string,
    employee_number?: number,
    cellphone?: number,
    role?: string,
    password?: string,
    region?: number[],
    photo?: File | null | string,
    picture_path?: string,
    [keys: string]: any,
}

type Option = {
    value: any,
    label: string,
}

type State = {
    showModal: boolean,
    modalUserId: null | number,
    users: UserData[],
    currentPage: number,
    totalPage: number,
    perPage: number,
    total: number,
    count: number,
    textSearch: null | string,
    role: null | string,
    rolList: Option[],
    regionList: Option[],
    labelList: Option[],
    user: UserModalData,
    userEdited: UserModalData,
    showModalTags: boolean,
    tagList: { id: number, label: string }[],
    errorMes: string
}

const emptyUser = {
    role: '',
    first_name: '',
    last_name: '',
    mother_last_name: '',
    username: '',
    email: '',
    employee_number: 0,
    cellphone: 0,
    password: '',
    region: [],
    picture_path: '',
}

export default class UsersPage extends Component<null, State> {
    tableHead = [
        {
            key: 'first_name',
            label: 'Nombre',
        },
        {
            key: 'last_name',
            label: 'Apellido paterno',
        },
        {
            key: 'mother_last_name',
            label: 'Apellido materno',
        },
        {
            key: 'username',
            label: 'Usuario',
        },
        {
            key: 'email',
            label: 'Correo electrónico',
        },
        {
            key: 'employee_number',
            label: 'No. de empleado',
        },
        {
            key: 'rolSelected',
            label: 'Rol',
        },
    ]

    state = {
        showModal: false,
        modalUserId: null,
        users: [],
        currentPage: 1,
        totalPage: 1,
        perPage: 10,
        total: 0,
        count: 0,
        textSearch: null,
        role: null,
        rolList: [],
        labelList: [],
        regionList: [],
        user: emptyUser,
        userEdited: emptyUser,
        showModalTags: false,
        tagList: [],
        errorMes: '',
    }


    async componentDidMount() {
        validateSession()
        const rolList = await getRolesCatalog()
        const regionList = await getRegionsCatalog()
        const labelList = await getLabelsCatalog()
        this.setState({
            rolList,
            regionList,
            labelList,
        })
        this.getUsersList(1)
    }

    getUsersList = async (page: number) => {
        const params: { role?: string, textSearch?: string, page: number } = { page }

        if (this.state.role) {
            params.role = `${this.state.role}`
        }

        if (this.state.textSearch) {
            params.textSearch = `${this.state.textSearch}`
        }

        try {
            const res = await api.get('api/users/listing', { headers: getHeader(), params, })

            if (res.data.data.length > 0) {
                const pagination = res.data.pagination

                const users = res.data.data.map((user: UserData) => {
                    return {
                        ...user,
                        // completeName: `${user.first_name} ${user.last_name}`,
                        rolSelected: user.roles[0]
                    }
                })

                this.setState({
                    users,
                    total: pagination.total,
                    currentPage: pagination.current_page,
                    count: pagination.count,
                    totalPage: pagination.total_pages,
                })
            } else if (res.data.length === 0) {
                this.setState({ users: [] })
            }
        } catch (err) {
            // TODO: enviar notificación cuando falla al obtener usuarios
            throw new Error(err)
        }
    }

    changeTextSearch = (e: any) => {
        const textSearch = e.target.value.length > 0 ? e.target.value : null
        this.setState({ textSearch }, () => {
            this.getUsersList(1)
        })
    }

    changeRol = (e: any) => {
        const role = e.target.value.length > 0 ? e.target.value : null
        this.setState({ role }, () => {
            this.getUsersList(1)
        })
    }

    createUser = async (data: UserModalData) => {
        try {
            const headers = {
                ...getHeader(),
                'content-type': 'multipart/form-data'
            }
            var form_data = new FormData();

            for (var key in data) {
                form_data.append(key, data[key]);
            }

            await api.post('api/register', form_data, { headers })

            this.setState({
                user: emptyUser,
                showModal: false,
                modalUserId: null,
                userEdited: emptyUser,
            })

            this.getUsersList(1)
        } catch (error) {
            const { response } = error;

            if (response && response.data) {
                const { errors } = response.data;

                if (errors) {
                    const values = Object.values(errors);

                    const str = values.reduce((prev: string, next: string[]) => {
                        if (next.length === 0) {
                            return prev
                        }

                        return `${prev}${next}. `
                    }, '') as string

                    this.setState({
                        errorMes: str
                    })
                }
            }
        }
    }

    deleteUser = async (userId: number) => {
        try {
            const response = await api.delete(`api/users/${userId}`, { headers: getHeader() })

            if (response.data.success) {
                this.getUsersList(1)
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    editUser = async (data: UserModalData) => {
        try {
            const headers = {
                ...getHeader(),
                'content-type': 'multipart/form-data'
            }
            var form_data = new FormData();

            if (!data.mother_last_name) {
                data.mother_last_name = null;
            }

            for (var key in data) {
                form_data.append(key, data[key]);
            }

            const userId = getId()

            const response = await api.post(`api/users/${this.state.modalUserId}/edit`, form_data, { headers })

            if (response.data.id == userId) {
                const user = response.data
                createSession(getToken(), `${user.first_name} ${user.last_name}`, user.roles, user.picture_path, user.id)
            }

            this.setState({
                showModal: false,
                modalUserId: null,
                user: emptyUser,
                userEdited: emptyUser,
            })

            this.getUsersList(1)
        } catch (error) {
            if (error.response && error.response.data && error.response.data['Validation errors']) {
                const mes = `${Object.values(error.response.data['Validation errors']).reduce((acc: string, er: string) => {
                    if (er.length === 0) {
                        return acc
                    }
                    return `${acc}${er}. `
                }, '')}`
                this.setState({
                    errorMes: mes
                })
            }
        }
    }

    openModalEditUser = (userData: UserData) => {
        const regionEle: Option[] = this.state.regionList.filter((r: Option) => r.label === userData.regions[0])
        const region = regionEle.length > 0 ? regionEle[0].value : ''
        const picture_path = userData.picture_path && userData.picture_path.length > 0 ? `${photoUrl}/${userData.picture_path}` : ''
        const user: UserModalData = {
            role: userData.roles[0],
            first_name: userData.first_name,
            last_name: userData.last_name,
            mother_last_name: userData.mother_last_name,
            username: userData.username,
            email: userData.email,
            employee_number: userData.employee_number,
            cellphone: userData.cellphone,
            picture_path,
            password: '',
            region,
        }
        this.setState({ showModal: true, modalUserId: userData.id, user, userEdited: user })
    }

    addTag = (value: { id: number, label: string }) => {
        const tagList: { id: number, label: string }[] = this.state.tagList
        if (tagList.filter(e => e.id == value.id).length === 0) {
            tagList.push(value)
            this.setState({ tagList })
        }
    }

    deleteTag = (id: number) => {
        const tagList: { id: number, label: string }[] = this.state.tagList.filter((e: { id: number }) => e.id !== id)
        this.setState({ tagList })
    }

    addUserTags = async () => {
        try {
            const data = this.state.tagList.map((t: { id: number }) => t.id)

            await api.post(`api/labels/${this.state.modalUserId}/addLabel`, { labels: data }, { headers: getHeader() })

            this.setState({
                showModalTags: false,
                tagList: [],
                modalUserId: null,
            })
            this.getUsersList(1)
        } catch (error) {
            // TODO: ALERTA DE ERROR
            throw new Error(error)
        }
    }

    openModalTags = (id: number, tags: string[]) => {
        const tagList: { id: number, label: string }[] = tags.map((t: string) => {
            const id = this.findIdByLabel(t)
            return {
                id: id,
                label: t
            }
        })
        this.setState({ showModalTags: true, modalUserId: id, tagList })
    }

    findIdByLabel = (label: string): number => {
        const ele: { value: number }[] = this.state.labelList.filter((l: { label: string }) => l.label === label)
        if (ele.length > 0) {
            return ele[0].value
        }

        return 0
    }

    closeModal = () => {
        this.setState({
            showModal: false,
            modalUserId: null,
            user: emptyUser,
            userEdited: emptyUser,
            errorMes: '',
        })
    }

    render() {
        const {
            showModal,
            modalUserId,
            currentPage,
            totalPage,
            total,
            count,
            rolList,
            regionList,
            user,
            showModalTags,
            tagList,
            labelList,
            errorMes,
            users,
        } = this.state

        const modalTitle = modalUserId ? 'Editar usuario' : 'Crea un nuevo usuario'
        const modalButton = modalUserId ? 'Guardar' : 'Crear'

        user.mother_last_name = user.mother_last_name === 'null' ? '' : user.mother_last_name;

        return (
            <>
                <Head>
                    <title>Usuarios</title>
                </Head>

                <Header />

                <div className={styles.headContainer}>
                    <div className={styles.leftContainer}>
                        <PageTitle title="Usuarios" />
                    </div>

                    <div className={styles.rightContainer}>
                        <div className={styles.inputContainer}>
                            <Input placeholderOverLabel={true} onChange={this.changeTextSearch} placeholder="Buscar un usuario" icon={faSearch} type="text" bgColor="transparent" />
                        </div>

                        <span className={styles.label}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <div className={styles.message}>
                                <p>Buscar por nombre, usuario, email, etiquetas, o número de empleado.</p>
                                <FontAwesomeIcon icon={faCaretDown} />
                            </div>
                        </span>

                        <div className={styles.inputContainer}>
                            <Select
                                noLabel={true}
                                onChange={this.changeRol}
                                bgColor="transparent"
                                label="Filtrar por rol"
                                options={[{ value: '', label: 'Todos' }].concat(rolList)}
                            />
                        </div>

                        <div className={styles.buttonContainer}>
                            <PrimaryButton
                                label="Crear nuevo usuario"
                                onClick={() => this.setState({ showModal: true, modalUserId: null, userEdited: emptyUser, user: emptyUser })}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <Table
                        bodyData={users}
                        header={this.tableHead}
                        currentPage={currentPage}
                        count={count}
                        total={total}
                        onNextPage={() => this.getUsersList(currentPage + 1)}
                        onPrevPage={() => this.getUsersList(currentPage - 1)}
                        actions={[
                            {
                                icon: faTags,
                                color: '#71A4E4',
                                action: (user: UserData) => this.openModalTags(user.id, user.labels)
                            },
                            {
                                icon: faPencilAlt,
                                color: '#71A4E4',
                                action: (user: UserData) => this.openModalEditUser(user),
                            },
                            {
                                icon: faTrashAlt,
                                color: '#DE4747',
                                action: (user: UserData) => this.deleteUser(user.id),
                            },
                        ]}
                        totalPage={totalPage}
                    />
                </div>

                {/* Modal de creación y edición de usuarios */}
                <Modal showModal={showModal} closeModal={this.closeModal}>
                    <EditUserForm
                        onAddUser={this.createUser}
                        onEditUser={this.editUser}
                        onClose={() => this.closeModal()}
                        showClose
                        title={modalTitle}
                        userProp={user}
                        labelButton={modalButton}
                        userId={modalUserId}
                        regionsList={regionList}
                        rolList={rolList}
                        serverErrors={errorMes}
                    />
                </Modal>

                <Modal showModal={showModalTags} closeModal={this.closeModal}>
                    <div className={styles.modalHeader}>
                        <p>
                            <img src="/img/logo.png" alt="Logo 3B" />
                        </p>
                        <p>Agregar etiquetas</p>
                    </div>

                    <div className={styles.modalBodyTags}>
                        <Tags
                            label="Etiquetas"
                            options={tagList}
                            deleteOption={this.deleteTag}
                            addOption={this.addTag}
                            optionList={labelList}
                        />
                    </div>

                    <div className={styles.modalFooter}>
                        <div className={styles.btnContainer}>
                            <SecondaryButton
                                onClick={() => this.setState({ showModalTags: false, modalUserId: null, tagList: [] })}
                                label="Cerrar"
                            />
                        </div>

                        <div className={styles.btnContainer}>
                            <PrimaryButton onClick={this.addUserTags} label="Agregar etiquetas" />
                        </div>
                    </div>
                </Modal>
            </>
        )
    }
}

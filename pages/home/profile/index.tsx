import React, { useState, useEffect } from 'react'
import { Header } from '../../../components/header'
import Modal from '../../../components/modal/Modal'
import EditUserForm from '../../../components/editUserForm/EditUserForm'
import Router, { useRouter } from 'next/router'
import { validateSession, getDarkTheme, getId, getHeader, createSession, getToken, getTheme, IsCustomTheme, getLocale } from '../../../utils/session-management'
import { getRolesCatalog, getRegionsCatalog, getLabelsCatalog } from '../../../utils/catalogs'
import api from '../../../utils/api'
import { buildTheme } from '../../../utils/theme';

type UserData = {
    first_name: string,
    last_name: string,
    mother_last_name?: string,
    username: string,
    id: number,
    employee_number: number,
    cellphone: number,
    roles: Array<string>,
    regions: Array<string>,
    labels: Array<string>,
    picture_path?: string,
    rolSelected?: string,
    completeName?: string,
    lang_id?: string,
}


const emptyUser = {
    role: '',
    first_name: '',
    last_name: '',
    mother_last_name: '',
    username: '',
    employee_number: 0,
    cellphone: 0,
    password: '',
    region: [],
    picture_path: '',
    dark_theme: 0,
    lang_id: '0',
}

const ProfilePage = () => {

    const [userId, setUserId] = useState('')
    const [hasDarkTheme, setHasDarkTheme] = useState(false)
    const [user, setUser] = useState(emptyUser)
    const [errorMessage, setErrorMessage] = useState('')
    const [errorMessageBad, setErrorMessageBad] = useState(true)
    const [languages, setLanguages] = useState([])
    const locale = getLocale()

    useEffect(() => {
        const isCustom = IsCustomTheme();
        const hasDarkTheme = getDarkTheme() === '1' ? true : false;

        (async () => {
            if (!languages.length) {
                const headers = {
                    ...getHeader(),
                    'content-type': 'multipart/form-data'
                }

                const response = await api.get('/api/languages/search', { headers })
                let { data } = response

                if (data && data.data) {
                    data = data.data

                    if (data && data.data) {
                        data = data.data

                        data = data.map((locale) => ({
                            value: `${locale.id}:${locale.abbreviation}`,
                            label: locale.name,
                        }))

                        setLanguages(data)
                    }
                }
            }
        })()

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
        setUserId(getId())
        setHasDarkTheme(hasDarkTheme)
        getUserData()
    }, [])

    if (hasDarkTheme) {
        document.querySelector('body').classList.add('darkmode')
    }

    const editUser = async (data) => {
        const theme: any = getTheme();
        try {
            const headers = {
                ...getHeader(),
                'content-type': 'multipart/form-data'
            }
            var form_data = new FormData();

            for (var key in data) {
                form_data.append(key, data[key]);
            }

            const userId = await getId()

            const response = await api.post(`api/users/${userId}/edit`, form_data, { headers })
            if (response.data.id == userId) {
                const user = response.data
                let language = null

                if (user && user.language) {
                    language = user.language
                }

                await createSession(`${await getToken()}`, `${user.first_name} ${user.last_name}`, user.roles, user.picture_path, user.id, theme?.dark_theme, theme, theme?.logo_path || "", language.abbreviation)
                setErrorMessage('Usuario actualizado con éxito');
                setErrorMessageBad(false)
                window.location.reload();
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data['Validation errors']) {
                const mes: string = `${Object.values(error.response.data['Validation errors']).reduce((acc: string, er: string) => {
                    if (er.length === 0) {
                        return acc
                    }
                    return `${acc}${er}. `
                }, '')}`
                setErrorMessage(mes)
                setErrorMessageBad(true)
            }
        }
    }

    const editLocale = async (lang) => {
        try {
            const headers = {
                ...getHeader(),
                'content-type': 'multipart/form-data'
            }
            const params = { lang }
            const response = await api.put('api/settings/update', params, { headers })
        } catch (error) {
            setErrorMessageBad(true)
        }
    }

    const getUserData = async () => {
        try {
            const userIdTemp = await getId()
            const res = await api.get(`api/users/${userIdTemp}`, { headers: getHeader(), })
            setUser(res.data.user)
        } catch (err) {
            // TODO: enviar notificación cuando falla al obtener usuarios
        }
    }

    return (
        <>
            <Header locale={locale}/>
            <Modal showModal={true}>
                <EditUserForm
                    onAddUser={() => { }}
                    onEditUser={editUser}
                    title={'Editar perfil'}
                    userProp={user}
                    showClose={true}
                    onClose={() => Router.back()}
                    labelButton={'Guardar'}
                    userId={userId}
                    hasDarkTheme={hasDarkTheme}
                    setHasDarkTheme={setHasDarkTheme}
                    regionsList={[]}
                    rolList={[]}
                    languages={languages}
                    showRol={false}
                    showEmployeeNumber={false}
                    showRegion={false}
                    serverErrors={errorMessage}
                    serverErrorsBad={errorMessageBad}
                    locale={locale}
                    onEditLocale={editLocale}
                />
            </Modal>
        </>
    )
}

export default ProfilePage

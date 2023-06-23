import React, { useState, useEffect, useRef, SyntheticEvent } from 'react'

import { Select } from '../select'
import { Checkbox } from '../../components/checkbox'
import { Input, File } from '../input'
import { SecondaryButton, PrimaryButton } from '../buttons'
import { getI18nLabel } from '../../i18n'
import { getLocale } from '../../utils/session-management'

import styles from './editUserForm.module.scss'
import { getLogo, getTheme } from '../../utils/session-management'
import { buildTheme } from '../../utils/theme';
import { useRouter } from 'next/router';

type Props = {
    title: string,
    userProp: UserModalData,
    userId: string | null,
    hasDarkTheme: any,
    setHasDarkTheme: any,
    onEditUser: Function,
    onEditLocale?: Function,
    onAddUser: Function,
    showClose: boolean,
    onClose?: Function,
    labelButton: string,
    regionsList: Option[],
    rolList: Option[],
    languages: [],
    showRol?: boolean,
    showRegion?: boolean,
    showEmployeeNumber?: boolean,
    serverErrors?: string,
    serverErrorsBad?: boolean,
    dark_theme?: boolean,
}

type Option = {
    value: any,
    label: string,
}

type UserModalData = {
    first_name?: string,
    last_name?: string,
    mother_last_name?: string,
    username?: string,
    employee_number?: number,
    cellphone?: number,
    role?: string,
    password?: string,
    region?: number[],
    photo?: File | null | string,
    picture_path?: string,
    [keys: string]: any,
}

export default function EditUserForm(props) {
    const {
        userProp,
        title,
        userId,
        hasDarkTheme,
        setHasDarkTheme,
        onEditUser,
        onAddUser,
        onClose,
        showClose,
        labelButton,
        regionsList,
        rolList,
        showRol = true,
        showRegion = true,
        showEmployeeNumber = true,
        serverErrors = '',
        serverErrorsBad = true,
        dark_theme = 0,
        locale = '',
        onEditLocale,
        languages,
        history,
    } = props

    const [user, setUser] = useState(userProp)
    const [rolErrorMessage, setRolErrorMessage] = useState('')
    const [nameErrorMessage, setNameErrorMessage] = useState('')
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
    const [employeeErrorMessage, setEmployeeErrorMessage] = useState('')
    const [cellphoneErrorMessage, setCellphoneErrorMessage] = useState('')
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('')
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
    const [lang, setLang] = useState(0)
    const [languageDefaultOption, setLanguageDefaultOption] = useState('0')
    const [logo, setLogo] = useState('');
    const router = useRouter();
    useEffect(() => {
        const logo = getLogo();
        console.log('que trae router,', router?.pathname);
        setLogo(logo);
        setUser(userProp)
    }, [userProp])

    const isAdmin = user && user.role === "admin"

    const changeTheme = (e: SyntheticEvent) => {
        const checked = (e.target as HTMLInputElement).checked
        const next = checked ? 1 : 0


        const updatedUser = {
            ...user,
            dark_theme: next,
        }

        setUser(updatedUser)

        setHasDarkTheme(next)

        if (next) {
            document.querySelector('body').classList.remove('custom')
            document.querySelector('body').classList.add('darkmode')
        } else {
            document.querySelector('body').classList.remove('darkmode')
            const theme = getTheme();
            const currentTheme = buildTheme(theme);
            const style = document.createElement('style');
            style.innerHTML = currentTheme;
            document.body.appendChild(style);
            document.querySelector('body').classList.add('custom');
        }

    }

    const changeModalLanguage = (e: any) => {
        const { value, options } = e.target
        const { selectedIndex } = options
        const [id, abbreviation] = value.split(':')

        const updatedUser = {
            ...user,
            lang_id: id,
        }

        setLanguageDefaultOption(value)
        setUser(updatedUser)
    }

    const changeModalRol = (e: any) => {
        const role = e.target.value
        let rolErrorMessage = ''

        if (!role || role.length === 0) {
            rolErrorMessage = 'Este campo es requerido'
        }

        setUser({
            ...user,
            role
        })

        setRolErrorMessage(rolErrorMessage)
    }

    const changeModalName = (e: any) => {
        const first_name = e.target.value

        setUser({
            ...user,
            first_name
        })

        if (first_name.length < 3) {
            setNameErrorMessage('El nombre debe contener al menos 3 caracteres.')
        } else {
            setNameErrorMessage('')
        }
    }

    const changeModalLastName = (e: any) => {
        const last_name = e.target.value

        setUser({
            ...user,
            last_name,
        })

        if (last_name.length < 3) {
            setLastNameErrorMessage('El apellido paterno debe de contener al menos 3 caracteres.')
        } else {
            setLastNameErrorMessage('')
        }
    }

    const changeModalSecondLastName = (e: any) => {
        const mother_last_name = e.target.value

        setUser({
            ...user,
            mother_last_name,
        })
    }

    const changeModalEmployeeNumber = (e: any) => {
        const employee_number = e.target.value
        setUser({
            ...user,
            employee_number
        })

        if (employee_number.length < 3 || employee_number.length > 6) {
            setEmployeeErrorMessage('El número de empleado debe ser entre 3 y 6 digitos.')
        } else {
            setEmployeeErrorMessage('')
        }
    }

    const changeModalCellphone = (e: any) => {
        const cellphone = e.target.value
        setUser({
            ...user,
            cellphone
        })

        if (cellphone.length < 8 || cellphone.length > 15) {
            setCellphoneErrorMessage('El número de celular debe contener de 8 a 15 digitos.')
        } else {
            setCellphoneErrorMessage('')
        }
    }

    const changeModalRegion = (e: any) => {
        const region = [e.target.value]
        setUser({
            ...user,
            region,
        })
    }

    const changeModalUsername = (e: any) => {
        const username = e.target.value
        setUser({
            ...user,
            username
        })

        if (username.length < 3) {
            setUsernameErrorMessage('El nombre de usuario debe de contener al menos 3 caracteres.')
        } else {
            setUsernameErrorMessage('')
        }
    }

    const changeModalPassword = (e: any) => {
        const password = e.target.value
        setUser({
            ...user,
            password,
        })

        if (password.length < 3) {
            setPasswordErrorMessage('La contraseña debe de tener al menos 3 caracteres.')
        } else {
            setPasswordErrorMessage('')
        }
    }

    const checkAndDeleteUnusedFields = (object: UserModalData): UserModalData => {
        const res = { ...object }

        if (!res.password || res.password.length === 0)
            delete res.password

        if (!res.cellphone || res.cellphone <= 0)
            delete res.cellphone

        if (!res.employee_number || res.employee_number <= 0)
            delete res.employee_number

        if (!res.mother_last_name || res.mother_last_name.length === 0)
            delete res.mother_last_name

        if (!res.picture_path || res.picture_path.length === 0)
            delete res.picture_path

        if (!res.photo)
            res.photo = ''

        return res
    }

    const validateRequiredFields = (object: UserModalData): boolean => {
        let isValid = true

        if (!object.username || object.username.length === 0) {
            setUsernameErrorMessage('El nombre de usuario es requerido')
            isValid = false
        }

        if (!object.first_name || object.first_name.length === 0) {
            setNameErrorMessage('El nombre es requerido')
            isValid = false
        }

        if (!object.last_name || object.last_name.length === 0) {
            setLastNameErrorMessage('El apellido paterno es requerido')
            isValid = false
        }

        return isValid
    }

    const onSend = () => {
        const data = checkAndDeleteUnusedFields(user)

        if (validateRequiredFields(data)) {
            userId ? onEditUser(data) : onAddUser(data)
        }
    }

    function clearForm() {
        setUser({
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
        });
    }

    function closeForm() {
        clearForm()
        onClose()
    }

    return (
        <>
            <div className={styles.modalHeader}>
                <p><img src={logo} style={logo != "" ? { width: '55px', height: '50px' } : {}} alt="Logo 3B" /></p>
                <p>{title}</p>
            </div>
            <div className={styles.modalBody}>
                <div className={styles.half}>
                    {showRol &&
                        <div className={styles.inputContainer}>
                            <Select
                                errorMessage={rolErrorMessage}
                                onChange={changeModalRol}
                                defaultOption={user && user.role}
                                options={rolList}
                                label={getI18nLabel(locale, 'profile.input.role.label')}
                            />
                        </div>
                    }

                    <div className={styles.inputContainer}>
                        <Input
                            defaultValue={user.first_name}
                            onChange={changeModalName}
                            type="text"
                            placeholder={getI18nLabel(locale, 'profile.input.first_name.label')}
                            minLength={3}
                            errorMessage={nameErrorMessage}
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <Input
                            defaultValue={user.last_name}
                            onChange={changeModalLastName}
                            type="text"
                            placeholder={getI18nLabel(locale, 'profile.input.last_name.label')}
                            minLength={3}
                            errorMessage={lastNameErrorMessage}
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <Input
                            defaultValue={user.mother_last_name}
                            onChange={changeModalSecondLastName}
                            type="text"
                            placeholder={getI18nLabel(locale, 'profile.input.mother_last_name.label')}
                        />
                    </div>
                    {
                        router && router?.pathname === '/home/profile' && (
                            <div className={styles.inputContainer}>
                                <Select
                                    errorMessage={rolErrorMessage}
                                    onChange={changeModalLanguage}
                                    defaultOption={languageDefaultOption}
                                    options={languages || []}
                                    label={getI18nLabel(locale, 'profile.input.locale.label')}
                                />
                            </div>
                        )
                    }

                    {showEmployeeNumber &&
                        <div className={styles.inputContainer}>
                            <Input
                                defaultValue={user.employee_number}
                                onChange={changeModalEmployeeNumber}
                                type="text"
                                placeholder={getI18nLabel(locale, 'profile.input.employee_number.label')}
                                minLength={3}
                                maxLength={6}
                                errorMessage={employeeErrorMessage}
                            />
                        </div>
                    }
                </div>

                <div className={styles.half}>
                    <div className={styles.inputContainer}>
                        <Input
                            defaultValue={user.cellphone}
                            onChange={changeModalCellphone}
                            type="text"
                            placeholder={getI18nLabel(locale, 'profile.input.cellphone.label')}
                            minLength={18}
                            errorMessage={cellphoneErrorMessage}
                        />
                    </div>

                    {showRegion &&
                        <div className={styles.inputContainer}>
                            <Select
                                defaultOption={user.region}
                                onChange={changeModalRegion}
                                options={regionsList}
                                label={getI18nLabel(locale, 'profile.input.region.label')}
                            />
                        </div>
                    }

                    <div className={styles.inputContainer}>
                        <Input
                            defaultValue={user.username}
                            onChange={changeModalUsername}
                            type="text"
                            placeholder={getI18nLabel(locale, 'profile.input.username.label')}
                            minLength={3}
                            errorMessage={usernameErrorMessage}
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <Input
                            defaultValue={user.password}
                            onChange={changeModalPassword}
                            type="password"
                            placeholder={getI18nLabel(locale, 'profile.input.password.label')}
                            minLength={3}
                            errorMessage={passwordErrorMessage}
                        />
                    </div>
                </div>

                <div className={styles.serverError}>
                    <p className={serverErrorsBad ? styles.errorBad : styles.errorGood}>
                        {serverErrors}
                    </p>
                </div>
            </div>

            <div className={styles.modalFooter}>
                {showClose &&
                    <div className={styles.btnContainer}>
                        <SecondaryButton
                            onClick={closeForm}
                            label={getI18nLabel(locale, 'profile.options.close')}
                        />
                    </div>
                }

                <div className={styles.btnContainer}>
                    <PrimaryButton
                        onClick={onSend}
                        label={getI18nLabel(locale, 'profile.options.save')}
                    />
                </div>
            </div>
        </>
    )
}

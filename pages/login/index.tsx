import React, { PureComponent, SyntheticEvent } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'

import { Input } from '../../components/input'
import { PrimaryButton } from '../../components/buttons'
import { ExternalContainer } from '../../components/externalContainer'
import API from '../../utils/api';
import { createSession } from '../../utils/session-management'

import styles from './login.module.scss'

type UserResponse = {
    first_name: string,
    last_name: string,
    picture_path: string,
    roles: string[],
    id: string,
    dark_theme: any,
    settings: any,
    theme: any,
    language: any,
}

export default class LoginPage extends PureComponent {
    state = {
        username: '',
        password: '',
        token: '',
        showErrorMessage: false,
        errorMessage: '',
    }

    componentDidMount() {
        document.querySelector('body').classList.remove('darkmode')
        document.querySelector('body').classList.remove('custom')
        const userInput: any = document.querySelector('.login-user-input');
        userInput.focus()

        document.addEventListener('keydown', this.handleTab);
    }

    usernameChangeHandler = (e) => {
        const {value} = e.target
        this.setState({ username: value });
    }

    passwordChangeHandler = (e) => {
        const {value} = e.target
        this.setState({ password: value });
    }

    login = async (e: SyntheticEvent) => {
        e.preventDefault()

        try {
            const response = await API.post(
                '/api/login',
                {
                    username: this.state.username,
                    password: this.state.password
                },
            );
            if (response?.status === 200) {
                const user = (response.data.user as UserResponse)
                const token = response.data.token
                const { settings: { language } } = user
                if (user.roles.includes('Scanner')) {
                    this.setState({
                        showErrorMessage: true,
                        errorMessage: 'No tienes acceso a este sistema. Solo tienes permisos para la aplicación móvil.',
                    })
                } else {
                    createSession(
                        token,
                        `${user.first_name} ${user.last_name}`,
                        user.roles,
                        user.picture_path,
                        user.id,
                        user && user.theme && user.theme.dark_theme ? user.theme.dark_theme : 0,
                        user.theme,
                        user && user.theme && user.theme.logo_path ? user.theme.logo_path : "",
                        language.abbreviation,
                    )
                    Router.push('/home')
                }
            }
        } catch (error) {
            if (error && error.response && error.response.status && error.response.status === 307) {
                const user = (error.response.data.user as UserResponse)

                const token = error.response.data.token
                createSession(
                    token,
                    `${user.first_name} ${user.last_name}`,
                    user.roles,
                    user.picture_path,
                    user.id,
                    user && user.theme && user.theme.dark_theme ? user.theme.dark_theme : 0,
                    user.theme,
                    user && user.theme && user.theme.logo_path ? user.theme.logo_path : "",
                )

                Router.push({
                    pathname: '/change-password',
                    query: { password: this.state.password },
                })
            }

            if (error?.response?.status === 401) {
                this.setState({
                    showErrorMessage: true,
                    errorMessage: 'Usuario o contraseña incorrectos',
                })
            }
        }
    }

    handleTab(event) {
        const keyCode = event.which ? event.which : event.keyCode;
        const key = event.code ? event.code : event.key;
        const isTabKey = keyCode === 9 && key === 'Tab';

        if (document && isTabKey) {
            event.preventDefault();
            event.stopPropagation();

            let indexedElements: any = [];
            indexedElements = document.querySelectorAll('.indexed-element[tabindex]');
            indexedElements = [...indexedElements].sort((a, b) => a.tabIndex - b.tabIndex);

            if (indexedElements.length) {
                const currentElement = event.target;
                const nextElementIndex = currentElement.tabIndex + 1;
                const nextElement = indexedElements.find((element) => element.tabIndex === nextElementIndex);

                if (nextElement)  {
                    nextElement.focus();
                } else {
                    indexedElements[0].focus();
                }
            }
        }
    }

    render() {
        const { showErrorMessage, errorMessage } = this.state

        return (
            <ExternalContainer>
                <Head>
                    <title>Iniciar sesión</title>
                </Head>

                <p className={styles.title}>¡Bienvenido! Ingresa tu contraseña</p>

                <form onSubmit={this.login}>
                    <div className={styles.input}>
                        <Input
                            defaultValue={this.state.username}
                            onChange={this.usernameChangeHandler}
                            type="text"
                            placeholder="Usuario"
                            tabindex={1}
                            className='login-user-input indexed-element'
                        />
                    </div>

                    <div className={styles.input}>
                        <Input
                            defaultValue={this.state.password}
                            onChange={this.passwordChangeHandler}
                            type="password"
                            placeholder="Contraseña"
                            tabindex={2}
                            className='login-user-pass indexed-element'
                        />
                    </div>

                    <p>
                        <PrimaryButton
                            type="submit"
                            label="Ingresar"
                            tabindex={3}
                            className='login-user-pass indexed-element'
                        />
                    </p>

                    {showErrorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                </form>
            </ExternalContainer>
        )
    }
}

import React, { PureComponent } from 'react'
import { NextPageContext } from 'next'
import Head from 'next/head'
import Router from 'next/router'

import { ExternalContainer } from '../../components/externalContainer'
import styles from './change-password.module.scss'
import { Input } from '../../components/input'
import { PrimaryButton, SecondaryButton } from '../../components/buttons'
import API from '../../utils/api'
import { getHeader } from '../../utils/session-management'

type Props = {
    oldPassword?: string,
    token: string,
}

class ChangePassword extends PureComponent<Props> {

    state = ({
        newPassword: '',
        confirmPassword: '',
        showErrorMessage: false,
        errorMessage: '',
        showChangeMessage: false,
    });

    static getInitialProps({ query }: NextPageContext) {
        return { oldPassword: query.password, token: query.token }
    }

    newPasswordChangeHandler = (e: any) => { this.setState({ newPassword: e.target.value }); }

    confirmPasswordChangeHandler = (e: any) => { this.setState({ confirmPassword: e.target.value }); }

    confirm = () => {
        if (this.state.newPassword === this.state.confirmPassword && this.state.newPassword.length >= 6) {

            if (this.props.oldPassword) {

                this.newUserChangePassword()
            } else if (this.props.token) {
                this.userResetPassword()
            }

        } else if (this.state.newPassword.length < 6) {
            this.setState({
                showErrorMessage: true,
                errorMessage: 'La contraseña debe tener al menos 6 caracteres'
            })
        } else {
            this.setState({
                showErrorMessage: true,
                errorMessage: 'La contraseña no coincide.'
            })
        }
    }

    userResetPassword = async () => {
        try {
            const data = {
                password: this.state.newPassword,
                password_confirmation: this.state.confirmPassword,
                token: this.props.token,
            }
            const response = await API.post(`/api/reset/${this.props.token}`, data)
            if (response.status === 200) {
                this.setState({
                    showChangeMessage: true,
                })
            }
        } catch (error) {
            this.setState({
                showErrorMessage: true,
                errorMessage: 'Ha habido un error inesperado, por favor intente de nuevo más tarde.'
            })
        }
    }

    newUserChangePassword = async () => {
        try {
            const response = await API.post('/api/setup-password', {
                old_password: this.props.oldPassword,
                new_password: this.state.newPassword,
                new_confirm_password: this.state.confirmPassword
            }, { headers: getHeader() });

            if (response.status === 200) {
                Router.push('/home');
            }
        } catch (error) {
            if (error.response.status === 412) {
                this.setState({
                    showErrorMessage: true,
                    errorMessage: 'La contraseña anterior es incorrecta.'
                })
            }
        }

    }

    render() {

        const { showErrorMessage, errorMessage, showChangeMessage } = this.state;

        return (
            <ExternalContainer>
                <Head>
                    <title>Cambiar contraseña</title>
                </Head>
                {!showChangeMessage &&
                    < div >
                        <p className={styles.title}>¡Bienvenido!<br />Define una nueva contraseña para iniciar.</p>
                        <p className={styles.input}>
                            <Input onChange={this.newPasswordChangeHandler} type="password" placeholder="Contraseña" />
                        </p>
                        <p className={styles.input}>
                            <Input onChange={this.confirmPasswordChangeHandler} type="password" placeholder="Validar contraseña" />
                        </p>

                        <p>
                            <PrimaryButton onClick={() => this.confirm()} label="Confirmar" />
                        </p>
                        {showErrorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}


                    </div>
                }
                {showChangeMessage &&
                    <div>
                        <p className={styles.successMessage}>Se ha cambiado tu contraseña exitosamente. Por favor ingresa con tu nueva contraseña.</p>
                        <SecondaryButton onClick={() => Router.push('/login')} label="Regresar" />
                    </div>}
            </ExternalContainer>
        )
    }
}

export default ChangePassword

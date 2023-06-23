import React, { PureComponent } from 'react'
import { ExternalContainer } from '../../components/externalContainer'
import Head from 'next/head'
import { Input } from '../../components/input'
import { PrimaryButton, SecondaryButton } from '../../components/buttons'

import styles from './forgot-password.module.scss'
import api from '../../utils/api'
import Router from 'next/router'

type State = {
    email: string,
    emailErrorMessage: string,
    showMessage: boolean,
}

class ForgotPasswordPage extends PureComponent<null, State> {


    state = {
        email: '',
        emailErrorMessage: '',
        showMessage: false,
    }

    changeEmail = (e: any) => {
        const email = e.target.value
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email || email.length === 0 || !re.test(String(email).toLowerCase())) {
            this.setState({
                emailErrorMessage: 'Escriba un correo válido'
            })
        } else {

            this.setState({ email, emailErrorMessage: '' })
        }
    }


    sendEmail = async () => {
        if (this.state.emailErrorMessage.length === 0 && this.state.email.length > 0) {
            try {
                const response = await api.post('/api/sendLinkResetPassword', { email: this.state.email })
                this.setState({
                    showMessage: true
                })
            } catch (error) {
                // TODO: mandar mensaje de error
            }
        } else if (this.state.email.length === 0) {
            this.setState({
                emailErrorMessage: 'El campo es obligatorio'
            })
        }
    }

    render() {
        return (
            <ExternalContainer>
                <Head>
                    <title>Olvidé mi contraseña</title>
                </Head>
                {!this.state.showMessage &&
                    <div>

                        <h2 className={styles.title}>Ingresa tu correo</h2>
                        <p className={styles.input}>
                            <Input errorMessage={this.state.emailErrorMessage} onChange={this.changeEmail} type="text" placeholder="Correo electrónico:" />
                        </p>
                        <p className={styles.buttons}>
                            <div className={styles.buttonContainer}>
                                <SecondaryButton onClick={() => Router.push('/login')} label="Regresar" />
                            </div>
                            <div className={styles.buttonContainer}>
                                <PrimaryButton label="Enviar correo" onClick={() => this.sendEmail()} />
                            </div>
                        </p>

                    </div>}
                {
                    this.state.showMessage &&
                    <div>
                        <p className={styles.successMessage}>Se ha enviado el correo exitosamente. Por favor revisa en tu bandeja de entrada y en la
                         carpeta de spam.</p>
                        <SecondaryButton onClick={() => Router.push('/login')} label="Regresar" />
                    </div>
                }
            </ExternalContainer>
        )
    }
}

export default ForgotPasswordPage
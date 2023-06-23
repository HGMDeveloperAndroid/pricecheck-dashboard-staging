import React, { PureComponent } from 'react'
import { getLogo } from '../../utils/session-management';

import styles from './externalContainer.module.scss'

class LoginPage extends PureComponent {
    state = {
        logo: "",
    }
    componentDidMount() {
        // const logo = getLogo();
        this.setState({logo: "https://app.pricecheck3b.com/img/logo.png"})
    }
    render() {
        const { logo } = this.state
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loginContainer}>
                    <img src={logo} style={logo != "" ? { width: '55px', height: '50px' } : {}} alt="Logo 3B" />
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default LoginPage
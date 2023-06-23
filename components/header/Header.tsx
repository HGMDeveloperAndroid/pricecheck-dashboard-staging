import React, { PureComponent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faCaretDown, faUser } from '@fortawesome/free-solid-svg-icons'

import styles from './header.module.scss'
import Router from 'next/router'
import {getI18nLabel} from '../../i18n'
import { deleteSession, getLogo, getName, getProfilePicture, validateIsAnalyst, getLocale } from '../../utils/session-management'

class Header extends PureComponent<any, any> {

    state = {
        name: '',
        profilePicture: null,
        showMenu: false,
        howShowMenu: 'key',
        isAnalyst: '',
        logo: ''
    }

    componentDidMount() {
        const rolAnalyst = validateIsAnalyst();
        const logo = getLogo();
        this.setState({
            name: getName(),
            profilePicture: getProfilePicture(),
            isAnalyst: rolAnalyst,
            logo,
        })

        window.addEventListener("keydown", e => this.handleKeydown(e))
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', e => this.handleKeydown(e))
    }

    handleKeydown = (e: any) => {
        const key = e.which || e.keyCode
        const ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false)
        if (key == 55 && ctrl) {
            if (!this.state.showMenu) {
                this.setState({
                    showMenu: true,
                    howShowMenu: 'key',
                })
            } else if (this.state.howShowMenu === 'key' && this.state.showMenu) {
                this.setState({
                    showMenu: false,
                })
            }

        }
    }

    closeSession = () => {
        deleteSession()
        Router.push('/login')
    }


    render() {
        const { name, profilePicture, showMenu, isAnalyst, logo } = this.state;
        const locale = getLocale()
        return (
            <div className={styles.header}>
                <Link href="/home"><a><img src={logo} style={logo != "" ? { width: '55px', height: '50px' } : {}} alt="Logo 3B" /></a></Link>
                <ul className={styles.optionsList}>
                    <li className={isAnalyst ? styles.optionDisabled : styles.option}>
                        <Link href="/home" locale={locale}>
                            {getI18nLabel(locale, 'navbar.option.validations')}
                        </Link>
                    </li>
                    <li className={isAnalyst ? styles.optionDisabled : styles.option}>
                        <Link href="/home/missions" locale={locale}>
                            {getI18nLabel(locale, 'navbar.option.missions')}
                        </Link>
                    </li>
                    <li className={styles.option}>
                        <Link href="/home/scans" locale={locale}>
                            {getI18nLabel(locale, 'navbar.option.captures')}
                        </Link>
                    </li>
                    <li className={styles.option}>
                        <Link href="/home/products" locale={locale}>
                            {getI18nLabel(locale, 'navbar.option.products')}
                        </Link>
                    </li>
                    <li className={styles.option}>
                        <Link href="/home/rankings" locale={locale}>
                            {getI18nLabel(locale, 'navbar.option.rankings')}
                        </Link>
                    </li>
                    <li className={styles.option}>
                        <a href='#'>
                            Reportes
                        </a>
                        <ul className={styles.dropdown}>
                            <FontAwesomeIcon className={styles.triangle} icon={faCaretDown} />
                            <li>
                                <Link href="/home/reports/statistic" locale={locale}>
                                    {getI18nLabel(locale, 'navbar.option.reports.statistic')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/home/reports/product" locale={locale}>
                                    {getI18nLabel(locale, 'navbar.option.reports.product')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/home/reports/scans" locale={locale}>
                                    {getI18nLabel(locale, 'navbar.option.reports.scans')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/home/reports/geolocalization" locale={locale}>
                                    {getI18nLabel(locale, 'navbar.option.reports.geolocalization')}
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>

                <div className={styles.leftContainer}>
                    {
                        !isAnalyst && (
                            <div className={styles.configuration}>
                                <FontAwesomeIcon icon={faCog} />
                                <ul className={styles.dropdown}>
                                    <FontAwesomeIcon className={styles.triangle} icon={faCaretDown} />
                                    <li>
                                        <Link href="/home/newCatalogs" locale={locale}>
                                            {getI18nLabel(locale, 'navbar.option.catalogs')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )
                    }

                    <div className={styles.profile}>
                        {/* {
                            profilePicture === null ? 
                                <div className={styles.defaultImg}><FontAwesomeIcon icon={faUser} /></div>
                            :
                                <div className={styles.profilePicture}><img src={`${profilePicture}`} /></div>
                        } */}

                        <div className={styles.defaultImg}><FontAwesomeIcon icon={faUser} /></div>

                        <span>{name}</span>
                        <ul className={styles.dropdown}>
                            <FontAwesomeIcon className={styles.triangle} icon={faCaretDown} />
                            <li>
                                <Link href="/home/profile" locale={locale}>
                                    {getI18nLabel(locale, 'navbar.option.editProfile')}
                                </Link>
                            </li>
                            <li onClick={() => this.closeSession()}>
                                {getI18nLabel(locale, 'navbar.option.signOut')}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

}

const withRouter = (props) => {
    const router = useRouter()
    return <Header {...props} router={router} />
}

export default withRouter;

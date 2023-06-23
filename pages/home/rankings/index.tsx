import React, { PureComponent, Fragment } from 'react';
import { useRouter } from 'next/router'

import { Header } from '../../../components/header';

import s from './rankings.module.scss'
import OptionList from '../../../components/optionList/OptionList';
import ScannersTab from '../../../components/scannersTab/ScannersTab';
import ValidatorsTab from '../../../components/validatorsTab/ValidatorsTab';
import PageTitle from '../../../components/pageTitle/PageTitle';
import {getI18nLabel} from '../../../i18n'
import { getDarkTheme, getTheme, IsCustomTheme, getLocale } from '../../../utils/session-management'
import { buildTheme } from '../../../utils/theme';

class RankingsPage extends PureComponent<any, any> {
    state = {
        options: [
            {
                value: 1,
                label: 'Capturistas',
                key: 'capturists',
            },
            {
                value: 2,
                label: 'Validadores',
                key: 'validators',
            }
        ],
        optionSelected: 1,
    }

    componentDidMount() {

        const isCustom = IsCustomTheme();
        const hasDarkTheme = getDarkTheme() === '1' ? true : false;
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

    }

    render() {
        const { optionSelected } = this.state
        const locale = getLocale()

        const options = this.state.options.map((option) => {
            option.label = getI18nLabel(locale, `rankings.tabs.${option.key}.title`)
            return option
        })

        return (
            <Fragment>
                <Header locale={locale}/>

                <div className={s.container}>
                    <PageTitle title="Rankings" />

                    <OptionList
                        options={options}
                        onOptionSelected={(v) => this.setState({ optionSelected: v })}
                        optionSelected={optionSelected}
                    />

                    {optionSelected === 1 && <ScannersTab locale={locale}/>}

                    {optionSelected === 2 && <ValidatorsTab locale={locale}/>}
                </div>
            </Fragment>
        );
    }
}

const withRouter = (props) => {
    const router = useRouter()
    return <RankingsPage {...props} router={router} />
}

export default withRouter;

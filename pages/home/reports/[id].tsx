import React, { useState, useEffect } from 'react';
import { getDarkTheme, getTheme, IsCustomTheme } from '../../../utils/session-management';
import { useRouter } from 'next/router';
import localStorage from 'localStorage';

import s from './geolocation-report.module.scss';
import ScansPage from '../scans';

import GoBack from '../../../components/goBack/GoBack';
import { Header } from '../../../components/header';
import { buildTheme } from '../../../utils/theme';

const ScanGeolocationPage = () => {
    const router = useRouter();

    const { id } = router.query;

    const location = localStorage.getItem('nameLocation')
    const [hasDarkTheme, setHasDarkTheme] = useState(false)

    useEffect(() => {
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
    })

    if (hasDarkTheme) {
        document.querySelector('body').classList.add('darkmode')
    }

    return (
        <>
            <Header />
            <div className={s.detailsContainer}>
                <GoBack />
                <div className={s.filtersContainer}>

                </div>
                <div className={s.tableContainer}>

                </div>
                <ScansPage geolocationId={`${id}`} nameLocation={location} />
            </div>
        </>
    )
};

export default ScanGeolocationPage;

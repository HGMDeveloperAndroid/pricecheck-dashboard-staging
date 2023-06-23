import React, { useState, Fragment, useEffect } from 'react'

import { useRouter } from 'next/router'
import ScanDetails from '../../../components/scanDetails/ScanDetails'
import { Header } from '../../../components/header'
import { getDarkTheme, getTheme, IsCustomTheme, getLocale } from '../../../utils/session-management';
import { buildTheme } from '../../../utils/theme';

const ScanDetailsPage = () => {

    const router = useRouter()

    const { id } = router.query

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


    return (
        <ScanDetails id={`${id}`} />
    )
}

export default ScanDetailsPage

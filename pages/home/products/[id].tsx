import React, { useState, Fragment, useEffect } from 'react'

import { useRouter } from 'next/router'
import ScanDetails from '../../../components/scanDetails/ScanDetails'
import ProductDetails from '../../../components/productDetails/ProductDetails'
import { Header } from '../../../components/header'
import { getDarkTheme, getTheme, IsCustomTheme, getLocale } from '../../../utils/session-management';
import { buildTheme } from '../../../utils/theme';

const ProductDetailsPage = () => {

    const router = useRouter()

    const { query } = router
    const locale = getLocale()
    const { id } = query

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
        <ProductDetails locale={locale} id={`${id}`} />
    )
}

export default ProductDetailsPage

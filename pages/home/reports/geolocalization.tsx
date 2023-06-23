import React, { useState, useEffect } from 'react';
import { Header } from '../../../components/header';

import GeolocationReports from './geolocation-reports';
import ListReportTypes from '../../../components/list-report-types/ListReportTypes';
import { getDarkTheme, getTheme, IsCustomTheme } from '../../../utils/session-management';
import { buildTheme } from '../../../utils/theme';

const Reports = () => {
    const [reportShow, setReportShow] = useState(0)
    const [hasDarkTheme, setHasDarkTheme] = useState(false)

    const reportTypes = [
        {
            id: 1,
            icon: '',
            title: 'Geolocalización',
            onClick: (id: any) => setReportShow(id)
        }
    ];

    const getReports = () => {
        switch (reportShow) {
            case 1:
                return <GeolocationReports />;
            default:
                return '';
        }
    };

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
        <div className="reports">
            <Header />
            {reportShow !== 0 ? (
                getReports()
            ) : (
                <ListReportTypes reportTypes={reportTypes} />
            )}
        </div>
    );
};

export default Reports;

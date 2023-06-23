import React, { useState, useEffect } from 'react';
import { Header } from '../../../components/header';

import GeolocationReports from './geolocation-reports';
import ListReportTypes from '../../../components/list-report-types/ListReportTypes';
import { getDarkTheme } from '../../../utils/session-management';

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
        const hasDarkTheme = getDarkTheme() === '1' ? true : false;

        setHasDarkTheme(hasDarkTheme)
    })

    if (hasDarkTheme) {
        document.querySelector('body').classList.add('darkmode')
    }

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

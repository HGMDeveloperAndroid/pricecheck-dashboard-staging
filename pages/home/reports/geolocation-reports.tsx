import React, { useState, useEffect } from 'react';
import localStorage from 'localStorage';
import { TableComplex } from '../../../components/table';
import {
    faExternalLinkAlt,
    faTrashAlt,
    faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import api from '../../../utils/api';
import { header } from '../../../utils/headers';
import ReportDetails from '../../../components/reportDetails';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import styles from './geolocation-report.module.scss';
import Router from 'next/router';
import PageTitle from '../../../components/pageTitle/PageTitle';
import Loader from '../../../components/loader/Loader';
import {baseURLGeoref, georefApiKey} from '../../../utils/baseUrl';

export default function GeolocationReports() {
    const [reports, setReports] = useState([]);
    const [showReportDetails, setShowReportDetails] = useState(false)
    const [selectedReportInfo, setSelectedReportInfo] = useState([])
    const [detailReadOnly, setDetailReadOnly] = useState(true)
    const [showLoader, setShowLoader] = useState(false)

    const getReports = async () => {
        setShowLoader(true)

        try {
            const response = await api({
                url: 'api/places',
                baseURL: baseURLGeoref,
                headers: { Authorization: `Api-Key ${georefApiKey}` }
            })

            transformReportsData(response.data.data)
        } catch (e) {
            throw new Error(e)
        } finally {
            setShowLoader(false)
        }
    };

    const deleteReport = async (row: any) => {
        try {
            await api({
                method: 'delete',
                url: `api/places/${row.id}`,
                baseURL: baseURLGeoref,
                headers: { Authorization: `Api-Key ${georefApiKey}` }
            })

            getReports()
        } catch (e) {
            throw new Error(e)
        }
    };

    const updateReport = async (data: any, id: any) => {
        try {
            await api({
                method: 'patch',
                url: `api/places/${id}`,
                baseURL: baseURLGeoref,
                headers: { Authorization: `Api-Key ${georefApiKey}` },
                data
            })
        } catch (e) {
            throw new Error(e)
        } finally {
            setShowReportDetails(false)
            getReports()
        }
    };

    const createNewReport = async (data: any) => {
        try {
            await api({
                method: 'post',
                url: 'api/places',
                baseURL: baseURLGeoref,
                headers: { Authorization: `Api-Key ${georefApiKey}` },
                data
            })
        } catch (e) {
            throw new Error(e)
        } finally {
            setShowReportDetails(false)
            getReports()
        }
    };

    useEffect(() => {
        getReports()
    }, []);

    const actions = [
        {
            icon: faExternalLinkAlt,
            color: '#71A4E4',
            action: (row: any) => {
                localStorage.setItem('nameLocation', row.location)
                Router.push(`/home/reports/${row.id}`)
            }
        },
        {
            icon: faPencilAlt,
            color: '#71A4E4',
            action: (row: any) => {
                showDetailReport(row)
            }
        },
        {
            icon: faTrashAlt,
            color: '#DE4747',
            action: (row: any) => {
                deleteReport(row)
            }
        }
    ];

    const showDetailReport = (row: any) => {
        const selectedReport = reports.filter(report => report.id === row.id)
        setSelectedReportInfo(selectedReport[0])
        setShowReportDetails(true)
        setDetailReadOnly(false)
    };

    const openCreateModal = () => {
        setDetailReadOnly(false)
        setShowReportDetails(true)
        setSelectedReportInfo([])
    }

    const transformReportsData = (reports: any[]) => {
        const newReportsArray = reports.map(report => ({
            id: report.id,
            location: report.name,
            position1: {
                coordinates: report.point1,
                latitude: report.point1.split(',', 1),
                longitude: report.point1.split(',', 2)[1]
            },
            position2: {
                coordinates: report.point2,
                latitude: report.point2.split(',', 1),
                longitude: report.point2.split(',', 2)[1]
            },
            position3: {
                coordinates: report.point3,
                latitude: report.point3.split(',', 1),
                longitude: report.point3.split(',', 2)[1]
            },
            position4: {
                coordinates: report.point4,
                latitude: report.point4.split(',', 1),
                longitude: report.point4.split(',', 2)[1]
            },
        }))

        setReports(newReportsArray)
    }

    const getReportRows = () => {
        const rows = reports.map(report => ({
            id: report.id,
            location: report.location,
            position1: report.position1.coordinates,
            position2: report.position2.coordinates,
            position3: report.position3.coordinates,
            position4: report.position4.coordinates
        }))

        return rows
    }

    return (
        <div className={styles.reportsContainer}>
            <Loader show={showLoader} />

            <div className={styles.reportHeader}>
                <PageTitle title="Reportes" />
            </div>

            <div className={styles.actions}>
                <div className={styles.button}>
                    <PrimaryButton
                        label="Nueva ubicación georeferenciada"
                        onClick={openCreateModal}
                    />
                </div>
            </div>

            <div className={styles.tableComplexContainer}>
                <TableComplex
                    actions={actions}
                    content={getReportRows()}
                    header={header}
                    changePageNext={() => { }}
                    changePagePrev={() => { }}
                    total={0}
                    count={0}
                    totalPage={0}
                    currentPage={0}
                    onClickDetails={() => { }}
                    textNotData=''
                />
            </div>

            {showReportDetails && (
                <ReportDetails
                    toggleModal={() => setShowReportDetails(false)}
                    showModal={showReportDetails}
                    {...selectedReportInfo}
                    readOnly={detailReadOnly}
                    saveInfo={(newReport: any, id: number) => id === 0 ?
                        createNewReport(newReport) :
                        updateReport(newReport, id)
                    }
                    cancel={() => setShowReportDetails(false)}
                />
            )}
        </div>
    );
};

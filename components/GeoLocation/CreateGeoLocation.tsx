import React, { useState, useEffect } from 'react';
import localStorage from 'localStorage';
import {
    faExternalLinkAlt,
    faTrashAlt,
    faPencilAlt,
    faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';
import { header } from '../../utils/headers';
import ReportDetails from '../reportDetails';
import { PrimaryButton } from '../buttons/PrimaryButton';
import styles from './createGeoLocation.module.scss';
import Router from 'next/router';
import PageTitle from '../pageTitle/PageTitle';
import Loader from '../loader/Loader';
import {baseURLGeoref, georefApiKey} from '../../utils/baseUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    getGeoCatalogs:Function,
    setShowReportDetails:Function,
    setSelectedReportInfo:Function,
    setDetailReadOnly:Function,
    setShowLoader:Function,
    showReportDetails:boolean,
    selectedReportInfo:any[],
    detailReadOnly:boolean,
    showLoader:boolean,
    getReports:Function,
}

// const [reports, setReports] = useState([]);
// const [showReportDetails, setShowReportDetails] = useState(false)
// const [selectedReportInfo, setSelectedReportInfo] = useState([])
// const [detailReadOnly, setDetailReadOnly] = useState(true)
// const [showLoader, setShowLoader] = useState(false)

    // const deleteReport:Function = async (id: number) => {
    //     // Elimina geoReporte
    //         try {
    //             await api({
    //                 method: 'delete',
    //                 url: `api/places/${id}`,
    //                 baseURL: baseURLGeoref,
    //                 headers: { Authorization: `Api-Key ${georefApiKey}` }
    //             })

    //             // getReports()
    //         } catch (e) {
    //             throw new Error(e)
    //         }
    //     };


    // // Editar GeoReporte
    //     const showDetailReport:Function = (row: any) => {
    //         // const selectedReport = reports.filter(report => report.id === row.id)
    //         // setSelectedReportInfo(selectedReport[0])
    //         setShowReportDetails(true)
    //         setDetailReadOnly(false)
    //     };




export default function CreateGeoLocation(props:Props) {

    const {
        getGeoCatalogs,
        setShowReportDetails,
        setSelectedReportInfo,
        setDetailReadOnly,
        setShowLoader,
        showReportDetails,
        selectedReportInfo,
        detailReadOnly,
        showLoader,
        getReports
    } = props;

        const openCreateModal = () => {
            setDetailReadOnly(false)
            setShowReportDetails(true)
            setSelectedReportInfo([])
        }
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
                getGeoCatalogs();
                setShowReportDetails(false);
                getReports();
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
                getGeoCatalogs();
                setShowReportDetails(false)
                getReports();
            }
        };
    return (
        <span>
            <Loader show={showLoader} />
            <FontAwesomeIcon onClick={openCreateModal} size='2x' icon={faPlusCircle} style={{color: 'green', margin: '0.5em', cursor: 'pointer', verticalAlign: 'middle'}} />
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
        </span>
    );
};

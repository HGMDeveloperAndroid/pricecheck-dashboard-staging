import React, { useEffect, SyntheticEvent,useState } from 'react'

import { PrimaryButton, SecondaryButton } from '../buttons'
import { ToggleSwitch} from '../toggleSwitch';
import styles from './advanced-search.module.scss'
import ExportButton from '../exportButton/ExportButton';
import CreateGeoLocation from '../GeoLocation/CreateGeoLocation';
import api from '../../utils/api';
import {baseURLGeoref, georefApiKey} from '../../utils/baseUrl';
import { Dropdown } from '../../components/dropdown';
import { getI18nLabel } from '../../i18n';

type Props = {
    placeholder?: string,
    onSearch: Function,//--
    onClear: Function,//--
    children: any,
    inputSearchValue: string,//--
    onChangeInputSearch: Function,//--
    onDownload?: Function,
    showCompare?: boolean,//--
    onCompare?: Function,//--
    filterDownloadGeo?:any,
    checkedGeo?:boolean,
    setCheckedGeo?:Function,
    geolocationIdToggle?:string,
    setGeolocationIdToggle?:Function,
    optionsGeoCatalog?: { value: any, label: string }[],
    getGeoCatalogs?:Function,
    showGeoref?: boolean,
    locale?: string,
}

export default function AdvanceSearch(props: Props) {
    const {
        placeholder,
        onSearch,
        onClear,
        inputSearchValue,
        onChangeInputSearch,
        onDownload,
        onCompare,
        showCompare = false,
        filterDownloadGeo,
        checkedGeo,
        setCheckedGeo,
        geolocationIdToggle,
        setGeolocationIdToggle,
        optionsGeoCatalog,
        getGeoCatalogs,
        showGeoref,
        locale,
        } = props;

    const [showReportDetails, setShowReportDetails] = useState(false)
    const [selectedReportInfo, setSelectedReportInfo] = useState([])
    const [detailReadOnly, setDetailReadOnly] = useState(true)
    const [showLoader, setShowLoader] = useState(false)
    const [reports, setReports] = useState([]);
    useEffect( ()  =>  {
        getReports();
    }, []);

    function search(e: SyntheticEvent) {
        e.preventDefault()
        onSearch()
    }
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
        console.log('newReportsArray',newReportsArray);
        setReports(newReportsArray)
    }
    const deleteReport = async (id: number) => {
        // Elimina geoReporte
        console.log('id',id);
            try {
                await api({
                    method: 'delete',
                    url: `api/places/${id}`,
                    baseURL: baseURLGeoref,
                    headers: { Authorization: `Api-Key ${georefApiKey}` }
                })
            } catch (e) {

            }finally{
                getGeoCatalogs();
                getReports();
                // cargar el idtoggle = fisrt report id
                // setGeolocationIdToggle(reports[0].id);
                console.log('Delete-geolocationidToggle',geolocationIdToggle);

            }

        };
    // Editar GeoReporte
    const showDetailReport = (id: number) => {
        getReports();
        console.log('showDetailReport');
        console.log('id',id);
        console.log('reports',reports);
        const selectedReport = reports.filter(report => report.id == id);
        console.log('lenght',selectedReport.length);
        selectedReport.length > 0 ?
        setSelectedReportInfo(selectedReport[0]) :
        setSelectedReportInfo(reports[0]) ;
        console.log('reportsinfo',selectedReportInfo);
        console.log('selected',selectedReport);

        setShowReportDetails(true)
        setDetailReadOnly(false)
        getGeoCatalogs();
    };

    return (
        <form className={styles.container} onSubmit={search}>
            <div className={styles.simpleSearchContainer}>
                <input
                    className={styles.inputSearch}
                    value={inputSearchValue}
                    onChange={(e) => onChangeInputSearch(e)}
                    type="text"
                    placeholder={placeholder || getI18nLabel(locale, 'advancedSearch.filters.searchField')}
                />

                <div className={styles.btnSearchContainer}>
                    <PrimaryButton
                        label={getI18nLabel(locale, 'advancedSearch.actions.search')}
                        type="submit"
                    />
                </div>
            </div>

            <div className={styles.advanceFiltersContainer}>
                <div className={styles.filtersContainer}>
                    {props.children}
                </div>

                <div className={styles.btnClearContainer}>
                    <SecondaryButton
                        label={getI18nLabel(locale, 'advancedSearch.actions.cleanFilter')}
                        onClick={() => onClear()}
                    />

                    <div className={styles.space}></div>
                    {
                        !checkedGeo ?
                        <SecondaryButton
                            label={getI18nLabel(locale, 'advancedSearch.actions.download')}
                            onClick={() => onDownload()}
                        /> :
                        <ExportButton csvData={filterDownloadGeo} fileName={'Report.csv'} />
                    }

                    <div className={styles.space}></div>

                    {showCompare &&
                        <SecondaryButton
                            label={getI18nLabel(locale, 'advancedSearch.actions.comparativeChart')}
                            onClick={() => onCompare()}
                        />
                    }

                    {
                        checkedGeo !== undefined ?
                            <>
                            <div className={styles.geoToggle}>
                                <ToggleSwitch optionLabels={[
                                    getI18nLabel(locale, 'advancedSearch.actions.georeference'),
                                    getI18nLabel(locale, 'advancedSearch.actions.georeference'),
                                ]} name="switch" id="switch" checked={checkedGeo} onChange={setCheckedGeo} />
                                {checkedGeo ?
                                    <CreateGeoLocation
                                    getGeoCatalogs={getGeoCatalogs}
                                    setShowReportDetails={setShowReportDetails}
                                    setSelectedReportInfo={setSelectedReportInfo}
                                    setDetailReadOnly={setDetailReadOnly}
                                    setShowLoader={setShowLoader}
                                    showReportDetails={showReportDetails}
                                    selectedReportInfo={selectedReportInfo}
                                    detailReadOnly={detailReadOnly}
                                    showLoader ={showLoader}
                                    getReports = { getReports }
                                    />
                                    :''
                                }
                            </div>

                                {
                                checkedGeo ?
                                    <div>
                                        <div className={styles.geoSelect}>
                                        <Dropdown title={"Geolocalizaciones"}
                                            options={optionsGeoCatalog}
                                            showReport={setGeolocationIdToggle}
                                            deleteReport={deleteReport}
                                            showDetailReport= {showDetailReport}
                                        />
                                        </div>
                                    </div>
                                : ''
                                }
                            </>
                        : ''
                    }
                </div>
            </div>
        </form>
    )
}


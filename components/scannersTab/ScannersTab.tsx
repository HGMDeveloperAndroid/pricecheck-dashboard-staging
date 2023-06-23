import React, { Component, SyntheticEvent } from 'react';
import { PrimaryButton, SecondaryButton } from '../buttons';
import Link from 'next/link';

import { Input } from '../input';
import { Table } from '../table';
import SelectSearch from '../selectSearch/SelectSearch';

import api from '../../utils/api'
import { getMissionsCatalogByMission } from '../../utils/catalogs';
import { validateSession, getHeader } from '../../utils/session-management'

import s from './scannersTab.module.scss'
import { Checkbox } from '../checkbox';

import Datepicker from '../datepicker/datepicker'
import { getI18nLabel, translateTableHeader } from '../../i18n';

type SearchScanner = {
    from: string,
    to: string,
    textSearch: string,
    perPage: string,
    locale?: string,
}

type searchScannerData = {
    id: number,
    employee_number: number,
    fullname: string,
    totalScanners: number,
    missions: Mission,
    totalValid: number,
    efficiency: number,
}

type Mission = {
    id: string,
    title: string,
}

const emptySearchScanner = {
    from: '',
    to: '',
    textSearch: '',
    perPage: '',
}

export default class ScannersTab extends Component<any, any> {
    state = {
        count: 0,
        currentPage: 0,
        total: 0,
        totalPage: 0,
        regionList: [],
        missionList: [],
        mission: null,
        searchScanner: emptySearchScanner,
        searchScanners: [],
        startDateErrorMsg: '',
        inputValueFilter: '',
        order: 'desc',
        header: [
            {
                label: 'Posición',
                key: 'ranking',
            },
            {
                label: 'No. de empleado',
                key: 'employee_number',
            },
            {
                label: 'Nombre',
                key: 'name',
            },
            {
                label: 'Porcentaje',
                key: 'efficiency',
            },
            {
                label: 'Capturas validadas',
                key: 'validated_captures',
            },
            {
                label: 'Puntos',
                key: 'points',
            },
        ]
    }

    searchTimeout = null;

    async componentDidMount() {
        validateSession()
        this.handleInputChange('')
        this.search(1)
    }

    searchScannerHandler = (e: SyntheticEvent) => {
        const searchScanner = {
            ...this.state.searchScanner,
            textSearch: (e.target as HTMLInputElement).value,
        }

        this.setState({ searchScanner }, () => {
            clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(() => {
                this.search(1)
            }, 1000)
        })
    }

    validateEndDate = () => {
        if (this.validateDate(this.state.searchScanner)) {
            this.setState({ startDateErrorMsg: '' }, () => this.search(1))
        }
    }

    missionHandler = (e: any) => {
        const missionId = e.value
        this.setState({ mission: missionId }, () => this.search(1))
    }

    handleInputChange = async (inputValue: string) => {
        return getMissionsCatalogByMission(inputValue)
    }

    search = async (page: number) => {
        const searchScanner = this.state.searchScanner

        try {
            const headers = {
                ...getHeader(),
                'content-type': 'multipart/form-data',
            }

            const form_data = new FormData();

            form_data.append('region', '')
            form_data.append('mission', this.state.mission !== null ? this.state.mission : '')
            form_data.append('to', this.formatDate(searchScanner.to))
            form_data.append('from', this.formatDate(searchScanner.from))
            form_data.append('textSearch', searchScanner.textSearch)
            form_data.append('perPage', searchScanner.perPage)
            form_data.append('sort', this.state.order)

            const response = await api.post(
                `api/reports/ranking-efficiency?page=${page}`,
                form_data,
                { headers },
            )

            if (response.data.data.length > 0) {
                const { order } = this.state
                const pagination = response.data.pagination

                const start = order === 'desc' ?
                    ((pagination.current_page - 1) * pagination.per_page) + 1 :
                    (pagination.total - ((pagination.current_page - 1) * pagination.per_page))

                const searchScanners = response.data.data.map(
                    (searchScanner: searchScannerData, i: number) => (
                        {
                            ...searchScanner,
                            ranking: order === 'desc' ? start + i : start - i,
                            efficiency: `${(Math.round(searchScanner.efficiency * 100)) / 100}%`
                        }
                    )
                )

                this.setState({
                    searchScanners,
                    total: pagination.total,
                    currentPage: pagination.current_page,
                    count: pagination.count,
                    totalPage: pagination.total_pages,
                })
            } else if (response.data.data.length === 0) {
                this.setState({ searchScanners: [] })
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    validateDate = (searchScanner: SearchScanner): boolean => {
        let isValid = true
        let startDateErrorMsg = ''

        const start = new Date(searchScanner.from).getTime();
        const end = new Date(searchScanner.to).getTime();

        if (start - end > 0) {
            startDateErrorMsg = 'La fecha de inicio no es válida'
        }

        if (startDateErrorMsg.length > 0) {
            isValid = false
        }

        this.setState({ startDateErrorMsg })

        return isValid
    }

    setSortDirection = (e: SyntheticEvent) => {
        const checked = (e.target as HTMLInputElement).checked
        const next = checked ? 'asc' : 'desc'

        this.setState({ order: next }, () => this.search(1))
    }

    clearDateSelection = () => {
        this.setState({
            searchScanner: {
                ...emptySearchScanner,
                from: '',
                to: '',
            },
        }, () => this.search(1))
    }

    formatDate(date) {
        if (date) {
            date = new Date(date);

            let month = '' + (date.getMonth() + 1);
            let day = '' + date.getDate();
            let year = date.getFullYear();

            if (month.length < 2) {
                month = '0' + month;
            }

            if (day.length < 2) {
                day = '0' + day;
            }

            return `${year}-${month}-${day}`;
        }

        return ''
    }

    startDateHandler = (date: any) => {
        let {searchScanner} = this.state;

        searchScanner = {
            ...searchScanner,
            from: date
        }

        if (this.validateDate(searchScanner)) {
            this.setState({
                searchScanner,
                startDateErrorMsg: '',
            }, () => {
                if (searchScanner.to) {
                    this.search(1)
                }
            })
        }
    }

    endDateHandler = (date: any) => {
        let {searchScanner} = this.state;

        searchScanner = {
            ...searchScanner,
            to: date,
        }

        if (this.validateDate(searchScanner)) {
            this.setState({
                searchScanner,
                startDateErrorMsg: '',
            }, () => {
                if (searchScanner.from) {
                    this.search(1)
                }
            })
        }
    }

    render() {
        const {
            count,
            currentPage,
            order,
            total,
            totalPage,
            searchScanner,
            searchScanners,
            startDateErrorMsg,
        } = this.state

        const { locale } = this.props

        const header = translateTableHeader(locale, this.state.header, 'scannersTab.table.header')

        return (
            <div>
                <div className="row">
                    <div className="row width70" style={{ flexDirection: 'column' }}>
                        <div className="row">
                            <div className="width30">
                                <Datepicker
                                    label={getI18nLabel(locale, 'scannersTab.startDate')}
                                    selected={searchScanner.from}
                                    onSelect={this.startDateHandler}
                                    placeholder='dd/mm/yyyy'
                                    dateFormat='dd/MM/yyyy'
                                    errorMsg={startDateErrorMsg}
                                />
                            </div>

                            <div className="width30">
                                <Datepicker
                                    label={getI18nLabel(locale, 'scannersTab.endDate')}
                                    selected={searchScanner.to}
                                    onSelect={this.endDateHandler}
                                    placeholder='dd/mm/yyyy'
                                    dateFormat='dd/MM/yyyy'
                                />
                            </div>

                            <div className="width30">
                                <SecondaryButton
                                    label={getI18nLabel(locale, 'scannersTab.options.clearDate')}
                                    onClick={this.clearDateSelection}
                                />
                            </div>
                        </div>

                        <br/>

                        <div className="row">
                            <div className="width45">
                                <Input
                                    defaultValue={searchScanner.textSearch}
                                    type="Text"
                                    placeholderOverLabel
                                    onChange={this.searchScannerHandler}
                                    placeholder={getI18nLabel(locale, 'scannersTab.input.search.placeholder')}
                                />
                            </div>

                            <div className="width20">
                                <SelectSearch
                                    noLabel
                                    label="Misión"
                                    optionFunction={this.handleInputChange}
                                    onChange={this.missionHandler}
                                    placeholder={getI18nLabel(locale, 'scannersTab.input.mission.placeholder')}
                                />
                            </div>

                            <div className="width15">
                            </div>
                        </div>
                    </div>

                    <div className="width20">
                        <div className={s.medalLink}>
                            <Link href="/positions">
                                <a>
                                    <img
                                        src="/img/1place.svg"
                                        alt="Posiciones"
                                        title="Posiciones"
                                    />
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={s.tableContainer}>
                    <Table
                        count={count}
                        bodyData={searchScanners}
                        header={header}
                        onNextPage={() => this.search(currentPage + 1)}
                        onPrevPage={() => this.search(currentPage - 1)}
                        currentPage={currentPage}
                        total={total}
                        totalPage={totalPage}
                    />
                </div>
            </div>
        );
    }
}

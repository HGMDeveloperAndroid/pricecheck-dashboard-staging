import React, { Component } from 'react';

import { Input } from '../input';
import { PrimaryButton, SecondaryButton } from '../buttons';
import { TableComplex } from '../table';
import { validateSession, getHeader } from '../../utils/session-management';
import api from '../../utils/api';
import { getMissionsCatalogByMission } from '../../utils/catalogs';
import SelectSearch from '../selectSearch/SelectSearch';
import { getI18nLabel, translateTableComplexHeader } from '../../i18n';

import s from './validatorsTab.module.scss'

import Datepicker from '../datepicker/datepicker'

type RankingValidator = {
    from: string,
    to: string,
    textSearch: string,
    perPage: string,
    locale?: string,
}

type RankingValidatorData = {
    id: number,
    employee_number: number,
    fullname: string,
    userValidates: number,
    efficiency: number,
}

const emptyRankingValidator = {
    from: '',
    to: '',
    textSearch: '',
    perPage: '',
}

export default class ValidatorsTab extends Component<any, any> {
    header = [
        {
            title: 'Núm de empleado',
            isHidedable: false,
            name: 'employee_number',
            type: 'number',
        },
        {
            title: 'Nombre',
            isHidedable: false,
            name: 'fullName',
            type: 'text',
        },
        {
            title: 'Porcentaje',
            isHidedable: false,
            name: 'efficiency',
            type: 'text',
        },
        {
            title: 'Capturas validadas',
            isHidedable: false,
            name: 'userValidates',
            type: 'number',
        },
    ]

    state = {
        count: 0,
        currentPage: 0,
        total: 0,
        totalPage: 0,
        rankingValidator: emptyRankingValidator,
        rankingValidators: [],
        startDateErrorMsg: '',
        totalScanHist: '',
        validScanHist: '',
        totalScan: '',
        validScan: '',
        mission: null,
    }

    async componentDidMount(){
        validateSession()
        this.loadData(1)
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

    loadData = async (page: number) =>{
        const rankingValidator = this.state.rankingValidator
        if(this.validateDate(rankingValidator)){
            try{
                const headers = {
                    ...getHeader(),
                    'content-type': 'multipart/form-data'
                }

                let form_data = new FormData();
                form_data.append('mission', `${this.state.mission !== null ? this.state.mission : ''}`)
                form_data.append('to', this.formatDate(rankingValidator.to))
                form_data.append('from', this.formatDate(rankingValidator.from))
                form_data.append('textSearch', rankingValidator.textSearch)
                form_data.append('perPage', rankingValidator.perPage)

                const response = await api.post(`api/reports/ranking-validators?page=${page}`, form_data, { headers })
                if(response.data.data) {
                    const {pagination, data} = response.data;
                    const {users, scans} = data;

                    const rankingValidators = users.map((rankingValidator: RankingValidatorData) => {
                        const efficiency = (Math.round(rankingValidator.efficiency * 100)) / 100;

                        return {
                            ...rankingValidator,
                            efficiency: `${efficiency}%`,
                            fullName: rankingValidator.fullname,
                        }
                    })

                    this.setState({
                        rankingValidators,
                        total: pagination.total,
                        currentPage: pagination.current_page,
                        count: pagination.count,
                        totalPage: pagination.total_pages,
                        totalScan: scans.filtered,
                        totalScanHist: scans.total,
                        validScan: scans.filtered_validated,
                        validScanHist: scans.validated,
                    })
                }else if(response.data.data.length === 0){
                    this.setState({ rankingValidators: [] })
                }
            }catch(e){
            }
        }
    }

    startDateHandler = (date: any) => {
        let {rankingValidator} = this.state;

        rankingValidator = {
            ...rankingValidator,
            from: date
        }

        if (this.validateDate(rankingValidator)) {
            this.setState({
                rankingValidator,
                startDateErrorMsg: '',
            }, () => {
                if (rankingValidator.to) {
                    this.loadData(1)
                }
            })
        }
    }

    endDateHandler = (date: any) => {
        let {rankingValidator} = this.state;

        rankingValidator = {
            ...rankingValidator,
            to: date,
        }

        if (this.validateDate(rankingValidator)) {
            this.setState({
                rankingValidator,
                startDateErrorMsg: '',
            }, () => {
                if (rankingValidator.from) {
                    this.loadData(1)
                }
            })
        }
    }

    searchTimeout = null;

    searchValidatorHandler = (e: any) => {
        const rankingValidator = {
            ...this.state.rankingValidator,
            textSearch: e.target.value
        }

        this.setState({ rankingValidator }, () => {
            this.searchTimeout = setTimeout(() => {
                this.loadData(1)
            }, 1000)
        })
    }

    missionHandler = (e: any) => {
        const missionId = e.value
        this.setState({ mission: missionId }, () => {
            this.loadData(1)
        })
    }

    handleInputChange = async (inputValue: string) => {
        return getMissionsCatalogByMission(inputValue)
    }

    validateDate = (rankingValidator: RankingValidator): boolean => {
        let isValid = true
        let startDateErrorMsg = ''

        const start = new Date(rankingValidator.from).getTime()
        const end = new Date(rankingValidator.to).getTime()

        if (start > end) {
            startDateErrorMsg = 'La fecha de inicio no es válida'
        }

        if (startDateErrorMsg.length > 0) {
            isValid = false
        }

        this.setState({ startDateErrorMsg })

        return isValid
    }

    clearDateSelection = () => {
        this.setState({
            rankingValidator: {
                ...emptyRankingValidator,
                from: '',
                to: '',
            },
        }, () => this.loadData(1))
    }

    render() {
        const {
            count,
            currentPage,
            total,
            totalPage,
            rankingValidator,
            rankingValidators,
            startDateErrorMsg,
            totalScan,
            totalScanHist,
            validScan,
            validScanHist,
        } = this.state
        const { locale } = this.props

        this.header = translateTableComplexHeader(locale, this.header, 'validatorsTab.table.header')

        return (
            <div>
                <div className="row width70" style={{alignItems: 'flex-end'}}>
                    <div className="width30">
                        <Datepicker
                            label={getI18nLabel(locale, 'validatorsTab.startDate')}
                            selected={rankingValidator.from}
                            onSelect={this.startDateHandler}
                            placeholder='dd/mm/yyyy'
                            dateFormat='dd/MM/yyyy'
                            errorMsg={startDateErrorMsg}
                        />
                    </div>

                    <div className="width30">
                        <Datepicker
                            label={getI18nLabel(locale, 'validatorsTab.endDate')}
                            selected={rankingValidator.to}
                            onSelect={this.endDateHandler}
                            placeholder='dd/mm/yyyy'
                            dateFormat='dd/MM/yyyy'
                            errorMsg={startDateErrorMsg}
                        />
                    </div>

                    <div className="width30">
                        <SecondaryButton
                            label={getI18nLabel(locale, 'validatorsTab.options.clearDate')}
                            onClick={this.clearDateSelection}
                        />
                    </div>
                </div>

                <br />

                <div className="row width70">
                    <div className="width45">
                        <Input
                            defaultValue={rankingValidator.textSearch}
                            type="text"
                            placeholderOverLabel
                            onChange={this.searchValidatorHandler}
                            placeholder={getI18nLabel(locale, 'validatorsTab.input.search.placeholder')}
                        />
                    </div>

                    <div className="width45 row">
                        <PrimaryButton
                            label={getI18nLabel(locale, 'validatorsTab.options.generateData')}
                            onClick={() => this.loadData(1)}
                        />
                    </div>
                </div>

                <br />

                <div className="row width70">
                    <div className="width45">
                        <SelectSearch
                            noLabel
                            label={getI18nLabel(locale, 'validatorsTab.input.mission.placeholder')}
                            optionFunction={this.handleInputChange}
                            onChange={this.missionHandler}
                            placeholder={getI18nLabel(locale, 'validatorsTab.input.mission.placeholder')}
                        />
                    </div>
                </div>

                <div className={s.statsContainer}>
                    <div>
                        <p>{getI18nLabel(locale, 'validatorsTab.total.captures')}</p>
                        <p>{ totalScan }</p>
                    </div>

                    <div>
                        <p>{getI18nLabel(locale, 'validatorsTab.total.validated')}</p>
                        <p>{ validScan }</p>
                    </div>

                    <div>
                        <p>{getI18nLabel(locale, 'validatorsTab.history.captures')}</p>
                        <p>{ totalScanHist }</p>
                    </div>

                    <div>
                        <p>{getI18nLabel(locale, 'validatorsTab.history.validated')}</p>
                        <p>{ validScanHist }</p>
                    </div>
                </div>

                <div className={s.tableContainer}>
                    <TableComplex
                        count={count}
                        content={rankingValidators}
                        header={this.header}
                        changePageNext={() => this.loadData(currentPage + 1)}
                        changePagePrev={() => this.loadData(currentPage - 1)}
                        currentPage={currentPage}
                        onClickDetails={() => {}}
                        total={total}
                        totalPage={totalPage}
                        actions={[]}
                    />
                </div>
            </div>
        );
    }
}

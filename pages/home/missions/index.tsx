import React, { PureComponent, SyntheticEvent } from 'react';
import Router, { useRouter } from 'next/router';

import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { Header } from '../../../components/header';
import { PrimaryButton, SecondaryButton } from '../../../components/buttons';
import { Table } from '../../../components/table';
import Modal from '../../../components/modal/Modal';
import { Input } from '../../../components/input';
import Tags from '../../../components/input/Tags';
import { getDarkTheme, validateSession, getHeader, IsCustomTheme, getTheme, getLocale } from '../../../utils/session-management'
import { getRegionsCatalog } from '../../../utils/catalogs'
import api from '../../../utils/api';
import DialogModal from '../../../components/modal/DialogModal';
import { PrimaryButtonVariant } from '../../../components/buttons/PrimaryButton';
import PageTitle from '../../../components/pageTitle/PageTitle';

import s from './missions.module.scss'
import { ContentRow } from '../../../@Types/table';
import { ToastContainer, toast } from 'react-nextjs-toast';
import { parse } from 'date-fns';
import { getI18nLabel, translateTableHeader } from '../../../i18n';
import { buildTheme } from '../../../utils/theme';

type Mission = {
    title: string,
    description: string,
    start_date: string,
    end_date: string,
    regions?: number[],
    capture_points: number,
    mission_points: number,
    scans: boolean,
}

type MissionData = {
    id: number,
    title: string,
    description: string,
    start_date: string,
    end_date: string,
    regions: Region[],
    regionsId?: number[],
    capture_points: number,
    mission_points: number,
    scans: boolean;
}

type Region = {
    id: number,
    name: string,
    short_name: string,
}

type Tag = {
    id: number,
    label: string,
}

const emptyMission = {
    id: 1,
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    regions: [],
    capture_points: 1,
    mission_points: 0,
    scans: false,
}

class MissionsPage extends PureComponent<any, any> {
    header = [
        {
            key: 'title',
            label: 'Título',
        },
        {
            key: 'description',
            label: 'Descripción',
        },
        {
            key: 'capture_points',
            label: 'Puntos por capturas',
        },
        {
            key: 'mission_points',
            label: 'Puntos por misión',
        },
        {

            key: 'start_date',
            label: 'Fecha de inicio',
        },
        {
            key: 'end_date',
            label: 'Fecha de fin',
        },
        {
            key: 'regions',
            label: 'Región',
        },
    ]

    state = {
        currentPage: 0,
        totalPage: 0,
        perPage: 0,
        total: 0,
        count: 0,
        showModal: false,
        regionList: [],
        mission: emptyMission,
        missionEdited: emptyMission,
        missions: [],
        tagList: [],
        titleErrorMsg: '',
        descriptionErrorMsg: '',
        capturePointsErrorMsg: '',
        missionPointsErrorMsg: '',
        endDateErrorMsg: '',
        regionErrorMsg: '',
        startDateErrorMsg: '',
        modalMissionId: null,
        isOpen: false,
        hasScans: false,

    }

    async componentDidMount() {
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
            document.querySelector('body').classList.remove('darkmode')
            document.querySelector('body').classList.add('custom');
        }

        validateSession()
        const regionList = await getRegionsCatalog()
        this.setState({ regionList })
        this.getMissionList(1)
    }

    getMissionList = async (page: number) => {
        try {
            const res = await api.get('api/missions', { headers: getHeader(), params: { page } })

            if (res.data.data.length > 0) {
                const pagination = res.data.pagination
                const missions = res.data.data.map((mission: MissionData) => {
                    const options: {} = { year: 'numeric', month: 'long', day: 'numeric' };
                    return {
                        ...mission,
                        start_date: new Date(mission.start_date).toLocaleDateString('es', options).replace(RegExp(' de ', 'g'), '/'),
                        end_date: new Date(mission.end_date).toLocaleDateString('es', options).replace(RegExp(' de ', 'g'), '/'),
                        regions: mission.regions.map((r: Region) => r.short_name).join(', '),
                        regionsId: mission.regions.map((r: Region) => {
                            return {
                                id: r.id,
                                label: r.short_name,
                            }
                        })
                    }
                })

                this.setState({
                    missions,
                    total: pagination.total,
                    currentPage: pagination.current_page,
                    count: pagination.count,
                    totalPage: pagination.total_pages,
                })
            } else if (res.data.length === 0) {
                this.setState({ missions: [] })
            }
        } catch (error) {
            // TODO: enviar notificación cuando falla al obtener las misiones
            throw new Error(error)
        }
    }

    titleHandler = (e: any) => {
        const mission = {
            ...this.state.mission,
            title: e.target.value,
        }

        this.setState({ mission })
    }

    descriptionHandler = (e: any) => {
        const mission = {
            ...this.state.mission,
            description: e.target.value,
        }

        this.setState({ mission })
    }

    startDateHandler = (e: any) => {
        const mission = {
            ...this.state.mission,
            start_date: e.target.value,
        }

        this.setState({ mission })
    }

    endDateHandler = (e: any) => {
        const mission = {
            ...this.state.mission,
            end_date: e.target.value,
        }

        this.setState({ mission })
    }

    missionPointsHandler = (e: any) => {
        const mission = {
            ...this.state.mission,
            mission_points: e.target.value,
        }

        this.setState({ mission })
    }

    capturePointsHandler = (e: any) => {
        const mission = {
            ...this.state.mission,
            capture_points: e.target.value,
        }

        this.setState({ mission })
    }

    addTag = (value: Tag) => {
        const tagList: Tag[] = this.state.tagList
        if (tagList.filter(e => e.id === value.id).length === 0) {
            tagList.push(value)
            this.setState({ tagList })
        }
    }

    deleteTag = (id: number) => {
        const tagList: Tag[] = this.state.tagList.filter((e: Tag) => e.id !== id)
        this.setState({ tagList })
    }

    createMission = async () => {
        const locale = getLocale()

        const mission = this.checkAndAddFields(this.state.mission)

        if (this.validateRequireFields(mission)) {
            try {
                const response = await api.post('api/missions/', mission, { headers: getHeader() })
                if (response.status === 201) {
                    this.setState({
                        mission: emptyMission,
                        showModal: false,
                        modalMissionId: null,
                        missionEdited: emptyMission,
                        tagList: [],
                    })
                    this.closeModal();
                    this.getMissionList(1)
                    toast.notify(getI18nLabel(locale, 'missions.toast.createMission.success.message'), {
                        title: getI18nLabel(locale, 'missions.toast.createMission.success.title'),
                        duration: 6,
                        type: "success"
                    })
                } else if (response.status === 200) {
                    this.closeModal();
                    if ('title' in response?.data['Validation errors']) {
                        toast.notify(getI18nLabel(locale, 'missions.toast.createMission.error.duplicatedMessage'), {
                            title: getI18nLabel(locale, 'missions.toast.createMission.error.title'),
                            duration: 6,
                            type: "error"
                        })
                    }
                }
            } catch (error) {
                toast.notify(getI18nLabel(locale, 'missions.toast.createMission.error.message'), {
                    title: getI18nLabel(locale, 'missions.toast.createMission.error.title'),
                    duration: 6,
                    type: "error"
                })
            }
        }
    }

    checkAndAddFields = (mission: MissionData): Mission => {
        const regions = this.state.tagList.map((t: { id: number }) => t.id)
        const res = {
            ...mission,
            regions,
        }

        delete res.regionsId
        delete res.scans

        return res
    }

    validateRequireFields = (mission: Mission): boolean => {
        const locale = getLocale()

        const REGULAR_EXP_AMOUNT = /(?:^\d{1,3}(?:,?\d{3})*(?:\.\d{2})?$)/

        let isValid = true
        let titleErrorMsg = ''
        let descriptionErrorMsg = ''
        let missionPointsErrorMsg = ''
        let capturePointsErrorMsg = ''
        let startDateErrorMsg = ''
        let endDateErrorMsg = ''
        let regionErrorMsg = ''

        const start = new Date(mission.start_date).getTime()
        const end = new Date(mission.end_date).getTime()

        const starValidate = parse(mission.start_date, 'yyyy-MM-dd', new Date());
        const yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);

        if (start - end > 0) {
            startDateErrorMsg = getI18nLabel(locale, 'missions.modal.input.startDate.validations.required')
        }
        if (new Date(starValidate) < new Date(yesterday)) {
            startDateErrorMsg = getI18nLabel(locale, 'missions.modal.input.startDate.validations.greaterThan')
        }
        if (!mission.start_date) {
            startDateErrorMsg = getI18nLabel(locale, 'missions.modal.input.startDate.validations.required')
        }
        if (!mission.end_date) {
            endDateErrorMsg = getI18nLabel(locale, 'missions.modal.input.endDate.validations.required')
        }
        if (!mission.regions.length) {
            regionErrorMsg = getI18nLabel(locale, 'missions.modal.input.region.validations.required')
        }
        if (!mission.title.trim()) {
            titleErrorMsg = getI18nLabel(locale, 'missions.modal.input.title.validations.required')
        }

        if (!mission.description.trim()) {
            descriptionErrorMsg = getI18nLabel(locale, 'missions.modal.input.description.validations.required')
        }
        if (mission.description.length < 5 ) {
            descriptionErrorMsg = getI18nLabel(locale, 'missions.modal.input.description.validations.minLength')
        }
        if (mission.description.length > 255 ) {
            descriptionErrorMsg = getI18nLabel(locale, 'missions.modal.input.description.validations.maxLength')
        }
        if (mission.capture_points.toString().match(REGULAR_EXP_AMOUNT) === null) {
            capturePointsErrorMsg = getI18nLabel(locale, 'missions.modal.input.capturePoints.validations.valid')
        }

        if (mission.mission_points.toString().match(REGULAR_EXP_AMOUNT) === null) {
            missionPointsErrorMsg = getI18nLabel(locale, 'missions.modal.input.missionPoints.validations.valid')
        }

        if (
            titleErrorMsg.length > 0 ||
            descriptionErrorMsg.length > 0 ||
            missionPointsErrorMsg.length > 0 ||
            capturePointsErrorMsg.length > 0 ||
            startDateErrorMsg.length > 0 ||
            endDateErrorMsg.length > 0 ||
            regionErrorMsg.length > 0
        ) {
            isValid = false
        }

        this.setState({
            titleErrorMsg,
            descriptionErrorMsg,
            missionPointsErrorMsg,
            capturePointsErrorMsg,
            startDateErrorMsg,
            regionErrorMsg,
            endDateErrorMsg,
        })

        return isValid
    }

    openModalDelete = () => {
        this.setState({ isOpen: true })
    }

    deleteMission = async (missionId: number, associatedScan: Boolean) => {
        if (associatedScan) {
            this.openModalDelete()
        } else {
            try {
                const response = await api.delete(`api/missions/${missionId}`, { headers: getHeader() })

                if (response.status === 204) {
                    this.getMissionList(1)
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    }

    openModalEditMission = (missionData: MissionData) => {
        const mission: Mission = {
            title: missionData.title,
            description: missionData.description,
            start_date: missionData.start_date,
            end_date: missionData.end_date,
            capture_points: missionData.capture_points,
            mission_points: missionData.mission_points,
            scans: missionData.scans,
        }

        this.setState({
            showModal: true,
            modalMissionId: missionData.id,
            mission,
            missionEdited: mission,
            tagList: missionData.regionsId,
            hasScans: missionData.scans,
        })
    }

    editMission = async () => {
        const mission = this.checkAndAddFields(this.state.mission)

        if (this.validateRequireFields(mission)) {
            try {
                await api.post(`api/missions/${this.state.modalMissionId}/update`, mission, { headers: getHeader() })

                this.setState({
                    showModal: false,
                    modalMissionId: null,
                    mission: emptyMission,
                    missionEdited: emptyMission,
                    tagList: [],
                    hasScans: false,
                })

                this.getMissionList(1)
            } catch (error) {
                throw new Error(error)
            }
        }
    }

    closeModal = () => {
        this.setState({
            showModal: false,
            modalMissionId: null,
            mission: emptyMission,
            missionEdited: emptyMission,
            tagList: [],
            hasScans: false,
            titleErrorMsg: '',
            descriptionErrorMsg: '',
            missionPointsErrorMsg: '',
            capturePointsErrorMsg: '',
            startDateErrorMsg: '',
            regionErrorMsg: '',
            endDateErrorMsg: '',
        })
    }

    editOrCreate = (e: SyntheticEvent) => {
        e.preventDefault()

        if (this.state.modalMissionId) {
            this.editMission()
        } else {
            this.createMission()
        }
    }

    createRowActions = (row: ContentRow) => {
        return [
            {
                icon: faPencilAlt,
                color: '#71A4E4',
                action: (mission: MissionData) => this.openModalEditMission(mission),
            },
            {
                icon: faTrashAlt,
                color: '#DE4747',
                action: (mission: MissionData) => this.deleteMission(mission.id, mission.scans),
            },
        ]
    }

    render() {
        const {
            currentPage,
            total,
            totalPage,
            count,
            showModal,
            isOpen,
            hasScans,
            regionList,
            mission,
            tagList,
            missions,
            modalMissionId,
            startDateErrorMsg,
            endDateErrorMsg,
            regionErrorMsg,
            descriptionErrorMsg,
            titleErrorMsg,
            capturePointsErrorMsg,
            missionPointsErrorMsg,
        } = this.state

        const locale = getLocale()

        this.header = translateTableHeader(locale, this.header, 'missions.table.head')

        const modalTitle = modalMissionId ? getI18nLabel(locale, 'missions.modal.edit.title') : getI18nLabel(locale, 'missions.modal.add.title')
        const modalButtom =modalMissionId ? getI18nLabel(locale, 'missions.modal.edit.title') : getI18nLabel(locale, 'missions.modal.add.title')

        return (
            <>
                <Header locale={locale}/>
                <div className={s.container}>
                    <PageTitle title={getI18nLabel(locale, 'missions.title')} />
                    <div className={s.addBtnContainer}>
                        <PrimaryButton
                            label={getI18nLabel(locale, 'missions.options.add')}
                            onClick={() => this.setState({ showModal: true })}
                        />
                    </div>

                    <Table
                        header={this.header}
                        bodyData={missions}
                        count={count}
                        currentPage={currentPage}
                        total={total}
                        onNextPage={() => this.getMissionList(currentPage + 1)}
                        onPrevPage={() => this.getMissionList(currentPage - 1)}
                        actions={this.createRowActions}
                        totalPage={totalPage}
                    />
                </div>

                <Modal
                    showModal={showModal} closeModal={this.closeModal}
                >
                    <form onSubmit={this.editOrCreate}>
                        <h2>{modalTitle}</h2>

                        <div className="width50">
                            <Input
                                type="text"
                                defaultValue={mission.title}
                                onChange={this.titleHandler}
                                placeholder={getI18nLabel(locale, 'missions.modal.input.title.label')}
                                errorMessage={titleErrorMsg}
                                disabled={hasScans}
                            />
                        </div>

                        <br />

                        <Input
                            type="text"
                            defaultValue={mission.description}
                            onChange={this.descriptionHandler}
                            placeholder={getI18nLabel(locale, 'missions.modal.input.description.label')}
                            errorMessage={descriptionErrorMsg}
                            maxLength={255}
                            disabled={hasScans}
                        />

                        <br />

                        <div className="row">
                            <div className="width45">
                                <Input
                                    type="date"
                                    defaultValue={mission.start_date}
                                    onChange={this.startDateHandler}
                                    placeholder={getI18nLabel(locale, 'missions.modal.input.startDate.label')}
                                    errorMessage={startDateErrorMsg}
                                    disabled={hasScans}
                                />
                            </div>

                            <div className="width45">
                                <Input
                                    type="date"
                                    defaultValue={mission.end_date}
                                    onChange={this.endDateHandler}
                                    errorMessage={endDateErrorMsg}
                                    placeholder={getI18nLabel(locale, 'missions.modal.input.endDate.label')}
                                />
                            </div>
                        </div>

                        <br />

                        <Tags
                            addOption={this.addTag}
                            deleteOption={this.deleteTag}
                            label={getI18nLabel(locale, 'missions.modal.input.region.label')}
                            optionList={regionList}
                            options={tagList}
                            isDisabled={hasScans}
                        />
                        {
                            regionErrorMsg && regionErrorMsg.length > 0 && (
                                <span style={{ color: '#DE4747' }}>{regionErrorMsg}</span>
                            )
                        }
                        <br />

                        <div className="row">
                            <div className="width45">
                                <Input
                                    type="text"
                                    defaultValue={mission.mission_points}
                                    onChange={this.missionPointsHandler}
                                    placeholder={getI18nLabel(locale, 'missions.modal.input.missionPoints.label')}
                                    errorMessage={missionPointsErrorMsg}
                                    disabled={hasScans}
                                />
                            </div>

                            <div className="width45">
                                <Input
                                    type="text"
                                    defaultValue={mission.capture_points}
                                    onChange={this.capturePointsHandler}
                                    placeholder={getI18nLabel(locale, 'missions.modal.input.capturePoints.label')}
                                    errorMessage={capturePointsErrorMsg}
                                    disabled={hasScans}
                                />
                            </div>
                        </div>

                        <br />

                        <div className={s.btnsContainer}>
                            <div className={s.btn}>
                                <SecondaryButton
                                    label={getI18nLabel(locale, 'missions.modal.edit.options.cancel')}
                                    onClick={() => this.closeModal()}
                                />
                            </div>

                            <div className={s.btn}>
                                <PrimaryButton
                                    label={modalButtom}
                                    type="submit"
                                />
                            </div>
                        </div>
                    </form>
                </Modal>

                <DialogModal
                    btnAcceptLabel={getI18nLabel(locale, 'missions.modal.dialog.options.acept')}
                    isOpen={isOpen}
                    message={getI18nLabel(locale, 'missions.modal.dialog.message')}
                    onClose={() => this.setState({ isOpen: false })}
                    btnAcceptType={PrimaryButtonVariant.Success}
                    onAccept={() => this.setState({ isOpen: false })} />
                <ToastContainer align="left" position="bottom" />
            </>

        );
    }
}

const withRouter = (props) => {
    const router = useRouter();

    return <MissionsPage {...props} router={router}/>
}

export default withRouter;

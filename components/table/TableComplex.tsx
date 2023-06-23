import React, { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCaretLeft,
    faCaretRight,
    faEye,
    faEyeSlash,
    faPercent,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { validateIsAnalyst } from '../../utils/session-management';
import { photoUrl } from '../../utils/photo_url'
import formatDate from '../../utils/format-date'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import Modal from '../modal/Modal'
import Checkbox from "../checkbox/Checkbox";

import styles from './table.module.scss'

type Props = {
    currentPage: number,
    count: number,
    total: number,
    totalPage: number,
    changePageNext: Function,
    changePagePrev: Function,
    header: { title: string, isHidedable: boolean, name: string, type: string, hide?: boolean }[],
    content: { [key: string]: any }[],
    actions: { action: Function, color: string, icon: IconProp}[],
    onClickDetails: Function,
    onChecked?: Function
    checkboxStyles?: string,
    textNotData?: string,
    reportDetails?: boolean,
    customClassName?: string,
}

const TableComplex = (props: Props) => {
    const {
        currentPage,
        totalPage,
        changePageNext,
        changePagePrev,
        header,
        content,
        actions,
        onClickDetails,
        onChecked = () => {},
        checkboxStyles,
        textNotData,
        reportDetails,
        customClassName,
    } = props

    const [headerList, setHeaderList] = useState(header)
    const [showModal, setShowModal] = useState(false)
    const [selectedImage, setSelectedImage] = useState('')
    const [isAnalyst, setIsAnalyst] = useState(false);

    useEffect(() => {
        setIsAnalyst(validateIsAnalyst());
    }, [])

    useEffect(() => {
        setHeaderList(headerList.map(h => {
            const hide = h.hide || false
            return {
                ...h,
                hide,
            }
        }))
    }, [header])

    const tableStyle = {
        width: header.length > 6 ? `${header.length * 10}em` : `100%`
    }

    const openModal = (imgUrl: string) => {
        setSelectedImage(imgUrl)
        setShowModal(true)
    }

    const getField = (fieldType: string, fieldName: string, row: any, isHidden: boolean | undefined) => {

        if (isHidden) {
            return ' '
        }

        const value = row[fieldName]

        switch (fieldType) {
            case 'text':
                return value ? value : null

            case 'img':
                return value ?
                    (
                        <img
                            style={{ cursor: 'pointer' }}
                            onClick={() => openModal(`${photoUrl}/${value}`)}
                            src={`${photoUrl}/${value}`}
                            width="50"
                            height="50"
                        />
                    ) : null
            case 'money':
                return value && !isNaN(value) ? `\$ ${parseFloat(value).toFixed(2)}` : '-'
            case 'date':
                return formatDate(value);
            case 'number':
                return value !== null && `${value}`.split('.').length > 1 ?
                    `${parseFloat(value).toFixed(2)}` :
                    value
            case 'checkbox':
                return (
                    <Checkbox
                        className={checkboxStyles}
                        checked={row.checked}
                        onChange={() => onChecked(row)}
                        label=""
                    />
                )
            case 'actions':
                return (
                    <div style={{ display: 'flex' }}>
                        {actions.map((ac, index) => (
                            <FontAwesomeIcon
                                key={index}
                                style={{ color:  isAnalyst ? '#d3d3d3' : ac.color, margin: '0.5em', cursor: 'pointer', pointerEvents: isAnalyst ? 'none' : 'auto' }}
                                icon={ac.icon}
                                onClick={() => ac.action(row)}
                            />
                        ))}
                    </div>
                )
            case 'id':
                return value ? (
                    <span>
                        <span
                            onClick={() => onClickDetails(value)}
                            className={styles.idClass}
                        >
                            {value}
                        </span>
                        {row['is_promotion'] ?
                            <FontAwesomeIcon className={styles.isPromo} icon={faPercent} /> :
                            ''}
                    </span>
                ): null
            default:
                return value
        }
    }

    const changeHideStatus = (fieldName: string, fieldTitle: string, hideField: boolean) => {
        const newHeader = headerList.map(e => {
            const hide = fieldName === e.name && fieldTitle === e.title ?
                hideField :
                e.hide

            return {
                ...e,
                hide,
            }
        })

        setHeaderList(newHeader)
    }

    const handleCloseModal = () => setShowModal(false)

    const tableClassName = customClassName ? `${styles.tableComplex} ${customClassName}` : styles.tableComplex

    return (
        <div className={tableClassName}>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        {headerList.map((op, index) => {
                            let propertyExist = false;
                            if (content.length) {
                                const scan = content[0];
                                propertyExist = scan[op.name] ? true : false;
                            }

                            if (op.type === 'actions' || op.type === 'checkbox') {
                                propertyExist = true;
                            }

                            if (op.title === 'Seleccionar' && reportDetails) {
                                return null
                            };
                            return propertyExist ? (
                                <th key={index}>
                                    {op.hide ? '' : op.title}
                                    {op.isHidedable ?
                                        <FontAwesomeIcon
                                            onClick={() => changeHideStatus(op.name, op.title, !op.hide)}
                                            className={styles.hide}
                                            icon={op.hide ? faEye : faEyeSlash}
                                        /> :
                                        ''}
                                </th>
                            ): <th key={index}>
                                {op.title}
                                </th>
                            ;
                        })}
                    </tr>
                </thead>

                <tbody>
                    {content.map((c, index) => (
                        <tr key={index}>
                            {headerList.map((ele,index) => {
                                if(c.status == 'Pendiente') {
                                    c.reviewed = ' - '
                                }

                                if (index === 0 && reportDetails) {
                                    return null
                                };

                                const field = getField(ele.type, ele.name, c, ele.hide);
                                return field ? (
                                    <td key={index}>
                                        {field}
                                    </td>
                                ):  <td key={index}>
                                        {'-'}
                                    </td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h4 className="text-center">
                { textNotData }
            </h4>

            <div className={styles.footer}>
                <p>
                    {currentPage > 1 && (
                        <a onClick={() => changePagePrev()} href="#">
                            <FontAwesomeIcon icon={faCaretLeft}/>
                            <FontAwesomeIcon icon={faCaretLeft}/>
                        </a>
                    )}

                    {totalPage > currentPage && (
                        <a onClick={() => changePageNext()} href="#">
                            <FontAwesomeIcon icon={faCaretRight}/>
                            <FontAwesomeIcon icon={faCaretRight}/>
                        </a>
                    )}
                </p>
            </div>

            <Modal
                noPadding={true}
                containerWidth="40%"
                showModal={showModal}
                closeModal={handleCloseModal}
            >
                <span onClick={() => setShowModal(false)} className={styles.modalImageClose}>
                    <FontAwesomeIcon icon={faTimesCircle}/>
                </span>

                <img src={selectedImage} alt="this is car image" className={styles.modalImage}/>
            </Modal>
        </div>
    )
}

TableComplex.defaultProps = {
    checkboxStyles: '',
    textNotData: '',
    customClassName: '',
}

export default TableComplex

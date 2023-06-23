import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getLocale } from '../../utils/session-management'
import { getI18nLabel } from '../../i18n'

import {
    faCaretLeft,
    faCaretRight,
    faSortDown,
    faSortUp,
} from '@fortawesome/free-solid-svg-icons'

import { Header, Action, ActionFunction, ContentRow } from '../../@Types/table';

import styles from './table.module.scss'

type Props = {
    bodyData: { [key: string]: any }[],
    header: Header[],
    actions?: any,
    currentPage: number,
    count: number,
    total: number,
    totalPage: number,
    onNextPage: Function,
    onPrevPage: Function,
}

export default function Table(props: Props) {
    const {
        bodyData,
        header,
        currentPage,
        totalPage,
        actions,
        onNextPage,
        onPrevPage,
    } = props

    const locale = getLocale()

    const totalLength = actions != null ? header.length + 1 : header.length

    const width = `${100 / totalLength}%`

    const tableStyle = {
        width: header.length > 8 ? `${header.length * 10}em` : `100%`
    }

    function createActionButtons(data) {
        return function(action, index) {
            let isBlocked = false;

            if (data.blocked_up && action.isBlocked === true) {
                isBlocked = true;
            }

            return (
                <FontAwesomeIcon
                    onClick={isBlocked ? () => {} : () => action.action(data)}
                    key={index}
                    icon={action.icon}
                    style={
                        {
                            color: (() => {
                                if (data.blocked_up && !action.enabled) {
                                    return '#d3d3d3'
                                }

                                return action.color;
                            })(),
                            cursor: (() => {
                                if (data.blocked_up && !action.enabled) {
                                    return 'not-allowed';
                                }

                                return 'pointer';
                            })(),
                            margin: '5px'
                        }
                    }
                />
            )
        }
    }

    return (
        <div className={styles.tableComplex}>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        {header.map((ele, index) => (
                            <th key={index} style={{ width }}>
                                <label>{ele.label}</label>
                                {ele.sort &&
                                    <FontAwesomeIcon
                                        onClick={() => ele.onSort(ele.order === 'desc'? 'asc' : 'desc')}
                                        className={styles.sortIcon}
                                        icon={ele.order === 'desc' ? faSortUp : faSortDown }
                                    />}
                            </th>
                        ))}
                        {
                            actions && actions.length && <th style={{ width }}>
                                {getI18nLabel(locale, 'table.actions')}
                            </th>
                        }
                    </tr>
                </thead>

                <tbody>
                    { bodyData.map((data, index) => (
                        <tr key={index} className={styles.row}>
                            {header.map((ele, index) => (
                                <td key={index} style={{ width }}>
                                    {data[ele.key] != 'null' ? (ele.key  === 'description' ? ( data[ele.key].length > 20 ?  data[ele.key].substring(0, 15) + "..." : data[ele.key]) : data[ele.key])  : ''}
                                </td>
                            ))}
                            <td>
                                {(typeof actions === 'function') ?
                                    actions(data as ContentRow).map(createActionButtons(data)) :
                                    Array.isArray(actions) && actions.length ?
                                    actions.map(createActionButtons(data)) :
                                    ''
                                }
                            </td>
                        </tr>
                    )) }
                </tbody>
            </table>

            <div className={styles.footer}>
                <p>
                    {currentPage > 1 && (
                        <a onClick={() => onPrevPage()} href="#">
                            <FontAwesomeIcon icon={faCaretLeft}/>
                            <FontAwesomeIcon icon={faCaretLeft}/>
                        </a>
                    )}

                    {totalPage > currentPage && (
                        <a onClick={() => onNextPage()} href="#">
                            <FontAwesomeIcon icon={faCaretRight}/>
                            <FontAwesomeIcon icon={faCaretRight}/>
                        </a>
                    )}
                </p>
            </div>
        </div>
    )
}

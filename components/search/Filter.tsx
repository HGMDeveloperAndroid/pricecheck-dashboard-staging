import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import styles from "./advanced-search.module.scss"

type Props = {
    children: any,
    label: string,
    showFilters?: boolean,
    floatWindow?: boolean,
}

const Filter = (props: Props) => {
    const {showFilters, floatWindow} = props
    const [showFilter, setShowFilters] = useState(showFilters)

    return (
        <div className={styles.filterContainer}>
            <span onClick={() => setShowFilters(!showFilter)} className={styles.label}>
                {props.label}
                {props.label && <FontAwesomeIcon icon={faCaretDown} />}
            </span>
            {
                showFilter &&
                <div className={floatWindow ? styles.hideContainer : styles.staticFilters}>
                    {props.children}
                </div>
            }

        </div>
    )
}

Filter.defaultProps = {
    showFilters : false,
    floatWindow: true
}

export default Filter

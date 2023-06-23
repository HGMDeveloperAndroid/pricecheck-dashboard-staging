import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Router from 'next/router'

import s from './goBack.module.scss'

const GoBack = () => {

    return (
    <div className={s.goBackContainer} onClick={() => Router.back()}>
        <FontAwesomeIcon className={s.icon} icon={faArrowLeft} />
    </div>
    )
}

export default GoBack
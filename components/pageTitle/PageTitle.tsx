import React from 'react'

import s from './pageTitle.module.scss'

type Props = {
    title: string
}

const PageTitle = ({title}: Props) => {
    return (
    <h1 className={s.title}>{title}</h1>
    )
}

export default PageTitle
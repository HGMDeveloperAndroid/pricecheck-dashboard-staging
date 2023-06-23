import React from 'react'

import s from './detailsContainer.module.scss'

type Props = {
    title?: string,
    children: any,
}

const DetailsContainer = ({title, children,}: Props) => {

    return (
        <div className={s.container}>
            <p className={s.title} >{title}</p>
            <div className={s.details}>
                {children}
            </div>
        </div>
    )
}

export default DetailsContainer

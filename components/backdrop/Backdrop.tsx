import React, { ReactChild } from 'react'

import styles from './backdrop.module.scss'

type Props = {
    display: string,
    children: ReactChild,
}

export default function Backdrop({ display, children }: Props) {
    return (
        <div style={{display}} className={styles.Backdrop}>
            {children}
        </div>
    )
}

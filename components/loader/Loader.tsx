import React from 'react'

import styles from './loader.module.scss'
import Backdrop from '../backdrop/Backdrop'

type Props = {
    show: boolean,
}

export default function Loader({ show }: Props) {
    const display = show ? 'block' : 'none'
    const style = { display }

    return (
        <div style={style}>
            <Backdrop display="show">
                <div className={styles.loaderContainer}>
                    <div className={styles.Loader}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </Backdrop>
        </div>
    )
}

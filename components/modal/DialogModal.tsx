import React from 'react'

import styles from './modal.module.scss'
import { SecondaryButton, PrimaryButton } from '../buttons'
import { PrimaryButtonVariant } from '../buttons/PrimaryButton'

type Props = {
    message: string,
    onAccept: Function,
    btnAcceptLabel: string,
    onClose: Function,
    isOpen: boolean,
    btnAcceptType?: PrimaryButtonVariant,
}

const DialogModal = (props: Props) => {

    const styleClose = props.isOpen ? {} : { display: 'none' }

    return (
        <div style={styleClose} className={styles.dialogModalContainer}>
            <div className={styles.dialogModalBg}></div>
            <div className={styles.dialogModal}>
                <p>{props.message}</p>
                <div className={styles.btnContainer}>
                    <div className={styles.btnClose}>
                        <SecondaryButton label="Cancelar" onClick={() => props.onClose()} />
                    </div>
                    <div className={styles.btnAccept}>
                        <PrimaryButton variant={props.btnAcceptType} label={props.btnAcceptLabel} onClick={() => props.onAccept()} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogModal

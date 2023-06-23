import React from 'react'
import Head from 'next/head'
import { Header } from '../../../../components/header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faSearch, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { PrimaryButton } from '../../../../components/buttons'

import styles from './labels.module.scss'
import { Input } from '../../../../components/input'
import { Table } from '../../../../components/table'

const LabelsPage = () => {

    const headerList = [
        {
            key: '',
            label: 'Etiqueta',
        },
        {
            key: '',
            label: 'Alias',
        },
    ]

    const actionList = [
        {
            icon: faPencilAlt,
            color: '#71A4E4',
            action: () => { },
        },
        {
            icon: faTrashAlt,
            color: '#DE4747',
            action: () => { },
        }
    ]

    return (
        <>
            <Head>
                <title>Catálogo de etiquetas</title>
            </Head>
            <Header />
            <div className={styles.header}>
                <div className={styles.titleContainer}>
                    <h2>
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={faTags} />
                        </div>
                         Catálogo de etiquetas</h2>
                </div>
                <div className={styles.leftContainer}>
                    <div className={styles.inputContainer}>
                        <Input type="text" onChange={() => { }} placeholder="Buscar una etiqueta" bgColor="transparent" placeholderOverLabel={true} icon={faSearch} />
                    </div>
                    <div className={styles.separator}></div>
                    <div className={styles.buttonContainer}>
                        <PrimaryButton label="Crear nueva etiqueta" onClick={() => { }} />
                    </div>
                </div>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.tableContainer}>
            </div>
        </>
    )
}

export default LabelsPage
import React from 'react'
import { CSVLink } from 'react-csv'

import styles from './exportButton.module.scss'

const  ExportReactCSV = ({csvData, fileName}) => {
    return (
        <button className= {styles.secondaryButton}>
            <CSVLink data={csvData} filename={fileName}>Exportar Datos Georeferencia</CSVLink>
        </button>
    )
}

export default ExportReactCSV;
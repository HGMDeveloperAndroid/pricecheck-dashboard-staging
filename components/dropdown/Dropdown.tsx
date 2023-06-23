import React from 'react'
import { faCaretDown, faCaretRight, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnEliminar from '../GeoLocation/BtnEliminar';
import BtnEditar from '../GeoLocation/BtnEditar';
import styles from  './dropdown.module.scss';

interface Props {
    title:String,
    options: any,
    showReport: Function,
    deleteReport: Function,
    showDetailReport: Function,
}

export default function Dropdown({ title, options, showReport, deleteReport, showDetailReport }: Props) {
    return(
        <div className={styles.navbar}>
            <div className={styles.dropdown}>
                <button className={styles.dropbtn}>{title}
                    <FontAwesomeIcon
                        style={{ cursor: 'pointer' }}
                        icon={faCaretDown}
                    />
                </button>
                <div className={styles.dropdown_content}>
                    {options.map(opt => (
                        <a>
                            <div className={styles.dropdown2}>
                                <button className={styles.dropbtn2}>{opt.label}
                                    <FontAwesomeIcon
                                        style={{ cursor: 'pointer' }}
                                        icon={faCaretRight}
                                    />
                                </button>
                                <div className={styles.dropdown_content2}>
                                    <button data-toggle='tooltip' title='Consultar' className={styles.btnConsulta} onClick={ () => showReport(opt.value)}  aria-label="consulta" type="button">
                                        <FontAwesomeIcon icon={faList} style={ {color:'#48A858', }} />
                                    </button>
                                    <BtnEditar geolocationId={opt.value} showDetailReport={() => showDetailReport(opt.value)} />
                                    <BtnEliminar geolocationId={opt.value} deleteReport={() => deleteReport(opt.value)}/>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

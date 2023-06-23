import React, { useEffect, useState } from 'react'
import {
    faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './createGeoLocation.module.scss';
import { validateIsAnalyst } from '../../utils/session-management';
type Props = {
    showDetailReport:Function,
    geolocationId:string,
}
export default function BtnEditar  (props:Props)  {
    const [isAnalyst, setIsAnalyst] = useState(false);
    const {
        showDetailReport,
        geolocationId,
    } = props;
    useEffect(() => {
        setIsAnalyst(validateIsAnalyst());
    }, [setIsAnalyst])

    return  <button data-toggle='tooltip' title='Editar' className={style.btnEditar} onClick={() => showDetailReport(geolocationId)}><FontAwesomeIcon icon={faPencilAlt} style={ {color:'#DE4747', }} /></button>
}

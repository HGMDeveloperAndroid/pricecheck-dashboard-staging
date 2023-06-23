import React, { useEffect, useState }  from 'react'
import {
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './createGeoLocation.module.scss';

import { validateIsAnalyst } from '../../utils/session-management';

type Props = {
    geolocationId:string,
    deleteReport:Function,
}
export default function BtnEditar  (props:Props)  {
    const [isAnalyst, setIsAnalyst] = useState(false);
    const {
        geolocationId,
        deleteReport
    } = props;

    useEffect(() => {
        setIsAnalyst(validateIsAnalyst());
    }, [setIsAnalyst])

    return <button disabled={isAnalyst} data-toggle='tooltip' title='Eliminar' className={style.btnEliminar} onClick={() => deleteReport(geolocationId)}  aria-label="delete"><FontAwesomeIcon  icon={faTrashAlt} style={ isAnalyst ? {color:'#D3D3D3', pointerEvents: 'none'} : {color:'#71A4E4', }}  /> </button>;
}

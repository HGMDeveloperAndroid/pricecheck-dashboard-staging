import React, { useState } from 'react';
import Modal from "../modal/Modal";
import Input from "../input/Input";
import s from "./reportDetails.module.scss";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import MapsGoogle from '../MapsGoogle/MapsGoogle';

type Props = {
  id?: number;
  location?: string;
  position1?: { latitude?: string; longitude?: string };
  position2?: { latitude?: string; longitude?: string };
  position3?: { latitude?: string; longitude?: string };
  position4?: { latitude?: string; longitude?: string };
  showModal?: boolean;
  toggleModal: Function;
  readOnly?: boolean;
  saveInfo: Function;
  cancel: Function;
};

const ReportDetails = (props: Props) => {

  const {
    showModal,
    toggleModal,
    readOnly,
    position1,
    position2,
    position3,
    position4,
    saveInfo,
    cancel,
    location,
    id
  } = props;

  const reportData = {
    id: id,
    name: location,
    position1: position1,
    position2: position2,
    position3: position3,
    position4: position4
  };
  const coordenadas = {
    id: id,
    name: location,
    position1: position1,
    position2: position2,
    position3: position3,
    position4: position4
  };

  const [report, setReportData] = React.useState(reportData);
  const [error, setError] = useState(false);
  const validateInfo = () => {
    if (report.name !== '') {
      setError(false);
      let newReport = {
        point1: `${report.position1.latitude}, ${report.position1.longitude}`,
        point2: `${report.position2.latitude}, ${report.position2.longitude}`,
        point3: `${report.position3.latitude}, ${report.position3.longitude}`,
        point4: `${report.position4.latitude}, ${report.position4.longitude}`,
        name: report.name,
      };
      saveInfo(newReport, report.id);
    } else {
      setError(true);
    }
  };

  const setChangeValue = (event, isLatitude, positionNumber) => {
    const {
      target: { value }
    } = event;
    const positionType = isLatitude ? "latitude" : "longitude";
    const positionName = `position${positionNumber}`;
    setReportData(prevState => {
      return {
        ...prevState,
        [positionName]: { ...prevState[positionName], [positionType]: value }
      };
    });
  };

  const setChangeName = event => {
    const {
      target: { value }
    } = event;
    setReportData(prevState => {
      return {
        ...prevState,
        name: value
      };
    });
  };
  const [showMapModal, setShowMapModal] = useState(false);
  // Cierra o abre el map y reinicia los valores
  const toggleMapModal = () => {
    setShowMapModal(!showMapModal);
    console.log('reportData', reportData);
  }
  //Solo cierra el modal y deja los valores del mapa
  const saveRectangleMap = () => {
    setShowMapModal(!showMapModal);
  }
  const setCoordsMap = (val:typeof coordenadas) => {
    setReportData(prevState => {
      return {
        ...prevState,
        position1: { ...prevState['position1'], latitude: val.position1.latitude, longitude: val.position1.longitude },
        position2: { ...prevState['position2'], latitude: val.position2.latitude, longitude: val.position2.longitude },
        position3: { ...prevState['position3'], latitude: val.position3.latitude, longitude: val.position3.longitude },
        position4: { ...prevState['position4'], latitude: val.position4.latitude, longitude: val.position4.longitude },
      };
    });
  }
  return (
    <div className={s.geolocalizationContainer}>
      <Modal showModal={showModal}>
        <p className={s.title}>Nuevo reporte georeferenciado <FontAwesomeIcon icon={faQuestionCircle} /></p>
        <p>Crear un nuevo reporte ingresando las coordenadas en el formulario, o bien, seleccionando un área sobre el mapa </p>
        <div className={s.pointContainer}>
          <div className={s.input}>
            <Input
              onChange={event => setChangeName(event)}
              placeholder="Nombre del Poligono"
              type="text"
              disabled={readOnly}
              defaultValue={report.name}
            ></Input>
          </div>
          <div className={s.input}>
            <PrimaryButton label="mostrar mapa" onClick={toggleMapModal} />
          </div>
        </div>
        <p className={s.subtitle}>Posición 1</p>
        <div className={s.pointContainer}>
          <div className={s.input}>
            <Input
              onChange={event => setChangeValue(event, true, 1)}
              placeholder="Latitud"
              inputPlaceholder='16.42000000'
              type="text"
              disabled={readOnly}
              defaultValue={report.position1.latitude}
            ></Input>
          </div>
          <div className={s.input}>
            <Input
              onChange={event => setChangeValue(event, false, 1)}
              placeholder="Longitud"
              inputPlaceholder='-94.96000000'
              type="text"
              disabled={readOnly}
              defaultValue={report.position1.longitude}
            ></Input>
          </div>
        </div>
        <p className={s.subtitle}>Posición 2</p>
        <div className={s.pointContainer}>
          <div className={s.input}>
            <Input
              onChange={event => setChangeValue(event, true, 2)}
              placeholder="Latitud"
              inputPlaceholder='16.42000000'
              type="text"
              disabled={readOnly}
              defaultValue={report.position2.latitude}
            ></Input>
          </div>
          <div className={s.input}>
            <Input
              onChange={event => setChangeValue(event, false, 2)}
              placeholder="Longitud"
              inputPlaceholder='-94.96000000'
              type="text"
              disabled={readOnly}
              defaultValue={report.position2.longitude}
            ></Input>
          </div>
        </div>
        <p className={s.subtitle}>Posición 3</p>
        <div className={s.pointContainer}>
          <div className={s.input}>
            <Input
              onChange={event => setChangeValue(event, true, 3)}
              placeholder="Latitud"
              inputPlaceholder='16.42000000'
              type="text"
              disabled={readOnly}
              defaultValue={report.position3.latitude}
            ></Input>
          </div>
          <div className={s.input}>
            <Input
              onChange={event => setChangeValue(event, false, 3)}
              placeholder="Longitud"
              inputPlaceholder='-94.96000000'
              type="text"
              disabled={readOnly}
              defaultValue={report.position3.longitude}
            ></Input>
          </div>
        </div>
        <p className={s.subtitle}>Posición 4</p>
        <div className={s.pointContainer}>
          <div className={s.input}>
            <Input
              onChange={event => setChangeValue(event, true, 4)}
              placeholder="Latitud"
              inputPlaceholder='16.42000000'
              type="text"
              disabled={readOnly}
              defaultValue={report.position4.latitude}
            ></Input>
          </div>
          <div className={s.input}>
            <Input
              onChange={event => setChangeValue(event, false, 4)}
              placeholder="Longitud"
              inputPlaceholder='-94.96000000'
              type="text"
              disabled={readOnly}
              defaultValue={report.position4.longitude}
            ></Input>
          </div>
        </div>
        {
          error && <span className={`d-flex w-100 my-2 ${s.errorMsg} input_errorMessage__16yxH`}>¡El nombre es requerido!</span>
        }
        <div className={s.actions}>
          {!readOnly && (
            <div className={s.btnContainer}>
              <PrimaryButton
                label="Guardar información"
                onClick={() => validateInfo()}
              />
            </div>
          )}
          {!readOnly && (
            <div className={s.btnContainer}>
              <SecondaryButton label="Cancelar" onClick={() => cancel()} />
            </div>
          )}
        </div>
      </Modal>
      <Modal showModal={showMapModal}>
        <div className='row justify-content-center'>
          <div className='col-12 justify-content-center'>
            {/* <img src='/img/coordenadas.jpg' className={s.reference}/> */}
            <MapsGoogle setCoordsMap={setCoordsMap} report={report} />
          </div>
          <div className={`col-12 ${s.modalButtonsContainer}`} >
            <SecondaryButton label="Cerrar" onClick={toggleMapModal} className={`${s.btnSm} ${s.bgWhite}`} />
            <PrimaryButton label="Guardar" onClick={saveRectangleMap} className={s.btnSm} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

ReportDetails.defaultProps = {
  id: 0,
  location: "",
  position1: [],
  position2: [],
  position3: [],
  position4: [],
  showModal: true,
  readOnly: true,
  saveInfo: () => { },
  cancel: () => { }
};

export default ReportDetails;

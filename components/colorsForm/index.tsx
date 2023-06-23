import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { buildStyle } from '../colorsForm/utils';
import styles from './colors.module.scss'
import { PrimaryButton, SecondaryButton } from '../buttons';
import { getDarkTheme, getHeader, getTheme, IsCustomTheme } from '../../utils/session-management';
import api from '../../utils/api';
import { toast } from 'react-nextjs-toast';
import FontSelect from '../fontSelect';
import { buildTheme } from '../../utils/theme';
import { useRouter } from 'next/router'
const ColorsForm = (props) => {
  const { closeModal } = props;
  const router = useRouter();
  const [font, setFont] = useState("Helvetica, sans-serif");
  const [settingsBackground, setSettingsBackground] = useState({ displayColorPicker: false, color: "#FFFF" });
  const [settingsTypo, setSettingsTypo] = useState({ displayColorPicker: false, color: "#FFFF" });
  const [settingsBtnP, setSettingsBtnP] = useState({ displayColorPicker: false, color: "#FFFF" });
  const [settingsBtnS, setSettingsBtnS] = useState({ displayColorPicker: false, color: "#FFFF" });
  const [settingsTxtP, setSettingsTxtP] = useState({ displayColorPicker: false, color: "#FFFF" });
  const [settingsTxtS, setSettingsTxtS] = useState({ displayColorPicker: false, color: "#FFFF" });
  const [isChecked, setIsChecked]: any = useState(false);
  // styles for pickers 
  const stylesBack = buildStyle(settingsBackground.color, '170px');
  const stylesTypo = buildStyle(settingsTypo.color, '170px');
  const stylesBtnP = buildStyle(settingsBtnP.color);
  const stylesBtnS = buildStyle(settingsBtnS.color);
  const stylesTxtP = buildStyle(settingsTxtP.color);
  const stylesTxtS = buildStyle(settingsTxtS.color);
  const [selectedFile, setSelectedFile]: any = useState(null);
  const handleFile = (event) => {

    setSelectedFile(event.target.files[0]);
  };

  const handleClickBackground = () => {
    setSettingsBackground({ ...settingsBackground, displayColorPicker: !settingsBackground.displayColorPicker })
  };
  const handleCloseBackground = () => {
    setSettingsBackground({ ...settingsBackground, displayColorPicker: false })
  };
  const handleChangeBackground = (color) => {
    setSettingsBackground({ ...settingsBackground, color: color.hex })
  };

  const handleClickTypo = () => {
    setSettingsTypo({ ...settingsTypo, displayColorPicker: !settingsTypo.displayColorPicker })
  };
  const handleCloseTypo = () => {
    setSettingsTypo({ ...settingsTypo, displayColorPicker: false })
  };
  const handleChangeTypo = (color) => {
    setSettingsTypo({ ...settingsTypo, color: color.hex })
  };

  const handleClickBtnP = () => {
    setSettingsBtnP({ ...settingsBtnP, displayColorPicker: !settingsBtnP.displayColorPicker })
  };
  const handleCloseBtnP = () => {
    setSettingsBtnP({ ...settingsBtnP, displayColorPicker: false })
  };
  const handleChangeBtnP = (color) => {
    setSettingsBtnP({ ...settingsBtnP, color: color.hex })
  };

  const handleClickBtnS = () => {
    setSettingsBtnS({ ...settingsBtnS, displayColorPicker: !settingsBtnS.displayColorPicker })
  };
  const handleCloseBtnS = () => {
    setSettingsBtnS({ ...settingsBtnS, displayColorPicker: false })
  };
  const handleChangeBtnS = (color) => {
    setSettingsBtnS({ ...settingsBtnS, color: color.hex })
  };

  const handleClickTxtP = () => {
    setSettingsTxtP({ ...settingsTxtP, displayColorPicker: !settingsTxtP.displayColorPicker })
  };
  const handleCloseTxtP = () => {
    setSettingsTxtP({ ...settingsTxtP, displayColorPicker: false })
  };
  const handleChangeTxtP = (color) => {
    setSettingsTxtP({ ...settingsTxtP, color: color.hex })
  };

  const handleClickTxtS = () => {
    setSettingsTxtS({ ...settingsTxtS, displayColorPicker: !settingsTxtS.displayColorPicker })
  };
  const handleCloseTxtS = () => {
    setSettingsTxtS({ ...settingsTxtS, displayColorPicker: false })
  };
  const handleChangeTxtS = (color) => {
    setSettingsTxtS({ ...settingsTxtS, color: color.hex })
  };
  const handleChangeTheme = (e?: any) => {
    setIsChecked(!isChecked)
    const next = isChecked ? 1 : 0

    if (!next) {
      document.querySelector('body').classList.add('darkmode');
      document.querySelector('body').classList.remove('custom');
    } else {
      document.querySelector('body').classList.remove('darkmode');
      document.querySelector('body').classList.add('custom');
    }

  }

  const onChangeTypo = (event) => {
    setFont(event.target.value);
  };

  useEffect(() => {

    api.get('/api/theme', { headers: getHeader() }).then(async (res) => {
      const theme = res && res.data && res.data.data && res.data.data
      setSettingsBackground({ ...settingsBackground, color: theme ? theme.wallpaper : "#FFFFF" })
      setSettingsTypo({ ...settingsTypo, color: theme ? theme.text : "#FFFFF" })
      setSettingsBtnP({ ...settingsBtnP, color: theme ? theme.primary_button : "#FFFFF" })
      setSettingsBtnS({ ...settingsBtnS, color: theme ? theme.secondary_button : "#FFFFF" })
      setSettingsTxtP({ ...settingsTxtP, color: theme ? theme.primary_text : "#FFFFF" })
      setSettingsTxtS({ ...settingsTxtS, color: theme ? theme.secondary_text : "#FFFFF" })
      setFont(theme && theme.font ? theme.font : "Arial, sans-serif")
      setIsChecked(theme && theme.dark_theme && !!parseInt(theme.dark_theme));
      if (!!parseInt(theme.dark_theme)) {
        document.querySelector('body').classList.add('darkmode');
        document.querySelector('body').classList.remove('custom');
      } else {
        document.querySelector('body').classList.add('custom');
        document.querySelector('body').classList.remove('darkmode');
      }
    }).catch(() => {
      toast.notify('Error al cargar el tema.', {
        title: "Notificación de error. ",
        duration: 6,
        type: "error"
      })
    })

  }, [])
  const onSubmit = async () => {
    let formData = new FormData();
    formData.append("logo_path", selectedFile)
    let buildResponse: any = {
      dark_theme: isChecked ? 1 : 0,
      wallpaper: settingsBackground.color,
      primary_button: settingsBtnP.color,
      secondary_button: settingsBtnS.color,
      primary_text: settingsTxtP.color,
      secondary_text: settingsTxtS.color,
      text: settingsTypo.color,
      font,
    }

    closeModal();
    const headers = {
      ...getHeader(),
      'content-type': 'multipart/form-data'
    }
    api.post('/api/theme', buildResponse, { headers: getHeader() }).then(async (res) => {
      if (selectedFile !== null) {
        await api.post('/api/theme-logo', formData, { headers }).then((res) => {
          localStorage.setItem('logo', `https://lampt3bdiag.blob.core.windows.net/pricecheckv2/${res.data.data.logo_path}`)
          buildResponse = { ...buildResponse, logo_path: res.data.data.logo_path }
        })
      }
      toast.notify('Se ha actualizado el tema. ', {
        title: "Notificación de éxito. ",
        duration: 19,
        type: "success"
      })

      localStorage.setItem('dark_theme', buildResponse.dark_theme.toString());
      await localStorage.setItem('theme', JSON.stringify(buildResponse));

      const currentTheme = buildTheme(buildResponse);
      const style = document.createElement('style');
      style.innerHTML = currentTheme;

      setTimeout(() => router.reload(), 3000)
    }).catch((err) => {
      toast.notify('Error al actualizar el tema.', {
        title: "Notificación de error. ",
        duration: 6,
        type: "error"
      })
    })
  }
  return (
    <>
      <h3 className="d-flex justify-content-center">Ajustes de color</h3>
      <div className="d-flex justify-content-center pt-3">
        <span className="px-5 font-weight-bold">Tema : </span>
        <label>
          <input
            type="checkbox"
            className="form-check-input"
            checked={isChecked}
            onChange={handleChangeTheme}
          />
          <span style={{ paddingTop: '8px', paddingLeft: '10px', fontSize: '18px' }}>{isChecked ? 'Oscuro' : 'Claro'}</span>
        </label>
      </div>
      {
        !isChecked && (
          <>
            <div className="d-flex justify-content-center py-3">
              <span className="pr-5 py-1 font-weight-bold">Logo: </span>
              <div className="">
                <input type="file" name="file" onChange={handleFile} />
              </div>
            </div>
            <div className="d-flex justify-content-center py-4">
              <span className="px-5 font-weight-bold">Tipografia: </span>
              <FontSelect value={font} handleChange={onChangeTypo} />
            </div>
            <div className="d-flex flex-row w-100 justify-content-center py-4">
              <span className="px-5 font-weight-bold">Letra: </span>
              <div style={stylesTypo.swatch} onClick={handleClickTypo}>
                <div style={stylesTypo.color} />
              </div>
              {settingsTypo.displayColorPicker ? <div style={stylesTypo.popover}>
                <div style={stylesTypo.cover} onClick={handleCloseTypo} />
                <SketchPicker color={settingsTypo.color} onChange={handleChangeTypo} />
              </div> : null}
            </div>

            <div className="d-flex flex-row w-100 justify-content-center">
              <span className="px-5 font-weight-bold">Fondo: </span>
              <div style={stylesBack.swatch} onClick={handleClickBackground}>
                <div style={stylesBack.color} />
              </div>
              {settingsBackground.displayColorPicker ? <div style={stylesBack.popover}>
                <div style={stylesBack.cover} onClick={handleCloseBackground} />
                <SketchPicker color={settingsBackground.color} onChange={handleChangeBackground} />
              </div> : null}
            </div>

            <div className="d-flex flex-row w-100 justify-content-center py-2">
              <span className="px-4 py-1 font-weight-bold">Botones (Fondo): </span>
              <div id="btns-primary">
                <span className="d-block py-1">Acción principal</span>
                <div className="d-block" style={stylesBtnP.swatch} onClick={handleClickBtnP}>
                  <div style={stylesBtnP.color} />
                </div>
              </div>
              {settingsBtnP.displayColorPicker ? <div style={stylesBtnP.popover}>
                <div style={stylesBtnP.cover} onClick={handleCloseBtnP} />
                <SketchPicker color={settingsBtnP.color} onChange={handleChangeBtnP} />
              </div> : null}
              <div id="btns-secondary" className="px-3">
                <span className="d-block py-1 ">Acción Secundaria</span>
                <div className="d-block" style={stylesBtnS.swatch} onClick={handleClickBtnS}>
                  <div style={stylesBtnS.color} />
                </div>
              </div>
              {settingsBtnS.displayColorPicker ? <div style={stylesBtnS.popover}>
                <div style={stylesBtnS.cover} onClick={handleCloseBtnS} />
                <SketchPicker color={settingsBtnS.color} onChange={handleChangeBtnS} />
              </div> : null}
            </div>
            <div className="d-flex flex-row w-100 justify-content-center py-2">
              <span className="px-4 py-1 font-weight-bold">Botones (Texto): </span>
              <div id="btns-primary">
                <span className="d-block py-1">Acción principal</span>
                <div className="d-block" style={stylesTxtP.swatch} onClick={handleClickTxtP}>
                  <div style={stylesTxtP.color} />
                </div>
              </div>
              {settingsTxtP.displayColorPicker ? <div style={stylesTxtP.popover}>
                <div style={stylesTxtP.cover} onClick={handleCloseTxtP} />
                <SketchPicker color={settingsTxtP.color} onChange={handleChangeTxtP} />
              </div> : null}
              <div id="btns-secondary" className="px-3">
                <span className="d-block py-1">Acción Secundaria</span>
                <div className="d-block" style={stylesTxtS.swatch} onClick={handleClickTxtS}>
                  <div style={stylesTxtS.color} />
                </div>
              </div>
              {settingsTxtS.displayColorPicker ? <div style={stylesTxtS.popover}>
                <div style={stylesTxtS.cover} onClick={handleCloseTxtS} />
                <SketchPicker color={settingsTxtS.color} onChange={handleChangeTxtS} />
              </div> : null}
            </div>
          </>
        )
      }
      <div className="d-flex flex-row w-100 justify-content-center py-5">
      <div className="w-25 mx-auto">
          <SecondaryButton
            label="Cancelar"
            onClick={closeModal}
          />
        </div>
        <div className="w-25 mx-auto">
          <PrimaryButton
            label="Guardar"
            onClick={onSubmit}
          />
        </div>
      </div>
    </>
  )
}

export default ColorsForm;

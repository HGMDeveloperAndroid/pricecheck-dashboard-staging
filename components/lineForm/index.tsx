import React, { useState, useEffect } from 'react'

import { Select } from '../select'
import { Input } from '../input'
import { SecondaryButton, PrimaryButton } from '../buttons'

import styles from './lineForm.module.scss'
import { getLogo } from '../../utils/session-management'

type Props = {
  title: string,
  lineProp: BrandModalData,
  lineId: string | null,
  onEditLine: Function,
  onAddLine: Function,
  showClose: boolean,
  onClose?: Function,
  groupList?: Option[],
  labelButton: string,
  showRol?: boolean,
  showRegion?: boolean,
  showEmployeeNumber?: boolean
  serverErrors?: string,
  serverErrorsBad?: boolean,
}

type Option = {
  value: any,
  label: string,
}

type BrandModalData = {
  name?: string,
  description?: string,
  group_id?: number, 
}

export default function EditLineForm(props: Props) {
  const {
    lineProp,
    title,
    lineId,
    onEditLine,
    onAddLine,
    onClose,
    groupList,
    showClose,
    labelButton,
    serverErrors = '',
    serverErrorsBad = true,
  } = props

  const [line, setLine] = useState(lineProp)
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [groupError, setGroupError] = useState('');
  const [logo, setLogo] = useState("");
  useEffect(() => {
    const logo = getLogo();
    setLogo(logo);
    setLine(lineProp)
  }, [lineProp])

  const changeModalName = (e: any) => {
    const name = e.target.value;

    setLine({
      ...line,
      name,
    })

    if (name.length < 3) {
      setNameErrorMessage('El nombre debe contener al menos 3 caracteres.')
    } else {
      setNameErrorMessage('')
    }
  }

  const handleDescription = (e: any) => {
    const description = e.target.value

    setLine({
      ...line,
      description,
    })
  }

  const changeGroup  = (e: any) => {
    const group_id = parseInt(e.target.value, 10)
    setLine({
        ...line,
        group_id,
    })
}
  const checkAndDeleteUnusedFields = (object: BrandModalData): BrandModalData => {
    const res = { ...object }
    return res
  }

  const validateRequiredFields = (object: BrandModalData): boolean => {
    let isValid = true

    if (!object.name || object.name.length === 0) {
      setNameErrorMessage('El nombre es requerido')
      isValid = false
    }

    if (!object.group_id) {
      setGroupError('El grupo es requerido');
      isValid = false
    }

    return isValid
  }

  const onSend = () => {
    const data = checkAndDeleteUnusedFields(line)
    if (validateRequiredFields(data)) {
      lineId ? onEditLine(data) : onAddLine(data)
    }
  }

  const clearForm = () => {
    setLine({
      name: '',
      description: '',
    });
  }

  const closeForm = () => {
    clearForm();
    onClose();
  }

  return (
    <>
      <div className={styles.modalHeader}>
        <img src={logo} style={logo != "" ? { width: '55px', height: '50px' } : {}} alt="Logo 3B" />
        <h3>{title}</h3>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.half}>
          <div className={styles.inputContainer}>
            <Input
              defaultValue={line.name}
              onChange={changeModalName}
              type="text"
              placeholder="Nombre*"
              inputPlaceholder="ej. (65) Dulces Mexicanos"
              minLength={3}
              errorMessage={nameErrorMessage}
            />
          </div>
          <div className={styles.inputContainer}>
            <Select
              defaultOption={line.group_id}
              onChange={changeGroup }
              options={groupList}
              label="Grupo *"
            />
          </div>
          <div className={styles.inputContainer}>
            <Input
              defaultValue={line.description}
              onChange={handleDescription}
              type="text"
              placeholder="Descripción "
              minLength={3}
              errorMessage=""
            />
          </div>
        </div>

        <div className={styles.serverError}>
          <p className={serverErrorsBad ? styles.errorBad : styles.errorGood}>
            { groupError && `** ${groupError} **`  || serverErrors }
          </p>
        </div>
      </div>

      <div className={styles.modalFooter}>
        {showClose &&
          <div className={styles.btnContainer}>
            <SecondaryButton onClick={closeForm} label="Cerrar" />
          </div>
        }

        <div className={styles.btnContainer}>
          <PrimaryButton onClick={onSend} label={labelButton} />
        </div>
      </div>
    </>
  )
}

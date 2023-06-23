import React, { useState, useEffect, useRef, SyntheticEvent } from 'react'

import { Select } from '../select'
import { Input, File } from '../input'
import { SecondaryButton, PrimaryButton } from '../buttons'

import styles from './unitForm.module.scss'
import { getLogo } from '../../utils/session-management'

type Props = {
  title: string,
  unitProp: UserModalData,
  unitId: string | null,
  onEditUnit: Function,
  onAddUnit: Function,
  showClose: boolean,
  onClose?: Function,
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

type UserModalData = {
  name?: string,
  abbreviation?: string,
}

export default function EditUnitForm(props: Props) {
  const {
    unitProp,
    title,
    unitId,
    onEditUnit,
    onAddUnit,
    onClose,
    showClose,
    labelButton,
    serverErrors = '',
    serverErrorsBad = true,
  } = props

  const [unit, setUnit] = useState(unitProp)
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [abbreviationErrorMessage, setAbbreviationErrorMessage] = useState('')
  const [logo, setLogo] = useState("")
  useEffect(() => {
    const logo = getLogo();
    setLogo(logo);
    setUnit(unitProp)
  }, [unitProp])

  const changeModalName = (e: any) => {
    const name = e.target.value

    setUnit({
      ...unit,
      name,
    })

    if (name.length < 3) {
      setNameErrorMessage('El nombre debe contener al menos 3 caracteres.')
    } else {
      setNameErrorMessage('')
    }
  }

  const handleAbbreviation = (e: any) => {
    const  abbreviation = e.target.value

    setUnit({
      ...unit,
      abbreviation,
    })
  }

  const checkAndDeleteUnusedFields = (object: UserModalData): UserModalData => {
    const res = { ...object }
    return res
  }

  const validateRequiredFields = (object: UserModalData): boolean => {
    let isValid = true

    if (!object.name || object.name.length === 0) {
      setNameErrorMessage('El nombre es requerido. ')
      isValid = false
    }
    return isValid
  }

  const onSend = () => {
    const data = checkAndDeleteUnusedFields(unit)
    if (validateRequiredFields(data)) {
      unitId ? onEditUnit(data) : onAddUnit(data)
    }
  }

  function clearForm() {
    setUnit({
      name: '',
      abbreviation: '',
    });
  }

  function closeForm() {
    clearForm()
    onClose()
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
              defaultValue={unit.name}
              onChange={changeModalName}
              type="text"
              placeholder="Nombre *"
              minLength={3}
              errorMessage={nameErrorMessage}
            />
          </div>
        </div>

        <div className={styles.serverError}>
          <p className={serverErrorsBad ? styles.errorBad : styles.errorGood}>
            {serverErrors}
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

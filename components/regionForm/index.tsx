import React, { useState, useEffect } from 'react'
import { Input } from '../input'
import { SecondaryButton, PrimaryButton } from '../buttons'

import styles from './regionForm.module.scss'
import { getLogo } from '../../utils/session-management'

type Props = {
  title: string,
  formProp: ChainModalData,
  formId: string | null,
  onEditForm: Function,
  onAddForm: Function,
  showClose: boolean,
  onClose?: Function,
  labelButton: string,
  serverErrors?: string,
  serverErrorsBad?: boolean,
}

type ChainModalData = {
  name?: string,
  alias?: string,
  description?: string,
}

export default function EditRegionForm(props: Props) {
  const {
    formProp,
    title,
    formId,
    onEditForm,
    onAddForm,
    onClose,
    showClose,
    labelButton,
    serverErrors = '',
    serverErrorsBad = true,
  } = props

  const [data, setData] = useState(formProp)
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [logo, setLogo] = useState("")
  useEffect(() => {
    const logo = getLogo();
    setLogo(logo);
    setData(formProp)
  }, [formProp])

  const changeModalName = (e: any) => {
    const name = e.target.value

    setData({
      ...data,
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

    setData({
      ...data,
      description,
    })
  }

  const checkAndDeleteUnusedFields = (object: ChainModalData): ChainModalData => {
    const res = { ...object }
    return res
  }

  const validateRequiredFields = (object: ChainModalData): boolean => {
    let isValid = true

    if (!object.name || object.name.length === 0) {
      setNameErrorMessage('El nombre es requerido')
      isValid = false
    }
    return isValid
  }

  const onSend = () => {
    const dataSend = checkAndDeleteUnusedFields(data)
    if (validateRequiredFields(dataSend)) {
      formId ? onEditForm(dataSend) : onAddForm(dataSend)
    }
  }

  function clearForm() {
    setData({
      name: '',
      description: '',
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
              defaultValue={data.name}
              onChange={changeModalName}
              type="text"
              placeholder="Nombre *"
              minLength={3}
              errorMessage={nameErrorMessage}
            />
          </div>
          <div className={styles.inputContainer}>
            <Input
              defaultValue={data.description}
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

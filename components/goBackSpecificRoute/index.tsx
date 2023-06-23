import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

import s from './goBack.module.scss'

const GoBackSpecific = (props) => {
  const { route } = props;
  const router = useRouter();
  return (
    <div className={s.goBackContainer} onClick={() => router.push(route)}>
      <a>
        <FontAwesomeIcon className={s.icon} icon={faArrowLeft} />
      </a>
    </div>
  )
}

GoBackSpecific.defaultProps = {
  route: '',
}

export default GoBackSpecific;

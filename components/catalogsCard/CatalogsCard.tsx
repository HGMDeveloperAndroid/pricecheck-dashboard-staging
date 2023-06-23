import React from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

import styles from './catalogs.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
    label: string,
    icon: IconProp,
    iconColor: string,
    onClick: Function,
}

const CatalogsCard = React.memo((props: Props) => {
    const { label, icon, iconColor, onClick} = props
    return (
        <div onClick={() => onClick()} className={styles.container}>
            <FontAwesomeIcon icon={icon} style={{color: iconColor, fontSize: '1.4em'}} />
            <p>{label}</p>
        </div>
    )
}, () => false)

export default CatalogsCard
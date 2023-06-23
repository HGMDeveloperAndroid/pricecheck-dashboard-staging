import React from 'react'

import styles from './square.module.scss'

const Square = (props: { title: string, value: number | null, date: string | null, bgColor?: string, color?: string }) => {
    const { title, value, date, bgColor, color } = props
    const colorStyle = { color: color ? color: '#565656'}
    return (
        <div style={{backgroundColor: bgColor ? bgColor : '#E6EAEE' }} className={styles.square}>
            <p className={styles.title} style={colorStyle}>{title}</p>
            {value && <p className={styles.value} style={colorStyle}>$ {value}</p>}
            {date && <p className={styles.date} style={colorStyle}>{date}</p>}
        </div>
    )
}

export default Square
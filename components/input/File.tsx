import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './input.module.scss'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

type Props = {
    label: string,
    acceptedFormats?: string,
    onChange: Function
}

class File extends PureComponent<Props> {
    inputRef: any

    render() {
        const { label, acceptedFormats, onChange } = this.props
        return (
            <div className={styles.fileContainer}>
                <input ref={ref => this.inputRef = ref} onChange={e => onChange(e)} className={styles.file} accept={acceptedFormats} type="file" />
                <button onClick={() => this.inputRef.click()} className={styles.button} >{label} <FontAwesomeIcon icon={faUpload} /></button>
            </div>
        )
    }
}

export default File
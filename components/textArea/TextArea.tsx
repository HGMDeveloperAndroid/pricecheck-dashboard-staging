import React, { PureComponent } from 'react'

import styles from './text.module.scss'

type Props = {
    onChange: Function,
    disabled?: boolean,
    placeholder: string,
    errorMessage?: string,
    defaultValue?: string,
    cols?: number,
    rows?: number,
}

class TextArea extends PureComponent<Props>{
    
    render(){

        const { placeholder, onChange, disabled,errorMessage, defaultValue, cols, rows } = this.props
        
        return(
            <div className={styles.textAreaContainer}>
                <label>{placeholder}</label>
                <div className={styles.textAreaLineContainer}>
                    <textarea onChange={(e) => onChange(e)} value={defaultValue} className={styles.textArea} disabled={disabled} cols={cols} rows={rows}/>
                </div>
                { errorMessage && errorMessage.length > 0 && <p className={styles.errorMessage}>{errorMessage}</p>}
            </div>
        )
    }
}


export default TextArea
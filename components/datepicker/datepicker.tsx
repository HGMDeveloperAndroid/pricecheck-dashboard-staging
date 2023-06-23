import React, { PureComponent } from 'react'
import styles from '../input/input.module.scss';
import DatePicker from 'react-datepicker';

type Props = {
    label: string,
    selected: string,
    onSelect: Function,
    placeholder: string,
    dateFormat: string,
    errorMsg: string,
    isLabel: boolean,
    inlineLabel: boolean,
}

export default class Datepicker extends PureComponent<Props> {
    public static defaultProps = {
        label: '',
        selected: '',
        onSelect: ()=> false,
        dateFormat: 'MM/dd/yyy',
        placeholder: '',
        errorMsg: '',
        isLabel: true,
        inlineLabel: false,
    }

    render() {
        const {
            label,
            selected,
            onSelect,
            placeholder,
            dateFormat,
            errorMsg,
            isLabel,
            inlineLabel,
        } = this.props

        const inlineLabelClass = inlineLabel ? 'inline-label' : '';

        return (
            <div className={styles.inputContainer}>
                {
                    isLabel && (
                        <label className={inlineLabelClass}>{label}:</label>
                    )
                }
                <div className={styles.inputLineContainer}>
                    <DatePicker
                        className={styles.input}
                        selected={selected}
                        onSelect={onSelect}
                        dateFormat={dateFormat}
                        placeholderText={placeholder}
                    />
                </div>

                {errorMsg ? (<div className={styles.errorMessage}>{errorMsg}</div>) : null}
            </div>
        )
    }
}

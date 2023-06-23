import React, { PureComponent } from 'react'
import styles from './input.module.scss'
import black from './inputBlack.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
    type: string,
    maxLength?: number,
    minLength?: number,
    placeholder?: string,
    icon?: IconProp,
    bgColor?: string,
    color?: string,
    fontSize?: string,
    placeholderColor?: string,
    onChange: Function,
    onKeyPress?: Function,
    errorMessage?: string,
    defaultValue?: string | number ,
    placeholderOverLabel?: boolean,
    disabled?: boolean,
    inputPlaceholder?: string,
    className?: string,
    tabindex?: number,
    isBlack?: boolean,
}

export default class Input extends PureComponent<Props> {
    public static defaultProps = {
        maxLength: 100,
        minLength: 0,
        placeholderOverLabel: false,
        onKeyPress: () => {},
        isBlack: false,
    }

    render() {
        const {
            type,
            maxLength,
            placeholder,
            icon,
            bgColor,
            color,
            onChange,
            onKeyPress,
            errorMessage,
            defaultValue,
            placeholderOverLabel,
            minLength,
            placeholderColor,
            disabled,
            inputPlaceholder,
            fontSize,
            tabindex,
            className,
            isBlack,
        } = this.props

        const styleInput = (bgColor && color && fontSize ) ?
            { backgroundColor: bgColor, color: color } : color ?
            { color : color } : bgColor ?
            { backgroundColor: bgColor } : {} ?
            { fontSize:  fontSize } : {}


        let placeholderInput = placeholderOverLabel ? placeholder : ''
        placeholderInput = inputPlaceholder ? inputPlaceholder : placeholderInput;

        return (
            <div className={styles.inputContainer}>
                {!placeholderOverLabel && (
                    <label style={ placeholderColor ? { color: placeholderColor } : {}}>{placeholder}:</label>
                )}

                <div className={styles.inputLineContainer}>
                    {icon && <FontAwesomeIcon icon={icon}/> }

                    <input
                        minLength={minLength}
                        value={defaultValue || ''}
                        style={styleInput}
                        placeholder={placeholderInput}
                        onChange={(e) => onChange(e)}
                        onKeyPress={(e) => onKeyPress(e)}
                        className={`${styles.input} ${className}`}
                        type={type}
                        maxLength={maxLength}
                        disabled={disabled}
                        tabIndex={tabindex}
                    />
                </div>

                {errorMessage && errorMessage.length > 0 && (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                )}
            </div>
        )
    }
}

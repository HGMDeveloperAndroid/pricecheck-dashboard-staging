import React from 'react'

import styles from './select.module.scss'

type Props = {
    label: string,
    options: { value: any, label: string }[],
    defaultOption?: any,
    bgColor?: string,
    color?: string,
    onChange: Function,
    noLabel?: boolean,
    defaultEmpty?: boolean,
    placeholderColor?: string
    errorMessage?: string,
    isDisabled?: boolean,
    tabindex?: number,
    className?: string,
}

Select.defaultProps = {
    defaultEmpty: true,
}

export default function Select(props: Props) {
    const {
        label,
        options,
        defaultOption,
        bgColor,
        onChange,
        noLabel,
        errorMessage,
        placeholderColor,
        color,
        isDisabled,
        tabindex,
        className,
        defaultEmpty,
    } = props

    const styleInput = bgColor && color ?
        { backgroundColor: bgColor, color: color } :
        color ?
            { color: color } :
            bgColor ?
                { backgroundColor: bgColor } :
                {}

    return (
        <div>
            {!noLabel && (
                <label
                    className={styles.label}
                    style={placeholderColor ? { color: placeholderColor } : {}}
                >
                    {label}
                </label>
            )}

            <select
                onChange={e => onChange(e)}
                value={defaultOption}
                style={styleInput}
                className={`${styles.select} ${className}`}
                disabled={isDisabled}
                tabIndex={tabindex}
            >
                <option disabled={true} value={defaultEmpty ? '0' : ''}>
                    {label}
                </option>

                {options.map(opt => (
                    <option
                        key={opt.value}
                        value={opt.value}
                    >
                        {opt.label}
                    </option>
                ))}
            </select>

            {errorMessage && errorMessage.length > 0 && (
                <p className={styles.errorMessage}>{errorMessage}</p>
            )}
        </div>
    )
}

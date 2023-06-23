import React, { SyntheticEvent, CSSProperties } from 'react'
import styles from './checkbox.module.scss'

type Props = {
    onChange: (e?: SyntheticEvent) => any,
    label: string,
    checked?: boolean,
    className?: string,
    checkboxClassName?: string,
    disabled?: boolean,
    style?: CSSProperties,
    tabindex?: number,
}

export default function Checkbox(props: Props) {
    const {
        onChange = () => {},
        label,
        checked = false,
        className = '',
        checkboxClassName = '',
        disabled = false,
        style = {},
        tabindex,
    } = props;

    const random = Math.random();
    const customId = `checkbox-${random}`;

    const classNames = [
        className,
        disabled ? styles.disabled : null,
    ].join(' ');

    return (
        <p
            className={`${classNames} text-left`}
            style={style}
        >
            <input
                id={customId}
                className={`${styles.checkbox} ${checkboxClassName}`}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                tabIndex={tabindex}
            />
            <label htmlFor={customId}>
                {label}
            </label>
        </p>
    );
}

import React, { FunctionComponent, SyntheticEvent } from 'react'

import styles from './button.module.scss'

type Props = {
    label: string,
    disabled?: boolean,
    type?: 'button' | 'submit' | 'reset',
    onClick?: (event: SyntheticEvent) => void,
    variant?: SecondaryButtonVariant,
    noBorder?: boolean,
    tabindex?: number,
    className?: string,
}

enum SecondaryButtonVariant {
    Success,
    Error,
}

const SecondaryButton: FunctionComponent<Props> = ({ className, tabindex, label, type, onClick, variant, noBorder, disabled }) => {
    const buttonClass = variant === SecondaryButtonVariant.Success ?
        styles.secondaryButton :
        styles.secondaryButtonError

    return (
        <button
            className={`${buttonClass} ${className} ${disabled && styles.disabled}`}
            style={noBorder ? { border: 'none' } : {} }
            type={type}
            disabled={disabled}
            onClick={onClick}
            tabIndex={tabindex}
        >
            {label}
        </button>
    )
}

SecondaryButton.defaultProps = {
    type: 'button',
    disabled: false,
    onClick: () => {},
    variant: SecondaryButtonVariant.Success,
    noBorder: false,
}

export {
    SecondaryButton,
    SecondaryButtonVariant,
}

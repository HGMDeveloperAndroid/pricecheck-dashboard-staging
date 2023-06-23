import React, { FunctionComponent, SyntheticEvent } from 'react'

import styles from './button.module.scss'

type Props = {
    label: string,
    type?: 'button' | 'submit' | 'reset',
    onClick?: (event: SyntheticEvent) => void,
    disabled?: boolean,
    variant?: PrimaryButtonVariant,
    tabindex?: number,
    className?: string,
}

enum PrimaryButtonVariant {
    Success,
    Error,
}

const PrimaryButton: FunctionComponent<Props> = ({ className, tabindex, label, type, onClick, disabled, variant }) => {
    const buttonClass = variant === PrimaryButtonVariant.Error ?
        styles.primaryButtonError :
        styles.primaryButton

    return (
        <button
            className={`${buttonClass} ${className}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
            tabIndex={tabindex}
        >
            {label}
        </button>
    )
}

PrimaryButton.defaultProps = {
    type: 'button',
    onClick: () => {},
    disabled: false,
    variant: PrimaryButtonVariant.Success,
}

export {
    PrimaryButton,
    PrimaryButtonVariant,
}

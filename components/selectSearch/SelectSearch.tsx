import React, { SyntheticEvent } from 'react'
import AsyncSelect from 'react-select/async';
import { OptionsType, OptionTypeBase } from 'react-select';

import styles from './selectSearch.module.scss'

type LoadOptionsFunction = (
    inputValue: string,
    callback: (options: OptionsType<OptionTypeBase>) => void,
) => void | Promise<any>;

type Props = {
    label: string,
    optionFunction?: LoadOptionsFunction,
    defaultOption?: any,
    bgColor?: string,
    placeholder?: string,
    color?: string,
    onChange: (e: SyntheticEvent) => any,
    noLabel?: boolean,
    placeholderColor?: string
    errorMessage?: string,
    isDisabled?: boolean,
}

export default function SelectSearch(props: Props) {
    const {
        label,
        onChange,
        noLabel,
        placeholderColor = 'unset',
        placeholder,
        optionFunction,
    } = props

    return (
        <div>
            {!noLabel && (
                <label
                    className={styles.label}
                    style={{ color: placeholderColor}}
                >
                    {label}:
                </label>)
            }
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={optionFunction}
                onChange={onChange}
                placeholder={placeholder}
                autoFocus={false}
            />
        </div>
    )
}

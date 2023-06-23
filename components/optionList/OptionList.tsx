import React from 'react'

import s from './optionList.module.scss'

type Props = {
    options: Array<{ value: any, label: string }>
    optionSelected: any
    onOptionSelected: Function
}

const OptionList = (props: Props) => {

    const { options, optionSelected, onOptionSelected } = props

    return (
        <ul className={s.tabBar}>
            {
                options.map((ele) => {
                    return (
                        <li key={`option-list-${ele.value}`} onClick={() => onOptionSelected(ele.value)} className={optionSelected === ele.value ? s.selected : ''}>
                            {ele.label}
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default OptionList
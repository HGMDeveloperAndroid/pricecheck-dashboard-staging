import React, { Component } from 'react'
import { Select } from '../select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './input.module.scss'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

type Options =
    { value: string, label: string }

type Props = {
    label: string,
    optionList: Array<Options>,
    addOption: Function,
    deleteOption: Function,
    options: Array<{ id: any, label: string }>
    isDisabled ?: boolean,
}

type State = {
    selectValue: null | string,
}

class Tags extends Component<Props, State> {

    state = {
        selectValue: '',
    }

    onTagSelected = (e: any) => {
        this.props.addOption({ id: e.target.value, label: this.findLabel(e.target.value) })
        this.setState({
            selectValue: ''
        })
    }

    findLabel = (id: any): string => {
        const ele = this.props.optionList.filter(op => op.value == id)
        if (ele.length > 0) {
            return ele[0].label
        }

        return ''
    }

    render() {
        const { label, optionList, options, addOption, deleteOption, isDisabled } = this.props
        const { selectValue } = this.state
        return (
            <div className={styles.tagContainer}>
                <Select options={optionList} onChange={this.onTagSelected} defaultOption={selectValue} defaultEmpty={false} label={label} isDisabled={isDisabled}/>
                <div className={styles.tags}>
                    {options.map(option => {
                        return <div className={styles.tag}><span>{option.label}</span> { isDisabled ? '': <FontAwesomeIcon onClick={() => deleteOption(option.id)} icon={faTimes} />} </div>
                    })}
                </div>
            </div>
        )
    }
}

export default Tags
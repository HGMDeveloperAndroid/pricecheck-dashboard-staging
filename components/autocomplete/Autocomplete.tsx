import React from 'react';
import Autosuggest from 'react-autosuggest';

export default class Autocomplete extends React.Component<any, any> {
    state = {
        value: '',
        suggestions: [],
        defaultValueWasDefined: false,
    };

    static defaultProps = {
        resetLine: false,
        defaultValue: '',
    }

    onChange = (event, { newValue }) => {
        const nextState = {
            value: newValue,
        };

        this.setState(nextState);
    };

    componentWillReceiveProps() {
        if (!this.props.resetLine && this.state.value) {
            this.setState({
                value: '',
            });
        }
    }

    onSuggestionsFetchRequested = (context) => {
        const { getSuggestions } = this.props;
        const value = context.reason == 'input-changed' ? context.value : '';

        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    shouldRenderSuggestions = (value, reason) => {
        return  true ;
    }

    render() {
        const { value, suggestions } = this.state;
        const { resetLine, defaultValue, tabindex, placeholder, onSuggestionSelected, getSuggestionValue, renderSuggestion, disabled, useWhiteText } = this.props;
        const textWhite = useWhiteText ? 'text-white' : '';

        const inputProps = {
            placeholder: !value && defaultValue ? defaultValue : placeholder,
            tabIndex: tabindex,
            disabled,
            value,
            onChange: this.onChange,
            className: `indexed-element react-autosuggest__input ${textWhite}`

        };
        return (
            <div className='autocomplete-wrapper'>
                <span className={textWhite}>{placeholder}: </span>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    highlightFirstSuggestion={true}
                    shouldRenderSuggestions= {this.shouldRenderSuggestions}
                    focusInputOnSuggestionClick={false}
                />
            </div>
        );
    }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'components/bases/I18n/withI18n';

export class Select extends Component
{
    state = {
        value: this.props.value,
    };

    constructor(props)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps)
    {
        if (nextProps.value !== this.state.value)
        {
            this.setState({ value: nextProps.value });
        }
    }

    handleChange(event)
    {
        this.setState({
            value: event.target.value,
        });
        this.fireOnSelect(event);
    }

    render()
    {
        const { padding } = this.props;
        return (
            <select
                className={this.props.className}
                value={this.state.value}
                disabled={this.props.disabled}
                style={{ width: this.props.width, padding }}
                onChange={this.handleChange}
            >
                {this.props.children}
            </select>
        );
    }

    fireOnSelect(event)
    {
        if (typeof this.props.onChange === 'function')
        {
            this.props.onChange(event.target.value);
        }
    }
}

Select.propTypes = {
    /** Class of Select */
    className: PropTypes.string,
    /** Value of Select */
    value: PropTypes.any,
    width: PropTypes.string,
    /** Disabled: true, false */
    disabled: PropTypes.bool,
    /** Callback function when changed value */
    onChange: PropTypes.func,
    /** padding select control */
    padding: PropTypes.string,
};

Select.defaultProps = {
    className: '',
    width: '100%',
    disabled: false,
    padding: null,
    onChange: () =>
    {
        // console.log('Select value changed');
    },
};

class SelectOption extends Component
{
    render()
    {
        const { value, text, t } = this.props;
        return (
            // Don't use: <option value={value}><T>{text}</T></option>
            <option value={value}>{t(text)}</option>
        );
    }
}

SelectOption = withI18n(SelectOption);
export { SelectOption };

SelectOption.propTypes = {
    /** Value of Select Option */
    value: PropTypes.any,
    /** Text of Select Option */
    text: PropTypes.string.isRequired,
};

SelectOption.defaultProps = {
    text: '',
};

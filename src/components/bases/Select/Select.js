import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { T } from 'components/bases/Translate/Translate';

export class Select extends Component
{
    state = {
        value: this.props.value
    };

    constructor(props)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps)
    {
        if (nextProps.value !== this.state.value)
        {
            this.setState({ value: nextProps.value });
        }
    }

    handleChange(event)
    {
        this.setState({
            'value': event.target.value
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
                onChange={this.handleChange}
                disabled={this.props.disabled}
                style={{ width: this.props.width, padding }}
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
    /** paddgin select control */
    padding: PropTypes.string
};

Select.defaultProps = {
    className: '',
    width: '100%',
    disabled: false,
    padding: null,
    onChange: () =>
    {
        // console.log('Select value changed');
    }
};

export class SelectOption extends Component
{
    render()
    {
        return (
            <option value={this.props.value}><T>{this.props.text}</T></option>
        );
    }
}

SelectOption.propTypes = {
    /** Value of Select Option */
    value: PropTypes.any,
    /** Text of Select Option */
    text: PropTypes.string.isRequired
};

SelectOption.defaultProps = {
    text: ''
};

import './SearchField.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';
import { Input } from 'components/bases/Input';

export class SearchField extends Component
{
    state = {
        value: this.props.value || '',
    };

    handleChange = (value) =>
    {
        this.setState(
            { value: value },
            this.props.onChange(value),
        );
    };

    handleClearText = () =>
    {
        this.setState(
            { value: '' },
            this.props.onChange(''),
        );
    };

    render()
    {
        const { type, className, placeholder, width, fullwidth } = this.props;
        return (
            <div className={'search-box'}>
                <Input
                    type={type}
                    className={`search-field ${className}`}
                    style={{ width: fullwidth ? '100%' : width }}
                    value={this.state.value}
                    placeholder={placeholder}
                    onChange={this.handleChange}
                />
                {
                    this.state.value && (
                        <button
                            className={'search-btn clear-text'}
                            onClick={this.handleClearText}
                        >
                            <FAIcon
                                icon={'times'}
                                size={'1.125rem'}
                            />
                        </button>
                    )}
                {
                    !this.state.value && (
                        <button className={'search-btn'}>
                            <FAIcon
                                icon={'search'}
                                size={'1.125rem'}
                            />
                        </button>
                    )}
            </div>
        );
    }
}

SearchField.propTypes = {
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.any,
    className: PropTypes.string,
    width: PropTypes.string,
    fullwidth: PropTypes.bool,
    onChange: PropTypes.func,
};

SearchField.defaultProps = {
    disabled: false,
    placeholder: '',
    type: 'text',
    value: '',
    className: '',
    width: '20rem',
    fullWidth: false,
    onChange: () =>
    {
    },
};

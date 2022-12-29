import './FormField.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container } from 'components/bases/Container/Container';
import { T } from 'components/bases/Translate/Translate';

export class FormField extends Component
{
    render()
    {
        return (
            <Container className={`form-field-item form-field-${this.props.type} ${this.props.className}`}>
                <Container className='form-field-left'>
                    <T>{this.props.label}</T>
                </Container>
                <Container className='form-field-right'>
                    {this.props.children}
                </Container>
            </Container>
        );
    }
}

FormField.propTypes = {
    className: PropTypes.string,
    label: PropTypes.any,
    type: PropTypes.oneOf(['vertical', 'horizontal'])
};

FormField.defaultProps = {
    className: '',
    label: '',
    type: 'horizontal'
};

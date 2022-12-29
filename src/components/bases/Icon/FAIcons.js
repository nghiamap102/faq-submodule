import './FAIcons.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container } from '../Container/Container';

export class FAIcons extends Component
{
    render()
    {
        return (
            <Container
                className={`icon-list ${this.props.className}`}
                style={{ display: 'flex' }}
            >
                {this.props.children}
            </Container>
        );
    }
}

FAIcons.propTypes = {
    /** Class of Icon */
    className: PropTypes.string
};

FAIcons.defaultProps = {
    className: ''
};

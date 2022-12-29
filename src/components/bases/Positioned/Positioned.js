import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Positioned extends Component
{
    render()
    {
        return (
            <div
                className={`${this.props.className}`}
                style={{
                    position: 'absolute',
                    top: this.props.top,
                    right: this.props.right,
                    bottom: this.props.bottom,
                    left: this.props.left
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

Positioned.propTypes = {
    className: PropTypes.string,
    top: PropTypes.string,
    right: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string
};

Positioned.defaultProps = {
    className: '',
    top: 'unset',
    right: 'unset',
    bottom: 'unset',
    left: 'unset'
};

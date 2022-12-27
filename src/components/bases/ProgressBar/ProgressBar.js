import './ProgressBar.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ProgressBar extends Component
{
    render()
    {
        let percent = this.props.value / this.props.total * 100;

        let initStyle = '';

        if (this.props.value === 0)
        {
            percent = 5;
            initStyle = 'init';
        }

        return (
            <div
                className={`progress-bar ${this.props.className}`}
                style={{ width: this.props.width || '100%' }}
            >
                <span>{this.props.value} / {this.props.total}</span>
                <div
                    className={`progress-bar-value ${initStyle} `}
                    style={{ width: `${percent}%` }}
                />
            </div>
        );
    }
}

ProgressBar.propTypes = {
    className: PropTypes.string,
    value: PropTypes.number,
    total: PropTypes.number,
    width: PropTypes.any,
};

ProgressBar.defaultProps = {
    className: '',
};

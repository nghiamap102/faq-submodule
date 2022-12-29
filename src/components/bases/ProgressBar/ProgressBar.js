import './ProgressBar.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ProgressBar extends Component
{
    formatter = (val) =>
    {
        if (val >= 1000000)
        {
            return (val / 1000000).toFixed(2) + ' triệu';
        }
        else if (val >= 1000)
        {
            return (val / 1000).toFixed(2) + ' nghìn';
        }
        else
        {
            return val.toFixed(2);
        }
    };
    render()
    {
        let percent = (this.props.value / this.props.total) * 100;

        let initStyle = '';

        if (this.props.value === 0)
        {
            percent = 5;
            initStyle = 'init';
        }

        if (this.props.percent)
        {
            return (
                <div
                    className={`progress-bar ${this.props.className}`}
                    style={{ width: '100%', height: '20px' }}
                >
                    {this.props.value > this.props.total / 2
                        ? (
                                <>
                                    <div
                                        className={`progress-bar-percent ${initStyle} `}
                                        style={{ width: `${(this.props.value / this.props.total) * 100}%`, height: '100%', backgroundColor: this.props.color || 'var(--primary)' }}
                                    >
                                        <div className={'inner'}>{this.formatter(this.props.value)}</div>
                                    </div>
                                </>
                            )
                        : (
                                <>
                                    <div
                                        className={`progress-bar-percent ${initStyle} `}
                                        style={{ width: `${(this.props.value / this.props.total) * 100}%`, height: '100%', backgroundColor: this.props.color || 'var(--primary)' }}
                                    />
                                    <div className={'outer'}>{this.formatter(this.props.value)}</div>
                                </>
                            )}
                </div>
            );
        }

        return (
            <div
                className={`progress-bar ${this.props.className}`}
                style={{ width: '100%' }}
            >
                <span>
                    {this.props.value} / {this.props.total}
                </span>
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
    percent: PropTypes.bool,
    color: PropTypes.string,
};

ProgressBar.defaultProps = {
    className: '',
};

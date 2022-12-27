import './ProgressInProgressBar.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ProgressInProgressBar extends Component
{
    render()
    {
        let startPoint = this.props.middleStart / 24 * 100;
        let endPoint = this.props.middleEnd / 24 * 100;
        let startTime = this.props.startTime / 24 * 100; // realtime start point
        let endTime = this.props.endTime / 24 * 100; // realtime end point

        const estimated_range = endPoint - startPoint;
        const realtime_range = endTime - startTime;

        if (startPoint === 0)
        {
            startPoint += 1;
        }
        if (endPoint === 0)
        {
            endPoint += 1;
        }
        if (startTime === 0)
        {
            startTime += 1;
        }
        if (endTime === 0)
        {
            endTime += 1;
        }

        return (
            <div
                className={`progress-in-progress-bar ${this.props.className}`}
                style={{ width: '100%', position: 'relative' }}
            >
                {
                    (
                        !isNaN(startPoint) && !isNaN(endPoint)) ?
                        <div
                            className={'progress-bar-value-estimated-range'}
                            style={{ left: `${startPoint}%`, width: `${estimated_range}%` }}
                        /> :
                        (
                            !isNaN(endPoint) ?
                                <div
                                    className={'progress-bar-value-estimated'}
                                    style={{ right: `${endPoint}%` }}
                                /> :
                                (
                                    !isNaN(startPoint) ?
                                        <div
                                            className={'progress-bar-value-estimated'}
                                            style={{ left: `${startPoint}%` }}
                                        /> : null
                                )
                        )
                }

                {
                    (
                        !isNaN(startTime) && !isNaN(endTime)) ?
                        <div
                            className={'progress-bar-value-realtime-range'}
                            style={{ left: `${startTime}%`, width: `${realtime_range}%` }}
                        /> :
                        (
                            !isNaN(endTime) ?
                                <div
                                    className={'progress-bar-value-realtime'}
                                    style={{ right: `${endTime}%` }}
                                /> :
                                (
                                    !isNaN(startTime) ?
                                        <div
                                            className={'progress-bar-value-realtime'}
                                            style={{ left: `${startTime}%` }}
                                        /> : null
                                )
                        )
                }

            </div>

        );
    }
}

ProgressInProgressBar.propTypes = {
    className: PropTypes.string
};

ProgressInProgressBar.defaultProps = {
    className: ''
};

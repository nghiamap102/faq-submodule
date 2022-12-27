import './TrackingMarker.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CircleMarker } from './CircleMarker';
import { T } from 'components/bases/Translate/Translate';

export class TrackingMarker extends Component
{
    render()
    {
        return (
            <div
                className={'tracking-marker'}
                style={{
                    width: this.props.size + 'px',
                    height: this.props.size + 'px',
                    fontSize: `${this.props.size / 2}px`
                }}
            >
                {
                    this.props.heading != null &&
                    (
                        <i
                            className="fas fa-caret-up tm-heading"
                            style={{
                                transform: 'rotate(' + this.props.heading + 'deg)',
                                fontSize: `${this.props.size / 2}px`,
                                color: this.props.color
                            }}
                        />
                    )
                }
                {
                    this.props.title && this.props.isShowLabel &&
                    <div
                        className="tracking-marker-label"
                        style={{ color: this.props.color }}
                    >
                        <T>{this.props.title}</T>
                    </div>
                }
                <CircleMarker {...this.props}/>
            </div>
        );
    }
}

TrackingMarker.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    isShowLabel: PropTypes.bool,
    title: PropTypes.any,
    heading: PropTypes.number
};

TrackingMarker.defaultProps = {
    heading: 0
};

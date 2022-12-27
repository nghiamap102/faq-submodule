import './PointMarker.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Animated } from 'react-animated-css';
import { SVG } from 'extends/ffms/bases/IconSvg/SVGIcon';

export class PointMarker extends Component
{
    animationDuration = 300;
    notifyInterval = undefined;

    state = {
        notifyZoom: 1,
        notifyDirection: 1,
        isVisible: true
    };

    handleClick = (e) =>
    {
        const { onClick, onActiveMarker } = this.props;
        if ((e.ctrlKey || e.metaKey) && e.button === 0)
        {
            if (onActiveMarker)
            {
                onActiveMarker();
            }
        }
        else
        {
            onClick(this.props);
        }
    };

    componentDidMount()
    {
        if (this.props.isNotify)
        {
            this.notifyInterval = setInterval(this.notifyIconHandler, 100);
        }
    }

    componentWillUnmount()
    {
        if (this.notifyInterval)
        {
            clearInterval(this.notifyInterval);
        }
    }

    notifyIconHandler = () =>
    {
        const zoom = this.state.notifyZoom;
        let direction = 0;
        if (zoom < 0.6 && this.state.notifyDirection === 0)
        {
            direction = 1;
        }
        else if (zoom > 1 && this.state.notifyDirection === 1)
        {
            direction = 0;
        }

        this.setState({
            notifyZoom: (zoom + (direction === 1 ? 0.05 : -0.05))
        });
    };

    render()
    {
        const { className, color, size, icon, active } = this.props;
        const { isVisible } = this.state;

        return (
            <Animated
                animationIn="zoomIn"
                animationOut="zoomOut"
                animationInDuration={this.animationDuration}
                isVisible={isVisible}
            >
                <div
                    className={`point-marker ${className}`}
                    style={{
                        width: size + 'px',
                        height: size + 'px'
                    }}
                    onClick={this.handleClick}
                >
                    <div className={'point-marker-content'}>
                        <SVG
                            name={icon}
                            width={`${size}px`}
                            height={`${size}px`}
                            fill={!active ? color : '#ec3f30'}
                            type={this.props.typeMarker}
                            stroke={!active ? 'black' : 'white'}
                            strokeWidth={!active ? 0.5 : 1}
                            strokeOpacity={!active ? 0.25 : 1}
                        />
                    </div>
                </div>
            </Animated>
        );
    }
}

PointMarker.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    notifyIcon: PropTypes.string.isRequired,
    isNotify: PropTypes.bool,
    size: PropTypes.number.isRequired,
    color: PropTypes.string,
    directional: PropTypes.number,
    typeMarker: PropTypes.string,
    onClick: PropTypes.func
};

PointMarker.defaultProps = {
    className: '',
    icon: '',
    notifyIcon: 'exclamation',
    notifyIconSize: '12px',
    isNotify: false,
    size: 32,
    directional: 0,
    color: 'white',
    typeMarker: 'solid',
    onClick: () =>
    {
    }
};

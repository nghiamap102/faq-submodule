import './Marker.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from 'components/bases/Icon/FAIcon';
import { Animated } from 'react-animated-css';

export class CircleMarker extends Component
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
        const { className, color, backgroundColor, size, icon, active, isNotify, notifyIcon } = this.props;
        const { isVisible } = this.state;

        return (
            <Animated
                animationIn="zoomIn"
                animationOut="zoomOut"
                animationInDuration={this.animationDuration}
                isVisible={isVisible}
            >
                <div
                    className={`map-marker ${className}`}
                    style={{
                        width: size + 'px',
                        height: size + 'px',
                        border: `2px solid ${!active ? color : '#1769ff'}`,
                        backgroundColor: backgroundColor,
                        fontSize: `${size / 2}px`
                    }}
                    onClick={this.handleClick}
                >
                    {
                        isNotify &&
                        <div
                            className={'mmk-notify'}
                            // style={{ transform: `scale(${this.state.notifyZoom})` }}
                        >
                            <FAIcon
                                icon={notifyIcon}
                                size={'70%'}
                                color="white"
                            />
                        </div>
                    }

                    <div className={'map-marker-content'}>
                        <FAIcon
                            icon={icon}
                            size={`${size / 2}px`}
                            color={!active ? color : '#1769ff'}
                            type={this.props.typeMarker}
                        />
                    </div>
                </div>
            </Animated>
        );
    }
}

CircleMarker.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    notifyIcon: PropTypes.string.isRequired,
    isNotify: PropTypes.bool,
    size: PropTypes.number.isRequired,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    directional: PropTypes.number,
    typeMarker:PropTypes.string,
    onClick: PropTypes.func
};

CircleMarker.defaultProps = {
    className: '',
    icon: '',
    notifyIcon: 'exclamation',
    notifyIconSize: '12px',
    isNotify: false,
    size: 48,
    directional: 0,
    color: 'white',
    backgroundColor: '#303030',
    typeMarker: 'light',
    onClick: () =>
    {
    }
};

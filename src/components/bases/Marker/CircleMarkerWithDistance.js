import './Marker.scss';

import React from "react";
import PropTypes from 'prop-types';
import {Animated} from "react-animated-css";

import {FAIcon} from 'components/bases/Icon/FAIcon';
import {CircleMarker} from "./CircleMarker";

export class CircleMarkerWithDistance extends CircleMarker
{
    render ()
    {
        const {className, color, backgroundColor, size, icon, isActive, isNotify, notifyIcon} = this.props;
        const {isVisible} = this.state;

        return (
            <Animated animationIn="zoomIn"
                      animationOut="zoomOut"
                      animationInDuration={this.animationDuration}
                      isVisible={isVisible}
            >
                <div className={`map-marker ${className}`}
                     style={{
                         width: size + 'px',
                         height: size + 'px',
                         border: `2px solid ${!isActive ? color : "#1769ff"}`,
                         backgroundColor: backgroundColor,
                         fontSize: `${size / 2}px`
                     }}
                     onClick={this.handleClick}
                >
                    {
                        isNotify &&
                        <div className={'mmk-notify'} style={{transform: `scale(${this.state.notifyZoom})`}}>
                            <FAIcon icon={notifyIcon} size={'70%'} color="white"/>
                        </div>
                    }

                    <div className={'map-marker-content'}>
                        <FAIcon
                            icon={icon}
                            size={`${size / 2}px`}
                            color={!isActive ? color : "#1769ff"}
                        />
                    </div>
                </div>
                <div className={`map-marker-distance ${className}`} onClick={this.handleClick}>
                    {this.props.distance}
                </div>
            </Animated>
        );
    }
}

CircleMarkerWithDistance.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    notifyIcon: PropTypes.string.isRequired,
    isNotify: PropTypes.bool,
    size: PropTypes.number.isRequired,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    directional: PropTypes.number,
    distance: PropTypes.string,
    onClick: PropTypes.func
};

CircleMarkerWithDistance.defaultProps = {
    className: '',
    icon: '',
    notifyIcon: 'exclamation',
    notifyIconSize: '12px',
    isNotify: false,
    size: 48,
    directional: 0,
    color: 'white',
    backgroundColor: '#303030',
    distance: '? km',
    onClick: () =>
    {
    }
};

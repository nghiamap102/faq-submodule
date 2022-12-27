import './MarkerPopup.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-animated-css';
import { Marker } from 'react-mapbox-gl';

import { FAIcon } from 'components/bases/Icon/FAIcon';
import { T } from 'components/bases/Translate/Translate';
import { ScrollView } from '@vbd/vui';

export class MarkerPopup extends Component
{
    animationDuration = 300;

    state = {
        isVisible: true,
    };

    onFocus = (event) =>
    {
        this.props.onFocus({ event, id: this.props.id });
    };

    onClose = (event) =>
    {
        this.setState({ isVisible: false });

        setTimeout(() =>
        {
            this.props.onClose({ event, id: this.props.id });
        }, this.animationDuration);

        event.stopPropagation();
    };

    render()
    {
        const arrowSize = 15;
        const spacing = this.props.spacing || 2;
        let anchor = '';
        let arrowOffset = [];
        const offsetMarker = this.props.markerSize / 2 + arrowSize + spacing;

        const markerOffset = this.props.markerOffset || offsetMarker;

        switch (this.props.location)
        {
            case 'left':
                arrowOffset = [-markerOffset, 0];
                anchor = 'right';
                break;
            case 'right':
                arrowOffset = [markerOffset, 0];
                anchor = 'left';
                break;
            default:
            case 'top':
                arrowOffset = [0, -markerOffset];
                anchor = 'bottom';
                break;
            case 'bottom':
                arrowOffset = [0, markerOffset];
                anchor = 'top';
                break;
        }

        return (

            <Marker
                className={this.props.className}
                coordinates={[this.props.lng, this.props.lat]}
                offset={arrowOffset}
                anchor={anchor}
            >
                <Animated
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    animationInDuration={this.animationDuration}
                    isVisible={this.state.isVisible}
                >
                    <div className={`mp-arrow-container ${this.props.location}`}>
                        <div className={`mp-arrow ${this.props.location}`} />
                    </div>

                    <div
                        className={'mp-container'}
                        onClick={this.onFocus}
                    >
                        <div
                            className="mp-header"
                            style={{
                                width: this.props.width,
                            }}
                        >
                            <h3>
                                <T>{this.props.title}</T>
                                <small><T>{this.props.sub}</T></small>
                            </h3>

                            <div className={'mp-header-actions'}>
                                {
                                    this.props.headerActions.map((action) =>
                                    {
                                        return (
                                            <button
                                                key={action.icon}
                                                onClick={action.onClick}
                                            >
                                                <FAIcon
                                                    icon={action.icon}
                                                    size={'1.5rem'}
                                                    type={'light'}
                                                />
                                            </button>
                                        );
                                    })
                                }
                                <button
                                    key={'close'}
                                    onClick={this.onClose}
                                >
                                    <FAIcon
                                        icon={'times'}
                                        size={'1.5rem'}
                                        type={'light'}
                                    />
                                </button>
                            </div>
                        </div>

                        <div
                            className="mp-body"
                            style={{
                                width: this.props.width,
                                height: this.props.height,
                                maxWidth: this.props.width,
                                maxHeight: this.props.height,
                            }}
                        >
                            <ScrollView scrollX={false}>
                                {this.props.children}
                            </ScrollView>
                        </div>

                        <div className={'mp-footer'}>
                            <div className={'mp-footer-actions'}>
                                {
                                    this.props.actions.map((action) =>
                                    {
                                        return (
                                            <button
                                                key={action.icon}
                                                onClick={action.onClick}
                                            >
                                                <FAIcon
                                                    icon={action.icon}
                                                    size={'1.5rem'}
                                                    type={'light'}
                                                />
                                            </button>
                                        );
                                    })
                                }
                            </div>
                        </div>

                    </div>

                </Animated>
            </Marker>
        );
    }
}

MarkerPopup.propTypes = {
    /** Key of Window Popup */
    id: PropTypes.any,
    /** Class of Window Popup */
    className: PropTypes.string,
    /** Title of Window Popup */
    title: PropTypes.string,
    sub: PropTypes.string,
    /** longitude of this popup in map */
    lng: PropTypes.number,
    /** Latitude of this popup in map */
    lat: PropTypes.number,
    /** Offset in map */
    offset: PropTypes.array,
    /** isActivate: true, false */
    isActivate: PropTypes.bool,
    /** location: true, false */
    location: PropTypes.oneOf(['none', 'left', 'right', 'top', 'bottom']),
    /** Number of width: px */
    width: PropTypes.number.isRequired,
    /** Number of height: px */
    height: PropTypes.number.isRequired,
    /** isNotFixed: true, false */
    isNotFixed: PropTypes.bool,
    /** Marker size: number */
    markerSize: PropTypes.number,
    headerActions: PropTypes.array,
    actions: PropTypes.array,
    /** onFocus: Function with key */
    onFocus: PropTypes.func,
    /** onClose: Function with key */
    onClose: PropTypes.func,
    markerOffset: PropTypes.number,
    spacing: PropTypes.number,
};

MarkerPopup.defaultProps = {
    id: '',
    className: '',
    title: '',
    sub: '',
    lng: 0,
    lat: 0,
    isActivate: false,
    location: 'top',
    isNotFixed: false,
    markerSize: 45,
    headerActions: [],
    actions: [],
    onFocus: () =>
    {
    },
    onClose: () =>
    {
    },
    spacing: 2,
};

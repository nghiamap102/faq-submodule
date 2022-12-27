import './HistoryDirection.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MarkerPopup } from '@vbd/vui';

import { MarkerPopupContain } from 'extends/ffms/views/TrackingHistory/MarkerPopupContain';

export class HistoryPopup extends Component
{
    render()
    {
        const { username, coordinates } = this.props;

        return (
            <MarkerPopup
                width={'20rem'}
                title={`${username}`}
                lng={coordinates[0]}
                lat={coordinates[1]}
            >
                <MarkerPopupContain
                    address={this.props.address}
                    status={this.props.status}
                    speed={this.props.speed}
                    trackerId={this.props.trackerId}
                    username={this.props.username}
                    direction={this.props.direction}
                    timestamp={this.props.timestamp}
                    coordinates={this.props.coordinates}
                />
            </MarkerPopup>
                    
        );
    }
}

HistoryPopup.propTypes = {
    timestamp: PropTypes.number,
    distance: PropTypes.number,
    trackerId: PropTypes.string,
    username: PropTypes.string,
    direction: PropTypes.number,
    speed: PropTypes.number,
    status: PropTypes.object,
    address: PropTypes.string,
    coordinates: PropTypes.array,
};

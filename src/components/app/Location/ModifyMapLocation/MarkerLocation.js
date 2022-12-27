import React, { Component } from 'react';
import { Marker as MapMarker } from 'react-mapbox-gl';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';

class MarkerLocation extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            location: props.location,
        };
    }

    setLocation = (location) =>
    {
        this.setState({ location });
    };

    render()
    {
        const { location } = this.state;

        return (
            <MapMarker
                coordinates={[location.longitude, location.latitude]}
                anchor="bottom"
            >
                <FAIcon
                    icon='map-marker-alt'
                    color='red'
                    type='solid'
                    size='18pt'
                />
            </MapMarker>
        );
    }
}

MarkerLocation.propTypes = {
    location: PropTypes.object,
};

export default MarkerLocation;

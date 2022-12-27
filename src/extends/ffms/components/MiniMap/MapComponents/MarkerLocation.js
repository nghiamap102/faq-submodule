import React, { Component } from 'react';
import { Marker as MapMarker } from 'react-mapbox-gl';

import { FAIcon } from '@vbd/vicon';
import PropTypes from 'prop-types';

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
                onClick={this.props.handleSelect}
            >
                <FAIcon
                    icon='map-marker-alt'
                    color={this.props.color}
                    type='solid'
                    size='1.5rem'
                />
            </MapMarker>
        );
    }
}

MarkerLocation.propTypes = {
    location: PropTypes.object,
    color: PropTypes.string,
    handleSelect: PropTypes.func,
};

MarkerLocation.defaultProps = {
    color: 'red',
    handleSelect: () =>
    {},
};

export default MarkerLocation;

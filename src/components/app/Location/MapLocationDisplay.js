import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ZoomControl } from 'react-mapbox-gl';

import { Map } from '@vbd/vui';

import MarkerLocation from 'components/app/Location/ModifyMapLocation/MarkerLocation';

class MapLocationDisplay extends Component
{
    mapStore = this.props.appStore.mapStore;

    render()
    {
        const { location, height } = this.props;

        return (
            <Map
                style={this.mapStore.defaultStyle}

                lightStyleOverride={this.props.lightStyleOverride}
                darkStyleOverride={this.props.darkStyleOverride}
                satelliteStyleOverride={this.props.satelliteStyleOverride}
                terrainStyleOverride={this.props.terrainStyleOverride}
                boundaryStyleOverride={this.props.boundaryStyleOverride}

                center={location && location.latitude && location.longitude ? { lat: location.latitude, lng: location.longitude } : {}}
                zoomLevel={[this.props.zoomLevel]}
                height={height}
                dragPan={this.props.interactive}
                dragRotate={this.props.interactive}
                scrollZoom={this.props.hasOwnProperty('scrollZoom') ? this.props.scrollZoom : this.props.interactive}
                boxZoom={this.props.interactive}
                interactive={this.props.interactive}
                isNotControl
                onClick={this.props.onClick}
            >
                {this.props.scrollZoom === false ? <ZoomControl className={'map-zoom-control'} /> : undefined}

                <MarkerLocation location={location} />
            </Map>
        );
    }
}

MapLocationDisplay.propTypes = {
    location: PropTypes.object,
    onClick: PropTypes.func,
    height: PropTypes.string,
    zoomLevel: PropTypes.number,
    interactive: PropTypes.bool,
    scrollZoom: PropTypes.bool,

    lightStyleOverride: PropTypes.object,
    darkStyleOverride: PropTypes.object,
    satelliteStyleOverride: PropTypes.object,
    terrainStyleOverride: PropTypes.object,
    boundaryStyleOverride: PropTypes.object,
};

MapLocationDisplay.defaultProps = {
    onClick: () =>
    {
    },
    height: '300px',
    zoomLevel: 16,
    interactive: false,
};

MapLocationDisplay = inject('appStore')(observer(MapLocationDisplay));
export default MapLocationDisplay;

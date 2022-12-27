import React, { useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { ZoomControl } from 'react-mapbox-gl';
import PropTypes from 'prop-types';

import { Map } from '@vbd/vui';
import MarkerLocation from 'components/app/Location/ModifyMapLocation/MarkerLocation';

let MapLocation = (props) =>
{
    const mapStore = props.appStore.mapStore;
    const markerRef = useRef();

    const [counter, setCounter] = useState();
    const [coordinates, setCoordinates] = useState(props.location);

    useEffect(() =>
    {
        // TODO: Change to memo to prevent map render
        if (counter !== props.counter)
        {
            setCoordinates(props.location);
            setCounter(props.counter);
        }
    }, [props.counter, props.location, counter, coordinates]);

    const handleMapMove = (map, event) =>
    {
        // keep marker center map

        if (markerRef.current)
        {
            markerRef.current.setLocation({
                longitude: event.target.transform.center.lng,
                latitude: event.target.transform.center.lat,
            });
        }
    };

    // update location when move end
    const handleLocationChange = (map, event) =>
    {
        const location = {
            longitude: event.target.transform.center.lng,
            latitude: event.target.transform.center.lat,
        };

        props.onLocationChange && props.onLocationChange(location);
    };

    const { height } = props;

    return (
        <Map
            height={height}
            style={mapStore.defaultStyle}

            lightStyleOverride={props.lightStyleOverride}
            darkStyleOverride={props.darkStyleOverride}
            satelliteStyleOverride={props.satelliteStyleOverride}
            terrainStyleOverride={props.terrainStyleOverride}
            boundaryStyleOverride={props.boundaryStyleOverride}

            center={{
                lng: coordinates.longitude,
                lat: coordinates.latitude,
            }}
            zoomLevel={[props.zoom]}
            isNotControl={props.isNotControl}
            scrollZoom={props.scrollZoom}
            onMove={handleMapMove}
            onMoveEnd={handleLocationChange}
        >
            <ZoomControl className={'map-zoom-control'} />
            <MarkerLocation
                ref={markerRef}
                location={coordinates}
            />
        </Map>
    );
};

MapLocation.propTypes = {
    onLocationChange: PropTypes.func,
    location: PropTypes.object,
    zoom: PropTypes.number,
    height: PropTypes.string,
    counter: PropTypes.number,
    scrollZoom: PropTypes.bool,
    isNotControl: PropTypes.bool,

    lightStyleOverride: PropTypes.object,
    darkStyleOverride: PropTypes.object,
    satelliteStyleOverride: PropTypes.object,
    terrainStyleOverride: PropTypes.object,
    boundaryStyleOverride: PropTypes.object,
};

MapLocation.defaultProps = {
    height: '300px',
    location: {
        longitude: null,
        latitude: null,
    },
    zoom: 12.5,
    isNotControl: true,
};


MapLocation = inject('appStore')(observer(MapLocation));
export default MapLocation;

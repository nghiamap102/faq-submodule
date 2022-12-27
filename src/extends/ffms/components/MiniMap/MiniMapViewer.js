import './MiniMapViewer.scss';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import { ZoomControl } from 'react-mapbox-gl';

import {
    Map, Container,
    CollapsibleSection, T,
} from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

import { CommonHelper } from 'helper/common.helper';
import { LocationPopup } from 'extends/ffms/components/MiniMap/MapComponents/LocationPopup';
import MarkerLocation from 'extends/ffms/components/MiniMap/MapComponents/MarkerLocation';
import MarkerPopupManager from 'components/app/MapManager/MarkerPopupManager';

import lightStyleOverride from 'extends/ffms/map-styles/light-style.override.js';
import darkStyleOverride from 'extends/ffms/map-styles/dark-style.override.js';
import satelliteStyleOverride from 'extends/ffms/map-styles/satellite-style.override.js';
import terrainStyleOverride from 'extends/ffms/map-styles/terrain-style.override.js';
import boundaryStyleOverride from 'extends/ffms/map-styles/boundary-style.override.js';

let MiniMapViewer = (props) =>
{
    const mapStore = props.fieldForceStore.miniMapStore;
    const { height, zoom, geoData } = props;
    
    const [center, setCenter] = useState(null);
    // const [legendAddresses, setLegendAddresses] = useState(null);

    useEffect(() =>
    {
        if (!center)
        {
            if (geoData.length >= 1)
            {
                setCenter({ longitude: geoData[0].lng, latitude: geoData[0].lat });
            }
        }

        if (mapStore.map)
        {
            const convertToBounds = geoData.map((poi) => ([poi.lng, poi.lat]));
                
            adjustBounds(convertToBounds);
        }
    }, [mapStore.map, center]);

    const handleMapRender = (map) =>
    {
        mapStore.setBounds(map.getBounds());
        mapStore.map = map;
    };

    const adjustBounds = (bounds) =>
    {
        const coords = bounds[0];
        if (!CommonHelper.isFalsyValue(mapStore.map) && coords)
        {
            var newBounds = bounds.reduce((boundArr, coord) =>
            {
                return boundArr.extend(coord);
            }, new mapboxgl.LngLatBounds(coords, coords));

            mapStore.map.fitBounds(newBounds, { padding: 100, maxZoom: 10 });
        }
    };

    const handlePopup = (poi) =>
    {
        mapStore.removeAllPopups();
        mapStore.add(
            {
                id: `${poi.lng} ${poi.lat}`,
                title: poi.fieldName,
                content: <LocationPopup addressString={poi.addressString} coordinates={[poi.lng, poi.lat]} />,
                lng: poi.lng,
                lat: poi.lat,
                width: 200,
                height: 100,
                isActivate: true,
                onClose: () => handleClosePopup(poi),
            },
        );
        mapStore.map.flyTo({
            center: [poi.lng, poi.lat],
            padding: { top: 120, bottom: 20, left: 20, right: 20 },
        });
    };

    const handleClosePopup = (poi) =>
    {
        mapStore.remove(`${poi.lng} ${poi.lat}`);
    };

    const handleZoomInPOI = (poi) =>
    {
        mapStore.map.flyTo({
            center: [poi.lng, poi.lat],
            zoom: 10,
            padding: { top: 120, bottom: 20, left: 20, right: 20 },
        });
        handlePopup(poi);
    };

    return (
        <>
            {
                center ?
                    <Map
                        height={height}
                        center={{
                            lng: center.longitude,
                            lat: center.latitude,
                        }}
                        onRender={handleMapRender}
                        zoomLevel={[zoom]}
                        scrollZoom={false}
                        isNotControl
                        interactive

                        lightStyleOverride={lightStyleOverride}
                        darkStyleOverride={darkStyleOverride}
                        satelliteStyleOverride={satelliteStyleOverride}
                        terrainStyleOverride={terrainStyleOverride}
                        boundaryStyleOverride={boundaryStyleOverride}
                    >
                        <ZoomControl className={'map-zoom-control'} />
                        {
                            geoData ? geoData.map((poi, index) =>
                            {
                                return (
                                    <MarkerLocation
                                        key={index}
                                        // ref={markerRef}
                                        location={{ longitude: poi.lng, latitude: poi.lat }}
                                        color={poi.markerColor}
                                        handleSelect={() => handlePopup(poi)}
                                    // location={poi}
                                    />
                                );
                            },
                            ) : null
                        }
                        
                        <MarkerPopupManager store={mapStore} />
                    </Map> : null
            }
            <CollapsibleSection
                className={'legend-overlay'}
                header={'Chú giải'}
                defaultExpanded
            >
                {
                    geoData.map((data) => (
                        <Container
                            key={data.fieldName}
                            className={'legend-address'}
                            onClick={() => handleZoomInPOI(data)}
                        >
                            <FAIcon
                                icon='map-marker-alt'
                                color={geoData.markerColor}
                                type='solid'
                                size='1.2rem'
                            />
                            <T>{data.fieldName}</T>
                        </Container>
                    ))
                }
            </CollapsibleSection>
        </>
    );
};

MiniMapViewer.propTypes = {
    geoData: PropTypes.array,
    recordData: PropTypes.object,
    height: PropTypes.string,
    onChange: PropTypes.func,
    isReadOnly: PropTypes.bool,
    zoom: PropTypes.number,

    lightStyleOverride: PropTypes.object,
    darkStyleOverride: PropTypes.object,
    satelliteStyleOverride: PropTypes.object,
    terrainStyleOverride: PropTypes.object,
    boundaryStyleOverride: PropTypes.object,
};
MiniMapViewer.defaultProps = {
    isReadOnly: false,
    height: '300px',
    zoom: 10,
    onChange: () =>
    {},
};

MiniMapViewer = inject('appStore', 'fieldForceStore')(observer(MiniMapViewer));
export default MiniMapViewer;

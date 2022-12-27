import React, { useContext } from 'react';
import { Map, useTenant } from '@vbd/vui';
import { MapUtil } from 'components/app/Map/MapUtil';
import { MapContext } from 'extends/ffms/pages/Layerdata/MapControl/MapContext';

import lightStyleOverride from 'extends/ffms/map-styles/light-style.override.js';
import darkStyleOverride from 'extends/ffms/map-styles/dark-style.override.js';
import satelliteStyleOverride from 'extends/ffms/map-styles/satellite-style.override.js';
import terrainStyleOverride from 'extends/ffms/map-styles/terrain-style.override.js';
import boundaryStyleOverride from 'extends/ffms/map-styles/boundary-style.override.js';

import { MAP_OPTIONS } from 'extends/ffms/constant/ffms-enum';
const MapEditor = (props) =>
{
    const tenantConfig = useTenant();
    const mapOptions = tenantConfig && tenantConfig.mapOptions ? tenantConfig.mapOptions : MAP_OPTIONS;
    const mapCenter = {
        lng: mapOptions.longitude,
        lat: mapOptions.latitude,
    };
    const { height, onMapStyleLoad } = props;

    const { mapState, dispatch } = useContext(MapContext);

    const onDrawCreate = (obj) =>
    {
        dispatch({
            type: 'createDraw',
            data: obj.features[0],
        });
    };
    const onDrawUpdate = (obj) =>
    {
        dispatch({
            type: 'setDrawObj',
            data: obj.features[0],
        });
    };
    const onDrawDelete = () =>
    {
        dispatch({
            type: 'setDrawObj',
            data: null,
        });
    };

    const onStyleLoad = (map) =>
    {
        map.addControl(mapState.draw, 'top-left');
        map.on('draw.create', onDrawCreate);
        map.on('draw.update', onDrawUpdate);
        map.on('draw.delete', onDrawDelete);

        mapState.map = map;
        mapState.mapUtil = new MapUtil(map);
        if (typeof onMapStyleLoad === 'function')
        {
            onMapStyleLoad(map);
        }
    };
    return (
        <Map
            center={mapCenter}
            zoomLevel={[12.5]}
            height={height}
            fontURL={''}
            lightStyleOverride={lightStyleOverride}
            darkStyleOverride={darkStyleOverride}
            satelliteStyleOverride={satelliteStyleOverride}
            terrainStyleOverride={terrainStyleOverride}
            boundaryStyleOverride={boundaryStyleOverride}
            saveViewport
            onStyleLoad={onStyleLoad}
        />
    );
};
MapEditor.defaultProps = {
    value: '',
    height: '40rem',
    onMapStyleLoad: (map) =>
    {
        map.resize();
    },
};
export { MapEditor };

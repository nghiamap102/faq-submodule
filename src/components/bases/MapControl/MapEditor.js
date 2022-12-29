import React, { useContext } from 'react';

import { Map } from 'components/bases/Map/Map';
import { MapUtil } from 'components/bases/Map/MapUtil';

import { MapContext } from './MapContext';

const MapEditor = (props) =>
{
    const mapCenter = props.center || {
        lng: 72.86427969590417,
        lat: 18.95459856681687,
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
            width={'100%'}
            fontURL={''}
            // saveViewport
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

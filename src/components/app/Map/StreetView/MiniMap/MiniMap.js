import '../StreetView.scss';

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Image as ImageMapbox } from 'react-mapbox-gl';

import {
    Container,
    Map,
} from '@vbd/vui';

import LayerManager from 'components/app/MapManager/LayerManager';

import MiniMapMarker from './MiniMapMarkers';

const MiniMap = (props) =>
{
    const { streetMap, setStreetMap, loadSceneLayerByLngLat, ICON_ROTATES } = props.appStore.streetViewStore;

    const handleLoadMap = (map) =>
    {
        setStreetMap('map', map);
    };

    const handleClickMap = (map, e) =>
    {
        loadSceneLayerByLngLat(e.lngLat, true);
    };

    if (!streetMap.center)
    {
        return null;
    }

    return (
        <Container className={'minimap'}>
            <Map
                center={{ lng: streetMap.center[0], lat: streetMap.center[1] }}
                zoomLevel={[18]}
                isNotControl
                onStyleLoad={handleLoadMap}
                onClick={handleClickMap}
            >
                {
                    Object.keys(ICON_ROTATES).map((iconId) =>
                    {
                        return (
                            <ImageMapbox
                                key={iconId}
                                id={`${iconId}-street`}
                                url={ICON_ROTATES[iconId]}
                            />
                        );
                    })
                }
                <LayerManager />
                <MiniMapMarker />
            </Map>
        </Container>
    );
};

export default inject('appStore')(observer(MiniMap));

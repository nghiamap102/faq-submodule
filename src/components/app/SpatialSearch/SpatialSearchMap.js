import './SpatialSearchMap.scss';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Layer, Source } from 'react-mapbox-gl';

import {
    Map, MapUtil,
    Positioned, Expanded,
} from '@vbd/vui';

import { BufferSizeControl } from 'components/app/SpatialSearch/BufferSizeControl';
import { LockDrawToolButton } from 'components/app/SpatialSearch/LockDrawToolButton';
import { SpatialSearchMarkerPopupManager } from 'components/app/SpatialSearch/SpatialSearchMarkerPopupManager';
import MarkerPopupManager from 'components/app/MapManager/MarkerPopupManager';

let SpatialSearchMap = (props) =>
{
    const spatialSearchStore = props.store;
    const mapCenter = { lng: 106.6029738547868, lat: 10.754634350198572 };

    const onDrawCreate = (obj) =>
    {
        if (spatialSearchStore.drawObj)
        {
            spatialSearchStore.drawTool.delete([spatialSearchStore.drawObj.id]);
        }
        spatialSearchStore.setDrawObj(obj.features[0]);
    };

    const onDrawUpdate = (obj) =>
    {
        spatialSearchStore.setDrawObj(obj.features[0]);
    };

    const onDrawDelete = (obj) =>
    {
        spatialSearchStore.setDrawObj(null);
    };

    const onMapStyleLoad = (map) =>
    {
        map.addControl(spatialSearchStore.drawTool, 'top-left');
        map.on('draw.create', onDrawCreate);
        map.on('draw.update', onDrawUpdate);
        map.on('draw.delete', onDrawDelete);

        spatialSearchStore.map = map;
        spatialSearchStore.mapUtil = new MapUtil(map);
        spatialSearchStore.mapUtil.initBufferLayers();
    };

    useEffect(() =>
    {
        spatialSearchStore.reset();
    }, []);

    return (
        <Expanded className={'spatial-search-map'}>
            <Map
                height={'100%'}
                width={'100%'}
                center={mapCenter}
                zoomLevel={[12.5]}
                onStyleLoad={onMapStyleLoad}
                onClick={props.onClick}
                onRender={(map) => props.onMapRender && props.onMapRender(map)}
            >
                <Positioned
                    top={'0.5rem'}
                    left={'130px'}
                >
                    <LockDrawToolButton store={spatialSearchStore} />
                </Positioned>

                <Positioned
                    top={'10px'}
                    left={'180px'}
                >
                    <BufferSizeControl store={spatialSearchStore} />
                </Positioned>

                {
                    props.lprSources && props.lprSources.map((source) =>
                    {
                        return (
                            <React.Fragment key={source.id}>
                                <Source
                                    id={`source_${source.name}`}
                                    // tileJsonSource={source}
                                />
                                <Layer
                                    type="raster"
                                    id={`layer_${source.name}`}
                                    sourceId={`source_${source.name}`}
                                />
                            </React.Fragment>
                        );
                    })
                }

                <SpatialSearchMarkerPopupManager
                    store={spatialSearchStore}
                    onMarkerClick={props.onMarkerClick}
                />
                <MarkerPopupManager store={props.popupStore} />
            </Map>
        </Expanded>
    );
};

SpatialSearchMap = observer(SpatialSearchMap);
export { SpatialSearchMap };

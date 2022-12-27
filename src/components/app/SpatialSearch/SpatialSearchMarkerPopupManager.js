import MAP_MARKER_IMG from 'images/markers/pin.png';

import React from 'react';
import { observer } from 'mobx-react';
import { Feature, Image, Layer } from 'react-mapbox-gl';

import { Container, MarkerPopup } from '@vbd/vui';

let SpatialSearchMarkerPopupManager = (props) =>
{
    const spatialSearchStore = props.store;

    const onMarkerClick = (data) =>
    {
        spatialSearchStore.addMapPopup(data);
        if (typeof props.onMarkerClick === 'function')
        {
            props.onMarkerClick(data);
        }
    };

    const data = spatialSearchStore.data;

    const IMAGES = {
        MAP_MARKER_IMG: { name: 'map-marker-img', src: MAP_MARKER_IMG },
    };

    const features = data?.map((d, index) => (
        <Feature
            key={index}
            coordinates={[d.y, d.x]}
            properties={d}
            draggable={false}
            onClick={() => onMarkerClick(d)}
        />
    ),
    );

    return (
        <>
            <Image
                id={IMAGES.MAP_MARKER_IMG.name}
                url={IMAGES.MAP_MARKER_IMG.src}
            />

            <Layer
                type="symbol"
                id="marker-image"
                filter={['!', ['has', 'iconText']]}
                layout={{ 'icon-image': IMAGES.MAP_MARKER_IMG.name }}
                minzoom={0}
            >
                {features}
            </Layer>

            <Layer
                type="symbol"
                id="marker-label"
                filter={['has', 'iconText']}
                layout={{
                    'text-field': '{text}',
                    'text-font': ['Roboto Medium'],
                    'text-size': 14,
                    'text-anchor': 'left',
                    'text-justify': 'left',
                    'text-offset': [1.5, 0],
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
                }}
                paint={{
                    'text-color': '#fff',
                    'text-halo-color': ['get', 'halo'],
                    'text-halo-width': 1,
                }}
            >
                {features}
            </Layer>

            <Layer
                type="symbol"
                id="marker-icon"
                filter={['has', 'iconText']}
                layout={{
                    'text-field': '{iconText}',
                    'text-font': ['Font Awesome Pro Light'],
                    'text-size': ['get', 'fontSize'],
                    'text-allow-overlap': true,
                    'text-ignore-placement': true,
                }}
                paint={{
                    'text-color': ['get', 'background'],
                    'text-halo-color': ['get', 'color'],
                    'text-halo-width': 2,
                }}
                minzoom={0}
            >
                {features}
            </Layer>

            {
                spatialSearchStore.popups?.map((p, index) => (
                    <MarkerPopup
                        key={'MarkerPopup-' + index}
                        {...p}
                    >
                        {
                            p.data && (
                                <Container style={{ margin: '0 1rem' }}>
                                    {React.cloneElement(spatialSearchStore.popupContent, { data: p.data })}
                                </Container>
                            )}
                    </MarkerPopup>
                ),
                )
            }
        </>
    );
};

SpatialSearchMarkerPopupManager = observer(SpatialSearchMarkerPopupManager);
export { SpatialSearchMarkerPopupManager };

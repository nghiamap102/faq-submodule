import CloseIcon from 'images/icon/close_white.png';

import { Feature, Marker, Layer } from 'react-mapbox-gl';
import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';

import { Image } from '@vbd/vui';

const MiniMapMarker = (props) =>
{
    const { personMapIcon, loadSceneLayerByLngLat, closeMapIcon, streetMap, setPersonMapIcon } = props.appStore.streetViewStore;
    const featureRef = useRef();

    // auto load when person MapIcon change
    useEffect(() =>
    {
        if (streetMap?.map)
        {
            streetMap.map.flyTo({
                center: personMapIcon.coordinates,
                zoom: Math.round(streetMap.map.getZoom())
            });
        }
    }, [personMapIcon?.coordinates]);

    const handleDragEnd = ((e) =>
    {
        loadSceneLayerByLngLat(e.lngLat, true).then((id) =>
        {
            if (!id)
            {
                const coordinates = personMapIcon?.coordinates;

                setPersonMapIcon(null, 'coordinates');
                setPersonMapIcon(coordinates, 'coordinates');
            }
        });
    });

    return (
        <>
            {
                personMapIcon?.coordinates &&
                <Layer
                    type={'symbol'}
                    id={'person-marker'}
                    layout={{
                        'icon-image': `${personMapIcon.degRotating}-street`,
                        'icon-allow-overlap': true, // important, reduce flickering when drag
                        'icon-ignore-placement': true, // important, reduce flickering when drag
                        'icon-anchor': 'bottom',
                        'icon-offset': [0, 18],
                        'icon-size': {
                            'base': 1,
                            'stops': [
                                [14, 0.4],
                                [15, 0.5],
                                [16, 0.6],
                                [17, 0.7],
                                [18, 0.8],
                                [19, 0.9],
                                [20, 1]
                            ]
                        }
                    }}
                >
                    <Feature
                        ref={featureRef}
                        coordinates={personMapIcon?.coordinates}
                        draggable
                        onDragEnd={handleDragEnd}
                    />
                </Layer>
            }

            {
                closeMapIcon?.coordinates &&
                <Marker
                    coordinates={closeMapIcon?.coordinates}
                    anchor="bottom"
                >
                    <Image
                        src={CloseIcon}
                        width={'1rem'}
                        height={'1rem'}
                    />
                </Marker>
            }
        </>
    );
};

export default inject('appStore')(observer(MiniMapMarker));


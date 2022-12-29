import React, { FC, useContext, useRef } from 'react';
import { Positioned } from 'components/bases/Positioned/Positioned';
import { Button } from 'components/bases/Button/Button';
import { Feature, Layer } from 'react-mapbox-gl';
import { CommonHelper } from 'helper/common.helper';
import { AdministrativeMapContext } from './AdministrativeMapContext';

type AdministrativeMarkerProps = {
    onLocationChange(location: any): any,
}
const AdministrativeMarker: FC<AdministrativeMarkerProps> = (props) =>
{
    const {
        map,
        location,
        clickToPin,
        setAdminMapState,
    } = useContext<any>(AdministrativeMapContext);
    const {
        onLocationChange,
    } = props;

    const onMapClick = useRef((event: any) =>
    {
        onLocationChange(event);
    }).current;

    const onMarkerDragEnd = (event: any) =>
    {
        onLocationChange(event);
    };
    return (
        <>
            <Positioned>
                <Button
                    className={`map-control map-control-button ${clickToPin && 'active'}`}
                    icon={'map-marker-plus'}
                    onlyIcon
                    onClick={() =>
                    {
                        if (clickToPin)
                        {
                            map.getCanvas().style.cursor = null;
                            map.off('click', onMapClick);
                        }
                        else
                        {
                            map.getCanvas().style.cursor = 'crosshair';
                            map.on('click', onMapClick);
                        }
                        setAdminMapState({ clickToPin: !clickToPin });
                    }}
                />
            </Positioned>
            <Layer
                type="symbol"
                id="map-location-marker"
                layout={{
                    'text-field': CommonHelper.getFontAwesomeStringFromClassName('map-marker-alt', 'solid'),
                    'text-font': ['Font Awesome Pro Solid'],
                    'text-size': 24,
                    'text-anchor': 'top',
                    'text-offset': [0, -1],
                    'text-ignore-placement': true, // important, reduce flickering when drag
                    'text-allow-overlap': true, // important, reduce flickering when drag
                }}
                paint={{
                    'text-color': '#037de8',
                    'text-halo-color': '#fff',
                    'text-halo-width': 0.8,
                }}
            >
                <Feature
                    coordinates={[location.longitude, location.latitude]}
                    draggable
                    onDragEnd={onMarkerDragEnd}
                />
            </Layer>
        </>
    );
};
export { AdministrativeMarker };

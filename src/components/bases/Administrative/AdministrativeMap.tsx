import React, { FC, useContext, useEffect } from 'react';
import { Map } from 'components/bases/Map/Map';
import { AdministrativeMapContext } from './AdministrativeMapContext';
import { AdministrativeMarker } from './AdministrativeMarker';

type AdministrativeMapProps = {
    onLocationChange?: Function,
    center?: { lng: number, lat: number },
    zoom?: number,
    height?: string,
    scrollZoom?: boolean,
    isNotControl?: boolean,
}

const AdministrativeMap: FC<AdministrativeMapProps> = (props) =>
{
    const {
        height = '300px',
        center,
        onLocationChange,
        zoom,
        scrollZoom,
        isNotControl,
    } = props;
    const {
        map,
        setAdminMapState,
    } = useContext<any>(AdministrativeMapContext);

    useEffect(() =>
    {
        if (map)
        {
            map.panTo(center);
        }
    }, [center]);

    // update location when move end
    const handleLocationChange = (event: any) =>
    {
        const location = {
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
        };
        onLocationChange && onLocationChange(location);
    };

    const onStyleLoad = (map: any) =>
    {
        setAdminMapState({ map: map });
    };

    return (

        <Map
            height={height}
            center={center}
            zoomLevel={[zoom]}
            isNotControl={isNotControl}
            scrollZoom={scrollZoom}
            fontURL=''
            onStyleLoad={onStyleLoad}
        >
            <AdministrativeMarker
                onLocationChange={handleLocationChange}
            />
        </Map>
    );
};

export { AdministrativeMap };

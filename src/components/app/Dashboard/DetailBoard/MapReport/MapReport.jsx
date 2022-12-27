import React, { useContext, useEffect } from 'react';

import { Map } from '@vbd/vui';

import { MapReportManager } from 'components/app/Dashboard/DetailBoard/MapReport/MapReportManager';
import { MapReportContext, MapReportProvider } from 'components/app/Dashboard/DetailBoard/MapReport/MapReportContext';

const MapReport = (props) =>
{
    const { setState } = useContext(MapReportContext);

    const mapCenter = props.center || { lng: 106.6029738547868, lat: 10.754634350198572 };

    useEffect(() =>
    {
        setState(props);
    }, [props]);

    const onMapStyleLoad = (map) =>
    {
        setState({ map: map });
        map.resize();
    };

    const onMapZoomEnd = (map) =>
    {
        setState({ zoomLevel: map.getZoom() });
    };

    // because Map will never re-render on report props change, so we need to by pass it by a context, simply store all report props
    return (
        <Map
            height={'100%'}
            width={'100%'}
            center={mapCenter}
            zoomLevel={[12.5]}
            fontURL={''}
            onStyleLoad={onMapStyleLoad}
            onZoomEnd={onMapZoomEnd}
        >
            <MapReportManager />
        </Map>
    );
};

const MapReportWithContext = (props) =>
{
    return (
        <MapReportProvider>
            <MapReport {...props} />
        </MapReportProvider>
    );
};

export { MapReportWithContext };

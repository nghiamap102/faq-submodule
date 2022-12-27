import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Layer, Source, Marker as MapMarker } from 'react-mapbox-gl';

import {
    Map,
    Container,
    MarkerPopup,
} from '@vbd/vui';

import { FaceDetectionPopupDetail } from 'components/app/FaceAlert/FaceDetection/FaceDetectionPopupDetail';

import { Constants } from 'constant/Constants';
import { CommonHelper } from 'helper/common.helper';
import { PlateDetectionService } from 'services/plateDetection.service';

let FaceHistoryMap = (props) =>
{
    const faceDetectionStore = props.appStore.faceAlertStore.faceDetectionStore;
    const mapCenter = { lng: 106.6029738547868, lat: 10.754634350198572 };

    return (
        <Map
            height={'100%'}
            center={faceDetectionStore.history.mapCenter || mapCenter}
            zoomLevel={[12.5]}
            onStyleLoad={(map) =>
            {
                map.resize();
                faceDetectionStore.setHistory('map', map);
            }}
        >
            <FaceHistoryMarkerPopupManager />
            <FaceHistoryVirtualRoute />
        </Map>
    );
};

let FaceHistoryVirtualRoute = (props) =>
{
    const faceDetectionStore = props.appStore.faceAlertStore.faceDetectionStore;

    useEffect(() =>
    {
        faceDetectionStore.setHistoryVirtualRoute(null);
        drawVirtualRoute();
    }, []);

    const drawVirtualRoute = async () =>
    {
        const data = CommonHelper.clone(faceDetectionStore.history.data);

        if (data && data.length && data.length > 1)
        {
            data.sort((a, b) => new Date(a.detectDate) > new Date(b.detectDate) ? 1 : -1);

            const points = [];
            const times = [];

            for (let i = 0; i < data.length; i++)
            {
                points.push({ 'Longitude': data[i].mapInfo.longitude, 'Latitude': data[i].mapInfo.latitude });
                times.push(Math.floor(new Date(data[i].detectDate) / 1000));
            }

            const routes = await new PlateDetectionService().getRoute(points, times.join('|'));

            if (routes)
            {
                const formatRoutes = { route_1: routes[0] };
                faceDetectionStore.setHistoryVirtualRoute(formatRoutes);
            }
            else // case not found direction
            {
                faceDetectionStore.setHistoryVirtualRoute(null);
            }

            faceDetectionStore.fitBoundHistoryMap(data);
        }
    };

    const routes = faceDetectionStore.history.virtualRoute;

    return (
        <>
            {
                routes &&
                Object.keys(routes).map((routeName, i) =>
                {
                    return routes[routeName]
                        ? (
                                <Container key={routeName}>

                                    <Source
                                        id={`${Constants.FACE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID}_${i}`}
                                        geoJsonSource={{
                                            'type': 'geojson',
                                            'data': {
                                                'type': 'Feature',
                                                'geometry': {
                                                    'type': 'LineString',
                                                    'coordinates': [...routes[routeName].Geometry],
                                                },
                                            },
                                        }}
                                    />
                                    <Layer
                                        type="line"
                                        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                                        // before={Constants.DIRECTION_ARROW_BODY_LAYER_ID + '-border'}
                                        paint={{
                                            'line-color': `${i !== 0 ? Constants.PATH_SECONDARY_COLOR : Constants.PATH_PRIMARY_COLOR}`,
                                            'line-width': {
                                                'base': 1,
                                                'stops': [
                                                    [13, 5],
                                                    [14, 6],
                                                    [15, 7],
                                                    [16, 8],
                                                    [17, 9],
                                                    [18, 10],
                                                    [19, 11],
                                                    [20, 12],
                                                ],
                                            },
                                        }}
                                        id={`${Constants.FACE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID}_${i}-body`}
                                        sourceId={`${Constants.FACE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID}_${i}`}
                                    />
                                </Container>
                            )
                        : <Container key={routeName} />;
                })
            }
        </>
    );
};

let FaceHistoryMarkerPopupManager = (props) =>
{
    const faceDetectionStore = props.appStore.faceAlertStore.faceDetectionStore;

    const onMarkerClick = (data) =>
    {
        faceDetectionStore.addHistoryPopup(data);
    };

    const data = CommonHelper.clone(faceDetectionStore.history.data);

    return (
        <>
            {
                data && data.sort((a, b) => new Date(a.detectDate) > new Date(b.detectDate) ? 1 : -1).map((d, index) => (
                    <MapMarker
                        key={'history-marker' + index}
                        style={{ cursor: 'pointer' }}
                        coordinates={[d.y, d.x]}
                        anchor="bottom"
                        onClick={() =>
                        {
                            onMarkerClick(d);
                        }}
                    >
                        <Container className={`history-middle-marker ${index === 0 ? 'start' : ''} ${index === data.length - 1 ? 'end' : ''}`}>
                            {index + 1}
                        </Container>

                        {/* <FAIcon */}
                        {/*    icon={index === 0 ? 'play-circle' : index === data.length - 1 ? 'stop-circle' : 'circle'} */}
                        {/*    color={index === 0 ? '#25d001' : index === data.length - 1 ? '#ff1313' : '#f17702'} */}
                        {/*    type='solid' */}
                        {/*    size={index === 0 || index === data.length - 1 ? '18pt' : '10pt'} */}
                        {/* /> */}
                    </MapMarker>
                ),
                )
            }

            {
                faceDetectionStore.history.popups.map((p, index) => (
                    <MarkerPopup
                        key={index}
                        {...p}
                    >
                        {
                            p.data && (
                                <Container style={{ margin: '0 1rem' }}>
                                    <FaceDetectionPopupDetail
                                        data={p.data}
                                        mini
                                    />
                                </Container>
                            )}
                    </MarkerPopup>
                ),
                )
            }
        </>
    );
};

FaceHistoryMarkerPopupManager = inject('appStore')(observer(FaceHistoryMarkerPopupManager));
FaceHistoryMap = inject('appStore')(observer(FaceHistoryMap));
FaceHistoryVirtualRoute = inject('appStore')(observer(FaceHistoryVirtualRoute));

export { FaceHistoryMap };


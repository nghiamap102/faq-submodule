import React from 'react';
import { inject, observer } from 'mobx-react';
import { Feature, Layer } from 'react-mapbox-gl';

import {
    Map,
    Container,
    FormControlLabel,
    TB1,
    Column,
    MarkerPopup,
} from '@vbd/vui';

import { Constants } from 'constant/Constants';
import { CommonHelper } from 'helper/common.helper';

let CameraMonitoringMap = (props) =>
{
    const { store } = props;

    const mapCenter = { lng: 106.6029738547868, lat: 10.754634350198572 };

    const onMapStyleLoad = (map) =>
    {
        store.map = map;
        store.fitBound();
    };

    return (
        <Map
            height={'100%'}
            width={'100%'}
            center={mapCenter}
            zoomLevel={[12.5]}
            fontURL={''}
            onStyleLoad={onMapStyleLoad}
        >
            <CameraMonitoringMarkerPopupManager />
        </Map>
    );
};

let CameraMonitoringMarkerPopupManager = (props) =>
{
    const { store } = props;
    const onMarkerClick = (data) =>
    {
        store.addMapPopup(data);
    };

    const markerPopupDetail = (d) =>
    {
        return (
            <Column>
                <FormControlLabel
                    label={'Tên'}
                    labelWidth={'8rem'}
                    control={(
                        <TB1 className={`status-text ${d.CameraName || 'no-data'}`}>
                            {d.CameraName || 'Không có dữ liệu'}
                        </TB1>
                    )}
                />

                <FormControlLabel
                    label={'Seri'}
                    labelWidth={'8rem'}
                    control={(
                        <TB1 className={`status-text ${d.SERI_CAMERA || 'no-data'}`}>
                            {d.quality?.count7d.val || 'Không có dữ liệu'}
                        </TB1>
                    )}
                />

                <FormControlLabel
                    label={'Mã vị trí'}
                    labelWidth={'8rem'}
                    control={(
                        <TB1 className={`status-text ${d.MA_VI_TRI || 'no-data'}`}>
                            {d.MA_VI_TRI || 'Không có dữ liệu'}
                        </TB1>
                    )}
                />

                <FormControlLabel
                    label={'Trạng thái tín hiệu'}
                    labelWidth={'8rem'}
                    control={(
                        <TB1 className={`status-text ${d.signal === Constants.CAMERA_STATUS.GOOD ? 'good' : d.signal === Constants.CAMERA_STATUS.BROKEN ? 'broken' : 'no-data'}`}>
                            {d.signal === Constants.CAMERA_STATUS.GOOD ? 'Tốt' : d.signal === Constants.CAMERA_STATUS.BROKEN ? 'Hỏng' : 'Không có dữ liệu'}
                        </TB1>
                    )}
                />
                <FormControlLabel
                    label={'Ago'}
                    labelWidth={'8rem'}
                    control={(
                        <TB1
                            className={`status-text ${d.AgoStatus === Constants.CAMERA_STATUS.GOOD ? 'good' : d.AgoStatus === Constants.CAMERA_STATUS.BROKEN ? 'broken' : 'no-data'}`}
                        >
                            {d.Ago || 'Không có dữ liệu'}
                        </TB1>
                    )}
                />
                <FormControlLabel
                    label={'Diff'}
                    labelWidth={'8rem'}
                    control={(
                        <TB1 className={`status-text ${d.Diff || 'no-data'}`}>
                            {d.Diff || 'Không có dữ liệu'}
                        </TB1>
                    )}
                />
                <FormControlLabel
                    label={'Giờ hệ thống'}
                    labelWidth={'8rem'}
                    control={(
                        <TB1 className={`status-text ${d.ServerTime || 'no-data'}`}>
                            {d.ServerTime || 'Không có dữ liệu'}
                        </TB1>
                    )}
                />
                <FormControlLabel
                    label={'Giờ thiết bị'}
                    labelWidth={'8rem'}
                    control={(
                        <TB1 className={`status-text ${d.DeviceTime || 'no-data'}`}>
                            {d.DeviceTime || 'Không có dữ liệu'}
                        </TB1>
                    )}
                />
            </Column>
        );
    };

    return (
        <>
            {
                store.popups.map((p) => (
                    <MarkerPopup
                        key={p.id}
                        {...p}
                    >
                        {
                            p.data && (
                                <Container style={{ margin: '0 1rem' }}>
                                    {markerPopupDetail(p.data)}
                                </Container>
                            )}
                    </MarkerPopup>
                ),
                )
            }
            <Layer
                type="symbol"
                id="marker"
                layout={{
                    'text-field': '{icon}',
                    'text-font': ['Font Awesome Pro Solid'],
                    'text-size': 24,
                    'text-anchor': 'top',
                }}
                paint={{
                    'text-color': ['get', 'color'],
                }}
            >
                {
                    store.data.map((c, index) =>
                    {
                        const ok = !(c.signal === Constants.CAMERA_STATUS.BROKEN || c.AgoStatus === Constants.CAMERA_STATUS.BROKEN);
                        return (
                            <Feature
                                key={c.Id}
                                coordinates={[c.y, c.x]}
                                properties={{
                                    'icon': CommonHelper.getFontAwesomeStringFromClassName('camera', 'solid'),
                                    'color': ok
                                        ? Constants.CAMERA_STATUS_COLOR.GOOD
                                        : Constants.CAMERA_STATUS_COLOR.BROKEN,
                                }}
                                onClick={() =>
                                {
                                    onMarkerClick(c);
                                }}
                            />
                        );
                    },
                    )}
            </Layer>
        </>

    );
};

CameraMonitoringMap = inject('store')(observer(CameraMonitoringMap));
CameraMonitoringMarkerPopupManager = inject('store')(observer(CameraMonitoringMarkerPopupManager));

export { CameraMonitoringMap, CameraMonitoringMarkerPopupManager };

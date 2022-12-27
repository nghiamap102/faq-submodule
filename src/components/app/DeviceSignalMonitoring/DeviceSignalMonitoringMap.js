import './DeviceSignalMonitoring.scss';

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Feature, Layer } from 'react-mapbox-gl';

import {
    Map,
    Column, Container,
    FormControlLabel,
    TB1,
    MarkerPopup,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import { Constants } from 'constant/Constants';

let DeviceSignalMonitoringMap = (props) =>
{
    const mapCenter = { lng: 106.6029738547868, lat: 10.754634350198572 };
    const onStyleLoad = (map) =>
    {
        map.resize();
    };

    return (
        <Map
            height={'100%'}
            width={'100%'}
            center={mapCenter}
            zoomLevel={[12.5]}
            fontURL={''}
            onStyleLoad={onStyleLoad}
        >
            <CameraMonitoringMarkerPopupManager />
        </Map>
    );
};

const markerPopupDetail = (d) =>
{
    return (
        <Column>
            <FormControlLabel
                label={'Tên'}
                labelWidth={'8rem'}
                control={(
                    <TB1 className={`status-text ${d.name ? '' : 'no-data'}`}>
                        {d.name || 'Không có dữ liệu'}
                    </TB1>
                )}
            />
            <FormControlLabel
                label={'Host'}
                labelWidth={'8rem'}
                control={(
                    <TB1 className={`status-text ${d.host ? '' : 'no-data'}`}>
                        {d.host || 'Không có dữ liệu'}
                    </TB1>
                )}
            />
            <FormControlLabel
                label={'Trạng thái'}
                labelWidth={'8rem'}
                control={(
                    <TB1 className={`status-text ${d.signal === 1 ? 'good' : 'bad'}`}>
                        {d.signal === 1 ? 'Tốt' : 'Hỏng'}
                    </TB1>
                )}
            />
            <FormControlLabel
                label={'Lỗi'}
                labelWidth={'8rem'}
                control={(
                    <TB1 className={`status-text ${d.error ? '' : 'no-data'}`}>
                        {d.error || 'Không có dữ liệu'}
                    </TB1>
                )}
            />
        </Column>
    );
};

let CameraMonitoringMarkerPopupManager = (props) =>
{
    const { deviceSignalStore } = props;
    const onMarkerClick = (data) =>
    {
        deviceSignalStore.addMapPopup(data);
    };

    return (
        <>
            {
                deviceSignalStore.popups.map((p) => (
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
                id="device-signal-marker"
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
                    deviceSignalStore.data.map((d, index) => (
                        <Feature
                            key={index}
                            coordinates={[d.y, d.x]}
                            properties={{
                                'icon': CommonHelper.getFontAwesomeStringFromClassName('map-marker-alt', 'solid'),
                                'color': d.signal === 1 ? Constants.CAMERA_STATUS_COLOR.GOOD : Constants.CAMERA_STATUS_COLOR.BAD,
                            }}
                            onClick={() => onMarkerClick(d)}
                        />
                    ))
                }
            </Layer>
        </>
    );
};

CameraMonitoringMarkerPopupManager = inject('deviceSignalStore')(observer(CameraMonitoringMarkerPopupManager));
DeviceSignalMonitoringMap = inject('deviceSignalStore')(observer(DeviceSignalMonitoringMap));
export default DeviceSignalMonitoringMap;

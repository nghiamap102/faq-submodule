import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { CameraService } from 'services/camera.service';

import { Camera } from '@vbd/vui';

import { LayerSwitcherBoard } from './LayerSwitcherBoard';

export class CameraSwitcherBoard extends Component
{
    cameraSvc = new CameraService();

    cameraData = this.props.appStore.layerStore.cameraData;

    markerStore = this.props.appStore.markerStore;
    markerPopupStore = this.props.appStore.markerPopupStore;
    popupStore = this.props.appStore.popupStore;
    layerStore = this.props.appStore.layerStore;

    onCameraMarkerClicked = (data) =>
    {
        const store = this.markerPopupStore;
        store.setStates('isActivate', false);
        const popup = store.getPopup(data.id);

        if (!popup)
        {
            store.add({
                id: data.id,
                title: data.title,
                sub: data.sub,
                content: (
                    <Camera
                        type={data.type}
                        data={data}
                    />
                ),
                lng: data.lng,
                lat: data.lat,
                width: 350,
                height: 230,
                // location: 'bottom',
                isActivate: true,
                onFocus: this.onMarkerPopupFocus,
                onClose: this.onMarkerPopupClose
                // headerActions: [{ icon: 'film-alt' }, { icon: 'external-link' }],
                // actions: [{ icon: 'sliders-v' }, { icon: 'link' }, { icon: 'engine-warning' }, { icon: 'exclamation-triangle' }]
            });
        }
        else
        {
            this.popupStore.setState(data.id, 'isActivate', true);
        }
    };

    onMarkerPopupFocus = (event) =>
    {
        const store = this.markerPopupStore;
        store.setStates('isActivate', false);
        store.setState(event.id, 'isActivate', true);
    };

    onMarkerPopupClose = (event) =>
    {
        this.markerPopupStore.remove(event.id);
    };

    handleChange = async (item, checked) =>
    {
        if (checked)
        {
            if (item.Id === 'CAMERAGIAOTHONG')
            {
                const rs = await this.cameraSvc.getMjpegCameraList();

                if (rs && rs.status && rs.status.success)
                {
                    for (const d of rs.data)
                    {
                        const location = JSON.parse(d.Location);
                        this.markerStore.add(Object.assign(d, {
                            id: d.Id,
                            title: d.CamName,
                            sub: '',
                            icon: 'video',
                            color: 'white',
                            draw: 'symbol',
                            text: d.CamName || '',
                            lng: location.coordinates[0],
                            lat: location.coordinates[1],
                            layer: 'CAMERAGIAOTHONG',
                            type: 'Mjpeg',
                            onClick: this.onCameraMarkerClicked
                        }));
                    }
                }
            }
            else if (item.Id === 'CAMERAGT')
            {
                const rs = await this.cameraSvc.getSnapShotCameraList();

                if (rs && rs.status && rs.status.success)
                {
                    for (const d of rs.data)
                    {
                        const location = JSON.parse(d.Location);
                        this.markerStore.add(Object.assign(d, {
                            id: d.Id,
                            title: d.DisplayName || d.Title,
                            sub: d.Code,
                            icon: 'camera',
                            color: 'white',
                            draw: 'symbol',
                            text: d.DisplayName || '',
                            lng: location.coordinates[0],
                            lat: location.coordinates[1],
                            layer: 'CAMERAGT',
                            type: 'Snapshot',
                            onClick: this.onCameraMarkerClicked
                        }));
                    }
                }
            }
            else if (item.Id === 'CAMERASTREAM')
            {
                const rs = await this.cameraSvc.getStreamCameraList();

                if (rs)
                {
                    for (const d of rs.data)
                    {
                        const location = JSON.parse(d.location);

                        if (location && location.coordinates)
                        {
                            this.markerStore.add(Object.assign(d, {
                                id: d.id,
                                title: d.cameraName,
                                sub: d.description,
                                icon: 'video',
                                color: 'white',
                                draw: 'symbol',
                                text: d.cameraName || '',
                                lng: location.coordinates[0],
                                lat: location.coordinates[1],
                                layer: 'CAMERASTREAM',
                                type: 'Stream',
                                onClick: this.onCameraMarkerClicked
                            }));
                        }
                    }
                }
            }

            this.layerStore.add({ id: item.Id, ...item.layerInfo });
        }
        else
        {
            this.markerStore.removeBy((m) => m.layer === item.Id);
            this.layerStore.remove(item.Id);
        }
    };

    render()
    {
        return (
            <LayerSwitcherBoard
                data={this.cameraData}
                onChange={this.handleChange}
            />
        );
    }
}

CameraSwitcherBoard = inject('appStore')(observer(CameraSwitcherBoard));

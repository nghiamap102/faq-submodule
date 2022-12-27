import './TrackingSwitcherBoard.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action, autorun } from 'mobx';
import TrackingService from 'services/tracking.service';

import { withModal } from '@vbd/vui';

import { VehicleContent } from 'components/app/PopupContent/VehiclePopup';

import { LayerSwitcherBoard } from './LayerSwitcherBoard';

export class TrackingSwitcherBoard extends Component
{
    trackingSrc = new TrackingService();
    combineFlag = 0;
    combineTrans = 0;
    trackingData = this.props.appStore.layerStore.trackingData;
    intervalTracking = undefined;

    batchClear = action(() =>
    {
        // by putting it inside an action
        // this will prevent marker manager or symbol manager trigger render every time we remove marker
        // => better performance

        for (const marker of this.props.appStore.markerStore.markers)
        {
            if (marker.type === 'tracking')
            {
                this.props.appStore.markerStore.remove(marker.id);
            }
        }
    });

    batchUpdate = action((trackers) =>
    {
        // by putting it inside an action
        // this will prevent marker manager or symbol manager trigger render every time we add marker
        // => better performance

        for (const tracker of trackers)
        {
            let icon = '';
            let layer = '';

            switch (tracker.TransType)
            {
                case 1:
                    icon = 'car';
                    layer = 'XECANHSAT';
                    break;
                case 2:
                    icon = 'car-garage';
                    layer = 'XETHEODOI';
                    break;
                case 4:
                    icon = 'mobile';
                    layer = 'THIETBIDIDONG';
                    break;
                case 8:
                    icon = 'motorcycle';
                    layer = 'XEMAY';
                    break;
                case 16:
                    icon = 'camera';
                    layer = 'BODYCAMERA';
                    break;
                default:
            }

            let color = '';
            let heading = null;

            if ((tracker.Status & 256) === 256)
            {
                color = '#07ff07';
                heading = Math.round(tracker.Heading);
            }
            else if ((tracker.Status & 16384) === 16384)
            {
                color = 'darkgray';
            }
            else if ((tracker.Status & 64) === 64)
            {
                color = 'yellow';
            }

            const marker = this.props.appStore.markerStore.getPopup(tracker.TrackerID);
            if (!marker)
            {
                this.props.appStore.markerStore.add({
                    id: tracker.TrackerID,
                    layer: layer,
                    icon: icon,
                    color: color,
                    size: 48,
                    heading: heading,
                    isNotify: false,
                    lng: tracker.Longitude,
                    lat: tracker.Latitude,
                    title: tracker.Title,
                    type: 'tracking',
                    onClick: this.handleClickMarker,
                });
            }
            else
            {
                this.props.appStore.markerStore.updateProps(marker, {
                    lng: tracker.Longitude,
                    lat: tracker.Latitude,
                    color: color,
                    heading: heading,
                });
            }
        }

        const removeList = [];
        for (const marker of this.props.appStore.markerStore.markers)
        {
            if (marker.type === 'tracking')
            {
                const found = trackers.find((d) => marker.id === d.TrackerID);
                if (!found)
                {
                    removeList.push(marker.id);
                }
            }
        }

        for (const id of removeList)
        {
            this.props.appStore.markerStore.remove(id);
        }
    });

    getTrackingData = () =>
    {
        if (!this.combineFlag || !this.combineTrans)
        {
            return;
        }

        this.trackingSrc.getDeviceOptimizeBoundsStatusCounting(this.combineFlag, this.combineTrans, this.props.appStore.mapStore.getViewport).then((rs) =>
        {
            if (rs && rs.data)
            {
                this.batchUpdate(rs.data.TrackerData);
            }
        });
    };

    handleClickMarker = async (data) =>
    {
        const rs = await this.trackingSrc.getDeviceByTrackerId(data.id);

        const popupStore = this.props.appStore.markerPopupStore;
        popupStore.setStates('isActivate', false);

        const popup = popupStore.getPopup(data.id);

        if (!popup && rs.data && rs.data.length)
        {
            popupStore.add({
                id: data.id,
                title: rs.data[0].PlateNumber,
                sub: '',
                content: (
                    <VehicleContent
                        userData={rs.data[0].Metadata ? rs.data[0].Metadata : null}
                        {...rs.data[0]}
                    />
                ),
                lng: data.lng,
                lat: data.lat,
                width: 350,
                height: 230,
                // location: 'bottom',
                isActivate: true,
                onFocus: this.onMarkerPopupFocus,
                onClose: this.onMarkerPopupClose,
                // headerActions: [{ icon: 'film-alt' }, { icon: 'external-link' }],
                // actions: [{ icon: 'sliders-v' }, { icon: 'link' }, { icon: 'engine-warning' }, { icon: 'exclamation-triangle' }]
            });
        }
        else
        {
            popupStore.setState(data.id, 'isActivate', true);
        }
    };

    onMarkerPopupClose = (event) =>
    {
        this.props.appStore.markerPopupStore.remove(event.id);
    };

    getDataTimer = null;
    handleChange = (item, checked) =>
    {
        if (checked)
        {
            this.props.appStore.layerStore.add({ id: item.Id, ...item.layerInfo });
        }
        else
        {
            this.props.appStore.layerStore.remove(item.Id);
        }

        // let all change process in one time
        if (this.getDataTimer)
        {
            clearTimeout(this.getDataTimer);
        }

        this.getDataTimer = setTimeout(async () =>
        {
            this.combineFlag = 0;
            this.combineTrans = 0;

            this.trackingData.childes[0].childes.forEach((e) =>
            {
                if (e.checkingType === 1)
                {
                    this.combineFlag |= e.flagStatus;
                }
            });

            this.trackingData.childes[1].childes.forEach((e) =>
            {
                if (e.checkingType === 1)
                {
                    this.combineTrans |= e.transType;
                }
            });

            // clear all marker
            this.batchClear();

            this.getTrackingData();

            if (this.intervalTracking)
            {
                clearInterval(this.intervalTracking);
            }

            this.intervalTracking = setInterval(async () =>
            {
                this.getTrackingData();
            }, 10000);
        }, 100);
    };

    viewportTimer = null;
    mapViewportChange = autorun(() =>
    {
        const mapView = this.props.appStore.mapStore.getViewport; // make it so it can trigger when value change

        if (mapView)
        {
            if (this.viewportTimer != null)
            {
                clearTimeout(this.viewportTimer);
            }

            this.viewportTimer = setTimeout(() =>
            {
                this.getTrackingData();
            }, 100);
        }
    });

    onSettingClick = (e) =>
    {
        this.props.menu({
            id: 'tracking-layer-setting',
            isTopLeft: false,
            position: { x: e.clientX, y: e.clientY },
            actions: [
                {
                    label: 'Hiện biển số',
                    className: 'ml-show-tracking-label-option',
                    iconClassName: 'ml-icon ' + (this.props.appStore.layerStore.isShowLabel ? 'ml-checked' : ''),
                    onClick: () =>
                    {
                        this.props.appStore.layerStore.setShowLabel();
                    },
                },
            ],
        });
    };

    render()
    {
        return (
            <LayerSwitcherBoard
                data={this.trackingData}
                onChange={this.handleChange}
                onExpand={this.props.onExpand}
                onCollapse={this.props.onCollapse}
                onSettingClick={this.onSettingClick}
            />
        );
    }
}

TrackingSwitcherBoard = withModal(inject('appStore')(observer(TrackingSwitcherBoard)));

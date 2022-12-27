import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action, autorun } from 'mobx';

import TrackingService from 'services/tracking.service';

import { TCDBContent } from 'components/app/PopupContent/TCDBPopup';

import { LayerSwitcherBoard } from './LayerSwitcherBoard';

export class TrackingTCDBSwitcherBoard extends Component
{
    trackingSrc = new TrackingService();
    combineFlag = 0;
    combineTrans = 0;
    trackingDataTCDB = this.props.appStore.layerStore.trackingDataTCDB;
    intervalTracking = undefined;

    batchClear = action(() =>
    {
        // by putting it inside an action
        // this will prevent marker manager or symbol manager trigger render every time we remove marker
        // => better performance

        for (const marker of this.props.appStore.markerStore.markers)
        {
            if (marker.type === 'trackingTCDB')
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
            const icon = 'truck-moving';
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
            else if ((tracker.Status & 32) === 32)
            {
                color = '#ef7930';
            }
            else if ((tracker.Status & 16384) === 16384)
            {
                color = 'darkgray';
            }
            else if ((tracker.Status & 128) === 128)
            {
                color = 'red';
            }

            const marker = this.props.appStore.markerStore.getPopup(tracker.TrackerID);
            if (!marker)
            {
                this.props.appStore.markerStore.add({
                    id: tracker.TrackerID,
                    layer: 'TrackingTCDB',
                    icon: icon,
                    color: color,
                    draw: 'symbol',
                    size: 40,
                    heading: heading,
                    lng: tracker.Longitude,
                    lat: tracker.Latitude,
                    type: 'trackingTCDB',
                    onClick: this.handleClickMarker
                });
            }
            else
            {
                this.props.appStore.markerStore.updateProps(marker, {
                    lng: tracker.Longitude,
                    lat: tracker.Latitude,
                    color: color,
                    heading: heading
                });
            }
        }

        const removeList = [];
        for (const marker of this.props.appStore.markerStore.markers)
        {
            if (marker.type === 'trackingTCDB')
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

    getTrackingDataTCDB = async () =>
    {
        if (!this.combineFlag || !this.combineTrans)
        {
            return;
        }

        this.trackingSrc.getDeviceOptimizeBoundsStatusCountingTCDB(this.combineFlag, this.combineTrans, this.props.appStore.mapStore.getViewport).then((rs) =>
        {
            if (rs && rs.TrackerData)
            {
                this.batchUpdate(rs.TrackerData);
            }
        });
    };


    handleClickMarker = async (data) =>
    {
        const rs = await this.trackingSrc.getDeviceByTrackerIdTCDB(data.id);

        const markerPopupStore = this.props.appStore.markerPopupStore;
        markerPopupStore.setStates('isActivate', false);

        const popup = markerPopupStore.getPopup(data.id);

        if (!popup && rs.data && rs.data.length)
        {
            markerPopupStore.add({
                id: data.id,
                title: rs.data[0].PlateNumber,
                sub: '',
                content: <TCDBContent {...rs.data[0]}/>,
                lng: data.lng,
                lat: data.lat,
                width: 350,
                height: 180,
                isActivate: true,
                onClose: this.onMarkerPopupClose,
                // headerActions: [{ icon: 'film-alt' }, { icon: 'external-link' }],
                // actions: [{ icon: 'sliders-v' }, { icon: 'link' }, { icon: 'engine-warning' }, { icon: 'exclamation-triangle' }]
            });
        }
        else
        {
            markerPopupStore.setState(data.id, 'isActivate', true);
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

            this.trackingDataTCDB.childes[0].childes.forEach((e) =>
            {
                if (e.checkingType === 1)
                {
                    this.combineFlag |= e.flagStatus;
                }
            });

            this.trackingDataTCDB.childes[1].childes.forEach((e) =>
            {
                if (e.checkingType === 1)
                {
                    this.combineTrans |= e.transType;
                }
            });

            // clear all marker
            this.batchClear();

            this.getTrackingDataTCDB();

            if (this.intervalTracking)
            {
                clearInterval(this.intervalTracking);
            }

            this.intervalTracking = setInterval(async () =>
            {
                this.getTrackingDataTCDB();
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
                this.getTrackingDataTCDB();
            }, 100);
        }
    });

    render()
    {
        return (
            <LayerSwitcherBoard
                data={this.trackingDataTCDB}
                onChange={this.handleChange}
            />
        );
    }
}

TrackingTCDBSwitcherBoard = inject('appStore')(observer(TrackingTCDBSwitcherBoard));

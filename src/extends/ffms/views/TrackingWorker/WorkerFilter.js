
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import moment from 'moment';
import { withRouter } from 'react-router';
import _findIndex from 'lodash/findIndex';

import { LayerSwitcherBoard } from 'components/app/LayerSwitcher/LayerSwitcherBoard';
import { RouterParamsHelper } from 'helper/router.helper';

import * as Routers from 'extends/ffms/routes';

import { LayerSwitcherItem } from 'extends/ffms/views/LayerSwitcher/LayerSwitcherItem';
import OrganizationService from 'extends/ffms/services/OrganizationService';
import GeocodeService from 'extends/ffms/services/GeocodeService';
import EmployeeService from 'extends/ffms/services/EmployeeService';
import { MarkerPopupContain } from 'extends/ffms/views/TrackingHistory/MarkerPopupContain';


class WorkerFilter extends Component
{
    workerStore = this.props.fieldForceStore.workerStore;
    trackingWorkerData = this.workerStore.trackingWorkerData;
    historyStore = this.props.fieldForceStore.historyStore;
    mapStore = this.props.appStore.mapStore;

    trackingSvc = this.workerStore.trackingSvc;
    orgSvc = new OrganizationService();
    geocodeSvc = new GeocodeService();
    empSvc = new EmployeeService(this.props.fieldForceStore?.appStore?.contexts);

    combineJobStatus = 0;
    combineEmpType = 0;
    combineOrgIds = [];
    intervalTracking = undefined;
    empTypes = undefined;
    statuses = undefined;

    async componentDidMount()
    {
        this.props.appStore.layerStore.isShowLabel = true;

        if (this.workerStore.toggleDataOn && !this.workerStore.workers || !this.workerStore.workers.length)
        {
            this.workerStore.trackingLayers.forEach((layer) =>
            {
                this.handleChange(layer, true);
            });
        }

    }

    getIconLayer = async (empId) =>
    {
        if (!this.workerStore.empTypes)
        {
            const empTypes = await this.empSvc.getEmpTypes();
            this.workerStore.empTypes = empTypes;
        }

        return this.workerStore.empTypes.filter((type) => type.employeetype_id === empId)[0] ?? {};
    };

    handleViewHistoryDriverClick = async (driverName) =>
    {
        // await this.historyStore.setFilters(driverName, moment().startOf('date'), moment().endOf('date'));
        // await this.historyStore.selectHistoryDebounced();
        // await this.historyStore.getGPSLogByDay(moment(), driverName);

        // this.historyStore.urlParams = {};
        // this.props.history.push(`${Routers.HISTORY}?username=${driverName}&from=${}&to=${}`);

        const data = {
            username: driverName,
            from: moment().startOf('date').format('x'),
            to: moment().endOf('date').format('x'),
        };
        RouterParamsHelper.setParamsWithPathName(Routers.HISTORY, this.historyStore.urlParams, this.props, data);
    }

    handleZoomLocationDriver = async (driver) =>
    {
        if (this.mapStore.map !== undefined)
        {
            this.mapStore.map.flyTo({
                center: [driver.lng, driver.lat],
                zoom: 25,
                padding: { top: 20, bottom: 20, left: 550, right: 80 },
            });
        }
    }

    handlePinTracker = (data) =>
    {
        const pinnedIndex = _findIndex(this.workerStore.pinnedTrackers, (w) => w.trackerId === data.trackerId);
        if (pinnedIndex >= 0)
        {
            data.pinned = false;
            this.workerStore.pinnedTrackers[pinnedIndex].pinned = false;
            this.workerStore.pinnedTrackers.splice(pinnedIndex, 1);
        }
        else
        {
            const worker = this.workerStore?.workers?.filter((w) => w.trackerId === data.trackerId)[0];

            if (worker)
            {
                this.workerStore.togglePinnedTracker(worker);
            }
            else
            {
                data.pinned = true;
                this.workerStore.pinnedTrackers.push(data);
            }
        }
    }

    handleClickWorker = async (data) =>
    {
        const rs = await this.trackingSvc.getDeviceByTrackerId(data.id);
        // const status = this.historyStore.getTrackingStatus(rs.data[0].jobStatus);
        if (rs.data && rs.data[0])
        {
            const status = this.workerStore.getTrackingStatus(rs.data[0][this.workerStore.trackingSvc.TRACKING_FIELD]);
            const geocode = await this.geocodeSvc.reverseGeocode([[data.lng, data.lat]]);
            let address = '';
            if (geocode && geocode.status && geocode.status.code === 200 && !geocode.status.message)
            {
                const { State, District, Tehsil, PinCode } = geocode.data[0];
                address = [State, District, Tehsil, PinCode].filter((x) => x).join(', ');
            }

            const popupStore = this.props.appStore.markerPopupStore;
            popupStore.setStates('isActivate', false);

            const popup = popupStore.getPopup(data.id);

            if (!popup && rs.data && rs.data.length)
            {
                popupStore.add({
                    id: data.id,
                    title: rs.data[0].driver,
                    sub: '',
                    content: (
                        <MarkerPopupContain
                            status={status}
                            speed={rs.data[0].speed}
                            trackerId={rs.data[0].trackerId}
                            direction={rs.data[0].heading}
                            timestamp={rs.data[0].ts} // v2,v3: ts, v1: timestamp
                            address={address}
                        />
                    ),
                    lng: data.lng,
                    lat: data.lat,
                    width: 350,
                    height: 130,
                    isActivate: true,
                    onClose: this.onMarkerPopupClose,
                    headerActions: [
                        {
                            icon: 'thumbtack',
                            onClick: () => this.handlePinTracker(rs.data[0]),
                        },
                        { icon: 'route', onClick: () => this.handleViewHistoryDriverClick(rs.data[0].driver) },
                        { icon: 'crosshairs', onClick: () => this.handleZoomLocationDriver(rs.data[0]) },
                    ],
                // actions: [{ icon: 'sliders-v' }, { icon: 'link' }, { icon: 'engine-warning' }, { icon: 'exclamation-triangle' }]
                });
            }
            else
            {
                popupStore.setState(data.id, 'isActivate', true);
            }
        }
    }

    onMarkerPopupClose = (event) =>
    {
        this.props.appStore.markerPopupStore.remove(event.id);
    };

    batchUpdate = action(async (trackers) =>
    {
        if (!Array.isArray(trackers))
        {
            return;
        }
        
        for (const tracker of trackers)
        {
            let option = {};
            option = await this.getIconLayer(tracker.employee_type_id);

            const status = this.workerStore.statuses.filter((s) => s.status_id === tracker[this.workerStore.trackingSvc.TRACKING_FIELD])[0] ?? { status_color: 'red' };
         
            const heading = tracker[this.workerStore.trackingSvc.TRACKING_FIELD] === 1 ? Math.round(tracker.heading) : undefined;

            const marker = this.props.appStore.markerStore.getPopup(
                tracker.trackerId,
            );

            if (!marker)
            {
                this.props.appStore.markerStore.add({
                    id: tracker.trackerId,
                    // temp HACK need to change to dynamic field in vdms config
                    layer: `employee_type_id-${option.employeetype_id}`,
                    // layer: option.employeetype_name,
                    icon: option.employeetype_icon,
                    color: status.status_color,
                    size: 30,
                    heading: heading,
                    isNotify: false,
                    lng: tracker.lng,
                    lat: tracker.lat,
                    title: tracker.driver || tracker.trackerId,
                    type: 'tracking',
                    typeMarker: 'duotone',
                    onClick: this.handleClickWorker,
                });
            }
            else
            {
                this.props.appStore.markerStore.updateProps(marker, {
                    lng: tracker.lng,
                    lat: tracker.lat,
                    color: status.status_color,
                    heading: heading,
                });
            }
        }

        const removeList = [];
        for (const marker of this.props.appStore.markerStore.markers)
        {
            if (marker.type === 'tracking')
            {
                const found = trackers.find((d) => marker.id === d.trackerId);
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

    batchClear = action(() =>
    {
        for (const marker of this.props.appStore.markerStore.markers)
        {
            if (marker.type === 'tracking')
            {
                this.props.appStore.markerStore.remove(marker.id);
            }
        }
    });

    handleChange = async (item, checked) =>
    {
        if (checked)
        {
            this.props.appStore.layerStore.add({
                id: item.Id,
                ...item.layerInfo,
            });
        }
        else
        {
            this.props.appStore.layerStore.remove(item.Id);
        }

        if (item.Id === 'TRACKING')
        {
            this.workerStore.toggleDataOn = checked;
        }

        if (item[item.paramName])
        {
            this.workerStore.setFilterState(item.paramName, item[item.paramName], { type: item.valueType, checked });
        }

        if (item.childes)
        {
            item.childes.forEach((c) =>
            {
                if (c.checkingType === 1)
                {
                    const value = c[item.paramName];
                    this.workerStore.setFilterState(c.paramName, value, c.valueType);
                }
            });
        }
        // get Worker Tracking data on List
        this.workerStore.getDataDebounced();

        // console.log(this.props.appStore.mapStore.getViewport);
        // get Worker Tracking on Map
        this.batchClear();

        const data = await this.workerStore.getTrackingDataDebounced(this.props.appStore.mapStore.getViewport);
        if (data && data.data && data.data.trackers)
        {
            this.batchUpdate(data.data.trackers);
        }

        if (this.interval)
        {
            clearInterval(this.interval);
        }
        
        this.interval = setInterval(async () =>
        {
            const data = await this.workerStore.getTrackingDataDebounced(this.props.appStore.mapStore.getViewport);
            if (data && data.data)
            {
                this.batchUpdate(data.data.trackers);
            }
        }, 10000);
    }

    onSettingClick = () =>
    {
        // console.log('onSettingClick');
    }

    handleExpand = async (layer) =>
    {
        layer.expanded = true;
    };

    handleCollapse = (layer) =>
    {
        layer.expanded = false;
    };


    render()
    {
        return (
            <LayerSwitcherBoard
                data={this.props.data}
                onChange={this.handleChange}
                toggleOn={this.workerStore.toggleDataOn}
                // onSettingClick={this.onSettingClick}
                onExpand={this.handleExpand}
                onCollapse={this.handleCollapse}
                itemComponent={LayerSwitcherItem}

            />
        );
    }
}
WorkerFilter = inject('appStore', 'fieldForceStore')(
    observer(withRouter(WorkerFilter)),
);
export { WorkerFilter };

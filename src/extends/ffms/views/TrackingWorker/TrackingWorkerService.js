import { AppConstant } from 'constant/app-constant';
import { AuthHelper } from 'helper/auth.helper';
import TrackingService from 'services/tracking.service';
import defaultTrackingConfig from './tracking-maplayer.json';

export default class TrackingWorkerService extends TrackingService
{
    TRACKING_CONFIG;
    TRACKING_LAYER = 'EMPLOYEE';
    TRACKING_FIELD = 'device_status';

    constructor()
    {
        super();

        this.initTracking();
    }

    initTracking = () =>
    {
        return this.getTrackingConfig().then((result) =>
        {
            if (result && result.length && result[0].Content)
            {
                const filterConfig = typeof (result[0].Content) === 'string' ? JSON.parse(result[0].Content) : result[0].Content;

                this.TRACKING_CONFIG = filterConfig;
                this.TRACKING_LAYER = filterConfig.layer;

                for (let i = 0; i < filterConfig.filters.length; i++)
                {
                    const item = filterConfig.filters[i];

                    if (item.type === 'tracking')
                    {
                        this.TRACKING_FIELD = item.field_name;
                        break;
                    }
                }
            }
            return this.TRACKING_CONFIG;
        });
    }

    getDeviceOptimizeBoundsStatusCountingAdv = (filter, viewport, pageOptions) =>
    {
        // const data = {
        //     'maxLng': viewport.right,
        //     'maxLat': viewport.top,
        //     'minLng': viewport.left,
        //     'minLat': viewport.bottom,
        //     'level': viewport.level,
        //     'jobStatus': jobStatus || 0,
        //     'empType': empType || 0,
        //     'orgIds': orgIds || []
        // };

        const data = {
            // filter: {
            //     'device_status': [1, 2, 4],
            //     'employee_organization_id': [1,2],
            //     'employee_type_id': [1,2,4]
            // },
            layer: this.TRACKING_LAYER,
            filter,
            ...pageOptions,
            // 'calcCounters': true
        };

        if (viewport)
        {
            data.boundaries = {
                'maxLng': viewport.right,
                'maxLat': viewport.top,
                'minLng': viewport.left,
                'minLat': viewport.bottom,
                'level': viewport.level,
            };
        }

        return this.http.post('/api/ffms/vdms-tracking/queryTrackers', data, AuthHelper.getVDMSHeader());

    };

    getWorkerData = (filter, pageOptions) =>
    {
        return this.getDeviceOptimizeBoundsStatusCountingAdv(filter, null,pageOptions).then((res) =>
        {
            if (res && res.data && res.data.trackers && res.data.trackers.length)
            {
                const unique = {};
                const chosenOne = [];
                res.data.trackers.forEach((t) =>
                {
                    unique[t.driver] = unique[t.driver] ? unique[t.driver] + 1 : 1;
                    if (unique[t.driver] === 1)
                    {
                        chosenOne.push(t.trackerId);
                    }
                });

                const trackerIds = [];
                const keys = Object.keys(unique);
                const queries = [];
                for (var i = 0; i < keys.length; i++)
                {
                    const name = keys[i];
                    if (unique[name] > 1)
                    {
                        // queries.push(this.http.get(`https://seems-dev.sovereignsolutions.com/api/devices/${name}/active`, AuthHelper.getVDMSHeader()));
                        queries.push(this.http.get(`/api/devices/${name}/active`, AuthHelper.getVDMSHeader()));
                    }
                }

                if (queries.length > 0)
                {
                    return Promise.all(queries).then((results) =>
                    {
                        results.forEach((device) =>
                        {
                            if (device && device.result !== -1 && device.data && device.data.deviceId)
                            {
                                trackerIds.push(device.data.deviceId);
                            }
                        });

                        res.data.trackers = res.data.trackers.map((x) =>
                        {
                            x.isActive = trackerIds.length ? trackerIds.indexOf(x.trackerId) > -1 : true;
                            return x;
                        });
                        return res;
                    });
                }
            }

            return res;
        });
    };

    getTrackingData = (filter, viewport, pageOptions) =>
    {
        return this.getDeviceOptimizeBoundsStatusCountingAdv(filter,viewport,pageOptions).then((res) =>
        {
            if (res && res.data && res.data.trackers && res.data.trackers.length)
            {
                const unique = {};
                const chosenOne = [];
                res.data.trackers.forEach((t) =>
                {
                    unique[t.driver] = unique[t.driver] ? unique[t.driver] + 1 : 1;
                    if (unique[t.driver] === 1)
                    {
                        chosenOne.push(t.trackerId);
                    }
                });

                const trackerIds = [];
                const keys = Object.keys(unique);
                const queries = [];
                for (var i = 0; i < keys.length; i++)
                {
                    const name = keys[i];
                    if (unique[name] > 1)
                    {
                        // queries.push(this.http.get(`https://seems-dev.sovereignsolutions.com/api/devices/${name}/active`, AuthHelper.getVDMSHeader()));
                        queries.push(this.http.get(`/api/devices/${name}/active`, AuthHelper.getVDMSHeader()));
                    }
                }

                if (queries.length > 0)
                {
                    return Promise.all(queries).then((results) =>
                    {
                        results.forEach((device) =>
                        {
                            if (device && device.result !== -1 && device.data && device.data.deviceId)
                            {
                                trackerIds.push(device.data.deviceId);
                            }
                        });

                        res.data.trackers = res.data.trackers.filter((x) => unique[x.driver] === 1 || trackerIds.indexOf(x.trackerId) > -1 || chosenOne.indexOf(x.trackerId) > -1);
                        return res;
                    });
                }
            }

            return res;
        });
    };

    getDeviceByTrackerId = (trackerId) =>
    {
        // return this.http.get(`${this.trackingUrl}/api/v1/tracking/detail?trackerId=${trackerId}`, AuthHelper.getVDMSHeader());
        const qsLayer = this.TRACKING_LAYER ? `&layer=${this.TRACKING_LAYER}` : '';
        return this.http.get(`/api/ffms/vdms-tracking/getDeviceByTrackerId?trackerId=${trackerId}${qsLayer}`, AuthHelper.getVDMSHeader());
    };

    getDevicesByTrackerIds = (trackerIds) =>
    {
        let trackerStr = trackerIds.reduce((all, tracker) =>
        {
            all += `${tracker},`;
            return all;
        }, '');
        trackerStr = trackerStr.substring(0, trackerStr.length - 2);
        const qsLayer = this.TRACKING_LAYER ? `&layer=${this.TRACKING_LAYER}` : '';

        return this.http.get(
            `/api/ffms/vdms-tracking/getDeviceByTrackerId?trackerId=${trackerStr}${qsLayer}`,
            AuthHelper.getVDMSHeader(),
        );

    };

    getTrackingStatuses = () =>
    {
        return this.http.get('/api/ffms/device-statuses', AuthHelper.getVDMSHeader());
    };

    getTrackingConfig = () =>
    {
        return this.http.get(`/api/ffms/containers?filter=${
            encodeURIComponent(JSON.stringify({
                path: `/root/vdms/hethong/trackingmaplayer/${AppConstant.sysIdPlaceholder}`,
                filterQuery: ['Type:(tracking-maplayer)'],
            }))
        }`).then((rs) =>
        {
            if (rs && rs.length > 0)
            {
                return rs;
            }
            return [{ Content: defaultTrackingConfig }];
        });
    }
}

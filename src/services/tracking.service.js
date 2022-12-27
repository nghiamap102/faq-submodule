import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';

export default class TrackingService
{
    trackingUrl = AppConstant.tracking.url;
    apiURL = AppConstant.vdms.url;

    http = new HttpClient();

    getDeviceOptimizeBoundsStatusCounting = (flagStatus, transType, viewport) =>
    {
        const data = {
            'l': viewport.left,
            't': viewport.top,
            'r': viewport.right,
            'b': viewport.bottom,
            'level': viewport.level,
            'transType': transType || 0,
            'flagStatus': flagStatus || 0
        };

        return this.http.post(`${this.trackingUrl}/api/v1/tracking/GetDeviceOptimizeBoundsStatusCounting`, data, AuthHelper.getVDMSHeader());
    };

    getDeviceByTrackerId = (trackerId) =>
    {
        const data = {
            'isFull': true,
            'trkrIDs': [trackerId] || []
        };

        return this.http.post(`${this.trackingUrl}/api/v1/tracking/GetDeviceByTrackerId`, data, AuthHelper.getVDMSHeader());
    };

    getDevicesByTrackerIds = (trackerIds) =>
    {
        const data = {
            'isFull': true,
            'trkrIDs': trackerIds || []
        };

        return this.http.post(`${this.trackingUrl}/api/v1/tracking/GetDeviceByTrackerId`, data, AuthHelper.getVDMSHeader());
    };

    getDeviceOptimizeBoundsStatusCountingTCDB = (flagStatus, transType, viewport) =>
    {
        const data = {
            'l': viewport.left,
            't': viewport.top,
            'r': viewport.right,
            'b': viewport.bottom,
            'level': viewport.level,
            'transType': transType || 0,
            'flagStatus': flagStatus || 0
        };

        return this.http.post(`${this.trackingUrl}/api/v1/trackingtcdb/GetDeviceOptimizeBoundsStatusCounting`, data, AuthHelper.getVDMSHeader());
    };

    getDeviceByTrackerIdTCDB = (trackerId) =>
    {
        const data = {
            'isFull': true,
            'trkrIDs': [trackerId] || []
        };

        return this.http.post(`${this.trackingUrl}/api/v1/trackingtcdb/GetDeviceByTrackerId`, data, AuthHelper.getVDMSHeader());
    };

    getDeviceNearestMapSearch = (coordinates, layers = ['ICS_POLICESTATIONS', 'ICS_FIRESTATIONS', 'ICS_FIREHYDRANT'], count = 10, distance = 10000) =>
    {
        const data = {
            'path': '/root/vdms/tangthu/data',
            'layers': layers || [],
            'isInTree': true,
            'searchKey': '',
            'start': 0,
            'count': count,
            'returnFields': ['*'],
            'geojson': `{"type":"Point","coordinates":[${coordinates[0]},${coordinates[1]}]}`,
            'distance': distance
        };

        return this.http.post(`${this.apiURL}/api/v1/mapsearch/multi`, data, AuthHelper.getVDMSHeader());
    };

    getDeviceNearestTracking = (coordinates, count = 10, distance = 10000) =>
    {
        const data = {
            'latitude': coordinates[1],
            'longitude': coordinates[0],
            'count': count,
            'radius': distance,
            'transType': 31,
            'flagStatus': 16848
        }
        ;

        return this.http.post(`${this.trackingUrl}/api/v1/tracking/NearestDevices`, data, AuthHelper.getVDMSHeader());
    };
}

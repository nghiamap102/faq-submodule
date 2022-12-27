import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';
import TrackingWorkerService from 'extends/ffms/views/TrackingWorker/TrackingWorkerService';
import { FileHelper } from 'helper/file.helper';

export default class HistoryService
{
    trackingURL = AppConstant.tracking.url;
    apiURL = AppConstant.vdms.url;

    http = new HttpClient();

    constructor(trackingSvc)
    {
        this.trackingSvc = trackingSvc ? trackingSvc : new TrackingWorkerService();
    }

    getHistoryDataByDriver = (driver, from, to) =>
    {
        const body = {
            layer: this.trackingSvc.TRACKING_LAYER,
            driver,
            from,
            to,
        };
        return this.http.post(
            // `${this.trackingURL}/api/v1/tracking/history/driver`,
            '/api/ffms/vdms-tracking/getHistoryDataByDriver',
            body,
            AuthHelper.getVDMSHeader(),
        );
    };

    getHistoryDataByTracker = (trackerId, from, to) =>
    {
        const body = {
            layer: this.trackingSvc.TRACKING_LAYER,
            trackerId,
            from,
            to,
        };
        return this.http.post(
            '/api/ffms/vdms-tracking/getHistoryDataByTracker',
            body,
            AuthHelper.getVDMSHeader(),
        );
    };

    getHistoryDataByDriverSummary = (driver, from, to) =>
    {
        const body = {
            layer: this.trackingSvc.TRACKING_LAYER,
            driver,
            from,
            to,
            timezoneOffset: new Date().getTimezoneOffset(),
        };

        return this.http.post(
            '/api/ffms/vdms-tracking/getHistoryDataByDriverSummary',
            body,
            AuthHelper.getVDMSHeader(),
        );
    };

    getExportGPSLog = (type, params) =>
    {
        if (params)
        {
            return this.http.postFileStream(`/api/ffms/vdms-tracking/export/${type}`, params, AuthHelper.getVDMSHeader()).then((response) =>
            {
                FileHelper.saveExportFileAs(`${type.toUpperCase()}_Export`, response, `.${type}`);
            });
        }

        return null;
    }
}

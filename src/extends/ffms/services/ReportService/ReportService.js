import * as _ from 'lodash';
import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { convertToAggregation } from './parseToModel';


const baseUrl = '/api/ffms/';
const Enum = require('constant/app-enum');


class ReportService
{
    http = new HttpClient();

    constructor()
    {
        // this.getReportConfigTemplate();
    }

    getConfig = (layerName) =>
    {
        return this.http.get(baseUrl + layerName, AuthHelper.getVDMSHeader());
    }

    getReportConfigs = async() =>
    {
        this.configList = await this.http.get(`${baseUrl}containers/report-configs`, AuthHelper.getVDMSHeader());
        return this.configList;
    }

    async getReportConfigTemplate(name)
    {
        let response = null;
        if (name === '' || name == undefined)
        {
            if (_.isEmpty(this.configTemplate))
            {
                response = await this.http.get(`${baseUrl}containers/get-report-config`, AuthHelper.getVDMSHeader());
            }
        }
        else
        {
            response = await this.http.get(`${baseUrl}containers/get-report-config?name=${name}`, AuthHelper.getVDMSHeader());
        }

        if (response != null)
        {
            const reportContent = _.get(response, 'data', '{}');
            const layerName = _.get(reportContent, 'layer');
            const dateTimeColumn = _.get(reportContent, 'defaultDateTimeColumn');
            var filters = _.get(reportContent, 'filter');
            var groupBys = _.get(reportContent, 'groupBy');
            var calculations = _.get(reportContent, 'calculation');
            
            this.configTemplate = {
                dateTimeColumn,
                filterConfig: convertToAggregation(filters, layerName, _.get(reportContent, 'displayName')),
                groupByConfig: convertToAggregation(groupBys, layerName, _.get(reportContent, 'displayName')),
                calculationConfig: convertToAggregation(calculations, layerName, _.get(reportContent, 'displayName')),
            };
        }

        return this.configTemplate;
    }

    gets = (filterObj) =>
    {
        return this.http.post(`${baseUrl}containers/report/gets`, filterObj, AuthHelper.getVDMSHeader()).then((reports) =>
        {
            return reports;
        });
    };

    get = (reportGuid) =>
    {
        return this.http.get(`${baseUrl}containers/${reportGuid}`, AuthHelper.getVDMSHeader());
    };

    add = (reportObj) =>
    {
        return this.http.post(`${baseUrl}containers/report`, reportObj, AuthHelper.getVDMSHeader()).then((report) =>
        {
            if (report)
            {
                // this.sendNotification(report, `${report.Title}`, 'You\'ve got a new report');
            }

            return report;
        });
    };

    update = (reportGuid, reportObj) =>
    {
        return this.http.put(`${baseUrl}containers/report/${reportGuid}`, reportObj, AuthHelper.getVDMSHeader()).then((report) =>
        {
            if (report)
            {
                // this.sendNotification(report, `${report.Title}`, 'Your report information has just been edited.');
            }
            return report;
        });
    };

    delete = (reportGuid) =>
    {
        return this.get(reportGuid).then((report) =>
        {
            return this.http.delete(`${baseUrl}containers/report/${reportGuid}`, {}, AuthHelper.getVDMSHeader()).then((res) =>
            {
                if (report && res && res.count > 0)
                {
                    // this.sendNotification(report, `Report was deleted:${report.Title}`);
                }
                return res;
            });
        });
    };

    async getReportContent(id, type)
    {
        const response = await this.http.get(`${baseUrl}containers/get-report-content?id=${id}&type=${type}`, AuthHelper.getVDMSHeader());

        return response;
    }
    
    async getReportData(stages, layerName)
    {
        const body = {
            stages, layerName,
        };
        const response = await this.http.post(`${baseUrl}containers/report/excuse-report-query`, body, AuthHelper.getVDMSHeader());
        if (response.result == undefined)
        {
            if (response.status.success == true)
            {
                response.result = Enum.APIStatus.Success;
            }
            else
            {
                response.result = Enum.APIStatus.Error;
            }
        }

        return response;
    }

    async getReportDataWithPaging({ stages, layerName, pageIndex, pageSize })
    {
        const body = {
            stages, layerName, pageIndex, pageSize,
        };
        const response = await this.http.post(`${baseUrl}containers/report/excuse-report-query-paging`, body, AuthHelper.getVDMSHeader());
        if (response.result == undefined)
        {
            if (response.status.success == true)
            {
                response.result = Enum.APIStatus.Success;
            }
            else
            {
                response.result = Enum.APIStatus.Error;
            }
        }

        return response;
    }

    async getDataLayer(layerName)
    {
        const response = await this.http.get(`${baseUrl}data/${layerName}`, AuthHelper.getVDMSHeader());
        if (response.result == undefined)
        {
            if (response.status.success == true)
            {
                response.result = Enum.APIStatus.Success;
            }
            else
            {
                response.result = Enum.APIStatus.Error;
            }
        }
        return response;
    }
}


export default new ReportService();

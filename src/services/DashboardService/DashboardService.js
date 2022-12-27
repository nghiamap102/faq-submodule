import * as _ from 'lodash';

import { convertDashboardModel } from './parseToModel';
import { buildDomainToSubStat, buildFilterQuery, convertDateRangeToUtc } from './util';
import { FACET_TYPE, FILTER_TYPE, STAT_FUNCTION_TYPE } from './constants';

import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

String.prototype.formatVal = function ()
{
    let a = this;
    for (const k in arguments)
    {
        a = a.replace('{' + k + '}', arguments[k]);
    }
    return a;
};

const baseUrl = '/api/';

class DashboardService
{
    http = new HttpClient();

    dashboardConfig = {};

    async getMasterAnalytics(filter, queryInfo, store)
    {
        let response = [];

        await Promise.all(
            store.config.masterCharts.map((item, index) =>
                this.getDashboardStat(filter, queryInfo, store, item, index, true),
            ))
            .then((res) =>
            {
                response = res;
            });

        return _.cloneDeep(response);
    }

    async getDashboardConfig(layerName)
    {
        if (this.dashboardConfig[layerName] === undefined)
        {
            const response = await this.http.get(`${baseUrl}containers/get-dashboard-config?name=${layerName}`, AuthHelper.getVDMSHeader());
            this.dashboardConfig[layerName] = response.result > -1 ? response?.data : {};
        }

        return this.dashboardConfig[layerName];
    }

    async getDashboardConfigs()
    {
        const response = await this.http.get(`${baseUrl}containers/dashboard-configs`, AuthHelper.getVDMSHeader());
        return response.result > -1 ? response?.data : [];
    }

    async getDashboardStat(filters, queryInfo, store, matersChart, index, isAllGroup)
    {
        const { config: { detailCharts, layerName, domain, extraLayers, domainKey }, groupByMode } = store;

        const statInfo = [];
        const subStats = [];
        const time = filters.find(filter => filter?.type === FILTER_TYPE.TIME_FILTER);

        const lstDetailsChart = isAllGroup ? detailCharts : detailCharts.filter(item => item.key.toLowerCase() === groupByMode.toLowerCase());
        lstDetailsChart.forEach(detailChart =>
        {
            let subStat = {
                statName: detailChart?.key,
                statField: detailChart?.field,
                statType: 'term',
                domain: domain ? domain[detailChart?.domainKey] : null,
            };

            // DetailType time use 'statType = range'
            if (detailChart?.detailType === 'time')
            {
                // Parse current TimeZone then set utc
                const date = convertDateRangeToUtc(time?.values);
                subStat = {
                    ...subStat,
                    ...{
                        statType: 'range',
                        statStart: date.from,
                        statEnd: date.to,
                        gap: detailChart?.gap,
                    },
                };
            }

            if (detailChart?.detailType === 'function')
            {
                const child = [];
                let data = detailChart?.define?.data;
                if (detailChart?.define?.initData)
                {
                    data = Array.from({ length: detailChart?.define?.initData }, (v, index) => index);
                }

                data.forEach((item) =>
                {
                    child.push({
                        statType: 'query',
                        statName: `val$${item?.label ?? item}`,
                        statQuery: detailChart?.define?.filter.formatVal(item?.value ?? item),
                    });
                });

                subStat = {
                    ...subStat,
                    ...{
                        statType: 'query',
                        statQuery: '*:*',
                        subStat: child,
                    },
                };

                delete subStat.statField;

                subStats.push(subStat);
            }
            else
            {
                subStats.push(subStat);
            }
        });

        // Build subStat Masters chart width type TERM
        if (matersChart.facetType === FACET_TYPE.TERM_FACET)
        {
            statInfo.push({
                statName: matersChart?.key,
                statType: _.get(_.split(matersChart.facetType, '-'), 0),
                statField: matersChart.field,
                subStat: subStats,
            });
        }
        else
        {
            // Build subStat Masters chart width type QUERY
            matersChart.queries.forEach(item =>
            {
                statInfo.push({
                    statName: item?.key,
                    statType: _.get(_.split(matersChart.facetType, '-'), 0),
                    statQuery: item.query?.filter,
                    statAlias: item?.key,
                    subStat: subStats,
                });
            });
        }

        // Build subStat Overview
        const overviewRatio = matersChart?.overviewRatio;
        overviewRatio && overviewRatio.variables.forEach((item, index) =>
        {
            statInfo.push({
                statName: `overview_number_${index + 1}`,
                statType: item?.type,
                statQuery: item?.query?.filter,
                domain: domain ? domain[item?.query?.domainKey] : null,
                subStat: this.getStatOverviewRatio(item, `overview_number_${index + 1}`),
            });
        });

        // Create filter binding to subStat, inject domain to subStat by domainKey
        // Result queryField : queryDomain use in graph.traversalFilter,  statQuery use with statType = query
        const queryField = buildFilterQuery(queryInfo, layerName, extraLayers);
        const statInfoDomain = buildDomainToSubStat(domain, domainKey, layerName, statInfo, queryField.queryDomain);

        const statName = 'filters';
        const body = {
            layers: extraLayers,
            statInfo: [{
                statName: 'filters',
                statType: 'query',
                statQuery: queryField.statQuery,
                subStat: _.isArray(statInfoDomain) ? statInfoDomain : [statInfoDomain],
            }],

        };

        const response = await this.http.post(`${baseUrl}containers/stat`, body, AuthHelper.getVDMSHeader());
        return convertDashboardModel(response, matersChart, detailCharts, _.without([statName, domainKey], undefined), time?.values);
    }

    async getMapReportData(query)
    {
        console.log('/query');

        return await this.http.post(`${baseUrl}containers/query`, query, AuthHelper.getVDMSHeader());
    }

    getStatOverviewRatio(item, name)
    {
        const tmp = [];

        if (STAT_FUNCTION_TYPE[_.toUpper(item?.query?.return)])
        {
            tmp.push({
                statName: name,
                statFunction: STAT_FUNCTION_TYPE[_.toUpper(item?.query?.return)],
                statType: 'aggregation',
                statField: item?.query?.field,
                statAlias: name,
            });
        }

        return tmp;
    }
}


export default new DashboardService();


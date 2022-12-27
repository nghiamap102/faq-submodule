import * as _ from 'lodash';
import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import moment from 'moment';

import { convertToTimeDetail } from 'extends/ffms/services/utilities/helper';
import { convertToMasterEmployee, convertDashboardModel } from './parseToModel';
import { getData, buildDomainToSubStat, buildFilterQuery, convertDateRangeToUtc, buildQueryTypeComparison, buildQueryTypeFunction, getDetailCharts } from './util';
import { AnalyticMode, DISTANCE, TIME, TAB, FILTER_TYPE, FACET_TYPE, STAT_FUNCTION_TYPE } from './constants';
import CommonService from 'extends/ffms/services/CommonService';

String.prototype.formatVal = function()
{
    let a = this;
    for (const k in arguments)
    {
        a = a.replace('{' + k + '}', arguments[k]);
    }
    return a;
};

const baseUrl = '/api/ffms/';

class DashboardService
{
    http = new HttpClient();
    dashboardConfig ={};

    constructor(contexts)
    {
        this.i18nContext = contexts?.i18n;
        this.comSvc = new CommonService(contexts);
    }

    getDataByModel = (layerName, filters) =>
    {
        // custom for EMPLOYEE
        if (layerName.toUpperCase() === 'EMPLOYEE' || layerName.toUpperCase() === 'EMPLOYEES')
        {
            filters = {
                ...filters,
                employee_username: { like: '*' },
            };
        }

        return this.comSvc.queryData(layerName, filters);
    }


    async getMasterAnalytics(filter, queryInfo, store)
    {
        let response = store.apiOutput ?? [];
        if (store.config.code !== TAB.EMPLOYEE)
        {

            let masterCharts = store.config?.masterCharts;
            if (_.size(store.apiOutput) > 0)
            {
                masterCharts = [store.config?.masterCharts[store?.masterIndex]];
            }
            
            await Promise.all(_.map(masterCharts, item=>
                this.getDashboardStat(filter, queryInfo, store, item),
            )).then((res) =>
            {
                if (_.size(res) === 1)
                {
                    response[store?.masterIndex] = res[0];
                }
                else
                {
                    response = res;
                }
            });
        }
        else
        {
            response = await this.getDashboardEmployee(filter, store.config, store.config.field);
        }
        return _.cloneDeep(response);
    }
    
    filterEmployeeByMode(result)
    {
        const masterData = [];

        masterData.push(getData(this.i18nContext, result, DISTANCE, AnalyticMode.DISTANCE));

        masterData.push(getData(this.i18nContext, result, TIME, AnalyticMode.TIME));

        return masterData;
    }

    setDataTime(layers)
    {
        const dataTimes = _.map(layers, layer =>
        {
            return convertToTimeDetail(moment(layer.time, 'YYYY-MM-DD'));
        },
        );
        return dataTimes;
    }
    async getDashboardConfig(layerName)
    {
        if (this.dashboardConfig[layerName] == undefined)
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

    async getDashboardStat(filters, queryInfo, { config, groupByMode, masterIndex, periodCompares }, matersChart, isAllGroup)
    {
        const statInfo = [];
        const subStats = [];
        const time = _.find(filters, filter => filter?.type == FILTER_TYPE.TIME_FILTER);
        const statCalculator = this.geStatCalculator(matersChart);
        statCalculator && subStats.push(statCalculator);

        // Todo
        const { layerName, layerDataConfig, masterCharts } = config;

        const extraLayers = _.uniq(_.concat([layerName],config?.extraLayers));
        const domains = layerDataConfig?.domain ?? [];
        const domainKey = layerDataConfig?.domainKey;
        const detailCharts = getDetailCharts(config, masterIndex);
        // Build subStat Detail Chart
        if (masterCharts[masterIndex]?.key == matersChart?.key)
        {
            const lstDetailsChart = isAllGroup ? detailCharts : _.filter(detailCharts, item=> _.toLower(item.key) === _.toLower(groupByMode));
            _.forEach(lstDetailsChart, detailChart=>
            {
                const subStat = {
                    statName: detailChart?.key,
                    statField: detailChart?.field,
                    statType: 'term',
                    domain: _.find(domains,item=>item.domainKey == domainKey),
                };
                statCalculator && _.set(subStat,'subStat', [statCalculator]);
                const date = convertDateRangeToUtc(time?.values, false);

                switch (detailChart?.detailType)
                {
                    case 'period':
                        buildQueryTypeComparison(subStat, periodCompares, statCalculator);
                        subStats.push(subStat);
                        break;
                    case 'time':
                        _.set(subStat, 'statType', 'range');
                        _.set(subStat, 'statStart', date.from);
                        _.set(subStat, 'statEnd',date.to);
                        _.set(subStat, 'gap', detailChart?.gap);
                        subStats.push(subStat);
                        break;
                    case 'function':
                        subStats.push(buildQueryTypeFunction(detailChart, subStat, statCalculator));
                        break;
                    default:
                        subStats.push(subStat);
                }
            });
        }
        // Build Masters chart width type TERM with subStat
        if (matersChart.facetType == FACET_TYPE.TERM_FACET)
        {
            statInfo.push({
                statName: matersChart?.key,
                statType: _.get(_.split(matersChart.facetType,'-'),0),
                statField: matersChart.field,
                subStat: subStats,
            });
        }
        // Build Masters chart width type QUERY
        else
        {
            matersChart.queries.forEach(item=>
            {
                const info = {
                    statName: item?.key,
                    statType: _.get(_.split(matersChart.facetType,'-'),0),
                    statQuery: item.query?.filter,
                    statAlias: item?.key,
                    subStat: subStats,
                };
                statInfo.push(info);
            });
        }
        // Build subStat Overview
        const overviewRatio = matersChart?.overviewRatio;
        _.forEach(overviewRatio?.variables,(item, index)=>
        {
            statInfo.push({
                statName: `overview_number_${index + 1}`,
                statType: item?.type,
                statQuery: item?.query?.filter,
                domain: _.find(domains,item=>item.domainKey == item?.query?.domainKey),
                subStat: this.getStatOverviewRatio(item,`overview_number_${index + 1}`),
            });
        });
        statCalculator && statInfo.push(statCalculator);
        // Create filter binding to subStat, inject domain to subStat by domainKey
        // Result queryField : queryDomain use in graph.traversalFilter,  statQuery use with statType = query
        const queryField = buildFilterQuery(queryInfo, layerName, extraLayers);
        const statInfoDomain = buildDomainToSubStat(domains, domainKey, layerName, statInfo, queryField.queryDomain);
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
        return convertDashboardModel(response, matersChart, detailCharts, _.without([statName, domainKey], undefined), time?.values, periodCompares);
    }

    async getDashboardEmployee(filters, tab)
    {
        filters.sort((a, b) => (a.layer == undefined) ? 1 : ((a.layer == b.layer) ? 1 : -1));
        const extraLayers = _.uniq(_.concat([tab.layerName],tab?.extraLayers));
        const body = {
            layers: extraLayers,
            returnFields: ['*'],
        };
        const graphSearch = tab?.trackingLogConfig?.graphSearch;
        const graphInfo = {
            fromLayer: tab.extraLayers[0],
            toLayer: tab.extraLayers[1],
            fromField: graphSearch.fromField,
            toField: graphSearch.toField,
            refTimeField: graphSearch.refTimeField != undefined ? graphSearch.refTimeField : 'job_assigned_time',
        };
        let fromQuery = '';
        let toQuery = '';
        const fromLayers = [];
        const toLayers = [];
        filters.forEach(item =>
        {
            if (item.type == 'time-filter')
            {
                body.defaultTime = item.values;
            }
            else
            {
                let field = item.field;
                if (item.layer == 'EMPLOYEE' && field == 'employee_guid')
                {
                    field = graphInfo.fromField;
                }
                field += '_sfacet'; // for exactly searching

                let val = item.values;
                if (typeof val == 'object')
                {
                    val = val.join('" OR "');
                }
                val = '"' + val + '"';

                if (item.layer == graphInfo.fromLayer)
                {
                    if (fromLayers.length == 0)
                    {
                        fromQuery = `${field}:(${val})`;
                    }
                    else
                    {
                        fromQuery += ` AND ${field}:(${val})`;
                    }
                    fromLayers.push(item.layer);
                }
                if (item.layer == graphInfo.toLayer)
                {
                    if (toLayers.length == 0)
                    {
                        toQuery = `${field}:(${val})`;
                    }
                    else
                    {
                        toQuery += ` AND ${field}:(${val})`;
                    }
                    toLayers.push(item.layer);
                }
            }
        });
        
        if (fromQuery != '')
        {
            graphInfo.fromFilterQuery = [fromQuery];
        }
        if (toQuery != '')
        {
            graphInfo.toFilterQuery = [toQuery];
        }
        body.graphInfo = graphInfo;
        
        const response = await this.http.post(`${baseUrl}employees/analytics-by-graph`, body, AuthHelper.getVDMSHeader());
        
        let resultEmployee = [];
        _.map(response, item =>
        {
            const arrEmployee = convertToMasterEmployee(item);
            if (!_.isEmpty(arrEmployee))
            {
                resultEmployee = _.concat(...resultEmployee, ...arrEmployee);
            }
        },
        );
        return resultEmployee;
        // return response;
    }

    getStatOverviewRatio(item,name)
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
    geStatCalculator(matersChart)
    {
        if (matersChart?.return)
        {
            return {
                statName: 'calculator',
                statFunction: STAT_FUNCTION_TYPE[_.toUpper(matersChart?.return.calculator)],
                statType: 'aggregation',
                statField: matersChart?.return.field,
                statAlias: 'calculator',
            };
        }
        else
        {
            return undefined;
        }
    }
}


export default DashboardService;


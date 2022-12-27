import * as _ from 'lodash';
import moment from 'moment';
import { LAYER_DATA_TYPE, AnalyticMode, DELAY_TIME, EMPLOYEE_TYPE_DRIVER, EMPLOYEE_TYPE_TECHNICIAN, DISTANCE, TIME, IGNORE_FILTER_PROPERTY } from './constants';
import { convertToTimeDetail } from '../utilities/helper';
import { secondsToHms, mToKms, div100 } from '../utilities/dateTime';

// import { language, translate } from 'components/bases/Translate/Translate';

// temporary hard code because only hook can work with i18n
const translate = (text) =>
{
    return text;
};
const language = 'vi';

export const getUnit = (key) =>
{
    let unit = 'Jobs';

    switch (key)
    {
        case AnalyticMode.COMPLETED_JOB:
        case AnalyticMode.DELAY_TIME:
        case AnalyticMode.SERVICE_TIME:
        case AnalyticMode.JOB_TYPE:
            unit = translate('Công việc');
            break;
        case AnalyticMode.DISTANCE:
            unit = translate('Ki-lô-mét');
            break;
        case AnalyticMode.TIME:
            unit = translate('Giờ');
            break;
    }

    return unit;
};

export const getData = (orgResults, mode, analyticMode) =>
{
    const keys = Object.keys(mode);
    const master = [];
    const colors = [];
    const titles = [];
    const items = [];
    const groups = [];
    const duration = {};
    const distance = {};
    const unit = getUnit(analyticMode);
    var count = 0;
    var totalEmployeeJobs = 0;
    var result = orgResults;
    _.map(keys, key =>
    {
        const obj = mode[key];
        switch (analyticMode)
        {
            case AnalyticMode.COMPLETED_JOB:
                result = filterByJobStatus(orgResults, obj);
                break;
            case AnalyticMode.DELAY_TIME:
                result = filterByOnTimeJob(orgResults, obj);
                break;
            case AnalyticMode.SERVICE_TIME:
                result = filterByServiceTime(orgResults, key);
                break;
            case AnalyticMode.JOB_TYPE:
                result = filterByJobType(orgResults, obj);
                break;
            default:
                break;
        }
        const value = getValue(result, analyticMode, obj.id);
        totalEmployeeJobs = totalEmployeeJobs + getTotalJob(result, analyticMode);
        count += value;
        master.push(value);
        colors.push(obj.color);
        titles.push(obj.name);
        items.push({
            name: obj.name,
            type: '',
            unit: (analyticMode === AnalyticMode.DISTANCE || analyticMode === AnalyticMode.TIME) ? unit : '',
            value,
            color: obj.color,
        });

        duration[_.camelCase(key)] = { value: _.sum(_.map(result, 'jobDuration')), estimated: _.sum(_.map(result, 'jobEstimatedDuration')), count: result.length };
        distance[_.camelCase(key)] = { value: _.sum(_.map(result, 'jobDistance')), estimated: _.sum(_.map(result, 'jobEstimatedDistance')), count: result.length };

        _.map(result, item =>
        {
            const timeParse = convertToTimeDetail(moment.utc(_.get(item, 'time'), 'YYYY-MM-DD'));
            const itemValue = getItemValue(item, analyticMode, obj.id);
            const newObj = {
                color: obj.color,
                typeName: obj.name,
                typeId: obj.id,
                employee: _.get(item, 'employee'),
                jobType: _.get(item, 'jobType'),
                value: itemValue,
            };
            groups.push(_.assign(newObj, timeParse));
        });


    });
    _.map(items, item => item.percent =
        count == 0 ? 0 : Math.round(item.value * 100 / count));

    // Handle JOB TYPE :
    // - Fixing job = the job assign to technician
    // - Pick-up job = the job assign to driver
    if (analyticMode == AnalyticMode.JOB_TYPE)
    {
        const empTechnician = filterByJobEmployees(orgResults, EMPLOYEE_TYPE_TECHNICIAN);
        const empDriver = filterByJobEmployees(orgResults, EMPLOYEE_TYPE_DRIVER);
        duration['empTechnician'] = { count: _.size(empTechnician) };
        duration['empDriver'] = { count: _.size(empDriver) };
    }

    const ratioNumber = ratioNumberJobType(analyticMode, duration, count, totalEmployeeJobs);

    return {
        master,
        titles,
        colors,
        detail: {
            title: analyticMode.name,
            unit,
            items,
            total: div100(count),
        },
        groups: groups,
        ratioNumber,
    };

};
const getValue = (data, analyticMode, key) =>
{
    if (analyticMode !== AnalyticMode.DISTANCE &&
        analyticMode !== AnalyticMode.TIME)
    {
        return data.length;
    }
    switch (analyticMode)
    {
        case AnalyticMode.DISTANCE:
            switch (key)
            {
                case DISTANCE.EN_ROUTE.id:
                    return mToKms(_.sumBy(data, item => item.distanceTotal));
                case DISTANCE.IDLE.id:
                    return mToKms(_.sumBy(data, item => item.distanceIdle));
            }
            break;
        case AnalyticMode.TIME:
            switch (key)
            {
                case TIME.EN_ROUTE.id:
                    return secondsToHms(_.sumBy(data, item => item.durationTotal));
                case TIME.IDLE.id:
                    return secondsToHms(_.sumBy(data, item => item.durationIdle));
            }
            break;

    }

};

const getItemValue = (item, analyticMode, key) =>
{
    if (analyticMode !== AnalyticMode.DISTANCE &&
        analyticMode !== AnalyticMode.TIME)
    {
        return 1;
    }
    switch (analyticMode)
    {
        case AnalyticMode.DISTANCE:
            switch (key)
            {
                case DISTANCE.EN_ROUTE.id:
                    return mToKms(item.distanceTotal);
                case DISTANCE.IDLE.id:
                    return mToKms(item.distanceIdle);
            }
            break;
        case AnalyticMode.TIME:
            switch (key)
            {
                case TIME.EN_ROUTE.id:
                    return secondsToHms(item.durationTotal);
                case TIME.IDLE.id:
                    return secondsToHms(item.durationIdle);
            }
            break;

    }

};

const getTotalJob = (data, analyticMode) =>
{
    if (analyticMode !== AnalyticMode.DISTANCE &&
        analyticMode !== AnalyticMode.TIME)
    {
        return 0;
    }
    switch (analyticMode)
    {
        case AnalyticMode.DISTANCE:
        case AnalyticMode.TIME:
            return _.sumBy(data, item => item.jobs?.length);

    }
};
const filterByJobStatus = (orgResults, obj) =>
{
    const result = _.filter(orgResults, item => item.status === obj.id);
    return result;
};

const filterByJobEmployees = (orgResults, employeeType) =>
{
    const result = _.filter(orgResults, item => _.includes(item.jobEmployeeTypes, employeeType));
    return result;
};

const filterByOnTimeJob = (orgResults, obj) =>
{
    const result = _.filter(orgResults, item =>
        (obj.value == 0 && (item.jobDuration - item.jobEstimatedDuration) > DELAY_TIME) || // Delay : time > 60
        (obj.value == 1 && (item.jobDuration - item.jobEstimatedDuration) <= DELAY_TIME), // On Time : On Time + time <=60
    );
    return result;
};

function filterByServiceTime(orgResults, key)
{
    const result = _.filter(orgResults, item =>
    {
        switch (key)
        {
            case 'LESS_THAN_1_HOUR':
                return item.serviceTime <= 1;
            case 'LESS_THAN_2_HOURS':
                return item.serviceTime > 1 && item.serviceTime <= 2;
            case 'MORE_THAN_2HOURS':
                return item.serviceTime > 2;
        }

    });
    return result;
}

const filterByJobType = (orgResults, obj) =>
{
    const result = _.filter(orgResults, item => item.jobType.id === obj.id);
    return result;
};

const ratioNumberJobType = (analyticMode, duration, total, totalEmployeeJobs = 0) =>
{
    let result = 0;
    let totalDurationActive = 0;
    switch (analyticMode)
    {
        case AnalyticMode.COMPLETED_JOB:
            result = {
                value: duration.cancel.count <= 0. ? 'N/A' : (duration.done.count / duration.cancel.count).toFixed(1),
                label: 'complete per cancel',
            };
            break;
        case AnalyticMode.DELAY_TIME:
            totalDurationActive = (duration.delay.value - duration.delay.estimated); // Minutes
            result = {
                value: totalDurationActive <= 0 ? 'N/A' : (totalDurationActive / duration.delay.count).toFixed(1),
                label: 'minutes per job',
            };
            break;
        case AnalyticMode.SERVICE_TIME:
            totalDurationActive = (_.get(duration, 'lessThan1Hour.value') + _.get(duration, 'lessThan2Hours.value') + _.get(duration, 'moreThan2Hours.value')) / 3600; // Minutes
            result = {
                value: totalDurationActive <= 0 ? 'N/A' : (total / totalDurationActive).toFixed(1),
                label: 'minutes per job',
            };
            break;
        case AnalyticMode.JOB_TYPE:
            result = {
                value: duration.empDriver.count <= 0 ? 'N/A' : (duration.empTechnician.count / duration.empDriver.count).toFixed(1),
                label: 'fixing job to pickup ratio',
            };
            break;
        case AnalyticMode.DISTANCE:
            result = {
                value: totalEmployeeJobs <= 0 ? 'N/A' : (total / totalEmployeeJobs).toFixed(1),
                label: translate('tỷ lệ Ki-lô-mét trên công việc'),
            };
            break;
        case AnalyticMode.TIME:
            result = {
                value: totalEmployeeJobs <= 0 ? 'N/A' : (total / totalEmployeeJobs).toFixed(1),
                label: translate('tỷ lệ giờ trên công việc'),
            };
            break;

        default:
            break;
    }
    return result;
};

export const convertCustomTime = (data, period) =>
{
    // Check select time return from date - to date
    const objPeriod = _.find(data, { id: period?.type || period });
    if (_.get(objPeriod, 'time'))
    {
        return {
            type: period?.type || period,
            from: moment.utc().add(-objPeriod.time, 'hours').set({ second: 0, millisecond: 0 }).format(),
            to: moment.utc().set({ second: 0, millisecond: 0 }).format(),
        };
    }

    return period;
};

export const convertOptions = (data, labelIsKey = false) =>
{
    return _.map(data, item =>
    {
        labelIsKey && (item.id = item['label'] ?? item['value']);
        return item;
    });
};
export const getFilterValues = (filter) =>
{
    if (filter.dataType === LAYER_DATA_TYPE.TIMESTAMP)
    {
        const date = convertDateRangeToUtc(filter.values);
        return `[${date.from} TO ${date.to}]`;
    }

    if (!_.get(filter, 'multi'))
    {
        return `("${filter.values}")`;
    }

    const result = filter.values.map(value => `("${value}")`).join(' OR ');
    return `(${result})`;
};

export const convertFilter2QueryInfo = (filter) =>
{
    const queryInfo = {};
    queryInfo.Combine = filter.combine;
    queryInfo.Condition = filter.condition;
    queryInfo.DataType = filter.dataType;

    const values = getFilterValues(filter);
    queryInfo.ValueFilter = values;
    queryInfo.ColumnName = `${filter.queryField ?? filter.field}${filter.condition !== 'like' ? '_sfacet' : ''}`;
    queryInfo.isInternal = !!filter?.isInternal;

    return queryInfo;
};

export const buildFilterQuery = (queryInfo, layerName, extraLayers) =>
{
    const statQuery = {};
    _.forEach(queryInfo, item =>
    {
        const key = (item?.isInternal && _.size(extraLayers) > 1) ? 'queryDomain' : 'statQuery';
        const currentQuery = _.get(statQuery, key);
        statQuery[key] = currentQuery ? `${currentQuery} ${item.Combine} ${item.ColumnName}:${item.ValueFilter}` : `${item.ColumnName}:${item.ValueFilter}`;
    });

    const queryFacet = _.join(_.map(_.filter(extraLayers, extraLayer => extraLayer !== layerName), item => `layer_sfacet:${item}`), ' OR ');

    return {
        queryDomain: statQuery['queryDomain'],
        statQuery: statQuery['statQuery'] ? `${statQuery['statQuery']}` : (queryFacet == '' ? '*:*' : queryFacet),
    };
};


export const convertToFilter = (filters) =>
{
    const tmp = [];
    _.forEach(filters, item =>
    {
        item.values && tmp.push(_.omit(item, IGNORE_FILTER_PROPERTY));
    });
    return tmp;
};

export const convertToQueryInfo = (filters) =>
{
    const queryInfo = [];
    filters.forEach(item =>
    {
        item.values && queryInfo.push(convertFilter2QueryInfo(item));
    });
    return queryInfo;
};


export const convertMatersCharts = (mastersCharts) =>
{
    const tmp = [];
    mastersCharts && mastersCharts.map(item =>
    {
        item.field && tmp.push({
            statName: item.field,
            statType: _.get(_.split(item.facetType, '-'), 0),
            statField: item.field,
        });
    });
    return tmp;
};

export const getFilter = (options, filter) =>
{
    if (!_.isEmpty(filter))
    {
        const fields = Object.getOwnPropertyNames(filter);
        let filterOption = _.cloneDeep(options);
        _.forEach(fields, (field) =>
        {
            const value = _.get(filter, field);
            if (_.isArray(value) && _.size(value) > 0)
            {
                filterOption = _.filter(filterOption, item =>
                {
                    const value2 = _.get(item, field);
                    return _.size(_.intersection(value, _.isArray(value2) ? value2 : [value2])) > 0;
                });
            }
        });
        return filterOption;
    }
    return options;
};

export const getCurrentMainTab = (config) =>
{
    const match = _.find(config, item => item.link === window.location.pathname);
    return match ?? config[0];
};

export const convertToDataLabel = (string, type, isFunction = false) =>
{
    const date = moment(string);
    let content;

    const dayOfWeek = moment.weekdays(true);
    const monthOfYear = moment.months(true);

    switch (type)
    {
        case 'day':
            content = date.format('DD/MM/YYYY');
            break;
        case 'month':
            content = `${monthOfYear[date.month()]} ${date.year()}`;
            break;
        case 'hour':
            content = date.hour(); // 00 ->23
            break;
        case 'dayOfWeek':
            content = dayOfWeek[isFunction ? string : (date.isoWeekday() - 1)]; // 1-> 7
            break;
        case 'week':
            content = `${date.isoWeek()} /${date.isoWeekYear()}`;
            break;
        default:
            content = convertTitleCase(string);
    }
    return content;
};

export const intArrayStat = (initValue, type, { from, to }) =>
{
    let initVal = initValue ?? 0;
    let data;

    const monthOfYear = moment.months(true);
    switch (type)
    {
        case 'hour':
            initVal = 24;
            break;
        case 'dayOfWeek':
            initVal = 7;
            data = moment.weekdays(true);
            break;
        case 'month':
            data = enumerateMonthsBetweenDates(from, to, monthOfYear);
            initVal = _.size(data);
            break;
    }
    if (initVal > 0)
    {
        return {
            labels: Array.from({ length: initVal }, (item, index) => _.get(data, index, index)),
            values: Array(initVal).fill(0),
        };
    }
    else
    {
        return undefined;
    }
};

export const enumerateMonthsBetweenDates = (startDate, endDate, monthOfYear) =>
{
    var dates = [];

    var currDate = moment(startDate);
    var lastDate = moment(endDate);
    while (currDate.diff(lastDate) <= 0 || currDate.month() <= lastDate.month())
    {
        dates.push(`${monthOfYear[currDate.month()]} ${currDate.year()}`);
        currDate.add(1, 'months');
    }
    return dates;
};


export const convertTitleCase = (str) =>
{
    return str.toLowerCase().replace(/\.\s*([a-z])|^[a-z]/gm, s => s.toUpperCase());
};

export const buildDomainToSubStat = (domain, domainKey, layerName, statInfo, traversalFilter) =>
{
    const data = domain ? domain[domainKey] : null;
    if (data)
    {
        _.set(data, 'graph.traversalFilter', traversalFilter);
        return {
            statName: domainKey,
            statType: 'query',
            statQuery: `layer_sfacet:${layerName}`,
            domain: data,
            subStat: statInfo,
        };
    }
    else
    {
        return statInfo;
    }
};

export const buildSubStat = ({ filterQuery, domain, subStats }) =>
{

    return [{
        statName: 'filters',
        statType: 'query',
        statQuery: filterQuery,
        subStat: [
            {
                ...domain,
                subStat: subStats,
            },
        ],
    }];
};

export const rebuildOptionData = (key, data, currentConfig) =>
{
    const dataItem = _.find(currentConfig?.filters, row => row?.key == key);
    dataItem.bindings && dataItem.bindings.forEach(element =>
    {
        // Condition filter
        const refConfig = _.find(currentConfig?.filters, row => row?.key == element?.refKey);
        if (dataItem?.values)
        {
            _.set(refConfig, ['conditionBinding', element?.field], data);
        }
        else
        {
            _.unset(refConfig, ['conditionBinding', element?.field]);
        }

        // Get data from condition filter
        const options = getFilter(refConfig?.data, refConfig?.conditionBinding);
        if (options)
        {
            _.set(refConfig, 'options', options);
        }
        else
        {
            _.unset(refConfig, 'options');
        }
        // Check new value select
        const newValue = _.intersection(_.map(options, 'id'), refConfig?.multi ? refConfig.values : [refConfig.values]);
        if (_.size(newValue) > 0)
        {
            refConfig.values = refConfig?.multi ? newValue : newValue[0];
        }
        else
        {
            _.unset(refConfig, 'values');
        }
    });
    return currentConfig;
};

export const convertDateRangeToUtc = (date) =>
{
    // TimeZone current user
    return {
        from: date.from ? moment(date.from).set({ hours: 0, minutes: 0, seconds: 0 }).utc().format() : date.from,
        to: date.to ? moment(date.to).set({ hours: 23, minutes: 59, seconds: 59 }).utc().format() : date.to,
    };
};

export const getContentByLanguage = (content) =>
{
    if (content != undefined && content[language] != undefined)
    {
        return content[language];
    }
    else
    {
        return content;
    }
};

export const transformLanguage = (obj, lang) =>
{
    try
    {
        for (var k of Object.keys(obj))
        {
            var val = obj[k];

            if (typeof val === 'object')
            {
                const langValue = _.get(val, lang);
                if (langValue)
                {
                    _.set(obj, k, langValue);
                    val = langValue;
                }
                Object.assign({}, transformLanguage(val, lang));
            } // <-- recursion
        }

        return obj;
    }
    catch (error)
    {
        // Object Null;
    }
};

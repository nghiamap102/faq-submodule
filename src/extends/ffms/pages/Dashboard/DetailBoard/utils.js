import { GROUP_BY_MODE, JOB_STATUS, ON_TIME_JOB, SERVICE_TIME_JOB, JOB_TYPE, DISTANCE, TIME } from 'extends/ffms/services/DashboardService/constants';
import { getDayOfWeek, getHourOfDay } from 'extends/ffms/services/utilities/dateTime';
import { TAB } from 'extends/ffms/services/DashboardService/constants';
import { enumerateDaysBetweenDates } from 'extends/ffms/services/utilities/helper';
import { div100 } from 'extends/ffms/services/utilities/dateTime';
import * as _ from 'lodash';
import { toJS } from 'mobx';
import moment from 'moment';

export const getAnalyticMode = (index, tab = 1) =>
{
    switch (tab)
    {
        case TAB.JOB:
            switch (index)
            {
                case 0:
                    return JOB_STATUS;
                case 1:
                    return ON_TIME_JOB;
                case 2:
                    return SERVICE_TIME_JOB;
                case 3:
                    return JOB_TYPE;
                default:
                    break;
            }
            break;
        case TAB.EMPLOYEE:
            switch (index)
            {
                case 0:
                    return DISTANCE;
                case 1:
                    return TIME;
                
                default:
                    break;
            }
            break;
        default:
            break;
    }

};

export const groupBy = (data, mode, showMode, filter) =>
{
    const timeRange = filter.find(item => item.type === 'time-filter');
    const days = enumerateDaysBetweenDates(timeRange.values.from, timeRange.values.to);
    const filterWeeks = _.groupBy(days, day => day.weekAndYear);
    const filterMonths = _.groupBy(days, day => day.month);

    let filterData = _.clone(data);
    switch (mode)
    {
        case _.toUpper(GROUP_BY_MODE.DAY.key):
            if (showMode)
            {
                _.map(days, day =>
                {
                    const hasDay = _.find(filterData, item => item.dayOfYear === day.dayOfYear);
                    if (!hasDay)
                    {
                        filterData.push({ dayOfYear: day.dayOfYear });
                    }
                });
            }
            filterData = _.sortBy(filterData, item => moment(item.dayOfYear, 'DD/MM/YYYY'));
            return _.groupBy(filterData, (item) => item.dayOfYear);
        case _.toUpper(GROUP_BY_MODE.WEEK.key):
            if (showMode)
            {
                _.map(filterWeeks, week =>
                {
                    const hasDay = _.find(filterData, item => item.weekAndYear === week[0].weekAndYear);
                    if (!hasDay)
                    {
                        filterData.push({
                            weekAndYear: week[0].weekAndYear,
                            year: week[0].year,
                            weekOfYear: week[0].weekOfYear,
                        });
                    }
                });
            }

            filterData = _.sortBy(filterData, ['year', 'weekOfYear']);
            return _.groupBy(filterData, (item) => item.weekAndYear);
        case _.toUpper(GROUP_BY_MODE.MONTH.key):
            if (showMode)
            {
                _.map(filterMonths, month =>
                {
                    const hasDay = _.find(filterData, item => item.monthAndYear === month[0].monthAndYear);
                    if (!hasDay)
                    {
                        filterData.push({ dayOfYear: month[0].dayOfYear, month: month[0].month, year: month[0].year, monthAndYear: month[0].monthAndYear });
                    }
                });
            }

            filterData = _.sortBy(filterData, ['year', 'month']);
            return _.groupBy(filterData, (item) => item.monthAndYear);
        case _.toUpper(GROUP_BY_MODE.DAY_OF_WEEK.key):
            if (showMode)
            {
                _.map(getDayOfWeek(), day =>
                {
                    const hasDay = _.find(filterData, item => item.dayOfWeek === day);
                    if (!hasDay)
                    {
                        filterData.push({ dayOfWeek: day });
                    }
                });
            }

            filterData = _.sortBy(filterData, ['dayOfWeek']);

            return _.groupBy(filterData, (item) => item.dayOfWeek);
        case _.toUpper(GROUP_BY_MODE.HOUR_OF_DAY.key):
            if (showMode)
            {
                _.map(getHourOfDay(), hour =>
                {
                    const hasDay = _.find(filterData, item => item.hourOfDay === hour);
                    if (!hasDay)
                    {
                        filterData.push({ hourOfDay: hour });
                    }
                });
            }

            filterData = _.sortBy(filterData, ['hourOfDay']);
            return _.groupBy(filterData, (item) => item.hourOfDay);
        case _.toUpper(GROUP_BY_MODE.WORKER_TYPE.key):
            return _.groupBy(data, (item) => item.employee.type);
        case _.toUpper(GROUP_BY_MODE.JOB_TYPE.key):
            return _.groupBy(data, (item) => item.jobType.id);
        case _.toUpper(GROUP_BY_MODE.WORKER.key):
            return _.groupBy(data, (item) => item.employee.name);
        default:
            break;
    }
};

export const convertToModel = (data, mode, index, tab, lang) =>
{
    let types = [];
    const values = [];
    const labels = [];

    const analyticMode = getAnalyticMode(index, tab.code);

    _.map(data, (item) =>
    {
        labels.push(getLabel(item, mode, lang));
        const value = [];
        const groupByType = _.groupBy(item, (detail) => detail.typeId);
        _.map(analyticMode, (modeItem) =>
        {
            types.push({
                color: modeItem.color,
                typeName: modeItem.name,
            });
            let itemValue = 0;
            _.map(groupByType, (type) =>
            {
                if (type[0].typeId === modeItem.id)
                {

                    if (tab.code !== TAB.EMPLOYEE)
                    {
                        itemValue = type.length;
                    }
                    else
                    {
                        itemValue = div100(_.sumBy(type, item => item.value));
                    }
                }
            });
            value.push(itemValue);
        });
        values.push(value);
    });
    types = _.uniqBy(types, (type) => type.color);
    
    return {
        types,
        values,
        labels,
    };

};

export const getLabel = (data, mode, lang) =>
{
    moment.updateLocale(lang, {
        week: {
            dow: 1,
        },
    });
    const DayOfWeek = moment.weekdays(true);
    const MonthOfYear = moment.months(true);
    switch (mode)
    {
        case _.toUpper(GROUP_BY_MODE.DAY.key):
            return data[0].dayOfYear;
        case _.toUpper(GROUP_BY_MODE.WEEK.key):
            return data[0].weekAndYear;
        case _.toUpper(GROUP_BY_MODE.MONTH.key):
            return `${MonthOfYear[data[0].month]} ${data[0].year}`;
        case _.toUpper(GROUP_BY_MODE.DAY_OF_WEEK.key):
            return DayOfWeek[data[0] ? data[0].dayOfWeek : data.dayOfWeek];
        case _.toUpper(GROUP_BY_MODE.HOUR_OF_DAY.key):
            return data[0].hourOfDay;
        case _.toUpper(GROUP_BY_MODE.WORKER_TYPE.key):
            return data[0].employee.type;
        case _.toUpper(GROUP_BY_MODE.JOB_TYPE.key):
            return data[0].jobType.name;
        case _.toUpper(GROUP_BY_MODE.WORKER.key):
            return data[0].employee.name;
        default:
            break;
    }
};

export const getDataExcel = (data, mode) =>
{
    const groupData = getGroupByExcel(toJS(data.groups), mode.id);
    const table = [];
    _.forOwn(groupData, function(value)
    {
        const row = {};
        const label = getLabel(value, mode);
        row[mode.title] = label ?? 'Undefined';
        const groupType = _.groupBy(value, (item) => item.typeName);
        _.forOwn(groupType, function(value1, key1)
        {
            row[key1] = _.sum(_.map(value1, item => item.value));
        });
        table.push(row);
    });
    return table;
};

export const getGroupByExcel = (data, mode)=>
{
    let filterData = _.clone(data);
    let groupByData = {};
    switch (mode)
    {
        case _.toUpper(GROUP_BY_MODE.DAY.key):
            filterData = _.sortBy(filterData, 'time');
            groupByData = _.groupBy(filterData, (item) => item.dayOfYear);
            break;
        case _.toUpper(GROUP_BY_MODE.WEEK.key):
            filterData = _.sortBy(filterData, item => item.weekOfYear);
            groupByData = _.groupBy(filterData, (item) => item.weekAndYear);
            break;
        case _.toUpper(GROUP_BY_MODE.MONTH.key):
            filterData = _.sortBy(filterData, ['year', 'month']);
            groupByData = _.groupBy(filterData, (item) => item.monthAndYear);
            break;
        case _.toUpper(GROUP_BY_MODE.DAY_OF_WEEK.key):
            filterData = _.sortBy(filterData, ['dayOfWeek']);

            groupByData = _.groupBy(filterData, (item) => item.dayOfWeek);
            break;
        case _.toUpper(GROUP_BY_MODE.HOUR_OF_DAY.key):
            filterData = _.sortBy(filterData, ['hourOfDay']);
            groupByData = _.groupBy(filterData, (item) => item.hourOfDay);
            break;
        case _.toUpper(GROUP_BY_MODE.WORKER_TYPE.key):
            groupByData = _.groupBy(data, (item) => item.employee.type);
            break;
        case _.toUpper(GROUP_BY_MODE.JOB_TYPE.key):
            groupByData = _.groupBy(data, (item) => item.jobType.id);
            break;
        case _.toUpper(GROUP_BY_MODE.WORKER.key):
            groupByData = _.groupBy(data, (item) => item.employee.name);
            break;
        default:
            break;
    }
    return groupByData;
};

export const parseDashboardData2Excel = (data, title, t) =>
{
    const result = [];
    if (!data)
    {
        return;
    }

    const arrKey = _.map(data.types, type => type.typeName);
    for (let i = 0; i < _.size(data.labels); i++)
    {
        const newItem = {};
        _.set(newItem, `${title}`, data.labels[i]);
        for (let j = 0; j < arrKey.length; j++)
        {
            _.set(newItem, `${t ? t(arrKey[j]) : arrKey[j]}`, data.values[i][j] ?? 0);
        }
        result.push(newItem);
    }
    return result;
};


import * as _ from 'lodash';
import { roundDecimal } from '../utilities/helper';
import { FACET_TYPE } from './constants';
import { convertToDataLabel, convertTitleCase, intArrayStat, getValueByKey } from './util';
var math_exp = require('math-expression-evaluator');

export const convertToMasterEmployee = (object) =>
{
    const result = [];
    if (_.isEmpty(object.employee_detail_log) || object.employee_detail_log.length < 1)
    {
        return null;
    }
    result.push(_.map(object.employee_detail_log, log =>
    {
        return {
            employeeCode: log.employee_code,
            distanceTotal: _.get(log,'total_distance', 0),
            distanceIdle: _.get(log,'idle_distance', 0),
            durationTotal: _.get(log,'total_duration', 0),
            durationIdle: _.get(log,'idle_duration', 0),
            employeeFullName: log.employee_full_name,
            employeeGuid: log.employee_guid,
            employeeTypeId: log.employee_type_id,
            employeeTypeName: log.employee_type_name,
            employeeUsername: log.employee_username,
            time: log.detail_date,
            employee: {
                guid: _.get(log, 'employee_guid'),
                name: _.get(log, 'employee_full_name'),
                id: _.get(log, 'employee_type_id'),
                type: _.get(log, 'employee_type_name'),
            },
            jobs: log.jobs,
        };

    },
    ));
    return result;
};

export const getBuckets = (data,field)=>
{
    return _.get(data,[field, 'buckets']) ?? _.get(data,field);
};

export const convertDashboardModel = (response, chart, detailCharts, keys = ['filters', 'result_filtered'], time, periodCompares) =>
{
    response = _.get(response, keys);
    const total = getValueByKey(response, chart);
    let buckets = [];
    switch (chart.facetType)
    {
        case FACET_TYPE.QUERY_FACET:
            chart.queries.forEach(item=>
            {
                const bucket = getBuckets(response,item?.key);
                buckets.push({ ...bucket, val: item.label });
            });
            break;
        case FACET_TYPE.TERM_FACET:
            buckets = getBuckets(response, chart?.key);
            break;
        default:
            break;
    }
    if (buckets)
    {
        // Include array detail chart with object { labels, values, types, title}
        const dataDetailChart = [];

        // For every bucket
        const items = buckets.map((item, idx) =>
        {
            const calculatorVal = getValueByKey(item, chart);
            // DAY, MONTH
            detailCharts.forEach((element, indexDetail) =>
            {
                // Check first time, if not exists create labels, values in dataDetailChart
                if (dataDetailChart[indexDetail] == undefined)
                {
                    const data = intArrayStat(element, time);
                    if (data)
                    {
                        _.set(dataDetailChart,[indexDetail,'labels'], data.labels);
                        _.set(dataDetailChart,[indexDetail,'values'], data.values);
                    }
                }
                // Get bucket from key
                let childBuckets = getBuckets(item, element?.key);
                _.set(dataDetailChart,[indexDetail,'types',idx],{ color: chart.colors[idx], typeName: convertTitleCase(item.val) });
                _.set(dataDetailChart,[indexDetail,'title'],element?.label);
                _.set(dataDetailChart,[indexDetail,'type'],element?.key);
                // Detail chart with type Function, response n bucket
                const isFunction = (element?.detailType === 'function' || element?.detailType === 'period');

                if (isFunction && childBuckets)
                {
                    // Ignore  count, val
                    _.unset(childBuckets,'count');
                    _.unset(childBuckets,'val');
                    // Parse from object to array
                    childBuckets = Object.entries(childBuckets).map(([key, val]) => ({ 'val': key.replace('val$',''), value: getValueByKey(val, chart) }));
                }
                // Get child from childBuckets
                childBuckets && _.map(childBuckets, child=>
                {
                    // Get value parse to label
                    const val = convertToDataLabel(child.val, element, periodCompares);

                    const labels = _.get(dataDetailChart,[indexDetail,'labels'],[]);
                    // Find label in init labels with index
                    let indexLabel = _.findIndex(labels, lbl => _.toUpper(lbl) == _.toUpper(val));
                    if (indexLabel < 0)
                    {
                        labels.push(val);
                        indexLabel = labels.length - 1;
                    }
                    // Get previous value then add with current value
                    const valuePrev = _.get(dataDetailChart,[indexDetail,'values', indexLabel, idx],0);
                    const valueFinal = isFunction ? child.value : getValueByKey(child, chart);

                    _.set(dataDetailChart,[indexDetail,'values',indexLabel,idx], valuePrev + valueFinal);
                    _.set(dataDetailChart,[indexDetail,'labels'], labels);
                });
            });
            const percent = roundDecimal((calculatorVal / total) * 100, 1);
            return {
                color: chart.colors[idx],
                name: convertTitleCase(item?.val),
                percent: _.isNaN(percent) ? 0 : percent,
                unit: chart?.unit,
                value: calculatorVal,
            };
        });
        // Ratio number
        const varTokens = [];
        const pairValue = {};
        _.forEach(chart?.overviewRatio?.variables, (item,index)=>
        {
            varTokens.push({
                type: 3, // Constant
                token: `number${index + 1}`,
                show: `number${index + 1}`,
                value: `number${index + 1}`,
            });
            const overview_number = getBuckets(response,[`overview_number_${index + 1}`]);
            if (overview_number)
            {
                pairValue[`number${index + 1}`] = getValueByKey(overview_number, item, `overview_number_${index + 1}`);// Object.values(overview_number)[1] ?? Object.values(overview_number)[0];
            }
        });
        const ratioValue = math_exp.eval(chart?.overviewRatio?.evaluator,varTokens,pairValue);
        return {
            masterChart: {
                colors: chart.colors,
                master: _.map(items,'value'),
                ratioNumber: {
                    value: _.isNumber(ratioValue) && !_.isNaN(ratioValue) ? ratioValue.toFixed(1) : 'N/A',
                    label: chart?.overviewRatio?.label,
                },
                titles: _.map(items,'name'),
                detail: {
                    title: chart?.label,
                    unit: chart?.unit,
                    total: total,
                    items: items,
                },
            },
            detailsChart: dataDetailChart,
        };
    }
    return {
        masterChart: {
            detail: {
                title: chart?.label,
                unit: chart?.unit,
            },
        },
        detailsChart: [],
    };
};

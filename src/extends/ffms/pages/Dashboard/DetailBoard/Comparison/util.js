import * as _ from 'lodash';
import moment from 'moment';
export const periodType = {
    year: 'year',
    quarter: 'quarter',
    month: 'month',
    week: 'week',
    custom: 'custom',
};

export const comparisonTypes = [
    {
        id: periodType.year,
        label: 'Năm',
        text: '',
        key: 'Y',
    }, {
        id: periodType.quarter,
        label: 'Quý',
        text: 'Q',
        key: 'Q',
    },
    {
        id: periodType.month,
        label: 'Tháng',
        text: 'Month',
        key: 'M',
    },
    {
        id: periodType.week,
        label: 'Tuần',
        text: 'W',
        key: 'W',
    },
    {
        id: periodType.custom,
        label: 'Tùy chọn',
        text: 'Custom',
        key: 'C',
    },
];

export const getPeriodTypeName = (periodType) =>
{
    return comparisonTypes.find(period => period.id === periodType).label;
};

export const groupBy = (days, type, t) =>
{
    let defaultGroupBy = [];
    let custom = [];
    const shortKeyLabel = comparisonTypes.find(periodType => periodType.id === type).label;
    const shortKey = t ? t(shortKeyLabel) : shortKeyLabel;
    let label = comparisonTypes.find(periodType => periodType.id === type).text;

    const monthOfYear = moment.months(true);

    switch (type)
    {
        case periodType.year:
            custom = _.groupBy(days, day => day.year);
            break;
        case periodType.quarter:
            defaultGroupBy = _.groupBy(days, day => day.quarter);
            custom = _.groupBy(days, day => day.quarterAndYear);
            break;
        case periodType.month:
            defaultGroupBy = _.groupBy(days, day => day.month);
            custom = _.groupBy(days, day => day.monthAndYear);
            break;
        case periodType.week:
            defaultGroupBy = _.groupBy(days, day => day.week);
            custom = _.groupBy(days, day => day.weekAndYear);
            break;
        default:
            break;
    }


    const defaultKeys = Object.keys(defaultGroupBy);
    const defaultValue = _.map(defaultKeys, key =>
    {
        const obj = defaultGroupBy[key];
        const values = [];
        const groups = _.groupBy(obj, item => item.year);
        label = type === periodType.month ? label = monthOfYear[obj[0].month] : `${shortKey} ${key}`;
        _.map(groups, group =>
        {
            const value = {
                from: moment.utc(group[0].dayOfYear, 'DD/MM/YYYY').format(),
                to: moment.utc(group[group.length - 1].dayOfYear, 'DD/MM/YYYY').format(),
                year: group[0].year,
            };
            values.push(value);
        });
        return {
            id: `${shortKey}${key}`,
            label: label,
            values,
        };
    });


    const customKeys = Object.keys(custom);
    const customValue = _.size(customKeys) > 0 ? _.map(customKeys, key =>
    {
        const obj = custom[key];
        label = type === periodType.month ? label = `${monthOfYear[obj[0].month]}-${obj[0].year}` : `${shortKey} ${key}`;
        return {
            id: `${shortKey}${key}`,
            label: label,
            values: {
                from: moment.utc(obj[0].dayOfYear, 'DD/MM/YYYY').format(),
                to: moment.utc(obj[obj.length - 1].dayOfYear, 'DD/MM/YYYY').format(),
            },
        };
    }) : [];
    return {
        type: type,
        default: defaultValue,
        custom: customValue,
    };
};

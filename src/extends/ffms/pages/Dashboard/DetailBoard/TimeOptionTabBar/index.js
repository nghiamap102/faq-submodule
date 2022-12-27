
import { MonthOfYear } from 'extends/ffms/services/utilities/dateTime';
import { GROUP_BY_MODE } from 'extends/ffms/services/DashboardService/constants';
import * as _ from 'lodash';

export const getYears = (times, mode) =>
{
    if (!times)
    {
        return null;
    }

    const years = [];
    _.map(times.years, (year) =>
    {
        years.push({
            label: year[0].year,
            value: year[0].year,
            id: year[0].year
        });
    });

    if (years.length > 1 &&
        (mode === GROUP_BY_MODE.DAY_OF_WEEK.id ||
            mode === GROUP_BY_MODE.MONTH.id ||
            mode === GROUP_BY_MODE.HOUR_OF_DAY.id
        ))
    {
        years.push({
            label: 'All',
            value: 0,
            id: 0
        });
    }
    return years;
};

export const getMonths = (years, year) =>
{
    if (!year)
    {
        return;
    }
    const pickTabs = [];

    const daysOfYear = _.find(years, (item) => item[0].year === year);
    const months = _.groupBy(daysOfYear, (day) => day.month);
    if (!months)
    {
        return;
    }
    _.map(months, (month) =>
    {
        pickTabs.push({
            id: month[0].month,
            title: MonthOfYear[month[0].month]
        });
    });
    return _.sortBy(pickTabs, item => item.id);
};


export { default } from './TimeOptionTabBar';

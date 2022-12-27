import moment from 'moment';

export const enumerateDaysBetweenDates = (startDate, endDate) =>
{
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');
    if (currDate.add(0, 'days').diff(lastDate) === 0)
    {
        dates.push(convertToTimeDetail(currDate.clone()));
        return dates;
    }
    while (currDate.add(1, 'days').diff(lastDate) <= 0)
    {
        dates.push(convertToTimeDetail(currDate.clone()));
    }

    return dates;
};

export const convertToTimeDetail = (time) =>
{
    return {
        dayOfYear: time.format('DD/MM/YYYY'),
        monthAndYear: time.format('YYYY/MM'),
        weekOfYear: time.week(),
        weekAndYear: `${time.isoWeek()}/${time.isoWeekYear()}`,
        month: time.month(),
        dayOfWeek: time.day(),
        hourOfDay: time.hour(),
        year: time.year(),
        time: time,
    };
};

export function getDaysInMonth(month, year)
{
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month)
    {
        days.push(convertToTimeDetail(moment(new Date(date))));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

export const numberToText = (value) =>
{
    if (Math.floor(value / 1000000000) > 0)
    {
        return `${Math.round(value / 10000000) / 100}B`;
    }
    if (Math.floor(value / 1000000) > 0)
    {
        return `${Math.round(value / 10000) / 100}M`;
    }
    if (Math.floor(value / 1000) > 0)
    {
        return `${Math.round(value / 10) / 100}K`;
    }
    return value;

};

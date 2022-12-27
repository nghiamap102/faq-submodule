import appEnum from 'constant/app-enum';
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
        week: time.isoWeek(),
        weekOfYear: time.week(),
        quarter: time.quarter(),
        quarterAndYear: `${time.quarter()}-${time.year()}`,
        yearAndQuarter: `${time.year()}-${time.quarter()}`,
        weekAndYear: `${time.isoWeek()}-${time.isoWeekYear()}`,
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
    return roundDecimal(value);

};

export const roundDecimal = (value, n = 2)=>
{
    return Math.round(value * Math.pow(10,n)) / Math.pow(10,n);
};

export const toastSendMailResult = (res, toast) => 
{
    if (res.result === appEnum.APIStatus.Success)
    {
        toast({ type: 'success', message: 'Đã gửi mail thành công!' });
        return true;
    }
    else if (res.result === appEnum.APIStatus.Error)
    {
        toast({ type: 'error', message: 'Gửi email không thành công!' });
        return false;
    }
    return null;
};
  

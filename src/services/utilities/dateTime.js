export const DayOfWeek = {
    0: 'T2',
    1: 'T3',
    2: 'T4',
    3: 'T5',
    4: 'T6',
    5: 'T7',
    6: 'CN',
};

export const getHourOfDay = () =>
{
    const hours = [];
    for (let i = 0; i < 24; i++)
    {
        hours.push(i);
    }
    return hours;
};

export const getDayOfWeek = () =>
{
    const days = [];
    for (let i = 0; i < 7; i++)
    {
        days.push(i);
    }
    return days;
};

export const MonthOfYear = {
    0: 'Tháng 1',
    1: 'Tháng 2',
    2: 'Tháng 3',
    3: 'Tháng 4',
    4: 'Tháng 5',
    6: 'Tháng 7',
    7: 'Tháng 8',
    8: 'Tháng 9',
    9: 'Tháng 10',
    10: 'Tháng 11',
    11: 'Tháng 12'
};

export const secondsToHms = (seconds) =>
{
    var hour = Math.round(seconds / 36) / 100;
    // var m = Math.floor(seconds % 3600 / 60);
    // var s = Math.floor(seconds % 3600 % 60);

    // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    // return hDisplay + mDisplay + sDisplay;
    return Number(hour);
};

export const mToKms = (meters) =>
{
    var kilometer = Math.round(meters / 10) / 100;
    return Number(kilometer);
};

export const div100 = (value) =>
{
    return Math.round(value * 100) / 100;
};

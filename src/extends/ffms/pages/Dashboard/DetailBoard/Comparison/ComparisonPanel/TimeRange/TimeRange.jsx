import PropTypes from 'prop-types';
import './TimeRange.scss';
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';

import DateRangePicker from 'extends/ffms/pages/base/DateRangePicker';
import TimeButton from './TimeButton';

const TimeRange = (props) =>
{
    const { period, changeTimeRange, defaultTimeRange } = props;
    const defaultTime = {
        from: _.get(period, 'values.from'),
        to: _.get(period, 'values.to'),
    };
    const limit = {
        min: defaultTime.from,
        max: defaultTime.to,
    };
    const defaultValue = {
        defaultRange: defaultTime, selectedRange: defaultTime,
    };
    const [timeRanges, setTimeRanges] = useState(!_.isEmpty(defaultTimeRange) ? defaultTimeRange : [ defaultValue]);
    
    const onDateChange = (timeRange)=>({ date }) =>
    {
        timeRange.selectedRange = date;
        changeTimeRange(timeRanges);
    };

    const addTimeRange = () =>
    {
        const temp = timeRanges;
        temp.push(defaultValue);
        changeTimeRange(_.clone(temp));
        setTimeRanges(_.clone(temp));
    };

    const removeTimeRange = (index) =>
    {
        const temp = timeRanges;
        if (_.size(temp) > 1)
        {
            temp.splice(index, 1);
            changeTimeRange(_.clone(temp));
            setTimeRanges(_.clone(temp));
        }
    };

    return (
        <>
            {_.map(timeRanges, (timeRange, index) =>
                (<div key={index} className={'time-bar'}>
                    <DateRangePicker
                        block={false}
                        defaultValue={timeRange.selectedRange}
                        onChange={onDateChange(timeRange)}
                        limit={limit}
                    />
                    
                    {
                        _.size(timeRanges) > 1 &&
                        <TimeButton
                            icon='times'
                            onClick={()=>removeTimeRange(index)}
                        />
                    }
                </div>
                ))
            }
            <TimeButton
                icon='plus'
                onClick={()=> addTimeRange()}
            />
        </>
    );
};

TimeRange.propTypes = {
    changeTimeRange: PropTypes.func,
    defaultTimeRange: PropTypes.any,
    period: PropTypes.any,
};

export default TimeRange;


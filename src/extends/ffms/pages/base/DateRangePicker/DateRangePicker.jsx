import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import { Container, T, FormControlLabel, Input } from '@vbd/vui';

function CustomRangeDate({ name, onChange, defaultValue, block, limit })
{
    const [fromDate, setFromDate] = useState(_.get(defaultValue, 'from'));
    const [toDate, setToDate] = useState(_.get(defaultValue, 'to'));

    useEffect(() =>
    {
        setFromDate(_.get(defaultValue, 'from'));
        setToDate(_.get(defaultValue, 'to'));
    }, [defaultValue]);

    const handleChange = () =>
    {
        const date = {
            from: fromDate ? moment(fromDate).set({ hours: 0, minutes: 0, seconds: 0 }).utc().format() : fromDate,
            to: toDate ? moment(toDate).set({ hours: 23, minutes: 59, seconds: 59 }).utc().format() : toDate,
        };
        if (!_.isNull(date.from) && !_.isNull(date.to))
        {
            _.isFunction(onChange) && onChange({ name, date });
        }
    };
    const today = moment().format('YYYY-MM-DD');
    const getLimitDate = (date1, date2, reg) =>
    {
        if (_.isEmpty(date1) && _.isEmpty(date2))
        {
            return '';
        }
        let date;
        if (!_.isEmpty(date1) && !_.isEmpty(date2))
        {
            date = reg === 'min' ? date1 > date2 ? date2 : date1 :
                date1 > date2 ? date1 : date2;
        }
        else
        {
            date = _.isEmpty(date1) ? date2 : date1;
        }
            
        return moment(date).format('YYYY-MM-DD');
    };

    const getMaxDate = (date1, date2) =>
    {
        if (_.isEmpty(date1) && _.isEmpty(date2))
        {
            return '';
        }
        const maxDate = date1 > date2 ? date1 : date2;
        return moment(maxDate).format('YYYY-MM-DD');
    };

    return (
        <Container >
            <div
                style={{ display: block ? 'unset' : 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onBlur={(e) =>
                {
                    if (!e.currentTarget.contains(e.relatedTarget))
                    {
                        handleChange();
                    }
                }}
            >
                <FormControlLabel
                    label='Từ'
                    control={
                        <Input
                            name={'from'}
                            type={'date'}
                            value={fromDate ? moment(fromDate).format('YYYY-MM-DD') : ''}
                            onChange={(value) => setFromDate(value)}
                            // max={toDate ? moment(toDate).format('YYYY-MM-DD') : today}
                            max={toDate ? getLimitDate(limit?.max, toDate,'min') : getLimitDate(limit?.max, today,'min')}
                            min={limit ? moment(limit?.min).format('YYYY-MM-DD') : ''}
                        />
                    }
                />
                {!block && <span><T>-</T></span>}
                <FormControlLabel
                    label={block ? 'Đến' : ''}
                    control={
                        <Input
                            name={'to'}
                            type={'date'}
                            value={toDate ? moment(toDate).format('YYYY-MM-DD') : ''}
                            onChange={(value) => setToDate(value)}
                            // min={fromDate ? moment(fromDate).format('YYYY-MM-DD') : ''}
                            // max={today}

                            min={getLimitDate(limit?.min, fromDate,'max')}
                            max={getLimitDate(limit?.max, today,'min')}
                        />
                    }
                />  </div>
            
        </Container>
    );
}

CustomRangeDate.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    defaultValue: PropTypes.object,
    block: PropTypes.bool,
};

CustomRangeDate.defaultProps = {
    block: false,
};

export default CustomRangeDate;

import PropTypes from 'prop-types';
import './RangeDatetimeFilter.scss';
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import { LIST_PERIOD } from 'extends/ffms/services/DashboardService/constants';
import SelectFilter from 'extends/ffms/pages/base/SelectFilter/SelectFilter';
import PopupWrapper from 'extends/ffms/pages/base/Popup/Popup';
import { Button } from '@vbd/vui';
import { convertCustomTime } from 'extends/ffms/services/DashboardService/util';
import { PERIOD_DEFAULT } from 'extends/ffms/services/ReportService/constants';

const RangeDatetimeFilter = ({ isCustom, defaultValue, onUpdated }) =>
{
    const [period, setPeriod] = useState(
        {
            type: isCustom ? 'Custom' : PERIOD_DEFAULT,
            from: _.get(defaultValue, 'from'),
            to: _.get(defaultValue, 'to'),
        });
    const [dirty, setDirty] = useState(false);

    useEffect(() =>
    {
        if (!isCustom)
        {
            setPeriod(convertCustomTime(LIST_PERIOD, { type: period.type }));
        }
    }, []);

    const getFormatDate = () =>
    {
        if (_.get(period, 'from') && _.get(period, 'to'))
        {
            const fromDate = moment.isMoment(_.get(period, 'from')) ? _.get(period, 'from') : moment(_.get(period, 'from'));
            const toDate = moment.isMoment(_.get(period, 'to')) ? _.get(period, 'to') : moment(_.get(period, 'to'));
            _.isFunction(onUpdated) && onUpdated({
                from: fromDate.format('DD/MM/YYYY'),
                to: toDate.format('DD/MM/YYYY'),
            }, dirty);
            if (dirty)
            {
                setDirty(false);
            }
            return ` ${fromDate.format('DD/MM/YYYY')} - ${toDate.format('DD/MM/YYYY')}`;
        }
        return 'DD/MM/YYYY - DD/MM/YYYY';
    };
    return (
        <>
            <PopupWrapper
                trigger={
                    <Button
                        icon='calendar'
                        label={getFormatDate()}
                        className='custom-button calender'
                    />
                }
                padding={'0.5rem'}
                isShowArrow
                position='center'
            >
                <SelectFilter
                    isCustom={isCustom}
                    name="period"
                    label="Period"
                    options={LIST_PERIOD}
                    defaultValue={_.get(period,'type')}
                    customDefault={period.type == 'Custom' && {
                        from: _.get(period, 'from'),
                        to: _.get(period, 'to'),
                    }}
                    placeholder={'Time'}
                    onChange={({ value, custom }) =>
                    {
                        if (value != 'Custom' || (_.get(custom, 'from') && _.get(custom, 'to') && value === 'Custom'))
                        {
                            setPeriod(convertCustomTime(LIST_PERIOD,{ type: value, ...custom }));
                        }
                        setDirty(true);
                    }
                    }
                    block
                />
            </PopupWrapper>
        </>
    );
};

RangeDatetimeFilter.propTypes = {
    isCustom: PropTypes.any,
    defaultValue: PropTypes.any,
    onUpdated: PropTypes.func,
};

RangeDatetimeFilter.defaultProps = {
    isCustom: false,
};

export default RangeDatetimeFilter;

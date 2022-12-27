import PropTypes from 'prop-types';
import 'extends/ffms/pages/Report/Report.scss';
import '../ReportFilter.scss';

import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import { toJS } from 'mobx';

import {
    T, useI18n,
    AdvanceSelect, FormControlLabel,
} from '@vbd/vui';
import DateRangePicker from 'extends/ffms/pages/base/DateRangePicker';

import { DATA_TYPE, MongoOperator } from 'extends/ffms/services/ReportService/constants';

const FilterType = (props) =>
{
    const { t } = useI18n();

    const { updateFilterValue, currentFilter } = props;
    const filterType = _.get(currentFilter, 'type');
    const data = toJS(_.get(currentFilter, 'data'));
    const layerName = _.get(currentFilter, 'text');
    const selectedValue = _.get(currentFilter, 'value');
    const currentValue = _.get(currentFilter, 'value.label');
    const [defaultDate, setDefaultDate] = useState();

    useEffect(() =>
    {
        if (!_.isEmpty(currentValue))
        {
            if (filterType === DATA_TYPE.TIMESTAMP)
            {
                // const from = moment.utc(currentValue.from,'DD/MM/YYYY');
                const date = {
                    from: moment.utc(currentValue.from, 'DD/MM/YYYY').format(),
                    to: moment.utc(currentValue.to, 'DD/MM/YYYY').format(),
                };
                setDefaultDate(date);
            }
        }

    }, [currentValue]);

    const inputOnBlur = (event) =>
    {
        const value = event.target.value;
        const type = event.target.type;
        const condition = type === 'text' ? MongoOperator.like : MongoOperator.eq;
        if (_.isEmpty(value))
        {
            currentFilter.checked = false;
        }
        updateFilterValue({ ...currentFilter, condition, value: { label: event.target.value } });
    };

    const onSelectedChange = (value) =>
    {
        // setSelectedValue(value);
        let filterValue;
        if (_.isArray(value))
        {
            filterValue = [];
            _.forEach(value, element =>
            {
                filterValue.push(_.find(data, item => item.id === element));
            });

        }
        else
        {
            filterValue = toJS(_.find(data, item => item.id === value));
        }

        updateFilterValue({ ...currentFilter, value: filterValue, checked: _.size(filterValue) > 0 });
    };
    const onDateChange = ({ date }) =>
    {
        const dateValue = {
            from: moment.utc(date.from).format('DD/MM/YY'),
            to: moment.utc(date.to).format('DD/MM/YY'),
        };
        updateFilterValue({ ...currentFilter, value: { label: dateValue } });
    };

    return (
        <>
            <div className='report-item-title'>
                <T>=</T>
            </div>
            {
                filterType == DATA_TYPE.STRING &&
                <FormControlLabel
                    control={
                        <input
                            type={'text'}
                            placeholder={t('Nhập từ khóa để tìm kiếm')}
                            defaultValue={currentValue}
                            onBlur={inputOnBlur}
                        />}
                />
            }
            {
                filterType == DATA_TYPE.NUMBER &&
                <FormControlLabel
                    control={
                        <input
                            type={'number'}
                            placeholder={t('Nhập từ khóa để tìm kiếm')}
                            defaultValue={currentValue}
                            onBlur={inputOnBlur}
                            onChange={(e) =>
                            {
                                if ((e.target.value * 1) < 0)
                                {
                                    e.target.value = 0;
                                }
                            }
                            }
                        />}
                />
            }
            {
                filterType == DATA_TYPE.TIMESTAMP &&
                <DateRangePicker
                    block
                    onChange={onDateChange}
                    defaultValue={defaultDate}
                />
            }
            {
                filterType == DATA_TYPE.LIST &&
                <AdvanceSelect
                    multi
                    placeholder={layerName}
                    value={_.isArray(selectedValue) ? _.map(selectedValue, 'id') : []}
                    options={data}
                    onChange={onSelectedChange}
                />
            }
        </>
    );
};

FilterType.propTypes = {
    currentFilter: PropTypes.shape({
        checked: PropTypes.any,
    }),
    updateFilterValue: PropTypes.func,
};

export default FilterType;


import PropTypes from 'prop-types';
import 'extends/ffms/pages/Report/Report.scss';
import './Comparison.scss';

import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';

import SelectFilter from 'extends/ffms/pages/base/SelectFilter';
import { toJS } from 'mobx';
import { enumerateDaysBetweenDates } from 'extends/ffms/services/utilities/helper';
import { comparisonTypes, periodType, groupBy } from './util';
import FilterTags from 'extends/ffms/pages/base/FilterTags';
import ComparisonPanel from 'extends/ffms/pages/Dashboard/DetailBoard/Comparison/ComparisonPanel';
import { useI18n } from '@vbd/vui';


const Comparison = ({ fieldForceStore, props }) =>
{
    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const [timePeriods, setTimePeriods] = useState([]);
    const [period, setPeriod] = useState();
    const [type, setType] = useState(periodType.year);
    const [curTimeFilter, setCurTimeFilter] = useState();
    const [filterTags, setFilterTags] = useState();
    const [periodCompares, setPeriodCompares] = useState(toJS(dashboardStore?.periodCompares));
    const [chosen, setChosen] = useState();
    const { t } = useI18n();
    
    const defaultTypeValue = comparisonTypes.find(item => item.id === type).id;
    const changeType = (item) =>
    {
        setType(item.value);
        const period = timePeriods.find(tp => tp.type === item.value);
        setPeriod(period);
    };

    useEffect(() =>
    {
        const period = timePeriods.find(tp => tp.type === type);
        setPeriod(_.clone(period));
    }, [timePeriods]);
    
    
    useEffect(() =>
    {
        const dashboardFilter = _.get(dashboardStore,'filters');
        const timeFilter = toJS(_.get(dashboardFilter.find(filter => filter.type === 'time-filter'),'values'));
        
        if (!_.isEmpty(timeFilter) &&
            !_.isEqual(curTimeFilter,timeFilter))
        {
            const periods = [];
            const days = enumerateDaysBetweenDates(timeFilter.fromMoment, timeFilter.toMoment);
            periods.push(groupBy(days, periodType.year, t));
            periods.push(groupBy(days, periodType.quarter, t));
            periods.push(groupBy(days, periodType.month, t));
            periods.push(groupBy(days, periodType.week, t));
            periods.push({
                type: periodType.custom,
                values: {
                    from: timeFilter.from,
                    to: timeFilter.to,
                },
            });
            
            setCurTimeFilter(_.clone(timeFilter));
            setTimePeriods(_.clone(periods));
        }
    }, [dashboardStore.filters]);

    const applyPeriodCompares = (periodCompares) =>
    {
        dashboardStore.setPeriodCompares(_.clone(periodCompares));
        setPeriodCompares(periodCompares);
    };

    useEffect(() =>
    {
        getTags();

    }, [periodCompares]);

    const getTags = ()=>
    {
        const tags = _.map(periodCompares, period =>
        {
            return {
                periodType: period.periodType,
                type: period.type,
                key: period.key,
                label: period.label,
            };
        });
        setFilterTags(_.cloneDeep(tags));
    };

    const removeTag = (item) =>
    {
        const newPeriod = _.clone(periodCompares);
        _.pullAt(newPeriod, item.index);
        dashboardStore.setPeriodCompares(_.clone(newPeriod));
        setChosen(newPeriod);
        setPeriodCompares(newPeriod);
    };
    return (
        <>
            <FilterTags
                title='Giai đoạn'
                data={toJS(filterTags)}
                onChange={removeTag}
            />
            <div className='comparison-type'>
                <SelectFilter
                    className='comparison-dropdown'
                    name={''}
                    label={''}
                    options={comparisonTypes}
                    defaultValue={defaultTypeValue}
                    onChange={(item) => changeType(item)}
                />
                <ComparisonPanel
                    period={period}
                    selectedPeriod={periodCompares}
                    applyPeriodCompares={applyPeriodCompares}
                    chosen={chosen}
                />
                
          
            </div>
        </>
        
    );
};

Comparison.propTypes = {
    fieldForceStore: PropTypes.any,
    props: PropTypes.any,
};

export default inject('fieldForceStore')(observer(Comparison));


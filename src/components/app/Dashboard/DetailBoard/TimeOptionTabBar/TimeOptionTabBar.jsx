import './TimeOptionTabBar.scss';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';

import { TabBar, AdvanceSelect } from '@vbd/vui';

import PagingDetail from '../PagingDetail/PagingDetail';

import { getYears, getMonths } from '.';

const TimeOptionTabBar = ({ dashboardStore, totalItem }) =>
{
    // const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const [tabs, setTabs] = useState([]);
    const [year, setYear] = useState();
    const [years, setYears] = useState();
    const [defaultIndex, setDefaultIndex] = useState();
    const [showPaging, setShowPaging] = useState(false);
    const [showMonth, setShowMonth] = useState(true);

    useEffect(() =>
    {
        const filterYears = getYears(dashboardStore.times, dashboardStore.groupByMode.id);

        setYears(filterYears);
        if (!_.isEmpty(filterYears))
        {
            const hasYearInFilter = _.find(filterYears, item => item.value === year);
            if (_.isEmpty(hasYearInFilter))
            {
                setYear(filterYears[0].value);
                dashboardStore.setYear(filterYears[0].value);
            }

        }
    }, [dashboardStore.times, dashboardStore.groupByMode]);

    useEffect(() =>
    {
        // setDefaultIndex(minMonth);
        const months = getMonths(dashboardStore.times.years, year);
        setTabs(months);
        if (!_.isEmpty(months))
        {
            setDefaultIndex(months[0].id);
            dashboardStore.setMonth(months[0].id);
        }

    }, [year, dashboardStore.times.years]);

    const onMonthChange = (month) =>
    {
        dashboardStore.setMonth(month);
    };

    const onYearChange = (value) =>
    {
        setYear(value);
        dashboardStore.setYear(value);
    };


    const handleIndexChange = (page) =>
    {
        dashboardStore.setPaging(page);
    };

    return (
        <>
            {
                _.size(years) > 0 && (
                    <div className="bar-content">
                        {years && (
                            <div
                                style={{ width: '70px' }}
                                className={`year-filter ${_.size(years) == 1 ? 'hide-arrow' : ''}`}
                            >
                                <AdvanceSelect
                                    options={years}
                                    value={year}
                                    disabled={_.size(years) == 1}
                                    onChange={(value) => onYearChange(value)}
                                />
                            </div>
                        )}
                        {showMonth && (
                            <TabBar
                                title=""
                                defaultIndex={defaultIndex}
                                tabs={tabs}
                                className={'time-group-by'}
                                onChange={onMonthChange}
                            />
                        )}
                        {showPaging && (
                            <PagingDetail
                                pageIndex={dashboardStore.paging.pageIndex}
                                limit={dashboardStore.paging.limit}
                                totalItem={totalItem}
                                onPageChange={handleIndexChange}
                            />
                        )}
                    </div>
                )}
        </>
    );
};

TimeOptionTabBar.propTypes = {
    fieldForceStore: PropTypes.any,
    totalItem: PropTypes.number,
};


export default inject('dashboardStore')(observer(TimeOptionTabBar));

import React, { useState, useEffect, useContext } from 'react';
import { inject, observer } from 'mobx-react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';

import { I18nContext } from '@vbd/vui';

import DetailHeader from 'extends/ffms/pages/Dashboard/DetailBoard/DetailHeader/DetailHeader';
import StackedChart from 'extends/ffms/pages/Dashboard/DetailBoard/StackedChart/StackedChart';
import GroupByTabBar from 'extends/ffms/pages/Dashboard/DetailBoard/GroupByTabBar/GroupByTabBar';
import { getCurrentMainTab } from 'extends/ffms/services/DashboardService/util';
import { TAB } from 'extends/ffms/services/DashboardService/constants';

import { convertToModel, groupBy } from './utils';

const DetailBoard = ({ fieldForceStore }) =>
{
    const { language } = useContext(I18nContext);

    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const [data, setData] = useState({});
    const [yAxisTile, setYAxisTile] = useState('');
    const tab = (getCurrentMainTab(toJS(dashboardStore.tabs)));

    // Dashboard for EMPLOYEE
    useEffect(() =>
    {
        if (tab.code !== TAB.EMPLOYEE)
        {
            getDetailCharts();
        }
        else
        {
            const currentDetail = toJS(dashboardStore.layers[dashboardStore.masterIndex]);

            if (currentDetail)
            {
                setYAxisTile(currentDetail.detail.unit);
                const groups = groupBy(currentDetail.groups, dashboardStore.groupByMode, dashboardStore.showMode, toJS(dashboardStore.filters));
                const result = convertToModel(groups, dashboardStore.groupByMode, dashboardStore.masterIndex, tab, language);
                const newValues = [];
                const newLabels = [];
                if (!dashboardStore.showMode)
                {
                    let i = 0;
                    result.values.forEach(value =>
                    {
                        const sum = _.reduce(value, function (sum, n)
                        {
                            return sum + (n ?? 0);
                        }, 0);
                        if (sum > 0)
                        {
                            newValues.push(value);
                            newLabels.push(result?.labels[i]);
                        }
                        i++;
                    });
                    setData({ ...result, labels: newLabels, values: newValues });
                }
                else
                {
                    setData(result);
                }
            }
        }

    }, [dashboardStore.layers,
        dashboardStore.masterIndex,
        dashboardStore.groupByMode,
        dashboardStore.timeOptionId,
        dashboardStore.month,
        dashboardStore.year,
        dashboardStore.showMode,
    ]);

    const getDetailCharts = () =>
    {
        if (tab.code !== TAB.EMPLOYEE)
        {
            if (_.isEmpty(dashboardStore.apiOutput))
            {
                return;
            }
            const master = toJS(dashboardStore.apiOutput[dashboardStore.masterIndex]?.masterChart);
            const items = toJS(dashboardStore.apiOutput[dashboardStore.masterIndex]?.detailsChart);
            let newItems = [];
            if (!dashboardStore.showMode)
            {
                items && items.forEach(item =>
                {
                    if (_.isEmpty(item.values))
                    {
                        return;
                    }
                    const newValues = [];
                    const newLabels = [];
                    let i = 0;
                    item.values.forEach(value =>
                    {
                        const sum = _.reduce(value, function (sum, n)
                        {
                            return sum + (n ?? 0);
                        }, 0);
                        if (sum > 0)
                        {
                            newValues.push(value);
                            newLabels.push(item.labels[i]);
                        }
                        i++;
                    });
                    const newItem = {
                        ...item,
                        values: newValues,
                        labels: newLabels,
                    };
                    newItems.push(newItem);
                });
            }
            else
            {
                newItems = items;
            }
            dashboardStore.setDetailCharts({
                unit: master?.detail?.unit,
                items: newItems,
            });
        }
    };

    useEffect(() =>
    {
        getDetailCharts();

    }, [dashboardStore.masterIndex, dashboardStore.showMode]);

    useEffect(() =>
    {
        if (_.isEmpty(dashboardStore.detailCharts))
        {
            return;
        }
        setYAxisTile(dashboardStore.detailCharts.unit);
        const result = toJS(dashboardStore.detailCharts.items?.find(item => _.toUpper(item.type) === dashboardStore.groupByMode));
        setData(result ?? {});

    }, [dashboardStore.detailCharts, dashboardStore.groupByMode]);

    return (
        <>
            <DetailHeader />
            {/* <TimeOptionTabBar totalItem = {_.size(data.labels)}/> */}
            <StackedChart
                data={data}
                title={yAxisTile}
            />
            <GroupByTabBar />
        </>
    );
};

DetailBoard.propTypes = {
    fieldForceStore: PropTypes.any,
};

export default inject('fieldForceStore')(observer(DetailBoard));

import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import * as _ from 'lodash';
import PropTypes from 'prop-types';

import { Container } from '@vbd/vui';

import DetailHeader from 'components/app/Dashboard/DetailBoard/DetailHeader/DetailHeader';
import StackedChart from 'components/app/Dashboard/DetailBoard/StackedChart/StackedChart';
import GroupByTabBar from 'components/app/Dashboard/DetailBoard/GroupByTabBar/GroupByTabBar';

import { MapReportWithContext } from './MapReport/MapReport';

import { FACET_TYPE } from 'services/DashboardService/constants';

import { buildFilterQuery, convertToQueryInfo } from 'services/DashboardService/util';
import dashboardService from 'services/DashboardService';

const DetailBoard = ({ dashboardStore }) =>
{
    const [data, setData] = useState({});
    const [mapData, setMapData] = useState([]);
    const [mapDataLoading, setMapDataLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [yAxisTile, setYAxisTile] = useState('');

    useEffect(() =>
    {
        getDetailCharts();

        if (dashboardStore.groupByMode.toUpperCase() === 'MAP')
        {
            setMapDataLoading(true);
            getMapData().then(rs =>
            {
                if (rs)
                {
                    setMapData(rs);
                }
                setMapDataLoading(false);
            });
        }
    }, [dashboardStore.layers,
        dashboardStore.masterIndex,
        dashboardStore.groupByMode,
        dashboardStore.timeOptionId,
        dashboardStore.month,
        dashboardStore.year,
        dashboardStore.showMode,
    ]);

    const getMapData = async () =>
    {
        const matterChart = dashboardStore.config.masterCharts[dashboardStore.masterIndex];
        const queryMode = matterChart.facetType;

        const layerName = dashboardStore.config.layerName;
        const config = toJS(dashboardStore.config);

        const queryInfo = convertToQueryInfo(config.filters);
        const filterQuery = buildFilterQuery(queryInfo, layerName, [layerName]).statQuery;

        const query = {
            layers: [layerName],
            filterQuery: filterQuery,
        };

        switch (queryMode)
        {
            case FACET_TYPE.QUERY_FACET:
            {
                const queries = matterChart.queries;
                const queryFacets = [];

                if (queries && queries.length)
                {
                    queries.forEach(q =>
                    {
                        queryFacets.push(q.query.filter);
                    });
                }

                query.queryFacets = queryFacets;
                break;
            }
            case FACET_TYPE.TERM_FACET:
                break;
            default:
                break;
        }

        return await dashboardService.getMapReportData(query);
    };

    const getDetailCharts = () =>
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
                if (item.type.toUpperCase() === 'MAP')
                {
                    setTypes(item.types);
                }

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
    };

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

    const chart = dashboardStore.config.masterCharts[dashboardStore.masterIndex];

    return (
        <>
            <DetailHeader />

            <Container className="detail-chart">
                {dashboardStore.groupByMode.toUpperCase() === 'MAP'
                    ? (
                            <MapReportWithContext
                                types={types}
                                data={mapData}
                                chart={chart}
                                loading={mapDataLoading}
                            />
                        )
                    : (
                            <StackedChart
                                data={data}
                                title={yAxisTile}
                            />
                        )
                }
            </Container>

            <GroupByTabBar />
        </>
    );
};

export default inject('dashboardStore')(observer(DetailBoard));

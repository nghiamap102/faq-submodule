import './Dashboard.scss';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { inject, observer, Provider } from 'mobx-react';
import * as _ from 'lodash';
import moment from 'moment';
import { toJS } from 'mobx';

import {
    Container,
    SideBar, Loading,
    BorderPanel, useI18n,
} from '@vbd/vui';

import { CountdownTimer } from 'components/bases/CountdownTimer';

import dashboardService from 'services/DashboardService';
import {
    convertCustomTime,
    getCurrentMainTab,
    convertToFilter,
    convertToQueryInfo,
    convertOptions,
    transformLanguage,
} from 'services/DashboardService/util';

import FilterBoard from 'components/app/Dashboard/FilterBoard/FilterBoard';
import MasterBoard from 'components/app/Dashboard/MasterBoard/MasterBoard';

import DetailBoard from './DetailBoard';

const Dashboard = ({ appStore }) =>
{
    const [loading, setLoading] = useState(true);
    const dataStorePrev = useRef();
    const { language } = useI18n();

    const dashboardStore = appStore.dashboardStore;

    const getCurrentTab = () => (getCurrentMainTab(toJS(dashboardStore.tabs)));

    async function setLayerDashboard(config, isLoading, isInterval = false)
    {
        let layers = null;

        // Get data width Filter
        isLoading && setLoading(true);
        !isInterval && dashboardStore.setLoading(true);

        const filter = convertToFilter(config.filters);
        const queryInfo = convertToQueryInfo(config.filters);

        dashboardStore.setFilters(config.filters);

        // Check Interval setting get new period if type Lastxx
        if (isInterval)
        {
            _.set(filter, 'period', convertCustomTime(filter.period));
        }

        // Call API
        const apiOutput = await dashboardService.getMasterAnalytics(filter, queryInfo, toJS(dashboardStore));
        const periodTo = _.get(dashboardStore.filter, 'period.to');

        dashboardStore.setApiOutput(apiOutput);
        layers = _.cloneDeep(_.map(apiOutput, item => item.masterChart));

        await dashboardStore.setLayers(layers, moment.isMoment(periodTo) ? periodTo : moment(periodTo));

        // Complete get data
        setLoading(false);
    }

    const getDashboardData = () =>
    {
        const config = toJS(dashboardStore.config);
        if (config != null)
        {
            setLayerDashboard(config, false, true);
        }
    };

    useEffect(() =>
    {
        dashboardStore.setDashboardConfig(null);

        async function getTabs()
        {
            let tabs = toJS(dashboardStore.tabs);

            // Check tabs null then load Tabs
            if (tabs == null)
            {
                let listConfig = await dashboardService.getDashboardConfigs();
                listConfig = transformLanguage(listConfig, language);
                tabs = _.map(listConfig, item => ({
                    ...item,
                    name: item?.name,
                    id: item?.layerName,
                    title: item?.name,
                    layerName: item?.layerName,
                }));
            }

            // Load Tabs
            await dashboardStore.setTabs(tabs);

            // Load current Config by tab selected
            await getCurrentConfig();
        }

        getTabs();
    }, []);

    useEffect(() =>
    {
        const dataStore = {
            config: toJS(dashboardStore.config),
            groupByMode: toJS(dashboardStore.groupByMode),
            masterIndex: toJS(dashboardStore.masterIndex),
        };

        if (dataStore?.config != null && JSON.stringify(dataStore) !== JSON.stringify(dataStorePrev.current))
        {
            setLayerDashboard(dataStore?.config);
            dataStorePrev.current = dataStore;
        }
    }, [dashboardStore.config]); // , dashboardStore.groupByMode, dashboardStore.masterIndex]);

    const getCurrentConfig = async () =>
    {
        const tab = getCurrentTab();
        if (!tab)
        {
            return;
        }
        let data = toJS(dashboardStore.configStore[tab.layerName]) ?? await dashboardService.getDashboardConfig(tab.code);
        data = transformLanguage(data, language);

        data && data.filters.forEach(item =>
        {
            if (item?.type === 'time-filter')
            {
                item.values = convertCustomTime(item?.data, item?.values ?? item?.default);
            }

            if (item?.content)
            {
                item.data = convertOptions(item.data, true);
            }
        });

        await dashboardStore.setDashboardConfig({ ...data }, tab, true);
    };

    return (
        <Provider dashboardStore={dashboardStore}>
            {loading
                ? <Loading />
                : (
                        <Container className={'dashboard-container'}>
                            <SideBar
                                className={'dashboard-left'}
                                width={'28rem'}
                            >
                                <FilterBoard />
                                <MasterBoard />
                            </SideBar>

                            <BorderPanel flex={1}>
                                <div className="counter-position">
                                    <CountdownTimer
                                        number={dashboardStore.interval}
                                        interval={dashboardStore.refreshInterval}
                                        onComplete={() => getDashboardData()}
                                    />
                                </div>

                                <DetailBoard />
                            </BorderPanel>
                        </Container>
                    )
            }
        </Provider>
    );
};

Dashboard.propTypes = {
    appStore: PropTypes.any,
};

export default inject('appStore')(observer(Dashboard));

import './Dashboard.scss';
import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import * as _ from 'lodash';
import moment from 'moment';
import { useLocation, useHistory, Switch } from 'react-router-dom';

import { Container } from '@vbd/vui';
import { SideBar } from '@vbd/vui';
import { useI18n } from '@vbd/vui';
import { useModal } from '@vbd/vui';

import SideBoard from 'extends/ffms/pages/Dashboard/SideBoard/SideBoard';
import DetailBoard from 'extends/ffms/pages/Dashboard/DetailBoard/DetailBoard';
import { convertCustomTime, getCurrentMainTab, convertToFilter, convertToQueryInfo, convertOptions, transformLanguage } from 'extends/ffms/services/DashboardService/util';
import * as Routers from 'extends/ffms/routes';


import TabBar from '../base/TabBar/TabBar';
import Loading from '../base/Loading';
import CountdownTimer from '../base/CountdownTimer/CountdownTimer';

import { TAB } from 'extends/ffms/services/DashboardService/constants';
import DashboardService from 'extends/ffms/services/DashboardService';
import { usePermission } from 'extends/ffms/components/Role/Permission/usePermission';
import { isEmpty } from 'helper/data.helper';

const Dashboard = ({ fieldForceStore }) =>
{
    const i18n = useI18n();
    const { language } = i18n;

    const dashboardService = new DashboardService(fieldForceStore.appStore?.contexts);

    const [loading, setLoading] = useState(true);
    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const dataStorePrev = useRef();

    const perContext = usePermission();
    const location = useLocation();
    const history = useHistory();
    const { toast } = useModal();

    const getCurrentTab = () => (getCurrentMainTab(toJS(dashboardStore.tabs)));

    async function setLayerDashboard(config, isLoading, isInterval = false)
    {
        // Define Variable
        const tab = getCurrentTab();

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
            dashboardStore.setApiOutput([]);
            _.set(filter, 'period', convertCustomTime(filter.period));
        }
        // Call API
        const apiOutput = await dashboardService.getMasterAnalytics(filter, queryInfo, toJS(dashboardStore));
        const periodTo = _.get(dashboardStore.filter, 'period.to');

        // Handle data to Display
        if (tab.code !== TAB.EMPLOYEE)
        {
            dashboardStore.setApiOutput(apiOutput);
            layers = _.cloneDeep(_.map(apiOutput, item => item?.masterChart));
        }
        else
        {
            layers = dashboardService.filterEmployeeByMode(_.cloneDeep(apiOutput));
        }

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
          
            tabs = permissionHandle(tabs);

            // Load Tabs
            await dashboardStore.setTabs(tabs);

            // Load current Config by tab selected
            await getCurrentConfig();
        }
        
        getTabs().then(()=>
        {
            if (location.pathname === Routers.DASHBOARD)
            {
                const tab = getCurrentTab();
                tab && history.push(tab.link);
            }
        });
    }, [location.pathname]);


    useEffect(() =>
    {
        const dataStore = {
            config: toJS(dashboardStore.config),
            groupByMode: toJS(dashboardStore.groupByMode),
            masterIndex: toJS(dashboardStore.masterIndex),
            periodCompares: toJS(dashboardStore.periodCompares),
        };
        if (!isEmpty(dataStore?.config) && JSON.stringify(dataStore) != JSON.stringify(dataStorePrev.current))
        {
            const tab = getCurrentTab();
            // Check case EMPLOYEE and group by change, master chart change not call API
            if (tab.code == TAB.EMPLOYEE && JSON.stringify(dataStore.config) == JSON.stringify(dataStorePrev.current?.config))
            {
                return;
            }
            else
            {
                setLayerDashboard(dataStore?.config);
                dataStorePrev.current = dataStore;
            }
        }
    }, [dashboardStore.config, dashboardStore.groupByMode, dashboardStore.masterIndex, dashboardStore.periodCompares]);

    // filter tabs and authen router
    const permissionHandle = (tabs) =>
    {
        tabs = tabs.filter(tab =>
        {
            const feature = tab.link.split('/').pop();
            const isAcess = perContext.hasPermissionNode(perContext.pathPermission, feature);
            return isAcess;
        });

        // show toast when 1 pathnamen isn't dashboard path (allow when init
        // and pathname isn't includes tabs links
        if (location.pathname !== Routers.DASHBOARD && tabs.every(tab=>tab.link !== location.pathname))
        {
            const path = location.pathname + location.search + location.hash;
            toast({ message: i18n.t('Bạn chưa được phân quyền để truy cập url %0%', [path]), type: 'error' });
            history.push(Routers.DASHBOARD);
        }

        return tabs;
    };


    const getCurrentConfig = async () =>
    {
        const tab = getCurrentTab() || null;
        if (!tab)
        {
            return;
        }

        let data = toJS(dashboardStore.configStore[tab.layerName]) ?? await dashboardService.getDashboardConfig(tab.code);
        data = transformLanguage(data, language);

        _.forEach(data?.filters, item =>
        {
            if (item?.type == 'time-filter')
            {
                item.values = convertCustomTime(item?.data, item?.values ?? item?.default);
            }
            else if (item?.default)
            {
                item.values = item.multi ? [item.default] : item.default;
            }

            if (item?.content)
            {
                item.data = convertOptions(item.data, true);
            }
        });
        
        await dashboardStore.setDashboardConfig({ ...data }, tab, true);
    };

    const setFilter = async () =>
    {
        getCurrentConfig();
    };

    const onChange = () =>
    {
        setLoading(true);
        setFilter();
    };

    const renderContent = () =>
    {

        return (
            <>
                <div className='counter-position'>
                    <CountdownTimer
                        number={dashboardStore.interval}
                        onComplete={() => getDashboardData()}
                        interval={dashboardStore.refreshInterval}
                    />
                </div>
                <Container className={'dashboard-container'}>
                    <SideBar
                        className={'dashboard-left'}
                        width={'30%'}
                    >
                        <SideBoard />
                    </SideBar>
                    <SideBar width={'70%'}>
                        <DetailBoard />
                    </SideBar>
                </Container>
            </>
        );
    };

    return (
        <SideBar width={'100%'}>
            {loading ? <Loading /> :
                <>
                    <Container>
                        <TabBar
                            title=''
                            defaultIndex={getCurrentMainTab(dashboardStore.tabs)?.id}
                            tabs={dashboardStore.tabs}
                            onChange={onChange}
                            className='tab-bar'
                            disabled={loading}
                        />
                    </Container>

                    <Switch>
                        {
                            dashboardStore.tabs.map(tab=>renderContent())
                        }
                    </Switch>
                </>
            }
        </SideBar>
    );
};


export default inject('fieldForceStore')(observer(Dashboard));

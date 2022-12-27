import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import { useI18n } from '@vbd/vui';
import { Container } from '@vbd/vui';

import { GROUP_BY_MODE } from 'extends/ffms/services/DashboardService/constants.js';
import { TAB } from 'extends/ffms/services/DashboardService/constants';
import TabBar from 'extends/ffms/pages/base/TabBar';
import { getCurrentMainTab, getDetailCharts } from 'extends/ffms/services/DashboardService/util';

const GroupByTabBar = ({ fieldForceStore }) =>
{
    const [tabs, setTabs] = useState([]);
    const { t } = useI18n();

    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const tab = (getCurrentMainTab(toJS(dashboardStore.tabs)));

    useEffect(() =>
    {
        const pickTabs = [];
        if (tab.code === TAB.EMPLOYEE)
        {
            const keys = Object.keys(GROUP_BY_MODE);
            _.map(keys, (key) =>
            {
                const item = GROUP_BY_MODE[key];
                if (item.key !== 'TypeOfJobs') // && item.key !== 'HourOfDay')
                {
                    pickTabs.push({
                        id: _.toUpper(item.key),
                        title: t(item.name),
                        code: 'groupby',
                        value: item.key.toLowerCase(),
                        isParam: true,
                    });
                }

            });
        }
        else
        {
            if (_.isEmpty(dashboardStore.detailCharts))
            {
                return;
            }
            const items = getDetailCharts(dashboardStore?.config, dashboardStore?.masterIndex);
            _.map(items, (item) =>
            {
                pickTabs.push({
                    id: _.toUpper(item.key),
                    title: item?.label,
                    code: 'groupby',
                    value: item.key.toLowerCase(),
                    isParam: true,
                });
            });
        }
        setTabs(pickTabs);
        dashboardStore.setPickTabs(pickTabs);
    }, [dashboardStore.detailCharts]);


    const onChange = (id) =>
    {
        dashboardStore.setGroupMode(id);
    };
    return (
        <Container>
            <TabBar
                title={'Nhóm theo'}
                defaultIndex={dashboardStore.groupByMode}
                tabs={tabs}
                onChange={onChange}
                className={'group-by'}
            />
        </Container>
    );

};


export default inject('fieldForceStore')(observer(GroupByTabBar));

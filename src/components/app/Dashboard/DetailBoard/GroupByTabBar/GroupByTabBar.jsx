import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';

import { Container } from '@vbd/vui';

import { TabBar } from 'components/bases/TabBar';

const GroupByTabBar = ({ dashboardStore }) =>
{
    const [tabs, setTabs] = useState([]);

    useEffect(() =>
    {
        if (_.isEmpty(dashboardStore.detailCharts))
        {
            return;
        }

        const pickTabs = dashboardStore?.config?.detailCharts?.map((item) => (
            {
                id: _.toUpper(item.key),
                title: item?.label,
                code: 'groupby',
                value: item.key.toLowerCase(),
                isParam: true,
            }
        ));

        setTabs(pickTabs);
        dashboardStore.setPickTabs(pickTabs);
    }, [dashboardStore.detailCharts]);

    const onChange = (id) =>
    {
        dashboardStore.setGroupMode(id);
    };

    return (
        <Container className={'group-by'}>
            <TabBar
                title={'Nhóm theo'}
                defaultIndex={dashboardStore.groupByMode}
                tabs={tabs}
                onChange={onChange}
            />
        </Container>
    );
};

export default inject('dashboardStore')(observer(GroupByTabBar));

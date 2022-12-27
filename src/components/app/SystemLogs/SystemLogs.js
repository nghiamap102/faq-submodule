import './SystemLogs.scss';

import { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';

import {
    DataGrid,
    FlexPanel, PanelBody,
    Tab, Tabs,
} from '@vbd/vui';

const logColumns = [
    { id: 'createdAt', displayAsText: 'Ngày tạo', width: 200 },
    { id: 'pid', displayAsText: 'PID', width: 90 },
    { id: 'log', displayAsText: 'Nội dung' },
];

let SystemLogs = (props) =>
{
    const [loading, setLoading] = useState(false);

    const { systemLogsStore } = props.appStore;
    const { pageSize, pageIndex, setPageSize, setPageIndex, logs, totalItem } = systemLogsStore;

    const handleSelectedTab = async (tabSelected) =>
    {
        setLoading(true);
        await systemLogsStore.setTab(tabSelected);
        setLoading(false);
    };

    const generateDataGrid = () =>
    {
        return (
            <FlexPanel>
                <DataGrid
                    rowKey={'id'}
                    columns={logColumns}
                    items={logs}
                    border={'none'}
                    pagination={{
                        pageIndex: pageIndex,
                        pageSize: pageSize,
                        pageSizeOptions: [50, 100, 150],
                        onChangePage: setPageIndex,
                        onChangeItemsPerPage: setPageSize,
                    }}
                    total={totalItem}
                    loading={loading}
                />
            </FlexPanel>
        );
    };


    useEffect(() =>
    {
        systemLogsStore.setTab(systemLogsStore.tabSelected);
    }, []);

    return (
        <FlexPanel flex={1}>
            <PanelBody>
                <Tabs
                    selected={systemLogsStore.tabSelected}
                    onSelect={handleSelectedTab}
                >
                    <Tab
                        id="system-logs-info"
                        // route="info"
                        title="Info"
                    >
                        {generateDataGrid()}
                    </Tab>
                    <Tab
                        id="system-logs-warn"
                        // route="warn"
                        title="Warn"
                    >
                        {generateDataGrid()}
                    </Tab>
                    <Tab
                        id="system-logs-error"
                        // route="error"
                        title="Error"
                    >
                        {generateDataGrid()}
                    </Tab>
                    <Tab
                        id="system-logs-crash"
                        // route="crash"
                        title="Crash"
                    >
                        {generateDataGrid()}
                    </Tab>
                </Tabs>
            </PanelBody>
        </FlexPanel>
    );
};

SystemLogs = inject('appStore')(observer(SystemLogs));
export default SystemLogs;

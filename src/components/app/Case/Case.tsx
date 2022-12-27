import React, { useState } from 'react';

import {
    Column,
    PanelHeader, PanelBody,
    Tab, Tabs,
} from '@vbd/vui';

import Dashboard from '../Dashboard';
import { CasePanel } from './CasePanel';

const CASE_TAB = {
    MANAGER: 'manager',
    REPORT: 'report',
};

const Case: React.FC = () =>
{
    const [activeTab, setActiveTab] = useState(CASE_TAB.MANAGER);

    return (
        <Column>
            <PanelHeader>
                Quản lý vụ việc
            </PanelHeader>

            <PanelBody>
                <Tabs
                    selected={activeTab}
                    onSelect={(tabSelected: any) => setActiveTab(tabSelected)}
                >
                    <Tab
                        route={CASE_TAB.MANAGER}
                        title="Vụ việc"
                    >
                        <CasePanel />
                    </Tab>
                    <Tab
                        route={CASE_TAB.REPORT}
                        title="Thống kê báo cáo"
                        renderOnActive
                    >
                        <Dashboard />
                    </Tab>
                </Tabs>
            </PanelBody>
        </Column>
    );
};

export default Case;

import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';

import { FormGroup, SwitchButton, Slider } from '@vbd/vui';

const Setting = ({ dashboardStore }) =>
{
    const [interval, setInterval] = useState(dashboardStore.refreshInterval);

    const onShowModeChange = (mode) =>
    {
        dashboardStore.setShowMode(mode);
    };

    const onRefreshIntervalChange = (mode) =>
    {
        dashboardStore.setRefreshInterval(mode);
        setInterval(mode);
    };

    const onIntervalChange = (value) =>
    {
        dashboardStore.setInterval(value);
    };

    return (
        <div>
            <FormGroup>
                <SwitchButton
                    title="Hiển thị cột rỗng"
                    checked={dashboardStore.showMode}
                    onChange={(mode) => onShowModeChange(mode)}
                />

                <SwitchButton
                    title="Làm mới cài đặt theo thời gian"
                    checked={dashboardStore.refreshInterval}
                    onChange={(mode) => onRefreshIntervalChange(mode)}
                />

                {interval && (
                    <Slider
                        value={dashboardStore.interval}
                        min={1}
                        max={10}
                        step={1}
                        onChange={(value) => onIntervalChange(value)}
                    />
                )}
            </FormGroup>
        </div>
    );
};

export default inject('dashboardStore')(observer(Setting));

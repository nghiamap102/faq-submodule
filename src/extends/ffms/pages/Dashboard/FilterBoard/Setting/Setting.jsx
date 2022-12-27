import React, { useState } from 'react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { FormGroup } from '@vbd/vui';
import SwitchButton from '../../../base/SwitchButton';
import Slider from '../../../base/Slider';


const Setting = ({ fieldForceStore }) =>
{
    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const [interval, setInterval] = useState(dashboardStore.refreshInterval);

    const onShowModeChange = (mode)=>
    {
        dashboardStore.setShowMode(mode);
    };
    const onDisplayLegendChange = (mode)=>
    {
        dashboardStore.setDisplayLegend(mode);
    };
    const onRefreshIntervalChange = (mode)=>
    {
        dashboardStore.setRefreshInterval(mode);
        setInterval(mode);
    };
    const onIntervalChange = (value)=>
    {
        dashboardStore.setInterval(value);
    };
    return (
        <div >
            <FormGroup>
                <SwitchButton
                    title='Hiển thị cột rỗng'
                    onChange={(mode)=>onShowModeChange(mode)}
                    checked={dashboardStore.showMode}
                />
                {/* <SwitchButton
                    title='Display legend'
                    onChange={(mode)=>onDisplayLegendChange(mode)}
                    checked={dashboardStore.displayLegend}
                /> */}
                
                <SwitchButton
                    title='Làm mới cài đặt theo thời gian'
                    onChange={(mode)=>onRefreshIntervalChange(mode)}
                    checked={dashboardStore.refreshInterval}
                />
                {interval && <Slider
                    onChange={(value)=>onIntervalChange(value)}
                    value={dashboardStore.interval}
                    min={1}
                    max={10}
                    step={1}
                />}
            </FormGroup>
        </div>
    );
};
Setting.propTypes = {
    fieldForceStore: PropTypes.any
};

export default inject('fieldForceStore')(observer(Setting));

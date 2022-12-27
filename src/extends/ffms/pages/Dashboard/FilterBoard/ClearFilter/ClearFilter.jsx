import './ClearFilter.scss';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { convertCustomTime, getCurrentMainTab } from 'extends/ffms/services/DashboardService/util';
import { toJS } from 'mobx';

const ClearFilter = ({ fieldForceStore, children }) =>
{
    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const currentConfig = toJS(dashboardStore.config);
    const currentTab = getCurrentMainTab(dashboardStore.tabs);
    const clearFilterAction = async () =>
    {
        _.forEach(currentConfig?.filters,item =>
        {
            if (item?.type == 'time-filter')
            {
                item.values = convertCustomTime(item?.data, item?.default);
            }
            else
            {
                _.unset(item,'values');
                _.unset(item,'selected');
            }
            
        });
        dashboardStore.setDashboardConfig(_.cloneDeep(currentConfig),currentTab);
    };

    const checkTags = () =>
    {
        let flag = false;
        currentConfig?.filters && currentConfig.filters.forEach(item=>
        {
            if (item?.type == 'time-filter')
            {
                item?.values.type != item?.default && (flag = true);
            }
            else if ((_.isArray(item?.values) && _.size(item?.values) > 0) || item.values)
            {
                flag = true;
            }
        });
        return flag;
    };
    return (
        checkTags() &&
       <div className='clear-filter'>
           {
               children({ onClick: clearFilterAction })
           }
       </div>
    );
};

ClearFilter.propTypes = {
    fieldForceStore: PropTypes.any,
    children: PropTypes.any
};

export default inject('fieldForceStore')(observer(ClearFilter));

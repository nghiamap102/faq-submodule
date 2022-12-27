import React, { useState } from 'react';
import _ from 'lodash';
import { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';

import { TB1, FormGroup, Button, useI18n } from '@vbd/vui';

import SelectFilter from 'extends/ffms/pages/base/SelectFilter';
import { convertCustomTime, getCurrentMainTab, rebuildOptionData } from 'extends/ffms/services/DashboardService/util';
import DashboardService from 'extends/ffms/services/DashboardService';
import ClearFilter from 'extends/ffms/pages/Dashboard/FilterBoard/ClearFilter';

const Filter = ({ fieldForceStore }) =>
{
    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const [currentConfig, setCurrentConfig] = useState();
    const filterStore = toJS(dashboardStore.filter);
    const tab = getCurrentMainTab(toJS(dashboardStore.tabs));
    const i18n = useI18n();
    const dashboardService = new DashboardService(fieldForceStore.appStore?.contexts);

    useEffect(() =>
    {
        const timer = setTimeout(() =>
        {
            setCurrentConfig(toJS(dashboardStore.config));
        }, 0);
        return () => clearTimeout(timer);
    }, [dashboardStore.config]);

    // Handle data before binding Component

    const handleFilter = (item, value, custom, selected, searchKey) =>
    {
        const dataItem = _.find(currentConfig?.filters, row => row?.key == item?.key);
        let flag = false;
        if (item?.type == 'time-filter')
        {
            if ((custom?.from && custom?.to && value == 'Custom') || (value != 'Custom'))
            {
                _.set(dataItem, 'values', convertCustomTime(item?.data, { type: value, ...custom }));
                flag = true;
            }
        }
        else
        {
            _.set(dataItem, 'searchKey', searchKey);
            if (value)
            {
                _.set(dataItem, 'values', value);
                _.set(dataItem, 'selected', selected);
            }
            else
            {
                _.unset(dataItem, 'values');
                _.unset(dataItem, 'selected');
                _.unset(dataItem, 'default');
            }
            flag = true;
        }
        if (flag)
        {
            const newConfig = rebuildOptionData(item?.key, dataItem?.values, currentConfig, dataItem?.selected);
            dashboardStore.setDashboardConfig(newConfig, tab);
        }
    };

    return (
        <div
            className="filter-board"
        // onBlur={()=>setDirty(true)}
        >
            <div className='reset-bar'>
                <TB1>Loại bộ lọc</TB1>
                <ClearFilter>
                    {
                        ({ onClick }) => (
                            <Button
                                color={'primary-color'}
                                icon='eraser'
                                text='Đặt lại'
                                onClick={onClick}
                            />
                        )}
                </ClearFilter>
            </div>

            <FormGroup>
                {
                    currentConfig?.filters && currentConfig.filters.map((item, index) =>
                    {
                        const data = _.find(filterStore, fs => fs?.key == item?.key);
                        const defaultValue = data?.values ?? item?.values ?? item?.default;
                        const customDefault = defaultValue?.type == 'Custom'
                            ? {
                                    from: defaultValue?.from,
                                    to: defaultValue?.to,
                                }
                            : null;
                        const label = item?.label;
                        return (
                            <SelectFilter
                                key={index}
                                name={label}
                                label={label}
                                selectedOptions={item?.selected}
                                options={item?.options ?? item.data}
                                placeholder={item?.placeholder}
                                defaultValue={(item.type == 'time-filter') ? defaultValue?.type : defaultValue}
                                multi={item.multi}
                                customDefault={customDefault}
                                hasSearch={item?.hasSearch}
                                searchMode={item?.model ? 'remote' : undefined}
                                remote={
                                    {
                                        service: dashboardService.getDataByModel,
                                        model: item?.model ?? 'employees',
                                        params: { skip: 0, take: 50 },
                                        item: item,
                                    }
                                }
                                type={item?.controlType}
                                clearable={(item.type != 'time-filter')}
                                onChange={({ value, custom, selected, searchKey }) => handleFilter(item, value, custom, selected, searchKey)}
                            />
                        );
                    })
                }


            </FormGroup>

        </div>
    );
};
Filter.propTypes = {
    fieldForceStore: PropTypes.any,
};
export default inject('fieldForceStore')(observer(Filter));

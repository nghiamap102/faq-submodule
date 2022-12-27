import React, { useState } from 'react';
import _ from 'lodash';
import { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';

import { FormGroup, Button, useI18n } from '@vbd/vui';

import SelectFilter from 'extends/ffms/pages/base/SelectFilter';
import {
    convertCustomTime,
    getCurrentMainTab,
    rebuildOptionData,
} from 'extends/ffms/services/DashboardService/util';

import ClearFilter from '../ClearFilter';

import dashboardService from 'services/DashboardService/DashboardService';

const Filter = ({ dashboardStore }) =>
{
    const { t } = useI18n();

    // const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const [currentConfig, setCurrentConfig] = useState();
    const filterStore = toJS(dashboardStore.filter);
    const tab = getCurrentMainTab(toJS(dashboardStore.tabs));

    // hard code
    const [provincePath, setProvincePath] = useState();
    const [districtPath, setDistrictPath] = useState();

    const getAdminData = async (path = '/root/vdms/tangthu/data/administrative') =>
    {
        const query = {
            path: path,
            isInTree: false,
            layers: ['ADMINISTRATIVE'],
            returnFields: ['Id', 'Path', 'AdministrativeID', 'Title'],
        };

        const rs = await dashboardService.getMapReportData(query);
        if (rs && rs.length)
        {
            return rs.map(r =>
            {
                return {
                    id: r.AdministrativeID,
                    label: r.Title,
                    path: r.Path,
                };
            });
        }

        return [];
    };

    useEffect(() =>
    {
        if (districtPath)
        {
            getAdminData(districtPath).then(data =>
            {
                if (currentConfig && currentConfig.filters)
                {
                    for (let i = 0; i < currentConfig.filters.length; i++)
                    {
                        if (currentConfig.filters[i].key === 'xa')
                        {
                            currentConfig.filters[i].data = data;
                        }
                    }
                    setCurrentConfig(toJS({ ...currentConfig }));
                }
            });
        }
    }, [districtPath]);

    useEffect(() =>
    {
        if (provincePath)
        {
            getAdminData(provincePath).then(data =>
            {
                if (currentConfig && currentConfig.filters)
                {
                    for (let i = 0; i < currentConfig.filters.length; i++)
                    {
                        if (currentConfig.filters[i].key === 'huyen')
                        {
                            currentConfig.filters[i].data = data;
                        }
                    }
                    setCurrentConfig(toJS({ ...currentConfig }));
                }
            });
        }
    }, [provincePath]);

    useEffect(() =>
    {
        const timer = setTimeout(() =>
        {
            if (!dashboardStore.config.filters.find(c => c.key === 'tinh'))
            {
                getAdminData().then(data =>
                {
                    if (dashboardStore.config && dashboardStore.config.filters)
                    {
                        setCurrentConfig(toJS({
                            ...dashboardStore.config, filters: [...dashboardStore.config.filters, {
                                combine: 'AND',
                                data: data,
                                field: 'TINH',
                                isInternal: true,
                                key: 'tinh',
                                label: 'Tỉnh',
                                layer: 'CHITIETVUVIEC',
                                multi: false,
                                placeholder: 'Tất cả tỉnh/ thành phố',
                                type: 'list-filter',
                            },
                            {
                                combine: 'AND',
                                data: [],
                                field: 'HUYEN',
                                isInternal: true,
                                key: 'huyen',
                                label: 'Quận/ huyện',
                                layer: 'CHITIETVUVIEC',
                                multi: false,
                                placeholder: 'Tất cả quận/ huyện',
                                type: 'list-filter',
                            },
                            {
                                combine: 'AND',
                                data: [],
                                field: 'XA',
                                isInternal: true,
                                key: 'xa',
                                label: 'Xã/ phường',
                                layer: 'CHITIETVUVIEC',
                                multi: false,
                                placeholder: 'Tất cả xã/ phường',
                                type: 'list-filter',
                            },
                            ],
                        }));
                    }
                });
            }
            else
            {
                setCurrentConfig(toJS(dashboardStore.config));
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [dashboardStore.config]);

    // Handle data before binding Component

    const handleFilter = (item, selected, custom) =>
    {
        const dataItem = _.find(currentConfig?.filters, row => row?.key == item?.key);
        if (item.key === 'tinh' || item.key === 'huyen')
        {
            const record = item.data.find(d => d.id === selected);
            switch (item.key)
            {
                case 'tinh':
                    setProvincePath(record.path);
                    break;
                case 'huyen':
                    setDistrictPath(record.path);
                    break;
            }
        }

        let flag = false;
        if (item?.type === 'time-filter')
        {
            if ((custom?.from && custom?.to && selected === 'Custom') || (selected !== 'Custom'))
            {
                _.set(dataItem, 'values', convertCustomTime(item?.data, { type: selected, ...custom }));
                flag = true;
            }
        }
        else
        {
            if (selected)
            {
                _.set(dataItem, 'values', selected);
            }
            else
            {
                _.unset(dataItem, 'values');
            }
            flag = true;
        }

        if (flag)
        {
            const newConfig = rebuildOptionData(item?.key, dataItem?.values, currentConfig);
            dashboardStore.setDashboardConfig(newConfig, tab);
        }
    };

    return (
        <div className="filter-board">
            <div className="reset-bar">
                <span>{_.upperCase(t('Loại bộ lọc'))}</span>
                <ClearFilter>{
                    ({ onClick }) => (
                        <Button
                            color={'primary'}
                            icon="eraser"
                            text="Đặt lại"
                            onClick={onClick}
                        />
                    )}
                </ClearFilter>
            </div>

            <FormGroup>
                {
                    currentConfig?.filters && currentConfig.filters.map((item, index) =>
                    {
                        const data = _.find(filterStore, fs => fs?.key === item?.key);
                        const defaultValue = data?.values ?? item?.values ?? item?.default;
                        const customDefault = defaultValue?.type === 'Custom'
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
                                options={item?.options ?? item.data}
                                placeholder={item?.placeholder}
                                defaultValue={(item.type == 'time-filter') ? defaultValue?.type : defaultValue}
                                multi={item.multi}
                                customDefault={customDefault}
                                hasSearch={item?.hasSearch}
                                onChange={({ value, custom }) => handleFilter(item, value, custom)}
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

export default inject('dashboardStore')(observer(Filter));

import 'extends/ffms/pages/Report/Report.scss';
import './ReportToolbar.scss';

import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useHistory } from 'react-router-dom';

import { useModal } from '@vbd/vui';

import Export from './Export';
import Duplicate from './Duplicate';
import Rename from './Rename';
import Delete from './Delete';
import reportService from 'extends/ffms/services/ReportService';
import RangeDatetimeFilter from './RangeDatetimeFilter';
import { useQueryPara } from 'extends/ffms/pages/hooks/useQueryPara';
import * as ROUTES from 'extends/ffms/routes';
import { usePermission } from 'extends/ffms/components/Role/Permission/usePermission';


const ReportToolbar = (props) =>
{
    const reportStore = _.get(props.fieldForceStore, 'reportStore');
    const reportCurrent = _.get(reportStore, 'originalTemplate');

    const [data, setData] = useState(reportCurrent);

    const param = useQueryPara();
    const history = useHistory();
    const { toast } = useModal();
    const { hasPermissionNode, pathPermission } = usePermission();

    useEffect(() =>
    {
        if (!_.isEmpty(reportCurrent))
        {
            setData(toJS(reportCurrent));
        }

    }, [reportCurrent]);

    useEffect(() =>
    {
        if (!_.isEmpty(reportStore.originalTemplate))
        {
            const currentTemplate = _.cloneDeep(reportStore.originalTemplate);
            if (!_.isEmpty(reportStore.templateContent))
            {
                _.set(currentTemplate, 'Content', JSON.stringify(reportStore.templateContent));
            }
            setData(toJS(currentTemplate));
        }

    }, [reportStore.originalTemplate, reportStore.templateContent]);

    const handleComplete = (obj, type) =>
    {
        toast({ type: 'success', message: 'Cập nhật thành công' });

        getReportList(obj, type);
    };

    const defaultDateChange = (date) =>
    {
        const dateDefaultFilter = _.cloneDeep(reportStore.defaultDateFilter);
        console.log('defaultDateChange', dateDefaultFilter);
        _.set(dateDefaultFilter, 'value.label', date);
        console.log('defaultDateChange', dateDefaultFilter);
        reportStore.setDefaultDateFilter(dateDefaultFilter);
    };

    async function getReportList(obj, type)
    {
        if (reportStore.mainTab == 1)
        {
            reportStore.setMainTab(2);
            param.set('id', obj.Id);
            history.push(`${ROUTES.REPORT}/customize?${param.toString()}`);
        }
        else
        {
            const filter = {
                type: reportStore.mainTab == 1 ? 'system' : 'user',
                pageIndex: reportStore.pageIndex,
                pageSize: reportStore.pageSize,
                textSearch: reportStore.textSearch,
                layerName: reportStore.layerReport.layer,
            };

            const reportList = await reportService.gets(filter);
            reportStore.setReportList(reportList.data.data);
            reportStore.setTotal(reportList.data.total);

            if (type != 'ADD')
            {
                const item = type == 'DELETE' ? _.get(reportList.data.data, 0) : obj;
                reportStore.setOriginalTemplate(item);
                param.set('id', item.Id);
                history.push(`${history.location.pathname}?${param.toString()}`);
            }
            else
            {
                reportStore.setPageIndex(1);
                reportStore.setReportIndex(0);
            }
        }
    }
    // Check
    const isUser = _.get(reportStore, 'mainTab') !== 1;

    return (
        <div
            className='report-toolbar'
        >
            <div className='report-toolbar-content'>
                <div className='report-group-toolbar'>
                    <Export
                        {...props}
                        disabled={!hasPermissionNode(pathPermission, 'export')}
                    />

                    <Duplicate
                        {...props}
                        data={data}
                        onCompleted={handleComplete}
                        disabled={!hasPermissionNode(pathPermission, 'create')}

                    />
                    {isUser &&
                        <>
                            <Rename
                                {...props}
                                data={data}
                                disabled={!hasPermissionNode(pathPermission, 'rename')}
                                onCompleted={handleComplete}
                            />
                            <Delete
                                {...props}
                                data={data}
                                disabled={!hasPermissionNode(pathPermission, 'delete')}
                                onCompleted={handleComplete}
                            />
                        </>
                    }

                 
                </div>
                <div className='report-group-toolbar'>
                    {/* <Save /> */}
                    <RangeDatetimeFilter
                        onUpdated={defaultDateChange}
                        {...props}
                    />
                </div>
            </div>
        </div>

    );
};

ReportToolbar.propTypes = {
    fieldForceStore: PropTypes.any,
    appStore: PropTypes.any,
};

export default inject('fieldForceStore', 'appStore')(observer(ReportToolbar));

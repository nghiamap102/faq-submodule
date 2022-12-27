import './Report.scss';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { useLocation, useHistory } from 'react-router-dom';
import * as _ from 'lodash';

import { Container } from '@vbd/vui';
import { SideBar } from '@vbd/vui';
import LeftSideBoard from 'extends/ffms/pages/Report/LeftSideBoard';
import { TAB } from 'extends/ffms/services/ReportService/constants';
import reportService from 'extends/ffms/services/ReportService';
import * as ROUTES from 'extends/ffms/routes';

import Loading from '../base/Loading/Loading';
import TabBar from '../base/TabBar/TabBar';
import ReportContent from './ReportContent/ReportContent';
import { LAYER_DATA_TYPE } from 'extends/ffms/services/ReportService/constants';
import { toJS } from 'mobx';
import { usePermission } from 'extends/ffms/components/Role/Permission/usePermission';
import { useModal } from '@vbd/vui';
import { useI18n } from '@vbd/vui';
import { CommonHelper } from 'helper/common.helper';
import { RoleRoute } from 'extends/ffms/components/Role/RoleRoute';
import { RouterParamsHelper } from 'helper/router.helper';

const baseRoute = ROUTES.REPORT;
const defaultTabs = [
    {
        id: TAB.SYSTEM,
        title: 'System',
        link: `${baseRoute}/system`,
    }, {
        id: TAB.CUSTOMIZE,
        title: 'User',
        link: `${baseRoute}/user`,
    },
];

const Report = ({ fieldForceStore }) =>
{
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const history = useHistory();
    const permContext = usePermission();
    const { toast } = useModal();
    const { t } = useI18n();

    const reportStore = _.get(fieldForceStore, 'reportStore');
    const [previousTab, setPreviousTab] = useState(reportStore.mainTab);
    const [layerReport, setLayerReport] = useState(toJS(reportStore.layerReport));
    const [rootPathData, setRootPathData] = useState();
    const [tabs, setTabs] = useState([]);
    

    let dateFilter = {
        text: '',
        layer: 'JOB',
        key: '',
        propertyId: '',
        name: 'DefaultSort',
        type: 5,
        dataType: LAYER_DATA_TYPE.TIMESTAMP,
        combine: '',
        function: '',
        value: null,
    };

    // load config
    async function getReportConfigs()
    {
        const result = await reportService.getReportConfigs();
        reportStore.setConfigList(result.data);
    }

    async function getConfigTemplate()
    {
        if (reportStore.layerReport)
        {
            const name = reportStore.layerReport.reportName;
            const configTemplate = await reportService.getReportConfigTemplate(name);
            const defaultDateTimePropName = _.get(configTemplate, 'dateTimeColumn', 'CreatedDate');
            if (!_.isEmpty(defaultDateTimePropName))
            {
                dateFilter = { ...dateFilter, ColumnName: defaultDateTimePropName, key: defaultDateTimePropName, propertyId: defaultDateTimePropName };
            }

            reportStore.setDefaultDateFilter(dateFilter);
            reportStore.setConfigTemplate(configTemplate);
            getReportList();
        }
    }


    useEffect(() =>
    {
        let tabsFilter = tabs;
        if (permContext.pathPermission.Path === RouterParamsHelper.getRouteFeature(ROUTES.REPORT, ROUTES.baseUrl))
        {
            tabsFilter = permissionHandle(defaultTabs);
        }

        setTabs(tabsFilter);
        activeTab(tabsFilter);
        getReportConfigs();

    }, [location.pathname]);

    useEffect(() =>
    {
        if (layerReport?.layer != reportStore.layerReport?.layer)
        {
            getConfigTemplate();
            setLayerReport(toJS(reportStore.layerReport));
        }
        else
        {
            reportStore.setLoading(false);
        }
    }, [reportStore.layerReport]);

    // filter tabs and authen router
    const permissionHandle = (tabs) =>
    {
        const { pathPermission } = permContext;
        const pathPermObj = CommonHelper.toDictionary(pathPermission.Children || [],'Path');
        
        if (pathPermObj)
        {
            tabs = tabs.filter(tab =>
            {
                let isAcess = false;
                const permPath = RouterParamsHelper.getRouteFeature(tab.link, ROUTES.baseUrl);
                if (permPath && pathPermObj[permPath])
                {
                    isAcess = pathPermObj[permPath].CanView;
                }
                return isAcess;
            });
        }

        // show toast when 1 pathnamen isn't dashboard path (allow when init
        // and pathname isn't includes tabs links
        if (!pathPermObj || (location.pathname !== ROUTES.REPORT && tabs.every(tab=>tab.link !== location.pathname)))
        {
            const path = location.pathname + location.search + location.hash;
            toast({ message: t('Bạn chưa được phân quyền để truy cập url %0%', [path]), type: 'error' });
            history.push(ROUTES.REPORT);
        }

        return tabs;
    };


    const onChange = (id) =>
    {
        setPreviousTab(_.clone(reportStore.mainTab));
        reportStore.setMainTab(id);
        reportStore.setPageIndex(1);
    };

    const activeTab = (tabs) =>
    {
        // if not math location pathname set init index tabs 0
        let match = _.find(tabs, item => item.link === location.pathname);
      
        if (!match && tabs.length > 0)
        {
            history.push(tabs[0].link);
            match = tabs[0];
        }

        if (match)
        {
            setPreviousTab(_.clone(match.id));
            reportStore.setMainTab(match.id);
        }
    };


    async function getReportList()
    {
        setLoading(true);
        if (reportStore.layerReport)
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
            // if (reportStore.originalTemplate == null)
            // {
            //     reportStore.setReportIndex(0);
            // }
        }
        reportStore.setLoading(false);
        setPreviousTab(reportStore.mainTab);
        setLoading(false);
    }

    useEffect(() =>
    {
        getReportList();
    }, [
        reportStore.pageIndex,
        reportStore.textSearch,
        reportStore.mainTab,
    ]);

    const renderContent = () =>
    {
        return (
            <Container className={'report-container'}>
                <SideBar
                    className={'report-left'}
                    width={'20%'}
                >
                    <LeftSideBoard
                        loading={loading}
                        total={reportStore.total}
                        layerReport={reportStore.layerReport}
                    />
                </SideBar>
                <SideBar width={'80%'}>
                    <ReportContent />
                </SideBar>
            </Container>
        );
    };

    return (
        <SideBar width={'100%'}>
            {(previousTab != reportStore.mainTab) ? <Loading /> :
                <>
                    <Container>
                        <TabBar
                            title=''
                            defaultIndex={reportStore.mainTab}
                            tabs={tabs}
                            onChange={onChange}
                            className='tab-bar'
                            disabled={loading}
                        />
                    </Container>

                    {
                        tabs.filter(tab => tab.id === reportStore.mainTab)
                            .map(tab =>(
                                <RoleRoute key={tab.id} path={tab.link} >
                                    {renderContent()}
                                </RoleRoute>
                            ))
                    }
                </>
            }
        </SideBar>

    );

};


export default inject('fieldForceStore')(observer(Report));

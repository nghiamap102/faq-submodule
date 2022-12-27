import './ReportContent.scss';
import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import ReportToolbar from './ReportToolbar';
import ReportHeader from './ReportHeader';
import ReportTitle from './ReportTitle';
import ReportViewer from './ReportViewer';
import { set, toJS } from 'mobx';
import { convertFilterToParameter, convertGroupByToFields } from 'extends/ffms/services/ReportService/parseToModel';
import { LAYER_DATA_TYPE, MongoOperator } from 'extends/ffms/services/ReportService/constants';

import ReportService from 'extends/ffms/services/ReportService';
import { getStages } from 'extends/ffms/services/ReportService/util';
import { T } from '@vbd/vui';

const ReportContent = ({ fieldForceStore }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const [currentFilters, setCurrentFilters] = useState();
    const [currentFields, setCurrentFields] = useState(1);
    const [currentSorters, setCurrentSorters] = useState(1);

    const [currentStages, setCurrentStages] = useState(toJS(_.get(reportStore, 'reportStages.stages')));
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const [currentId, setCurrentId] = useState(_.get(reportStore, 'originalTemplate.Id'));

    const paging = reportStore.pagingData;
    async function getReportData()
    {
        const reportData = paging.pageIndex > 1 ? _.get(reportStore, 'reportData',{}) : null;
        if (_.isEmpty(_.get(reportStore, 'reportStages.stages')) ||
        _.isEmpty(_.get(reportStore, 'layerReport.layer')) ||
        !paging.hasMore)
        {
            return;
        }
        paging.pageIndex == 1 && reportStore.setLoading(true);
        const response = await ReportService.getReportDataWithPaging({
            stages: reportStore.reportStages.stages,
            layerName: reportStore.layerReport.layer,
            pageIndex: paging.pageIndex,
            pageSize: paging.pageSize,
        });
        reportStore.setReportData({ ...response, data: _.concat(reportData?.data ?? [],response.data ?? []) });
        paging.pageIndex == 1 && reportStore.setLoading(false);
    }

    async function getReportTotalData()
    {
        if (_.isEmpty(_.get(reportStore, 'reportStages.stages')) ||
        _.isEmpty(_.get(reportStore, 'layerReport.layer')))
        {
            return;
        }
        
        const totalResult = await ReportService.getReportData(
            reportStore.reportStages.totalStages,
            reportStore.layerReport.layer,
        );
        if (totalResult.result > -1 && _.size(totalResult.data) > 0)
        {
            reportStore.setReportTotal(totalResult.data[0]);
        }
    }

    const getStageTemplate = () =>
    {
        const fields = toJS(_.filter(_.get(reportStore, 'fieldFilter.fields')));
        const filters = toJS(_.get(reportStore, 'fieldFilter.reportFilters'));
        const groupBy = toJS(_.get(reportStore, 'reportTemplate.groupBy'));
        const sorters = reportStore.sorters !== null ? reportStore.sorters : [];
        
        _.map(groupBy, item =>
        {
            const existSort = _.find(reportStore.sorters, sort=> sort.id === item.key);
            if (!existSort)
            {
                sorters.push({
                    direction: 'asc',
                    id: item.key,
                });
            }
        });

        if (reportStore.loading)
        {
            return;
        }

        if (_.isEqual(currentFields, fields) && _.isEqual(currentFilters, filters) && _.isEqual(currentSorters, sorters))
        {
            return;
        }

        setCurrentFields(_.cloneDeep(fields));
        setCurrentFilters(_.cloneDeep(filters));
        setCurrentSorters(_.cloneDeep(sorters));

        const totalStages = getStages(toJS(fields), toJS(filters), toJS(sorters), true);
        const templateStages = getStages(toJS(fields), toJS(reportStore.filtersTemplate), toJS(sorters));

        // const defaultSorter = { id: _.get(reportStore, 'defaultDateFilter.propertyId') };
        // if (!_.isEmpty(defaultSorter.id))
        // {
        //     sorters.push(defaultSorter);
        // }
        const stages = getStages(fields, filters, toJS(sorters));
        

        const reportStages = {
            stages,
            templateStages,
            totalStages,
        };
        reportStore.setReportStages(reportStages);

        reportStore.setPagingData({ ...paging, pageIndex: 1, time: (new Date().getTime()) });
    };

    useEffect(() =>
    {
        getStageTemplate();
    }, [reportStore.fieldFilter]);
    useEffect(() =>
    {
        getStageTemplate();
    }, [reportStore.sorters]);

    useEffect(() =>
    {
        const templateStages = toJS(_.get(reportStages, 'templateStages'));
        const template = _.get(reportStore, 'originalTemplate');
        const reportStages = toJS(_.get(reportStore, 'reportStages'));
        const stages = _.get(reportStages, 'stages');

        if (_.isEmpty(template) || _.isEmpty(stages) ||
            (_.isEqual(currentStages, stages) &&
                _.isEqual(currentPageIndex, paging.pageIndex) && currentId === template.Id)
        )
        {
            return;
        }
        setCurrentId(template.Id);
        setCurrentStages(_.cloneDeep(stages));
        setCurrentPageIndex(_.cloneDeep(paging.pageIndex));
        if (!_.isEqual(currentStages, stages) && reportStore.fieldFilter.fields.length >= 2)
        {
            getReportTotalData();
            const templateContent = JSON.parse(_.get(template, 'Content'));
            const title = _.get(template, 'Title');

            const source = templateContent.source;
            _.set(source, 'stages', toJS(templateStages));
            _.set(source, 'title', toJS(title));
            _.set(source, 'fields', toJS(reportStore.fieldFilter.fields));
            _.set(source, 'filters', toJS(reportStore.filtersTemplate));
            _.set(templateContent, 'source', source);
            reportStore.setTemplateContent(templateContent);
        }
        if (reportStore.fieldFilter.fields.length < 2)
        {
            reportStore.setReportData(null);
        }
        else
        {
            getReportData();
        }
    }, [reportStore.pagingData]);//

    const convertFilterToFilterTemplate = (reportFilter) =>
    {
        if (!_.isEmpty(reportFilter))
        {
            const filters = [];
            _.map(reportFilter, filter =>
            {
                const fil = convertFilterToParameter(filter);
                const value = filter.value.label;
                if (filter.dataType === LAYER_DATA_TYPE.TIMESTAMP &&
                    typeof value === 'object')
                {
                    filters.push(convertFilterToParameter({
                        ...filter,
                        condition: MongoOperator.gte,
                        value: {
                            label: value.from,
                        },
                    }));
                    filters.push(convertFilterToParameter({
                        ...filter,
                        condition: MongoOperator.lte,
                        value: {
                            label: value.to,
                        },
                    }));
                }
                else if (filter.dataType === LAYER_DATA_TYPE.LIST)
                {
                    filters.push(convertFilterToParameter({
                        ...filter,
                        propertyId: filter.propertyId + '_id',
                        condition: MongoOperator.in,
                        value: {
                            label: _.map(filter.value, 'id'),
                        },
                    }));
                }
                else
                {
                    filters.push(fil);
                }
            });
            return filters;
        }
    };

    useEffect(() =>
    {
        const groupBys = toJS(_.get(reportStore, 'reportTemplate.groupBy'));
        const calculation = toJS(_.get(reportStore, 'reportTemplate.calculation'));

        let reportFields = [];

        // if (!_.isEmpty(groupBys))
        {
            const fields = _.map(groupBys, groupBy =>
            {
                return convertGroupByToFields(groupBy);
            });
            reportFields = _.cloneDeep(fields);
        }
        // if (!_.isEmpty(calculation))
        {
            const fields = _.map(calculation, cal =>
            {
                return convertGroupByToFields(cal, true);
            });
            reportFields = _.concat(reportFields, fields);
        }

        let filtered = [];
        let reportFilter = _.get(reportStore, 'reportTemplate.reportFilter');
        // if (!_.isEmpty(reportFilter))
        {
            reportFilter = toJS(reportFilter);
            filtered = _.cloneDeep(reportFilter);
            const filtersTemplate = convertFilterToFilterTemplate(reportFilter);
            reportStore.setReportFiltersTemplate(filtersTemplate);
        }
        const defaultDateFilter = toJS(_.get(reportStore, 'defaultDateFilter'));
        const dateTime = _.get(defaultDateFilter, 'value.label');
        if (!_.isEmpty(dateTime) && !_.isEmpty(filtered))
        {
            filtered.push(defaultDateFilter);
        }
        const filters = convertFilterToFilterTemplate(filtered);
        reportStore.setFieldFilter({ fields: reportFields, reportFilters: filters });

    }, [reportStore.reportTemplate, reportStore.defaultDateFilter]);

    return (
        (!reportStore.originalTemplate) ? <div className='report-empty-content'><T>No content</T></div> :
            <>
                <ReportTitle />
                <ReportToolbar />
                <div className='report-wrapper'>
                    <ReportHeader />
                    <ReportViewer />
                </div>
            </>
    );
};

export default inject('fieldForceStore')(observer(ReportContent));

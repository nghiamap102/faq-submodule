import 'extends/ffms/pages/Report/Report.scss';
import './ReportHeader.scss';

import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import ReportFilter from './ReportFilter';
import ReportGroupBy from './ReportGroupBy';
import ReportCalculator from './ReportCalculator';
import { categoriesItemCheck } from 'extends/ffms/services/ReportService/util';
import { convertFieldToConfig, convertFilterToConfig, convertDateUtc } from 'extends/ffms/services/ReportService/parseToModel';
import { toJS } from 'mobx';
import { LAYER_DATA_TYPE } from 'extends/ffms/services/ReportService/constants';
import FilterTags from 'extends/ffms/pages/base/FilterTags';

const ReportHeader = ({ fieldForceStore }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const [filterTags, setFilterTags] = useState();

    const dateFilter = {
        text: 'Create Date',
        layer: 'JOB',
        key: 'CreatedDate',
        propertyId: 'CreatedDate',
        name: 'CreatedDate',
        type: 5,
        dataType: LAYER_DATA_TYPE.TIMESTAMP,
        combine: '$and',
        function: '$gt',
        value: null,
    };

    async function getReportByGuid()
    {
        let template = _.get(reportStore, 'originalTemplate');
        if (!template)
        {
            template = toJS(reportStore.reportList[0]);
        }
        const reportTemplate = {};
        if (template != undefined)
        {
            const content = template.Content;
            const dataObj = JSON.parse(content);

            const layerName = _.get(dataObj, 'source.layer');

            // get template Filter
            const filterData = _.get(dataObj, 'source.filters');
            const filters = _.groupBy(filterData, filter => filter.ColumnName);
            const contentFilter = _.map(filters, config =>
            {
                return convertFilterToConfig(config, layerName);
            });
            // reportStore.setReportFilter(contentFilter);
            _.set(reportTemplate, 'reportFilter', contentFilter);

            const fields = _.get(dataObj, 'source.fields');
            // get template GroupBy
            const groupBy = _.filter(fields, field => field.Function === 'GROUPBY' || field.Function === undefined);
            const contentGroupBy = _.map(groupBy, config =>
            {
                return convertFieldToConfig(config, layerName);
            });
            // reportStore.setGroupBy(contentGroupBy);
            _.set(reportTemplate, 'groupBy', contentGroupBy);


            // get template Calculator
            const calculation = toJS(_.filter(fields, field => field.Function && field.Function !== 'GROUPBY'));
            const contentCalculation = _.map(calculation, config =>
            {
                return convertFieldToConfig(config, layerName);
            });
            // reportStore.setCalculation(contentCalculation);
            _.set(reportTemplate, 'calculation', contentCalculation);
            reportStore.setReportTemplate(reportTemplate);
        }
    }

    useEffect(() =>
    {
        if (!_.isEmpty(reportStore.originalTemplate))
        {
            getReportByGuid();
        }
    }, [reportStore.originalTemplate]);

    useEffect(() =>
    {
        const reportFilter = _.get(reportStore, 'reportTemplate.reportFilter');

        const tags = _.map(reportFilter, filter =>
        {
            let value = filter.value.label;
            if (filter.dataType === LAYER_DATA_TYPE.TIMESTAMP)
            {
                value = `${convertDateUtc(value.from).format('DD/MM/YYYY')} - ${convertDateUtc(value.to).format('DD/MM/YYYY')}`;
            }
            if (filter.dataType === LAYER_DATA_TYPE.LIST)
            {
                value = _.join(_.map(filter.value, 'label'), ', ');
            }
            return {
                ...filter,
                key: filter.key,
                label: `${filter.text}: ${value}`,
            };
        });
        setFilterTags(_.cloneDeep(tags));

    }, [reportStore.reportTemplate]);

    const updateFilterValue = (filter) =>
    {
        const curReportFilter = _.get(reportStore, 'reportTemplate.reportFilter');
        if (_.isEmpty(curReportFilter))
        {
            return;
        }
        const reportFilter = categoriesItemCheck(curReportFilter, filter);
        _.set(reportStore, 'reportTemplate.reportFilter', reportFilter);
        reportStore.setReportTemplate(reportStore.reportTemplate);
    };

    return (
        <div className='row-bar report-header'>
            <div className='bar-between'>
                <div className='report-child-bar'>
                    <div className='report-header-item'>
                        <ReportFilter />
                    </div>
                    <div className='report-header-item'>
                        <ReportGroupBy />
                    </div>
                </div>
                <div >
                    <div className='report-header-item'>
                        <ReportCalculator />
                    </div>
                </div>
            </div>
            <div>
                <FilterTags
                    data={toJS(filterTags)}
                    onChange={updateFilterValue}
                />
            </div>

        </div>
    );
};

ReportHeader.propTypes = {
    fieldForceStore: PropTypes.any,
};

export default inject('fieldForceStore')(observer(ReportHeader));

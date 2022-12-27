import 'extends/ffms/pages/Report/Report.scss';
import './ReportFilter.scss';

import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Button, T, FAIcon, FormControlLabel, FormGroup } from '@vbd/vui';

import { addOrUpdateItemValue } from 'extends/ffms/services/ReportService/util';
import SelectionCard from 'extends/ffms/pages/base/SelectionCard/SelectionCard';
import PopupWrapper from 'extends/ffms/pages/base/Popup';
import FilterType from 'extends/ffms/pages/Report/ReportContent/ReportHeader/ReportFilter/FilterType';

const ReportFilter = ({ fieldForceStore, props }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const [filterTree, setFilterTree] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Choose filter options...');
    const [filterData, setFilterData] = useState(_.clone(reportStore.filterConfig));
    const [currentFilter, setCurrentFilter] = useState();

    useEffect(() =>
    {
        setFilterData(reportStore.filterConfig);
    }, [reportStore.filterConfig]);
    const filterCategoriesClick = () =>
    {
        setFilterTree(filterTree => !filterTree);
    };
    const handleClick = () =>
    {
        if (currentFilter)
        {
            const currentItem = _.find(reportStore.reportTemplate.reportFilter, filter => filter.id === currentFilter.id);
            setCurrentFilter(currentItem);
            setFilterTree(!currentItem);
        }
    };

    const updateFilterValue = (filter) =>
    {
        const reportTemplate = reportStore.reportTemplate;
        const reportFilter = addOrUpdateItemValue(reportTemplate.reportFilter, filter);
        setCurrentFilter(filter);
        reportStore.setReportTemplate({ ...reportTemplate, reportFilter });
    };

    const onClick = (item) =>
    {
        setSelectedCategory(item.name);
        setFilterTree(false);
        const currentItem = _.find(reportStore.reportTemplate.reportFilter, filter => filter.id === item.id);
        setCurrentFilter(_.isEmpty(currentItem) ? item : currentItem);
    };
    return (
        <PopupWrapper
            trigger={<Button label='Filter' />}
            modal={false}
            onClick={handleClick}
            width='18rem'
        >

            <FormGroup>
                <div className='report-item-title'>
                    <T>By</T>
                </div>

                <FormControlLabel
                    control={
                        <button
                            className='bar-between filter-button'
                            onClick={filterCategoriesClick}
                        >
                            <span><T>{selectedCategory}</T></span>
                            <FAIcon
                                icon='sort'
                                size={'1rem'}
                                type={'light'}
                            />

                        </button>}
                />

                {filterTree && _.map(filterData, (item) =>
                    <SelectionCard
                        hasBorder
                        title={item.title}
                        data={item.items}
                        key={item.key}
                        {...item}
                        onClick={onClick}
                    />,
                )}
                {!filterTree && currentFilter &&
                    <FilterType
                        updateFilterValue={updateFilterValue}
                        currentFilter={currentFilter}
                    />}

            </FormGroup>
        </PopupWrapper>

    );
};

ReportFilter.propTypes = {
    fieldForceStore: PropTypes.any,
    props: PropTypes.any,
};

export default inject('fieldForceStore')(observer(ReportFilter));


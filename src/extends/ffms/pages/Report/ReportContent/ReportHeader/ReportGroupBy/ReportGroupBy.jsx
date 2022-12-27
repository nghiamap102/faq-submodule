import './ReportGroupBy.scss';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Button } from '@vbd/vui';
import { buildCategoriesTree, categoriesItemCheck } from 'extends/ffms/services/ReportService/util';
import PopupWrapper from 'extends/ffms/pages/base/Popup';
import SelectionCard from 'extends/ffms/pages/base/SelectionCard';
import { toJS } from 'mobx';

const ReportGroupBy = ({ fieldForceStore }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const hasCheckbox = true;
    const [groupByData, setGroupByData] = useState(_.clone(reportStore.groupByConfig));

    const handleClick = () =>
    {
        const groupBy = toJS(_.get(reportStore, 'reportTemplate.groupBy'));
        const result = buildCategoriesTree(reportStore.groupByConfig, groupBy);
        setGroupByData(result);
    };
    useEffect(() =>
    {
        handleClick();
    }, [reportStore.reportTemplate]);

    const onClick = (item) =>
    {
        const groupBy = categoriesItemCheck(_.get(reportStore, 'reportTemplate.groupBy'), item);
        const reportTemplate = reportStore.reportTemplate;
        reportStore.setReportTemplate({ ...reportTemplate, groupBy });
    };


    return (
        <PopupWrapper
            trigger={<Button label='Group By' />}
            modal={false}
            onClick={handleClick}
            width='18rem'
        >
            <div className='report-group-by'>
                {
                    _.map(groupByData, (item) => (
                        <SelectionCard
                            title={item.title}
                            data={item.items}
                            key={item.key}
                            hasCheckbox={hasCheckbox}
                            onClick={onClick}
                        />
                    ))
                }
            </div>
        </PopupWrapper>

    );
};

ReportGroupBy.propTypes = {
    fieldForceStore: PropTypes.any
};

export default inject('fieldForceStore')(observer(ReportGroupBy));

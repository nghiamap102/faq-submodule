import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';

import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { useQueryPara } from 'extends/ffms/pages/hooks/useQueryPara';
import { useHistory } from 'react-router-dom';
import ReportCard from '../ReportCard';
import ReportService from 'extends/ffms/services/ReportService';
import { toJS } from 'mobx';

const ReportList = ({ fieldForceStore }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const [activeItem, setActiveItem] = useState(reportStore.originalTemplate);

    const history = useHistory();
    const param = useQueryPara();

    useEffect(() =>
    {
        if (reportStore.systemReport || reportStore.customizeReport)
        {
            switch (reportStore.mainTab)
            {
                case 1:
                    reportStore.originalTemplate = toJS(reportStore.systemReport);
                    break;
                case 2:
                    reportStore.originalTemplate = toJS(reportStore.customizeReport);
                    break;
                default:
                    reportStore.originalTemplate = null;
            }
            if (reportStore.originalTemplate)
            {
                param.set('id', reportStore.originalTemplate.Id);
            }
            else
            {
                param.delete('id');
            }
            history.push(`${history.location.pathname}?${param.toString()}`);
            if (reportStore.originalTemplate)
            {
                onCardClick(reportStore.originalTemplate.Id);
            }
        }
    }, [reportStore.mainTab]);

    const onCardClick = async (cardId) =>
    {
        if (!_.isEqual(_.get(activeItem,'Id'), cardId))
        {
            const item = await ReportService.get(cardId);
            reportStore.saveReportIndex(reportStore.mainTab === 1 ? 'systemReport' : 'customizeReport', item);
            reportStore.setOriginalTemplate(item, true);
            param.set('id', item.Id);
            history.push(`${history.location.pathname}?${param.toString()}`);
        }

    };
    
    useEffect(() =>
    {
        const item = reportStore.reportList[reportStore.reportIndex];
        if (!_.isEmpty(item))
        {
            reportStore.setOriginalTemplate(item, true);
        }
        
    }, [reportStore.reportIndex]);

    useEffect(() =>
    {
        if (reportStore.originalTemplate)
        {
            setActiveItem(toJS(reportStore.originalTemplate));
        }
    }, [reportStore.originalTemplate]);

    return (
        <>
            {
                _.map(reportStore.reportList, (item, index) =>
                {
                    return (
                        <ReportCard
                            key={index}
                            active={_.get(activeItem, 'Id') === item.Id ? 'active' : ''}
                            data={item}
                            onClick={() => onCardClick(item.Id)}
                        />
                    );
                },
                )
            }
        </>
    );
};

ReportList.propTypes = {
    fieldForceStore: PropTypes.any,
};

export default inject('fieldForceStore')(observer(ReportList));

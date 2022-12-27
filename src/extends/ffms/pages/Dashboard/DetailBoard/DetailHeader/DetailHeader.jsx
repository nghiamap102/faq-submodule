import './DetailHeader.scss';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { toJS } from 'mobx';
import _ from 'lodash';

import { useI18n } from '@vbd/vui';

import DetailTag from 'extends/ffms/pages/Dashboard/FilterBoard/SearchTagBar/DetailTags';
import Comparison from 'extends/ffms/pages/Dashboard/DetailBoard/Comparison';

const DetailHeader = ({ fieldForceStore }) =>
{
    const { t } = useI18n();

    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const groupMode = toJS(dashboardStore.groupByMode);
    const [lastUpdate, setLastUpdate] = useState({});

    useEffect(() =>
    {
        const periodTo = _.get(dashboardStore.filter, 'period.to');
        if (periodTo)
        {
            setLastUpdate(moment.isMoment(periodTo) ? periodTo : moment(periodTo));
        }
    }, [dashboardStore.layers]);

    return (
        <>
            <div className='detail-header'>
                <div className='title'>{t(dashboardStore.layers[dashboardStore.masterIndex] && dashboardStore.layers[dashboardStore.masterIndex].detail.title)}</div>
                <DetailTag />
                {
                    groupMode === 'PERIOD' ?
                        <Comparison /> :
                        <div>{t('Ngày cập nhật mới nhất') + ' '}{lastUpdate && moment(lastUpdate).format('LLL')}</div>
                }

            </div>
        </>
    );
};
DetailHeader.propTypes = {
    fieldForceStore: PropTypes.any,
};

export default inject('fieldForceStore')(observer(DetailHeader));

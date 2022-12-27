import './DetailHeader.scss';

import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import _ from 'lodash';

import { T } from '@vbd/vui';

import DetailTag from '../../FilterBoard/SearchTagBar/DetailTags';

const DetailHeader = ({ dashboardStore }) =>
{
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
            <div className="detail-header">
                <div className="title">{dashboardStore.layers[dashboardStore.masterIndex]?.detail?.title}</div>
                <DetailTag />
                <div><T>Ngày cập nhật mới nhất</T> {lastUpdate && moment(lastUpdate).format('LLL')}</div>
            </div>
        </>
    );
};

export default inject('dashboardStore')(observer(DetailHeader));

import 'extends/ffms/pages/Report/Report.scss';

import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

import { useModal } from '@vbd/vui';

import Save from 'extends/ffms/pages/Report/ReportContent/ReportToolbar/Save';

const ReportTitle = ({ fieldForceStore, appStore }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const isUser = _.get(reportStore, 'mainTab') !== 1;
    const [title, setTitle] = useState('');

    const { toast } = useModal();

    useEffect(() =>
    {
        const report = toJS(reportStore.originalTemplate);
        report && setTitle(report.Title);
    }, [reportStore.originalTemplate]);

    const handleComplete = () =>
    {
        toast({ type: 'success', message: 'Cập nhật thành công' });
    };
    return (
        <div className='report-title'>
            <div>
                <span className='title' title={title}>{title}</span>
            </div>
            {
                isUser &&
                <Save
                    data={reportStore.originalTemplate}
                    onCompleted={handleComplete}
                />
            }
        </div>
    );
};

ReportTitle.propTypes = {
    fieldForceStore: PropTypes.any,
    appStore: PropTypes.any,
};

export default inject('fieldForceStore', 'appStore')(observer(ReportTitle));

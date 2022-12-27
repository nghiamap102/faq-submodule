import './ReportFooter.scss';
import React from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { ScrollView } from '@vbd/vui/types';

const ReportFooter = ({ fieldForceStore }) =>
{
    // const reportStore = _.get(fieldForceStore, 'reportStore');
    return (
        <ScrollView
            className='report-footer'
            options={{ suppressScrollY: true }}
        >
            <div className='report-footer-item'>Total</div>
            <div className='report-footer-item'>0</div>
            <div className='report-footer-item'>0</div>
            <div className='report-footer-item'>0</div>
            <div className='report-footer-item'>0</div>
            <div className='report-footer-item'>0</div>
            <div className='report-footer-item'>0</div>
            {/* {
            _.map(data, item =>
                <div className='report-viewer-row'>
                    {
                        _.map(columns, col =>
                            <div
                                className='item'
                                style={{ width: _.get(col, 'width', '200px') }}
                                title={_.get(item, col.column, '')}
                            >{_.get(item, col.column, '')}</div>
                        )
                    }
                </div>
            )
            } */}
        </ScrollView>
    );
};

export default inject('fieldForceStore')(observer(ReportFooter));

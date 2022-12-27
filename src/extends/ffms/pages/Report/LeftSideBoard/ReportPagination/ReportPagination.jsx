import 'extends/ffms/pages/Report/Report.scss';
import './ReportPagination.scss';

import React from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Paging, PanelFooter } from '@vbd/vui';
import { useQueryPara } from 'extends/ffms/pages/hooks/useQueryPara';

const ReportPagination = ({ fieldForceStore }) =>
{
    const history = useHistory();
    const param = useQueryPara();

    const reportStore = _.get(fieldForceStore, 'reportStore');
    const totalItem = reportStore.total;
    const pageIndex = reportStore.pageIndex;
    const pageSize = reportStore.pageSize;

    const changePage = (pageIndex) =>
    {
        reportStore.setPageIndex(pageIndex);
        param.set('page', pageIndex ?? '1');
        history.push(`${history.location.pathname}?${param.toString()}`);
    };

    return (
        totalItem >= 1 ?
            <>
                <PanelFooter>
                    <Paging
                        total={totalItem}
                        currentPage={pageIndex}
                        pageSize={pageSize}
                        onChange={changePage}
                    />
                </PanelFooter>
            </> : ''
    );
};

ReportPagination.propTypes = {
    fieldForceStore: PropTypes.any,
};

export default inject('fieldForceStore')(observer(ReportPagination));

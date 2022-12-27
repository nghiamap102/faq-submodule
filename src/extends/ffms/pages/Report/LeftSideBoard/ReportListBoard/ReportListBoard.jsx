import 'extends/ffms/pages/Report/Report.scss';
import './ReportListBoard.scss';
import React, { useEffect, useState, useRef } from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { Container } from '@vbd/vui';
import { SearchBox }from '@vbd/vui';
import ReportList from '../ReportList';
import ReportPagination from '../ReportPagination';

import Loading from 'extends/ffms/pages/base/Loading';
import useDebounce from 'extends/ffms/pages/hooks/useDebounce';
import { useQueryPara } from 'extends/ffms/pages/hooks/useQueryPara';

const ReportListBoard = ({ fieldForceStore, loading }) =>
{
    const [dirty, setDirty] = useState(false);
    const [searchTerm, setSearchTerm] = useState(null);
    const reportStore = _.get(fieldForceStore, 'reportStore');

    const debouncedSearchTerm = useDebounce(searchTerm, 700);
    const history = useHistory();
    const param = useQueryPara();

    useEffect(() =>
    {
        if (!_.isNull(debouncedSearchTerm) && !reportStore.loading)
        {
            reportStore.setTextSearch(searchTerm);

            param.set('s', searchTerm ?? '');
            if (dirty)
            {
                reportStore.setPageIndex(1);
                param.set('page', 1);
            }
            if (!searchTerm)
            {
                param.delete('s');
            }

            history.push(`${history.location.pathname}?${param.toString()}`);
        }
    }, [debouncedSearchTerm]);

    useEffect(() =>
    {
        setSearchTerm(param.get('s'));
    }, []);


    return (
        <Container className="report-list-board">
            <SearchBox
                className={'search-box-control searchbox'}
                placeholder={'Nhập tên báo cáo cần tìm'}
                value={searchTerm}
                onChange={value =>
                {
                    setSearchTerm(value);
                    setDirty(true);
                }}
            />
            { loading ? <Loading /> : <ReportList />}
            <Container className={'bottom-bar'}>
                <ReportPagination />
            </Container>

        </Container>
    );
};

ReportListBoard.propTypes = {
    fieldForceStore: PropTypes.any,
    loading: PropTypes.bool,
};

export default inject('fieldForceStore')(observer(ReportListBoard));

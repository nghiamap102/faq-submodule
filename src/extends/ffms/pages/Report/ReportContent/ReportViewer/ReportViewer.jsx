/* eslint-disable react/no-multi-comp */
import './ReportViewer.scss';
import React, { useEffect, useState, useRef } from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

import { DataGrid } from '@vbd/vui';

import { getDataTypeFormat } from 'extends/ffms/services/ReportService/util';
import Loading from 'extends/ffms/pages/base/Loading';

const ReportViewer = ({ fieldForceStore }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const [columns, setColumns] = useState();
    const [data, setData] = useState();
    const [paging, setPaging] = useState(toJS(reportStore.pagingData));
    const [sorters, setSorters] = useState(toJS(reportStore.sorters));

    const refDiv = useRef(null);

    useEffect(() =>
    {
        setPaging(toJS(_.cloneDeep(reportStore.pagingData)));
    }, [reportStore.pagingData]);

    useEffect(() =>
    {
        const reportData = _.get(reportStore, 'reportData');
        const width = 200;
        if (!_.isEmpty(reportData))
        {
            const columns = toJS(_.filter(reportStore.fieldFilter.fields, item => item.DisplayName !== 'DefaultSort'));

            const rect = refDiv.current.getBoundingClientRect();
            const lastColumnFullWidth = (columns.length * width) <= rect.width;
            const lastWidth = rect.width - ((columns.length - 1) * width) - 8;
            const exColumns = _.map(columns, (column, index) =>
            {
                
                const isFunction = column.Function !== 'GROUPBY';
                const displayName = `${column.DisplayName}${isFunction ? ` - ${column.Function}` : ''}`;
                return {
                    ...column,
                    DisplayName: displayName,
                    width: lastColumnFullWidth && index == (columns.length - 1) ? lastWidth : width,
                    isSortable: !isFunction,
                };
            });
            getColumns(exColumns, toJS(reportData));
        }
        else
        {
            setData([]);
            setColumns([]);
        }

    }, [reportStore.reportData, reportStore.pagingData, reportStore.reportTotal]);

    const getColumns = (_columns, { data }) =>
    {
        // Get binding columns
        const dataListType = toJS(reportStore.dataListType);
        const newColumns = _.map(_columns, col =>
        {
            const type = getDataTypeFormat(col, dataListType);
            return _.pickBy({
                hidden: false,
                id: `${col.ColumnName}${col.Function != 'GROUPBY' ? '_' + col.Function : '' }`,
                displayAsText: type?.displayName ?? col.DisplayName,
                width: col.width,
                isSortable: col.isSortable,
                options: type?.options,
                schema: type?.schema,
                format: type?.format,
                summary: {
                    formula: col.Function != 'GROUPBY' && col.ColumnName != 'index' ? ()=> toJS(reportStore.reportTotal[col.PropertyId]) : undefined,
                },
            }, _.identity);
        });
        setColumns(newColumns);
        setData(data);

    };

    const handlePageSize = (_pageSize) =>
    {
        const pagingData = { ...paging, pageSize: _pageSize };
        reportStore.setPagingData(pagingData);
        setPaging(pagingData);
    };

    const handlePageIndex = async (_pageIndex) =>
    {
        if (!reportStore.loading)
        {
            const pagingData = { ...paging, pageIndex: _pageIndex + 1, hasMore: _.size(data) < _.get(reportStore, 'reportData.total', 0) };
            reportStore.setPagingData(pagingData);
            setPaging(pagingData);
        }
    };

    const onColumnSort = (columns) =>
    {
        setSorters(columns);
        reportStore.setSorters(sorters);
    };

    return (
        
        <div
            ref={refDiv}
            className='report-viewer'
        >
            {reportStore.loading
                ? <Loading />
                : (
                        <DataGrid
                            columns={columns}
                            items={data ?? []}
                            rowKey={'Id'}
                            pagination={{
                                useInfiniteScroll: true,
                                pageIndex: paging?.pageIndex,
                                pageSize: paging?.pageSize,
                                pageSizeOptions: [20, 50, 100],
                                onChangePage: handlePageIndex,
                                onChangeItemsPerPage: handlePageSize,
                            }}
                            total={_.get(reportStore, 'reportData.total', 0)}
                            sorting={{
                                columns: sorters,
                                isSingleSort: true,
                                onSort: onColumnSort,
                            }}
                            summary={{ stick: true }}
                            isFixedHeader
                        />
                    )
            }
        </div>
    );
};

ReportViewer.propTypes = {
    fieldForceStore: PropTypes.any,
    data: PropTypes.array,
};

export default inject('fieldForceStore')(observer(ReportViewer));

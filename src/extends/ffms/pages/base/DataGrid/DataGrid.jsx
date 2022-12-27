import './DataGrid.scss';
import React, { useEffect, useState, useRef } from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';

import { T, ScrollView } from '@vbd/vui';

import { LAYER_DATA_TYPE } from 'extends/ffms/services/ReportService/constants';
import Loading from 'extends/ffms/pages/base/Loading';
import DataGridSort from './DataGridSort';

const DataGrid = ({ columns, data, className, loading }) =>
{
    const [_columns, setColumns] = useState();
    const [_data, setData] = useState();
    const [_loading, setLoading] = useState(loading);
    const [sortList, setSortList] = useState([]);

    const psRef = useRef(null);
    const psContentRef = useRef(null);
    const psFooterRef = useRef(null);

    useEffect(() =>
    {
        setColumns(columns ?? []);
        setData(data ?? []);
    }, [columns, data]);

    useEffect(() =>
    {
        setLoading(loading);
    }, [loading]);

    const handleSort = (e) =>
    {
        let newSortList = sortList;
        newSortList[e.column] = e.sort;
        newSortList = _.pickBy(sortList, _.identity);
        var dataSort = _.orderBy(data, _.keys(newSortList, 'column'), _.values(newSortList, 'sort'));
        setData(dataSort);
        setSortList(newSortList);
    };

    const getDataTypeFormat = (item, column, index) =>
    {
        let value = _.get(item, column.columnName);

        if (column.function && _.isArray(item) && column.function != 'GROUPBY')
        {
            value = _.sumBy(item, column.columnName);
        }

        switch (column.dataType)
        {
            case LAYER_DATA_TYPE.BOOLEAN:
                break;
            case LAYER_DATA_TYPE.INT:
                value = column.format
                    ? Number(value).toLocaleString(undefined, {
                        minimumFractionDigits: _.isNumber(column.format) ? column.format : 2,
                        maximumFractionDigits: _.isNumber(column.format) ? column.format : 2,
                    })
                    : value;
                break;
            case LAYER_DATA_TYPE.TEXT:
                break;
            case LAYER_DATA_TYPE.FLOAT8:
                value = column.format
                    ? Number(value).toLocaleString(undefined, {
                        minimumFractionDigits: _.isNumber(column.format) ? column.format : 2,
                        maximumFractionDigits: _.isNumber(column.format) ? column.format : 2,
                    })
                    : value;
                break;
            case LAYER_DATA_TYPE.TIMESTAMP:
                value = (value && column.format) ? moment.utc(value).format(column.format) : value;
                break;
            case LAYER_DATA_TYPE.LONG_TEXT:
                break;
            case LAYER_DATA_TYPE.UUID:
                break;
            case LAYER_DATA_TYPE.WORDS:
                break;
            case LAYER_DATA_TYPE.LIST:
                break;
            case 'index':
                break;
            default:
                break;
        }
        return value === 'NaN' ? '' : value;
    };

    return (
        <div className={`${className ?? ''}`}>
            <div className='report-data-grid-wrapper'>
                <div className='report-data-grid'>
                    <ScrollView
                        className='report-data-grid-header'
                        containerRef={el => (psRef.current = el)}
                        options={{ suppressScrollY: true }}
                    >
                        {
                            _.map(_columns, col => (
                                <div
                                    className='header-item'
                                    style={{ minWidth: _.get(col, 'width', '200px'), width: _.get(col, 'width', '200px'), textAlign: _.get(col, 'textAlignHeader') }}
                                >
                                    {
                                        !col.isSortable
                                            ? (
                                                    <div className='header-title'>
                                                        <T>{col.displayName}</T>
                                                    </div>
                                                )
                                            : (
                                                    <DataGridSort
                                                        sort={sortList[col.columnName] ?? col.sort}
                                                        column={col.columnName}
                                                        className='header-title'
                                                        onChange={(e) => handleSort(e)}
                                                    >
                                                        <T>{col.displayName}</T>
                                                    </DataGridSort>
                                                )
                                    }
                                </div>
                            ))
                        }
                    </ScrollView>

                    <ScrollView
                        className='report-data-grid-content'
                        containerRef={ref =>
                        {
                            if (ref)
                            {
                                ref._getBoundingClientRect = ref.getBoundingClientRect;

                                ref.getBoundingClientRect = () =>
                                {
                                    const original = ref._getBoundingClientRect();
                                    return { ...original, height: Math.round(original.height), width: Math.round(original.width) };
                                };
                            }
                            psContentRef.current = ref;
                        }}
                        onScrollX={(container) =>
                        {
                            psRef.current.scrollLeft = psFooterRef.current.scrollLeft = container.scrollLeft;
                        }}
                    >
                        {_loading
                            ? <Loading />
                            : _.map(_data, item => (
                                <div className='report-data-grid-row'>
                                    {
                                        _.map(_columns, col => (
                                            <div
                                                className='row-item'
                                                style={{ minWidth: _.get(col, 'width', '200px'), width: _.get(col, 'width', '200px'), textAlign: _.get(col, 'textAlign') }}
                                                title={getDataTypeFormat(item, col)}
                                            >
                                                {getDataTypeFormat(item, col)}
                                            </div>
                                        ),
                                        )
                                    }
                                </div>
                            ),
                            )
                        }
                    </ScrollView>

                </div>
            </div>
            <div className='report-data-grid-footer'>
                <ScrollView
                    className='report-data-grid-footer-content'
                    options={{ suppressScrollY: true }}
                    containerRef={el => (psFooterRef.current = el)}
                >
                    {
                        _.map(_columns, col => (
                            <div
                                className='report-data-grid-footer-item'
                                style={{ minWidth: _.get(col, 'width', '200px'), width: _.get(col, 'width', '200px'), textAlign: _.get(col, 'textAlign') }}
                            >
                                {getDataTypeFormat(data, col)}
                            </div>
                        ),
                        )
                    }
                </ScrollView>
            </div>
        </div>
    );
};

DataGrid.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    className: PropTypes.string,
    loading: PropTypes.bool,
    isSortable: PropTypes.bool,
};
DataGrid.defaultProps = {
    loading: false,
    isSortable: false,
};

export default DataGrid;

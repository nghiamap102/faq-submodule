import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { toDisplaySchemaProps } from 'helper/data.helper';
import { DataGrid } from '@vbd/vui';

export const LayerGrid = (props) =>
{
    const { properties, data, layerName } = props;

    const columns = useMemo(() => properties?.map((property) => ({
        id: property.ColumnName,
        displayAsText: property.DisplayName,
        ...toDisplaySchemaProps(property.DataType),
        width: 200,
        ...property,
    })), [props.properties]);

    return (
        <DataGrid
            columns={columns}
            items={data}
            rowKey={'Id'}
            pagination={{
                pageSize: props.pageSize,
                pageIndex: props.pageIndex,
                onChangePage: props.onChangePage,
                onChangeItemsPerPage: props.onChangeItemsPerPage,
                pageSizeOptions: [5, 10, 20, 50, 100],
            }}
            total={props.total}
            toolbarVisibility={{ showColumnSelector: true, showReloadButton: true }}
            // hideToolbar
            trailingControlColumns={props.actions && props.actions.length
                ? [
                        {
                            width: props.actionWidth || 100,
                            headerCellRender: 'Thao tác',
                            rowCellRender: props.actions,
                            freezeEnd: true,
                        },
                    ]
                : undefined}
            loading={props.isLoading}
            sorting={{
                columns: props.sortingColumns,
                isSingleSort: true,
                onSort: props.onSort,
            }}
            isFixedHeader
            rowNumber
            onReload={props.onRefresh}
            onCellDoubleClick={props.onCellDoubleClick}
        />
    );
};

LayerGrid.propTypes = {
    // Columns & Data & layerName
    properties: PropTypes.array, // [{ColumnName: '', DisplayName: '', DataType: 5,...}]
    data: PropTypes.array,
    layerName: PropTypes.string,

    // Paging
    total: PropTypes.number,
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangeItemsPerPage: PropTypes.func,

    // Loading
    isLoading: PropTypes.bool,
    onRefresh: PropTypes.func,

    // Sorting
    sortingColumns: PropTypes.array,
    onSort: PropTypes.func,

    // Actions
    actions: PropTypes.func,
    actionWidth: PropTypes.number,

    onCellDoubleClick: PropTypes.func,
};

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    PanelBody, Tag, EmptyData, Spacer, DataGrid,
    T, withI18n,
} from '@vbd/vui';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

import { DataUtils } from 'extends/ffms/services/Utils';

export class ImportDataGrid extends Component
{
    uploadStore = this.props.fieldForceStore.uploadStore;
    data = this.props.data;
    state = {
        sorters: [],
        page: 1,
        pageSize: 20,
    };

    async componentDidMount()
    {
        const { columns } = this.props;
        const columnSorters = columns.filter((col) => col?.isSortable).map((col) =>
        {
            return {
                id: col.id,
                direction: undefined,
            };
        });
        
        this.setState({
            sorters: columnSorters,
        });
    }
    
    static getDerivedStateFromProps(nextProps, prevState)
    {
        if (nextProps.pageSize !== prevState.pageSize)
        {
            return { pageSize: nextProps.pageSize };
        }

        if (nextProps.page !== prevState.page)
        {
            return { page: nextProps.page }; // return new state
        }
        return null; // don't change state
    }

    StatusRender = (row) =>
    {
        const { status, color } = this.uploadStore.getImportStatusColor(row.Status);

        return (
            row.Error
                ? (
                        <PopperTooltip
                            tooltip={Object.keys(row.Error).map((fieldName) => <span key={fieldName}>{row.Error[fieldName]}</span>)}
                            // placement={'top'}
                            trigger={['hover', 'click']}
                        >
                            <Tag
                                key={row.Status}
                                text={status}
                                color={color}
                            />
                        </PopperTooltip>
                    )
                : (
                        <Tag
                            key={row.Status}
                            text={status}
                            color={color}
                        />
                    )
        );
    };

    importStatusRenderer = (row) =>
    {
        let importStatus = row.ImportStatus;
        if (importStatus && typeof (importStatus) === 'string' && importStatus.startsWith('{') && importStatus.endsWith('}'))
        {
            importStatus = JSON.parse(importStatus);
            return Object.keys(importStatus).map((key,index)=>
            {
                return (
                    <div key={index}>
                        <p>
                            <Tag
                                text={this.props.t(key)}
                                color={'var(--default-color)'}
                                textStyle={{ color: 'var(--default-text-color)' }}
                            />
                            <Spacer />
                            <T>{importStatus[key]}</T>
                        </p>
                    </div>
                );
            });
        }
        return null;
    };

    onColumnSort = (columns) =>
    {
        if (columns && columns.length)
        {
            DataUtils.sortBy(this.props.data, columns[0]?.id, columns[0]?.direction);
            this.setState({
                sorters: columns,
            });
        }
    };

    setPageSize = async (pageSize) =>
    {
        this.props.onPagingChange && this.props.onPagingChange({ page: this.state.page, pageSize: pageSize });
    };

    setPageIndex = async(pageIndex) =>
    {
        this.props.onPagingChange && this.props.onPagingChange({ page: pageIndex, pageSize: this.state.pageSize });
    };

    render()
    {
        const { data, totalItems, columns } = this.props;
        return (
            <PanelBody
                flex={1}
                scroll
            >
                {
                    data && data.length
                        ? (
                                <DataGrid
                                    columns={columns}
                                    items={data}
                                    rowKey={'rowKey'}
                                    total={totalItems}
                                    leadingControlColumns={[{
                                        width: 120,
                                        headerCellRender: 'Trạng thái',
                                        rowCellRender: this.StatusRender,
                                    }, {
                                        width: 320,
                                        headerCellRender: 'Chi tiết',
                                        rowCellRender: this.importStatusRenderer,
                                    }]}
                                    sorting={{
                                        columns: this.state.sorters,
                                        isSingleSort: true,
                                        onSort: this.onColumnSort,
                                    }}
                                    pagination={{
                                        pageIndex: this.state.page,
                                        pageSize: this.state.pageSize,
                                        pageSizeOptions: [10, 20, 50, 100],
                                        onChangeItemsPerPage: this.setPageSize,
                                        onChangePage: this.setPageIndex,
                                    }}
                                    isFixedHeader
                                    rowNumber
                                />
                            )
                        : <EmptyData />
                }
            </PanelBody>
        );
    }
}

ImportDataGrid.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalItems: PropTypes.number,
};

ImportDataGrid = withI18n(inject('appStore', 'fieldForceStore')(observer(ImportDataGrid)));
export default ImportDataGrid;

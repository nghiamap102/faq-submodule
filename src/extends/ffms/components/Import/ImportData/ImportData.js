import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Column, EmptyData } from '@vbd/vui';

import ImportDataGrid from 'extends/ffms/components/Import/ImportData/ImportDataGrid/ImportDataGrid';
import ImportDataToolbar from 'extends/ffms/components/Import/ImportData/ImportDataToolbar/ImportDataToolbar';
export class ImportData extends Component
{
    uploadStore = this.props.fieldForceStore.uploadStore;
    render()
    {
        const { layerName, onFileContentFilterChange, columns } = this.props;
        const { currentFileContents } = this.uploadStore;
        const { currentPage, rows, pageSize } = currentFileContents;

        const skip = ((currentPage - 1) * pageSize);
        const take = skip + pageSize;
        const visibleItems = rows.filter((d) =>
        {
            return d.isVisible === undefined || d.isVisible === true;
        });
        return (
            <Column itemMargin={'md'}>
                <ImportDataToolbar
                    layerName={layerName}
                    onToolbarValueChange={onFileContentFilterChange}
                    paging={{
                        currentPage: currentPage,
                        totalItems: visibleItems.length,
                        pageSize: pageSize,
                    }}
                />
                {
                    currentFileContents.rows && currentFileContents.rows.length ?
                        <ImportDataGrid
                            data={visibleItems.slice(skip, take)}
                            columns={columns}
                            page={currentPage}
                            pageSize={pageSize}
                            totalItems={visibleItems.length}
                            onPagingChange={(pager) =>
                            {
                                onFileContentFilterChange({ page: pager.page, pageSize: pager.pageSize });
                            }}
                        /> : <EmptyData/>
                }
            </Column>
        );
    }
}

ImportData.propTypes = {
    layerName: PropTypes.string,
    onFileContentFilterChange: PropTypes.func,
    columns: PropTypes.array,
};

ImportData = inject('appStore', 'fieldForceStore')(observer(ImportData));
export default ImportData;

import './ImportManager.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { RouterParamsHelper } from 'helper/router.helper';
import { DataTypes } from 'helper/data.helper';

import { Row } from '@vbd/vui';

import ImportFiles from 'extends/ffms/components/Import/ImportFiles/ImportFiles';
import ImportData from 'extends/ffms/components/Import/ImportData/ImportData';
import CommonService from 'extends/ffms/services/CommonService';
import UploadService from 'extends/ffms/components/Import/UploadService';

export class ImportManager extends Component
{

    uploadStore = this.props.fieldForceStore.uploadStore;
    comSvc = new CommonService();
    uploadSvc = new UploadService();

    layerName = this.props.layerName;

    async componentDidMount()
    {
        // Restore params & set to url
        if (this.uploadStore.urlParams[this.props.layerName] && Object.values(this.uploadStore.urlParams[this.props.layerName]).length !== 0)
        {
            RouterParamsHelper.setParams(null, this.props, this.uploadStore.urlParams[this.props.layerName]);
        }

        this.uploadStore.appStore = this.props.appStore;
        await this.uploadStore.loadExcelFiles(this.props.layerName);

        await this.loadParams();

        await this.bindImportDataGridColumns();
    }

    componentDidUpdate = (prevProps) =>
    {
        const locationSearch = RouterParamsHelper.shouldLocationChanged(this.props.location, prevProps.location);
        if (locationSearch)
        {
            this.loadParams(locationSearch);
        }
    };

    setUploadParams = (object) =>
    {
        RouterParamsHelper.setParams(this.uploadStore.urlParams[this.props.layerName], this.props, object);
    }

    loadParams = (search) =>
    {
        const params = {
            stringFilters: ['username', 'uploader', 'file'],
            dateFilters: ['CreatedDate'],
            intFilters: ['Status'],
            fileSearchKey: DataTypes.String,
            page: DataTypes.Number,
            pageSize: DataTypes.Number,
        };

        const qs = RouterParamsHelper.getParams(this.props.location.search, params);
        for (const key in qs)
        {
            this.uploadStore.urlParams[this.props.layerName][key] = qs[key];
        }

        const { username, file, ...filterState } = qs;

        if (this.uploadStore.files && this.uploadStore.files.length)
        {
            let _file = this.uploadStore.files[0];
            if (username && file)
            {
                const found = this.uploadStore.files.find(f => f.Username === username && f.Description === file);

                if (found)
                {
                    _file = found;
                }
            }
            this.uploadStore.loadExcelFileContent(this.props.layerName,_file.Username, _file.Description, _file.TotalRecords);
        }

        this.uploadStore.setAllFileFilterState({ ...filterState, Status: Array.isArray(filterState.Status) && filterState.Status.length ? filterState.Status[0] : filterState.Status }, true);
        this.uploadStore.applyFileFilter(this.uploadStore.fileFilter);
    };

    bindImportDataGridColumns = async () =>
    {
        if (this.props.layerName)
        {
            const hiddenColumns = [];
    
            const layer = `${this.props.layerName.toLowerCase()}` + 's';
    
            const columns = await this.comSvc.getDataGridColumns(layer, hiddenColumns);
    
            this.uploadStore.setFileColumns(columns);
        }
        else
        {
            this.uploadStore.setFileColumns();
        }
    }

    handleFileFilterChange = (key, value) =>
    {
        this.setUploadParams({
            page: 1,
            [key]: value,
        });
    };

    handleRefresh = async () =>
    {
        this.uploadStore.loadExcelFiles(this.props.layerName).then(() =>
        {
            this.loadParams();
        });
    };

    handleFileContentFilterChange = (filter) =>
    {
        Object.keys(filter).forEach((key) =>
        {
            this.uploadStore.setFileContentFilterState(key, filter[key]);
        });
        this.uploadStore.applyFileContentFilter(this.uploadStore.fileContentFilter);
    };

    handlePagingChange = (paging) =>
    {
        this.setUploadParams({
            page: paging.page,
            pageSize: paging.pageSize,
        });
    }

    handleSearching = (keyword) =>
    {
        this.setUploadParams({ fileSearchKey: keyword, page: 1 });
    }

    render()
    {
        return (
            <Row
                className={'im-upload-panel'}
            >
                <ImportFiles
                    layerName={this.props.layerName}
                    searching={{
                        searchKey: this.uploadStore.fileFilter.fileSearchKey,
                        onSearch: this.handleSearching,
                    }}
                    loading={{
                        isLoading: this.uploadStore.isLoading,
                        onRefresh: this.handleRefresh,
                    }}
                    onFilterChange={this.handleFileFilterChange}
                    onPagingChange={this.handlePagingChange}
                />
                
                <ImportData
                    layerName={this.props.layerName}
                    columns={this.uploadStore.fileColumns}
                    onFileContentFilterChange={this.handleFileContentFilterChange}
                />
            </Row>
        );
    }
}

ImportManager.propTypes = {
    layerName: PropTypes.string,
};

ImportManager.defaultProps = {

};

ImportManager = inject('appStore', 'fieldForceStore')(observer(ImportManager));
ImportManager = withRouter(ImportManager);
export default ImportManager;

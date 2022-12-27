import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import fileDialog from 'file-dialog';
import Promise from 'bluebird';

import {
    SearchBox, EmptyButton, Line,
    withI18n, Row, withModal, Button,
} from '@vbd/vui';

import ImportFileFilter from 'extends/ffms/components/Import/ImportFiles/ImportFileFilter/ImportFileFilter';


let ImportFileToolbar = (props) =>
{
    const uploadStore = props.fieldForceStore.uploadStore;
    const comSvc = props.fieldForceStore.comSvc;
    
    const { layerName, onFilterChange } = props;
    
    const { loadExcelFiles } = uploadStore;

    const handleSearch = (value) =>
    {
        props.searching?.onSearch && props.searching.onSearch(value);
    };

    const handleUploadBtn = async () =>
    {
        fileDialog({ multiple: true, accept: ['.xls', '.xlsx'] }).then(async files =>
        {
            const errors = [];
            await Promise.mapSeries(files, async (file) =>
            {
                const result = await uploadStore.uploadSvc.uploadExcelToTempTable(layerName, file, uploadStore.defaultConfig);
                if (result.result === -1)
                {
                    errors.push(result.errorMessage);
                }
                else
                {
                    props.toast({ type: 'info', message: props.t('Đã tải tập tin lên'), timeout: 3000 });

                    onFilterChange && onFilterChange({ page: 1 });
                }
            });
            if (errors.length === 0)
            {
                await loadExcelFiles(layerName).then(()=>
                {
                    uploadStore.applyFileFilter(uploadStore.fileFilter);
                });
            }
            else
            {
                props.toast({ type: 'error', message: `${errors}`, timeout: 5000 });
            }

        });
    };

    const handleRefreshFileList = () =>
    {
        props.loading.onRefresh && props.loading.onRefresh();
    };

    return (
        <Row
            itemMargin={'md'}
            crossAxisAlignment={'start'}
        >
            <EmptyButton
                text={'Chọn tập tin...'}
                icon={'file-csv'}
                onClick={handleUploadBtn}
            />
            <Line
                width={'1px'}
                height={'2.25rem'}
                color={'var(--border)'}
            />
            <SearchBox
                placeholder={'Nhập từ khóa để tìm kiếm'}
                value={props.searching?.searchKey}
                onChange={handleSearch}
            />
            <EmptyButton
                icon={'sync'}
                tooltip={'Tải lại danh sách'}
                isLoading={props.loading.isLoading}
                onlyIcon
                onClick={handleRefreshFileList}
            />
            <ImportFileFilter
                onFilterChange={onFilterChange}
            />
            <EmptyButton
                icon={'file-download'}
                tooltip={'Tải tập tin mẫu'}
                onlyIcon
                onClick={() => comSvc.getImportTemplate(layerName)}
            />
        </Row>
    );
};

ImportFileToolbar.propTypes = {
    layerName: PropTypes.string,
    onFilterChange: PropTypes.func,
    // Search feature
    searching: PropTypes.shape({
        searchKey: PropTypes.string,
        onSearch: PropTypes.func,
    }),
    loading: PropTypes.shape({
        isLoading: PropTypes.bool,
        onRefresh: PropTypes.func,
    }),
};


ImportFileToolbar = inject('appStore', 'fieldForceStore')(observer(ImportFileToolbar));
ImportFileToolbar = withModal(withI18n(withRouter(ImportFileToolbar)));
export default ImportFileToolbar;

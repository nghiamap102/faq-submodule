import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
    PanelBody, PanelFooter, FlexPanel,
    Section, Paging, EmptyData,
    withI18n, Column, withModal,
} from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import UploaderExcelItem from 'extends/ffms/components/Import/ImportFiles/UploaderExcelItem';
import ImportFileToolbar from 'extends/ffms/components/Import/ImportFiles/ImportFileToolbar/ImportFileToolbar';

let ImportFiles = (props) =>
{
    const uploadStore = props.fieldForceStore.uploadStore;

    const [fileLoaded, setFileLoaded] = useState(false);

    const { layerName, onFilterChange, onPagingChange, searching, loading } = props;

    const { files, paging, currentFileContents, deleteFile, loadExcelFileContent, downloadFile, urlParams } = uploadStore;

    const handleSelect = async (userName, dataId, limit) =>
    {
        setFileLoaded(true);

        RouterParamsHelper.setParams(urlParams[layerName], props, { username: userName, file: dataId });
        await loadExcelFileContent(layerName, userName, dataId, limit);
    };

    const handlePageChange = (page) =>
    {
        onPagingChange && onPagingChange({ page: page || paging.currentPage, pageSize: paging.pageSize });
    };

    const currentFiles = files?.filter((f) => f.isVisible === undefined || f.isVisible === true) || [];

    const skip = ((paging.currentPage - 1) * paging.pageSize);
    const take = skip + paging.pageSize;

    return (
        <Column
            className={'im-panel-left'}
            flex={0}
            crossAxisSize='max'
            // width={'30rem'}
            borderRight
        >
            <Section className="section-top">
                <ImportFileToolbar
                    layerName={layerName}
                    searching={searching}
                    loading={loading}
                    onFilterChange={onFilterChange}
                />
            </Section>
            <FlexPanel className={'section-bottom'}>
                <PanelBody scroll>
                    {
                        currentFiles?.length
                            ? currentFiles.slice(skip, take).map((file) =>
                            {
                                return (
                                    <UploaderExcelItem
                                        key={`${file.Description}_${file.Username}`}
                                        data={file}
                                        layerName={layerName}
                                        active={file.Description === currentFileContents.fileName && file.Username === currentFileContents.userName}
                                        totalRecs={file.TotalRecords}
                                        deleteFile={deleteFile}
                                        downloadFunc={downloadFile}
                                        onSelect={handleSelect}
                                    />
                                );
                            })
                            : <EmptyData />
                    }
                </PanelBody>
                <PanelFooter>
                    <Paging
                        total={currentFiles.length}
                        currentPage={paging.currentPage}
                        pageSize={paging.pageSize}
                        onChange={handlePageChange}
                    />
                </PanelFooter>
            </FlexPanel>
        </Column>
    );
};

ImportFiles.propTypes = {
    layerName: PropTypes.string,
    onFilterChange: PropTypes.func,
    searching: PropTypes.shape({
        searchKey: PropTypes.string,
        onSearch: PropTypes.func,
    }),
    loading: PropTypes.shape({
        isLoading: PropTypes.bool,
        onRefresh: PropTypes.func,
    }),
    onPagingChange: PropTypes.object,
};

ImportFiles = inject('appStore', 'fieldForceStore')(observer(ImportFiles));
ImportFiles = withModal(withI18n(withRouter(ImportFiles)));
export default ImportFiles;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Expanded, Section, Spacer,
    withI18n, Row, ProgressBar, Button, withModal,
} from '@vbd/vui';

import ImportDataFilter from 'extends/ffms/components/Import/ImportData/ImportDataToolbar/ImportDataFilter';

export class ImportDataToolbar extends Component
{
    uploadStore = this.props.fieldForceStore.uploadStore;

    comSvc = this.props.fieldForceStore.comSvc;

    handleFilterChange = (filter) =>
    {
        this.props.onToolbarValueChange && this.props.onToolbarValueChange(filter);
    }

    handleImport = async () =>
    {
        const rowStep = 10;

        this.uploadStore.isImporting = true;
        // const importResult = await this.uploadStore.uploadSvc.import(this.props.layerName, this.uploadStore.currentFileContents.fileName, this.uploadStore.currentFileContents.rows.length);
        let rowCount = 0;
        let importSuccess = false;
        while (rowCount < this.uploadStore.currentFileContents.rows.length)
        {
            const importResult = await this.uploadStore.uploadSvc.import(this.props.layerName, this.uploadStore.currentFileContents.fileName, rowStep);
            if (importResult.result === 0)
            {
                await this.uploadStore.loadExcelFileContent(this.props.layerName, this.uploadStore.currentFileContents.userName, this.uploadStore.currentFileContents.fileName, this.uploadStore.currentFileContents.totalItems);
                importSuccess = true;
            }
            rowCount += rowStep;
        }

        const message = [];
        if (this.uploadStore.currentFileContents.processedRow)
        {
            message.push(this.props.t('Đã tiến hành nhập %0% dòng dữ liệu', [this.uploadStore.currentFileContents.processedRow]));
        }
        message.push(this.props.t('Vui lòng kiểm tra trạng thái dòng trong bảng'));

        this.props.toast({ type: 'info', message: message.join('\n'), timeout: 5000 });

        this.uploadStore.isImporting = false;
    }

    handleExportByStatus = () =>
    {
        const data = this.uploadStore.currentFileContents;
        if (data)
        {
            this.uploadStore.comSvc.getImportedFile(this.props.layerName, {
                userName: data.userName,
                fileName: data.fileName,
                limit: 1000,
                status: this.uploadStore.fileContentFilter && this.uploadStore.fileContentFilter.Status ? this.uploadStore.fileContentFilter.Status : undefined,
            });
        }
    }

    render()
    {
        return (
            <Section className="section-top">
                <Row
                    crossAxisAlignment={'start'}
                >
                    <Button
                        className={'ellipsis'}
                        color={'primary-color'}
                        text={'Bắt đầu nhập'}
                        icon={'file-import'}
                        isLoading={this.uploadStore.isImporting || false}
                        onClick={this.handleImport}
                    />
                    <Spacer />
                    <Button
                        className={'ellipsis'}
                        color={'primary-color'}
                        text={'Xuất danh sách'}
                        icon={'file-export'}
                        tooltip={'Chỉ xuất danh sách dữ liệu bên dưới (có áp dụng bộ lọc)'}
                        onClick={this.handleExportByStatus}
                    />
                    <Expanded margin={'auto'} />
                    <ImportDataFilter
                        onFilterChange={this.handleFilterChange}
                    />
                </Row>
                <ProgressBar
                    total={this.uploadStore.currentFileContents.totalItems || 0}
                    value={this.uploadStore.currentFileContents.processedRow || 0}
                />
            </Section>
        );
    }
}

ImportDataToolbar.propTypes = {
    onToolbarValueChange: PropTypes.func,
    paging: PropTypes.object,
};

ImportDataToolbar = withModal(withI18n(inject('appStore', 'fieldForceStore')(observer(ImportDataToolbar))));
export default ImportDataToolbar;

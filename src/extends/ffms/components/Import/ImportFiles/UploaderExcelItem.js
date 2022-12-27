import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Container, T, Row, Column, Button, FAIcon, withModal, EmptyButton } from '@vbd/vui';

import { IMPORT_STATUS } from 'extends/ffms/constant/ffms-enum';
import { PlainListItem } from 'extends/ffms/components/ListItem/PlainListItem';

export class UploaderExcelItem extends Component
{
    uploadStore = this.props.fieldForceStore.uploadStore;
    handleFileChosen = () =>
    {
        const { data, onSelect, modifiedDate } = this.props;
        if (data)
        {
            onSelect(data.Username, data.Description, data.TotalRecords);
        }
    };

    handleDeleteFile = () =>
    {
        const { deleteFile, data, layerName } = this.props;
        
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn xóa tập tin này không?',
            onOk: () =>
            {
                deleteFile(layerName, data.Username, data?.Description);
            },
        });
    }

    handleDownloadFile = () =>
    {
        const { data } = this.props;

        if (this.props.downloadFunc)
        {
            this.props.downloadFunc(this.props.layerName, data.Username, data.Description);
        }
        else
        {
            this.uploadStore.downloadFile(this.props.layerName, data.Username, data.Description);
        }
    }

    render()
    {
        const { data, active, modifiedDate } = this.props;

        return (
            <>
                <Column
                    mainAxisSize={'min'}
                    className={'import-left'}
                >
                    <Container className={'toolbar-button'}>
                        <EmptyButton
                            icon={'download'}
                            tooltip={'Tải tập tin này'}
                            onlyIcon
                            onClick={this.handleDownloadFile}
                        />
                        <EmptyButton
                            icon={'trash-alt'}
                            tooltip={'Xóa (chỉ xóa tập tin, không xóa dữ liệu)'}
                            onlyIcon
                            onClick={this.handleDeleteFile}
                        />
                    </Container>
                    <PlainListItem
                        iconClass={'file-excel'}
                        label={data?.Description}
                        sub={(
                            <>
                                <p>
                                    <FAIcon
                                        icon={'circle'}
                                        size={'0.7rem'}
                                        type={'solid'}
                                        color={this.uploadStore.getImportStatusColor(data.statusId).color}
                                    />
                                    <span><T>{data.statusOverview}</T></span>
                                </p>
                                <p>
                                    <T>Tải lên vào ngày</T>: <span>{moment(data.CreatedDate).format('L')}</span> <T>bởi</T> <span>{data.Username}</span>
                                </p>
                                {
                                    modifiedDate && data.statusId !== parseInt(IMPORT_STATUS.notImported) && (
                                        <p>
                                            <T>Ngày nhập liệu</T>: <span>{moment(modifiedDate.ModifiedDate).format('L LT')}</span>
                                        </p>
                                    )}
                            </>
                        )}
                        active={active}
                        disableSelection={false}
                        onClick={this.handleFileChosen}
                    />
                    <Row className="total-row">
                        <Column>
                            <span><T>Tổng số dữ liệu</T></span>
                            <span>{data.totalItems === undefined ? '--' : data.totalItems}</span>
                        </Column>
                        {
                            data.totalNotImported !== undefined && (
                                <Column>
                                    <span><T>Chưa xử lý</T></span>
                                    <span>{data.totalNotImported}</span>
                                </Column>
                            )}
                        <Column>
                            <span><T>Tổng số lỗi</T></span>
                            <span>{data.totalFails === undefined ? '--' : data.totalFails}</span>
                        </Column>
                    </Row>
                </Column>
            </>
        );
    }
}

UploaderExcelItem.propTypes = {
    data: PropTypes.object,
    onSelect: PropTypes.func,
    active: PropTypes.bool,
    totalRecs: PropTypes.number,
    failRecs: PropTypes.number,
    deleteFile: PropTypes.func,
    unloadFileFilter: PropTypes.func,
    downloadFunc: PropTypes.func,
};

UploaderExcelItem.defaultProps = {
    data: {},
    deleteFile: () =>
    {
    },
    downloadFunc: () =>
    {
    },
    onSelect: () =>
    {
    },
};

UploaderExcelItem = withModal(inject('appStore', 'fieldForceStore')(observer(UploaderExcelItem)));
export default UploaderExcelItem;


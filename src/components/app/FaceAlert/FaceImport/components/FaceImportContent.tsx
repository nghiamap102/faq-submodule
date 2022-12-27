import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import {
    Container, Column,
    Button,
    BorderPanel,
    DataGrid,
} from '@vbd/vui';

import { FaceImportContext, ImportStatus, ImportActions, SessionTypes } from '../FaceImportContext';
import { FaceImportService } from '../FaceImportService';

export const StatusColors = [
    { id: ImportStatus.Uploading, label: 'Đang tải', color: 'var(--color-0)' },
    { id: ImportStatus.Uploaded, label: 'Đã tải xong', color: 'var(--color-1)' },
    { id: ImportStatus.Processing, label: 'Đang xử lý', color: 'var(--info-color)' },
    { id: ImportStatus.Completed, label: 'Hoàn thành', color: 'var(--success-color)' },
    { id: ImportStatus.Error, label: 'Lỗi không nhận dạng được mặt', color: 'var(--danger-color)' },
    { id: ImportStatus.ErrorId, label: 'Lỗi không tìm thấy Id', color: 'var(--danger-color)' },
    { id: ImportStatus.ErrorAlreadyIndex, label: 'Lỗi ảnh đã tồn tại', color: 'var(--danger-color)' },
];
export const ActionsColors = [
    { id: ImportActions.Create, label: 'Tạo mới', color: 'var(--success-color)' },
    { id: ImportActions.Update, label: 'Cập nhật', color: 'var(--warning-color)' },
];
const ImageGalleryColumns = [
    { id: 'status', schema: 'select', options: StatusColors, displayAsText: 'Trạng thái', width: 230 },
    { id: 'personId', displayAsText: 'Mã đối tượng', width: 200 },
    { id: 'updatedAt', schema: 'datetime', displayAsText: 'Ngày cập nhật', width: 200 },
    { id: 'image', schema: 'image', displayAsText: 'Hình ảnh', imageHeight: 50 },
];

const GalleryColumns = [
    { id: '_status', schema: 'select', options: StatusColors, displayAsText: 'Trạng thái', width: 250 },
    { id: 'action', schema: 'select', options: ActionsColors, displayAsText: 'Hành động', width: 200 },
    { id: 'personId', displayAsText: 'Mã đối tượng', width: 200 },
    { id: 'faceId', displayAsText: 'Mã khuôn mặt', width: 200 },
    { id: 'name', displayAsText: 'Tên', width: 200 },
    { id: 'updatedAt', schema: 'datetime', displayAsText: 'Ngày cập nhật' },
];

export let FaceImportContent: React.FC = (props) =>
{
    const { currentSession, imageGalleries = [], galleries = [], pageIndex, pageSize, isLoadingDataGrid } = useContext(FaceImportContext);
    const { reloadSessions, setPageIndex, setPageSize, totalGalleries, totalGalleriesImages } = useContext(FaceImportContext);
    const [isDisabledStartButton, setIsDisabledStartButton] = useState(true);

    useEffect(() =>
    {
        setIsDisabledStartButton(currentSession?.status !== ImportStatus.Uploaded);
    }, [currentSession]);

    const handleOnChangePageSize = async (newPageSize: number) =>
    {
        setPageSize(newPageSize);
    };
    const handleOnChangePageIndex = async (newPageIndex: number) =>
    {
        setPageIndex(newPageIndex - 1);
    };
    const items = (currentSession?.type != SessionTypes.Gallery ? imageGalleries : galleries);
    return (
        <BorderPanel
            className={'face-alert-content'}
            flex={1}
        >
            <Container className={'face-alert-tool'}>
                <Container className={'face-alert-actions'}>
                    <Button
                        color={'success'}
                        text={'Bắt đầu'}
                        disabled={isDisabledStartButton}
                        onClick={async () =>
                        {
                            setIsDisabledStartButton(true);
                            currentSession && await FaceImportService.startSession(currentSession.id);
                            reloadSessions();
                        }}
                    />
                </Container>
            </Container>
            <Column>
                <DataGrid
                    rowKey={'id'}
                    columns={currentSession?.type != SessionTypes.Gallery ? ImageGalleryColumns : GalleryColumns}
                    items={items}
                    pagination={{
                        pageIndex: pageIndex + 1,
                        pageSize: pageSize,
                        pageSizeOptions: [20, 50, 100],
                        onChangePage: handleOnChangePageIndex,
                        onChangeItemsPerPage: handleOnChangePageSize,
                    }}
                    total={currentSession?.type != SessionTypes.Gallery ? totalGalleriesImages : totalGalleries}
                    loading={isLoadingDataGrid}
                />
            </Column>
        </BorderPanel>
    );
};

FaceImportContent = observer(FaceImportContent);

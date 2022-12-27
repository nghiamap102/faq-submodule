import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';

import { DataGrid } from '@vbd/vui';

import { StatusColors, ActionsColors } from 'components/app/FaceAlert/FaceImport/components/FaceImportContent';
import { PlateImportContext } from '../PlateImportContext';
import { usePlateImportSessionsGallery } from '../usePlateImportSessionsGallery';

const plateColumns = [
    { id: 'status', schema: 'select', options: StatusColors, displayAsText: 'Trạng thái', width: 200, isSortable: true },
    { id: 'action', schema: 'select', options: ActionsColors, displayAsText: 'Hành động', width: 200, isSortable: true },
    { id: 'plateNumber', displayAsText: 'Biển số xe', width: 200 },
    { id: 'type', displayAsText: 'Loại xe', width: 200 },
    { id: 'color', displayAsText: 'Màu xe', width: 200 },
    { id: 'owner', displayAsText: 'Chủ sở hữu', width: 200 },
    { id: 'vin', displayAsText: 'Số khung', width: 200 },
    { id: 'make', displayAsText: 'Hãng sản xuất', width: 200 },
    { id: 'model', displayAsText: 'Dòng xe', width: 200 },
];

export let PlateImportContentGallery: React.FC = (props) =>
{
    const { currentSession, galleryPageIndex, galleryPageSize, setGalleryPageIndex, setGalleryPageSize } = useContext(PlateImportContext);
    const {
        galleries,
        totalGalleries: total,
        isLoadingGalleries: isLoading,
        refetchGalleries,
    } = usePlateImportSessionsGallery(currentSession?.id || '', galleryPageIndex, galleryPageSize);

    useEffect(() =>
    {
        refetchGalleries();
    }, [currentSession, galleryPageIndex, galleryPageSize]);

    return (
        <DataGrid
            rowKey={'id'}
            columns={plateColumns}
            items={galleries}
            pagination={{
                pageIndex: galleryPageIndex,
                pageSize: galleryPageSize,
                pageSizeOptions: [20, 50, 100],
                onChangePage: setGalleryPageIndex,
                onChangeItemsPerPage: setGalleryPageSize,
            }}
            total={total}
        />
    );
};

PlateImportContentGallery = observer(PlateImportContentGallery);

import { EmptyData } from 'components/bases/Data/EmptyData';
import { Popup, DataGrid } from '@vbd/vui';
import { inject, observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { PlateDetectionHistoryContainer } from '../../PlateDetection/PlateDetectionHistory';
import { plateGalleryColumns } from '../../PlateGallery/PlateGalleryContent';
import { PlateAccompliceService } from '../PlateAccompliceService';

interface PlateAccompliceItemsProps {
    sessionId?: string;
    plateAlertStore?: any;
}

export interface PlateAccompliceItem {
    sessionId: string;
    accuracy: number;
    faceId: string;
    overviewImage: string;
    faceImage: string;
    candidates: {id: string, accuracy: number};
}

const columns = [
    { id: 'found', schema: 'string', displayAsText: 'Số lần tìm thấy', width: 100 },
    ...plateGalleryColumns,
];

export let PlateAccompliceItems: React.FC<PlateAccompliceItemsProps> = (props)=>
{
    const { sessionId = '' } = props;
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const { data, refetch } = useQuery<any>(['faceHistory', sessionId], () => PlateAccompliceService.getItems({ sessionId, pageIndex, pageSize }), { refetchInterval: 5000 });
    const plateDetectionStore = props.plateAlertStore!.plateDetectionStore;
    
    useEffect(() =>
    {
        sessionId && setPageIndex(1);
    }, [sessionId]);
    useEffect(() =>
    {
        sessionId && refetch();
    }, [pageIndex, pageSize]);

    if (!sessionId || !data || !data.items?.length)
    {
        return <EmptyData />;
    }
    const { total, items } = data;
    return (
        <>
            <DataGrid
                rowKey={'id'}
                columns={columns}
                items={items}
                pagination={{
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    pageSizeOptions: [20, 50, 100],
                    onChangePage: setPageIndex,
                    onChangeItemsPerPage: setPageSize,
                }}
                total={total}
                onRowClick={(e, row) => plateDetectionStore.setHistory('plateNumber', row.plateNumber)}
            />

            {!!plateDetectionStore.history.plateNumber && (
                <Popup
                    title={'Lịch sử'}
                    width={'90%'}
                    height={'90%'}
                    padding={'0'}
                    scroll={false}
                    onClose={() => plateDetectionStore.setHistory('plateNumber', null)}
                >
                    <PlateDetectionHistoryContainer />
                </Popup>
            )
            }
        </>
    );
};

PlateAccompliceItems = inject('plateAlertStore')(observer(PlateAccompliceItems));

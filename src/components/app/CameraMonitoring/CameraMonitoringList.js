import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Row, Column,
    Button,
    DataGrid,
} from '@vbd/vui';

import { Constants } from 'constant/Constants';

let CameraMonitoringList = (props) =>
{
    const { store } = props;

    const columns = [
        {
            hidden: false,
            id: 'CameraName',
            displayAsText: 'Tên',
            // width: 120,
            isSortable: true,
            defaultSortDirection: 'desc',
        },
        {
            hidden: true,
            id: 'SERI_CAMERA',
            displayAsText: 'Seri',
            width: 85,
            isSortable: true,
            defaultSortDirection: 'desc',
        },
        {
            hidden: true,
            id: 'MA_VI_TRI',
            displayAsText: 'Mã vị trí',
            width: 60,
            isSortable: true,
            defaultSortDirection: 'desc',
        },
        {
            hidden: false,
            id: 'ServerTime',
            displayAsText: 'Giờ hệ thống',
            width: 100,
            isSortable: true,
            defaultSortDirection: 'desc',
        },
        {
            hidden: false,
            id: 'DeviceTime',
            displayAsText: 'Giờ thiết bị',
            width: 100,
            isSortable: true,
            defaultSortDirection: 'desc',
        },
        {
            hidden: false,
            id: 'Ago',
            displayAsText: 'Cách đây',
            width: 90,
            isSortable: true,
            defaultSortDirection: 'desc',
        },
        {
            hidden: false,
            id: 'Diff',
            displayAsText: 'Độ lệch',
            width: 90,
            isSortable: true,
            defaultSortDirection: 'desc',
        },
        {
            hidden: false,
            id: 'signal',
            displayAsText: 'Trạng thái',
            width: 100,
            schema: 'select',
            options: [
                { id: Constants.CAMERA_STATUS.GOOD, label: 'Tốt', color: 'var(--success-color)' },
                { id: Constants.CAMERA_STATUS.BROKEN, label: 'Hỏng', color: 'var(--danger-color)' },
            ],
            isSortable: true,
            defaultSortDirection: 'desc',
        },
    ];

    const setPageIndex = (index) =>
    {
        store.setPage(index);
    };

    const setPageSize = (size) =>
    {
        store.setCount(size);
    };

    const onSearch = (key) =>
    {
        store.setSearchKey(key);
    };

    const onColumnSort = (columns) =>
    {
        store.setSorter(columns);
    };

    useEffect(() =>
    {
        store.setData();
    }, [store.count, store.page, store.total, store.searchKey, store.sorters]);

    const exportBrokenCamera = () =>
    {
        const rows = [['Ten', 'SERI', 'MA_VI_TRI', 'TT_TIN HIEU', 'DUONG', 'GIAO_LO', 'Ago', 'Diff', 'GIO_HE_THONG', 'GIO_THIET_BI']];
        for (let i = 0; i < store.allData.length; i++)
        {
            if (store.allData[i].signal === Constants.CAMERA_STATUS.BROKEN || store.allData[i].AgoStatus === Constants.CAMERA_STATUS.BROKEN)
            {
                rows.push(
                    [
                        store.allData[i].CameraName,
                        store.allData[i].SERI_CAMERA,
                        store.allData[i].MA_VI_TRI,
                        store.allData[i].signal === Constants.CAMERA_STATUS.GOOD ? 'Good' : store.allData[i].signal === Constants.CAMERA_STATUS.BROKEN ? 'Broken' : 'No data',
                        store.allData[i].DUONG,
                        store.allData[i].GIAO_LO,
                        store.allData[i].Ago,
                        store.allData[i]['Diff'],
                        store.allData[i].ServerTime,
                        store.allData[i].DeviceTime,
                    ],
                );
            }
        }

        const csvContent = rows.map(e => e.join(',')).join('\n');
        const link = window.document.createElement('a');
        link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent));
        link.setAttribute('download', 'report.csv');
        link.click();
    };

    return (
        <Column>
            <DataGrid
                columns={columns}
                items={store.data}
                rowKey={'device_signal'}
                toolbarActions={(
                    <Row
                        mainAxisSize={'min'}
                        crossAxisSize={'min'}
                        flex={0}
                        className={'device-signal-toolbar'}
                    >
                        <Button
                            color={'success'}
                            className={'btn-export'}
                            text={'XUẤT DANH SÁCH CAMERA HỎNG'}
                            onClick={() =>
                            {
                                exportBrokenCamera();
                            }}
                        />
                    </Row>
                )}
                pagination={{
                    pageIndex: store.page,
                    pageSize: store.count,
                    pageSizeOptions: [10, 20, 50, 100],
                    onChangePage: setPageIndex,
                    onChangeItemsPerPage: setPageSize,
                }}
                total={store.total}
                toolbarVisibility={{
                    showSearchBox: true,
                }}
                searching={{ onSearch: onSearch }}
                sorting={{
                    columns: store.sorters,
                    isSingleSort: true,
                    onSort: onColumnSort,
                }}
                isFixedHeader
                rowNumber
            />
        </Column>
    );
};

CameraMonitoringList.defaultProps = {
    data: {
        results: [],
        total: 0,
    },
    handleChangePage: () =>
    {

    },
    pageSize: 20,
    page: 1,
};

CameraMonitoringList = inject('store')(observer(CameraMonitoringList));
export default CameraMonitoringList;

import './DeviceSignalMonitoring.scss';

import React, { useEffect, useState } from 'react';

import {
    Row, Column,
    DataGrid,
    Button,
} from '@vbd/vui';

const DeviceSignalMonitoringList = (props) =>
{
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(20);
    const [total, setTotal] = useState(0);
    const [sorters, setSorters] = useState();
    const [searchKey, setSearchKey] = useState('');

    const columns = [
        {
            hidden: false,
            id: 'name',
            displayAsText: 'Tên',
            width: 100,
            isSortable: true,
            defaultSortDirection: 'desc',
        },
        { hidden: false, id: 'host', displayAsText: 'Host', width: 100 },
        {
            hidden: false, id: 'signal',
            displayAsText: 'Trạng thái',
            width: 150,
            schema: 'select',
            options: [
                { id: 1, label: 'Tốt', color: 'var(--success-color)' },
                { id: 2, label: 'Hỏng', color: 'var(--danger-color)' },
            ],
            isSortable: true,
            defaultSortDirection: 'desc',
        },
        {
            hidden: false, id: 'error', displayAsText: 'Lỗi',
        },
    ];

    const setPageIndex = (index) =>
    {
        setPage(index);
    };
    const setPageSize = (size) =>
    {
        setCount(size);
    };
    const onSearch = (key) =>
    {
        setSearchKey(key);
    };
    const getData = () =>
    {
        return props.data;
    };
    const sort = (arr, sorter) =>
    {
        const compare = (a, b) =>
        {
            const valA = a[sorter.id] ? a[sorter.id].toString().toLowerCase() : '';
            const valB = b[sorter.id] ? b[sorter.id].toString().toLowerCase() : '';
            if (valA < valB)
            {
                return sorter.direction === 'asc' ? -1 : 1;
            }
            if (valA > valB)
            {
                return sorter.direction === 'asc' ? 1 : -1;
            }
            return 0;
        };
        return arr.sort(compare);
    };
    const onSort = (sorters) =>
    {
        setSorters(sorters);
    };
    useEffect(() =>
    {
        if (props.data && props.data.length)
        {
            setData(getData());
            setTotal(props.data.length);
        }
    }, [props.data]);

    useEffect(() =>
    {
        if (props.data && props.data.length)
        {
            let allData = props.data;
            const end = count * page;
            const start = count * (page - 1);
            const dt = [];

            // search
            if (!searchKey)
            {
                allData = props.data;
            }
            else
            {
                allData = allData.filter(d => d.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1);
            }
            // sort
            if (sorters)
            {
                allData = sort(allData, sorters[0]);
            }
            // paging
            for (let i = start; i < end; i++)
            {
                if (i === allData.length)
                {
                    break;
                }
                dt.push({
                    ...allData[i],
                    no: i + 1,
                });
            }

            setData(dt);
        }
    }, [count, page, total, sorters, searchKey]);

    const exportBrokenDevices = () =>
    {
        const rows = [['Device name', 'Status', 'Detail']];
        for (let i = 0; i < data.length; i++)
        {
            if (data[i].signal === 2)
            {
                rows.push([data[i].name, 'Hỏng', data[i].error]);
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
                items={data}
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
                            text={'XUẤT DANH SÁCH THIẾT BỊ HỎNG'}
                            onClick={() =>
                            {
                                exportBrokenDevices();
                            }}
                        />
                    </Row>
                )}
                pagination={{
                    pageIndex: page,
                    pageSize: count,
                    pageSizeOptions: [10, 20, 50, 100],
                    onChangePage: setPageIndex,
                    onChangeItemsPerPage: setPageSize,
                }}
                total={total}
                toolbarVisibility={{
                    showSearchBox: true,
                }}
                searching={{ onSearch: onSearch }}
                sorting={{
                    columns: sorters,
                    isSingleSort: true,
                    onSort: onSort,
                }}
                isFixedHeader
                rowNumber
            />
        </Column>
    );
};
export default DeviceSignalMonitoringList;

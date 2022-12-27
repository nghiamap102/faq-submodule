import React, { ReactNode, useContext, useEffect, useState } from 'react';

import {
    DataGrid,
    Row, Button,
} from '@vbd/vui';

import { CaseContext } from './CaseContext';

type CaseGridProps = {
    selectedCase: any,
    onEdit: Function,
    onViewHistory: Function,
    onOpenWorkflow: Function,
    onRowCheckChange?: any,
    onAllRowCheckChange?: any
    onSort?: Function,
    onRowSelectionChange?: any,
    toolbarActions?: ReactNode
}

const CaseGrid: React.FC<CaseGridProps> = (props) =>
{
    const {
        selectedCase,
        onEdit,
        onViewHistory,
        onOpenWorkflow,
        onSort,
        onRowCheckChange,
        onAllRowCheckChange,
        onRowSelectionChange,
        toolbarActions,
    } = props;

    const {
        cases,
        loading,
        total,
        pageSize,
        pageIndex,
        setCaseState,
        allSelectionFieldOptions,
    } = useContext<any>(CaseContext);

    const [sortColumns, setSortColumns] = useState();
    const [columns, setColumns] = useState<any>([]);

    const setPageIndex = async (index: number) =>
    {
        if (!loading)
        {
            setCaseState({ pageIndex: index });
        }
    };

    const setPageSize = async (size: number) =>
    {
        if (!loading)
        {
            setCaseState({ pageSize: size });
        }
    };

    useEffect(() =>
    {
        if (allSelectionFieldOptions)
        {
            setColumns([
                { hidden: false, id: 'TENVUVIEC', displayAsText: 'Tên vụ việc', width: 140, isSortable: true },
                {
                    hidden: false, id: 'TRANGTHAI', displayAsText: 'Trạng thái', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.TRANGTHAI.map((item: any) =>
                    {
                        return {
                            id: item.id,
                            label: item.label,
                            color: item.id === 'DAXULY' ? 'gray' : 'green',
                        };
                    }),
                    // isSortable: true
                },
                { hidden: false, id: 'CREATION_OU', displayAsText: 'Cơ quan tạo', width: 100, isSortable: true },
                { hidden: false, id: 'ID_CANBO', displayAsText: 'Người tạo', width: 100, isSortable: true },
                { hidden: false, id: 'NGAYTAO', displayAsText: 'Ngày tạo', schema: 'datetime', width: 140, isSortable: true },
                { hidden: true, id: 'MOTA', displayAsText: 'Mô tả', width: 100 },
                { hidden: true, id: 'GHICHU', displayAsText: 'Ghi chú', width: 100 },

                {
                    hidden: false, id: 'PHANLOAI', displayAsText: 'Phân loại', width: 120,
                    schema: 'select',
                    options: allSelectionFieldOptions?.PHANLOAI,
                },

                {
                    hidden: true, id: 'LOAIVUVIECCHITIET', displayAsText: 'Phân loại chi tiết', width: 140,
                    schema: 'select',
                    options: allSelectionFieldOptions?.LOAIVUVIECCHITIET,
                },

                {
                    hidden: false, id: 'TINHCHATVUVIEC', displayAsText: 'Tính chất vụ việc', width: 140,
                    schema: 'select',
                    options: allSelectionFieldOptions?.TINHCHATVUVIEC,
                },

                { hidden: true, id: 'ID_NANNHAN', displayAsText: 'Mã nạn nhân', width: 100, isSortable: true },
                { hidden: false, id: 'SONANNHAN', displayAsText: 'Số nạn nhân', width: 120, isSortable: true },

                { hidden: true, id: 'ID_DOITUONG', displayAsText: 'Mã đối tượng', width: 100, isSortable: true },
                { hidden: true, id: 'SODOITUONG', displayAsText: 'Số đối tượng', width: 100, isSortable: true },

                { hidden: false, id: 'NGUYCAP', displayAsText: 'Chuyển lên TTCH', schema: 'boolean', width: 130 },

                { hidden: true, id: 'CHUYENDE', displayAsText: 'Chuyên đề', width: 100 },
                {
                    hidden: true, id: 'DIABAN', displayAsText: 'Địa bàn', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.DIABAN,
                },

                { hidden: true, id: 'NUOC', displayAsText: 'Quốc gia', width: 100 },
                { hidden: true, id: 'TINH', displayAsText: 'Tỉnh', width: 100 },
                { hidden: true, id: 'HUYEN', displayAsText: 'Quận/Huyện', width: 100 },
                { hidden: true, id: 'XA', displayAsText: 'Phường/Xã', width: 100 },
                { hidden: true, id: 'THON', displayAsText: 'Thôn', width: 100 },
                { hidden: false, id: 'DIACHI', displayAsText: 'Địa chỉ', width: 200 },

                { hidden: true, id: 'NGUOIPHATHIEN', displayAsText: 'Người phát hiện', width: 100 },
                {
                    hidden: true, id: 'NGUONPHATHIEN', displayAsText: 'Nguồn phát hiện', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.NGUONPHATHIEN,
                },

                { hidden: true, id: 'KHAMPHA', displayAsText: 'Khám phá', width: 100 },

                { hidden: true, id: 'THIETHAI', displayAsText: 'Thiệt hại', width: 100 },

                {
                    hidden: true, id: 'NGUYENNHANXAYRA', displayAsText: 'Nguyên nhân xảy ra', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.NGUYENNHANXAYRA,
                },
                { hidden: true, id: 'NGUYENNHANCHITIET', displayAsText: 'Nguyên nhân chi tiết', width: 100 },

                {
                    hidden: true, id: 'PHUONGTHUCTHUDOAN', displayAsText: 'Phương thức thủ đoạn', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.PHUONGTHUCTHUDOAN,
                },
                { hidden: true, id: 'PHUONGTHUCCHITIET', displayAsText: 'Phương thức chi tiết', width: 100 },
                {
                    hidden: true, id: 'PHUONGTIENGAYAN', displayAsText: 'Phương tiện gây án', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.PHUONGTIENGAYAN,
                },
                { hidden: true, id: 'PHUONGTIENCHITIET', displayAsText: 'Phương tiện chi tiết', width: 100 },

                { hidden: true, id: 'COTOCHUC', displayAsText: 'Có tổ chức', width: 100, schema: 'boolean' },
                {
                    hidden: true, id: 'COCAUTOCHUC', displayAsText: 'Cơ cấu tổ chức', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.COCAUTOCHUC,
                },

                { hidden: true, id: 'THUHOITAISAN', displayAsText: 'Thu hồi tài sản', width: 100 },
                {
                    hidden: true, id: 'CAPCHIDAO', displayAsText: 'Cấp chỉ đạo', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.CAPCHIDAO,
                },

                {
                    hidden: true, id: 'KETQUAXULY', displayAsText: 'Kết quả xử lý', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.KETQUAXULY,
                },
                { hidden: true, id: 'KETQUACHITIET', displayAsText: 'Kết quả chi tiết', width: 100 },

                {
                    hidden: true, id: 'HINHTHUCXULY', displayAsText: 'Hình thức xử lý', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.HINHTHUCXULY,
                },
                { hidden: true, id: 'HINHTHUCCHITIET', displayAsText: 'Hình thức chi tiết', width: 100 },

                {
                    hidden: true, id: 'DONVIXULY', displayAsText: 'Đơn vị xử lý', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.DONVIXULY,
                },

                {
                    hidden: true, id: 'KHOITOVUAN', displayAsText: 'Khởi tố vụ án', width: 100,
                    schema: 'select',
                    options: allSelectionFieldOptions?.KHOITOVUAN,
                },
                { hidden: true, id: 'NOIDUNGKHOITO', displayAsText: 'Nội dung khởi tố', width: 100 },

                { hidden: true, id: 'NGAYTHUCHIEN', displayAsText: 'Ngày thực hiện', schema: 'datetime', width: 100 },
                { hidden: true, id: 'NGAYKETTHUC', displayAsText: 'Ngày kết thúc', schema: 'datetime', width: 100 },

                {
                    hidden: false,
                    id: 'NGAYGHINHAN',
                    displayAsText: 'Ngày ghi nhận',
                    schema: 'datetime',
                    width: 140,
                    isSortable: true,
                },
                { hidden: true, id: 'NGAYPHANCONG', displayAsText: 'Ngày phân công', schema: 'datetime', width: 100 },

                { hidden: true, id: 'NGAYTUCHOI', displayAsText: 'Ngày từ chối biên tập', schema: 'datetime', width: 100 },
                { hidden: true, id: 'ID_CANBO_TUCHOI', displayAsText: 'Mã cán bộ từ chối', width: 100 },
                { hidden: true, id: 'LYDO', displayAsText: 'Lý do', width: 100 },

                { hidden: true, id: 'NGAYPHEDUYET', displayAsText: 'Ngày phê duyệt', schema: 'datetime', width: 100 },
                { hidden: true, id: 'ID_CANBO_DUYET', displayAsText: 'Mã cán bộ duyệt', width: 100 },

                { hidden: true, id: 'NGAYSUA', displayAsText: 'Ngày sửa', schema: 'datetime', width: 100 },
                { hidden: true, id: 'ID_CANBO_SUA', displayAsText: 'Mã cán bộ sửa', width: 100 },

                { hidden: true, id: 'APPLICATION', displayAsText: 'Ứng dụng', width: 100 },
            ]);
        }
    }, [allSelectionFieldOptions]);

    const onColumnSort = (column: any) =>
    {
        setSortColumns(column);
        onSort && onSort(column);
    };

    const actionsColumn = {
        id: 'Id',
        headerCellRender: <span>Actions</span>,
        width: 140,
        freezeEnd: true,
        rowCellRender: function ActionsField (row: any, index: number)
        {
            return (
                <Row
                    itemMargin={'sm'}
                    crossAxisAlignment={'start'}
                >
                    <Button
                        icon={'edit'}
                        iconSize={'xs'}
                        tooltip={'Chỉnh sửa'}
                        onlyIcon
                        onClick={() => onEdit(row)}
                    />
                    <Button
                        icon={'history'}
                        tooltip={'Lịch sử'}
                        iconSize={'xs'}
                        onlyIcon
                        onClick={() => onViewHistory(row)}
                    />
                    <Button
                        disabled={!row.wfCode}
                        icon={'code-branch'}
                        iconSize={'xs'}
                        tooltip={'Quy trình xử lý'}
                        onlyIcon
                        onClick={() => onOpenWorkflow(row)}
                    />
                </Row>
            );
        },
    };

    return (
        <DataGrid
            loading={loading}
            columns={columns}
            items={cases}
            toolbarActions={toolbarActions}
            sorting={{
                columns: sortColumns,
                onSort: onColumnSort,
                isSingleSort: true,
            }}
            pagination={{
                pageIndex,
                pageSize,
                pageSizeOptions: [10, 20, 50, 100, 200],
                onChangePage: setPageIndex,
                onChangeItemsPerPage: setPageSize,
            }}
            toolbarVisibility={{
                showColumnSelector: true,
                showStyleSelector: true,
                showSortSelector: true,
                showFullScreenSelector: true,
            }}
            total={total}
            rowKey={'Id'}
            trailingControlColumns={[actionsColumn]}
            selectRows={{
                onChange: onRowCheckChange,
                onChangeAll: onAllRowCheckChange,
            }}
            selectedRow={selectedCase}
            rowNumber
            onCellClick={(event: any, row: any) =>
            {
                onRowSelectionChange(row);
            }}
        />
    );
}
;
export { CaseGrid };

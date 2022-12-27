import React from 'react';

import { Button, DataGrid, Row } from '@vbd/vui';

type CaseGridProps = {
    data: any,
    onRestore: Function,
    onRowSelectionChange: (row: any) => any
}

const NodeHistoryGrid: React.FC<CaseGridProps> = (props) =>
{
    const {
        data,
        onRestore,
        onRowSelectionChange,
    } = props;

    const columns = [
        { id: 'Modified', displayAsText: 'Ngày sửa', schema: 'datetime', width: 100 },
        { id: 'Modifier', displayAsText: 'Người sửa' },
    ];

    const actionsColumn = {
        id: 'Id',
        headerCellRender: <span>Actions</span>,
        width: 70,
        freezeEnd: true,
        rowCellRender: function ActionsField (row: any, index: number)
        {
            return (
                <Row
                    itemMargin={'sm'}
                    crossAxisAlignment={'start'}
                >
                    <Button
                        icon={row.HistoryId ? 'undo' : 'check'}
                        onlyIcon
                        onClick={() =>
                        {
                            row.HistoryId && onRestore(row);
                        }}
                    />
                </Row>
            );
        },
    };

    return (
        <DataGrid
            columns={columns}
            items={data}
            rowKey={'HistoryId'}
            trailingControlColumns={[actionsColumn]}
            rowNumber
            onRowClick={(e, row) => onRowSelectionChange(row)}
        />
    );
};

export { NodeHistoryGrid };

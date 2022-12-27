import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import Moment from 'react-moment';

import {
    Table, TableRowCell, TableRow,
    TB1,
    Column, Container,
    T,
} from '@vbd/vui';

let ActivityLogsList = (props) =>
{
    const { data, currentPage, pageSize } = props;

    const columns = [
        { label: 'STT', width: '3.5rem' },
        { label: 'Hành động', width: '3.5rem' },
        { label: 'Model', width: '5rem' },
        { label: 'Thay Đổi', width: '30%' },
        { label: 'Người Tạo', width: '15rem' },
        { label: 'Ngày Tạo', width: '15rem' },
    ];

    return (
        <Column>
            <Table
                isFixedHeader
                headers={columns}
            >
                {
                    data?.map((row, i) =>
                        <TableRow key={row.id}>
                            <TableRowCell>
                                <TB1>{((currentPage - 1) * pageSize) + i + 1}</TB1>
                            </TableRowCell>
                            <TableRowCell>
                                <TB1 className={row.action}>{row.action}</TB1>
                            </TableRowCell>
                            <TableRowCell>
                                <TB1>{row.model}</TB1>
                            </TableRowCell>
                            <TableRowCell className={'cell-after'}>
                                <ChangeList row={row} i={i} />
                            </TableRowCell>
                            <TableRowCell>
                                <TB1>{row?.user?.profile?.displayName}</TB1>
                                <TB1>{row?.user?.profile?.emails?.[0].value}</TB1>
                            </TableRowCell>
                            <TableRowCell>
                                <TB1><Moment format={'L LTS'}>{row.createdDate}</Moment></TB1>
                            </TableRowCell>
                        </TableRow>,
                    )
                }
            </Table>
        </Column>
    );
};

ActivityLogsList.defaultProps = {
    data: [],
};

ActivityLogsList = inject('appStore')(observer(ActivityLogsList));
export default ActivityLogsList;

function ChangeList(props)
{
    const { row, i } = props;

    const [isShowingFull, setIsShowingFull] = useState(false);
    const showFull = () => setIsShowingFull(!isShowingFull);
    return (
        <>
            <Container style={{ maxHeight: isShowingFull ? undefined : '5rem', overflow: 'hidden' }}>
                {
                    row.data?.map((p, j) =>
                        {
                            if (p.type || isShowingFull)
                            {
                                return <TB1 className={`tb tb1 log ${p.type}`} key={`${row.id}${i}${j}`}>{p.key}: {p.value}</TB1>;
                            }
                        },
                    )
                }
            </Container>
            <span onClick={showFull}>
                {isShowingFull ? <T>Xem rút gon</T> : <T>Xem đầy đủ</T>}
            </span>
        </>
    );
}

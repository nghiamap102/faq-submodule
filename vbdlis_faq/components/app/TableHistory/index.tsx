import { Container, HD6, Table, TableRow, TableRowCell } from '@vbd/vui';
import React from 'react';
import './TableHistory.scss';

interface TableHistoryProps {
    headers?: any[];
    data?: any[];
};
const TableHistory: React.FC<TableHistoryProps> = ({
    headers,
    data,
}) => {
    return (
        <>
            <Container className='history container-bg-white'>
                <Table headers={headers}>
                    {data?.map((ele, index) => {
                        const renderRating = ele.rating ? 'Có' : 'Không'
                        return (
                            <TableRow key={ele.name}>
                                <TableRowCell align='left'>{index + 1}</TableRowCell>
                                <TableRowCell align='left'>{ele.username}</TableRowCell>
                                <TableRowCell align='left'>{ele.time}</TableRowCell>
                                <TableRowCell align='left'>{ele.topic}</TableRowCell>
                                <TableRowCell
                                    align='left'
                                    className={`rating  ${renderRating}`}
                                >
                                    <HD6>{renderRating}</HD6>
                                </TableRowCell>
                            </TableRow>

                        )
                    })}
                </Table>
            </Container>
        </>
    );
};

export default TableHistory;
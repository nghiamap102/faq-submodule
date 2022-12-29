import { Meta, Story } from '@storybook/react';

import { Table, TableRow, TableRowCell } from 'components/bases/Table';
import { TableProps } from '../Table';

export default {
    title: 'Display/Table',
    component: Table,
    subcomponents: { TableRow, TableRowCell },
    args: {},
} as Meta;

const headers = [
    {
        label: 'Table is wrapped by 200px height div to see isFixedHeader',
        width: '50%',
        col: 1,
    },
    {
        label: 'Section 2',
        width: '25%',
        subCols: [
            {
                label: 'Section 2.1',
            },
            {
                label: 'Section 2.2',
            },
        ],
    },
    {
        label: 'Section 3',
        width: '25%',
    },
];

const Template: Story<TableProps> = (args) =>
{
    const renderRows = (rowCount: number) =>
    {
        const rows = [];
        for (let i = 0; i < rowCount; i++)
        {
            rows.push(
                <TableRow>
                    <TableRowCell>Test 1</TableRowCell>
                    <TableRowCell>Test 2.1</TableRowCell>
                    <TableRowCell>Test 2.2</TableRowCell>
                    <TableRowCell>Test 3</TableRowCell>
                </TableRow>,
            );
        }
        return rows;
    };
    return (
        <div style={{ height: '150px', backgroundColor: 'aqua' }}>
            <Table {...args}>
                {renderRows(5)}
            </Table>
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    headers,
};

export const WithFixedHeader = Template.bind({});
WithFixedHeader.args = {
    headers,
    isFixedHeader: true,
};

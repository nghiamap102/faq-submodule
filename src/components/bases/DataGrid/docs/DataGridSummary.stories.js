import React from 'react';
import faker from 'faker';

import { DataToolBar } from 'components/bases/DataToolBar/DataToolBar';
import { AppBody } from 'components/bases/AppBody';
import { StoryDoc } from 'components/story/blocks';

import { DataGrid } from '../DataGrid';
import docs from './DataGrid.docs.mdx';
import changelog from './DataGrid.changelog.md';

export default {
    title: 'Display/DataGrid/Summary',
    component: DataGrid,
    decorators: [(Story) => <div style={{ margin: '-1rem' }}><AppBody><Story /></AppBody></div>],
    parameters: {
        changelog,
        docs: {
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="DataGrid"
                    componentName="DataGrid"
                    component={DataGrid}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
};

export function Summary()
{
    return (
        <>
            <DataToolBar
                fields={[
                    {
                        ColumnName: 'guid',
                        DisplayName: 'Ma so',
                        DataType: 'array',
                        Config: '{"content":{"source":[{"Value":"1","Display":"test"}]}}',
                    },
                    {
                        ColumnName: 'name',
                        DisplayName: 'Ten',
                        DataType: 'integer',
                    },
                ]}
                defaultField={[
                    'guid',
                    'name',
                ]}
                primaryFields={[
                    // 'guid',
                    // 'name',
                ]}
                fieldsShow={['guid', 'name']}
            />

            <DataGrid
                items={tableData}
                columns={tableColumns}
                rowKey={'guid'}
                toolbarVisibility={{ showColumnSelector: true }}
                summary={{ stick: true }}
            />
        </>
    );
}

function generateUser()
{
    return {
        name: faker.name.firstName('male'),
        code: faker.datatype.number(),
        guid: faker.datatype.uuid(),
        active: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        spent: faker.datatype.number() * 99,
        spentVND: faker.datatype.number() * 1000,
    };
}

const tableData = [];

for (let i = 0; i < 10; i++)
{
    tableData.push(generateUser());
}

const tableColumns = [
    {
        id: 'guid',
        width: 200,
        displayAsText: 'Numeric',
        schema: 'numeric',
    },
    {
        id: 'name',
        width: 200,
        displayAsText: 'Name',
        schema: 'boolean',
    },
    {
        id: 'chart',
        width: 200,
        height: 120,
        displayAsText: 'Chart',
        schema: 'chart',
        chartType: 'line',
        isMiniStyle: true,
    },
    {
        id: 'code',
        displayAsText: 'Code',
        display: <span style={{ color: 'red' }}>Code</span>,
        schema: 'select',
        isSortable: true,
        width: 200,
        defaultSortDirection: 'desc',
        options: [
            { label: 'Ho Chi Minh label', id: 'Ho Chi Minh', color: 'green' },
            { label: 'Ha Noi label', id: 'Ha Noi', color: 'orange' },
            { label: 'Da Nang label 12311111', id: 'Da Nang', color: 'brown' },
        ],
    },
    {
        id: 'active',
        displayAsText: 'Active',
        schema: 'datetime',
        isSortable: true,
        width: 200,
    },
    {
        id: 'createdAt',
        displayAsText: 'HH:mm',
        schema: 'date',
        isSortable: true,
        format: 'HH:mm',
        width: 200,
    },
    {
        id: 'spent',
        displayAsText: 'Test long header! Which is very longgg',
        isSortable: true,
        schema: 'currency',
        width: 200,
        summary: {
            label: 'Async',
            formula: async (cols) => await (new Promise((resolve) =>
                setTimeout(() =>
                    resolve(cols.reduce((pre, cur, items) => pre += cur)),
                2000),
            )),
        },
    },
    {
        id: 'spentVND',
        width: 200,
        displayAsText: 'Spent in Vietnam',
        schema: 'currency',
        locale: 'vi',
        summary: {
            label: 'Sync',
            formula: (cols) => cols.reduce((pre, cur) => pre + cur),
        },
    },
];

import React, { useState } from 'react';
import faker from 'faker';

import { AppBody } from 'components/bases/AppBody';
import { StoryDoc } from 'components/story/blocks';

import { DataGrid } from '../DataGrid';
import docs from './DataGrid.docs.mdx';
import changelog from './DataGrid.changelog.md';

export default {
    title: 'Display/DataGrid/Advance',
    component: DataGrid,
    decorators: [(Story) => <AppBody><Story /></AppBody>],
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

export function InfiniteScroll()
{
    const [data, setData] = useState(genData(400) || []);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(100);

    const [tableData, setTableData] = useState([]);

    const pageSize = 100;

    const handleOnChangePageSize = (pageIndex, keepOldItems, onDone) =>
    {
        return new Promise(resolve =>
        {
            setTimeout(() =>
            {
                setEnd(end + pageSize);
                onDone && onDone();
                resolve();
            }, 1000);
        });

    };

    return (
        <>
            <DataGrid
                items={data.slice(start, end)}
                columns={columnDefinitions}
                rowKey={'numeric'}
                pagination={{
                    useInfiniteScroll: true,
                    pageIndex: 0,
                    pageSize: pageSize,
                    pageSizeOptions: [100],
                    onChangePage: handleOnChangePageSize,
                }}
            />
        </>
    );
}

const columnDefinitions = [
    {
        id: 'numeric',
        width: 200,
        displayAsText: 'Numeric',
        schema: 'numeric',
    },

    {
        id: 'currency',
        width: 200,
        displayAsText: 'Currency',
        schema: 'currency',
        locale: 'vi',
    },
    {
        id: 'datetime',
        displayAsText: 'Datetime',
        schema: 'datetime',
        format: 'YYYY/MM/DD mm:HH',
        width: 200,
    },
    {
        id: 'date',
        displayAsText: 'Date',
        schema: 'date',
        width: 200,
    },
    {
        id: 'boolean',
        width: 200,
        displayAsText: 'Boolean',
        schema: 'boolean',
    },
    {
        id: 'select',
        displayAsText: 'Select',
        display: <span style={{ color: 'red' }}>Code</span>,
        schema: 'select',
        isSortable: true,
        width: 200,
        defaultSortDirection: 'desc',
        options: [
            { label: 'code1', id: 'Code 1', color: 'green' },
            { label: 'code2', id: 'Code 2', color: 'orange' },
            { label: 'code3', id: 'Code 3', color: 'brown' },
        ],
    },
    {
        id: 'multiSelect',
        displayAsText: 'Multi-select',
        display: <span style={{ color: 'red' }}>Code</span>,
        schema: 'select',
        isSortable: true,
        width: 200,
        defaultSortDirection: 'desc',
        options: [
            { label: 'code1', id: 'Code 1', color: 'green' },
            { label: 'code2', id: 'Code 2', color: 'orange' },
            { label: 'code3', id: 'Code 3', color: 'brown' },
        ],
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
        id: 'string',
        width: 200,
        displayAsText: 'String',
    },
    {
        id: 'link',
        schema: 'link',
        displayAsText: 'Link',
        width: 200,
    },
    {
        id: 'json',
        schema: 'json',
        displayAsText: 'JSON',
        width: 200,
    },
];

function generateUser(index)
{
    return {
        numeric: index,
        currency: faker.datatype.number() * 1000,
        datetime: faker.date.future(),
        date: faker.date.past(),
        boolean: faker.datatype.boolean(),
        select: String(faker.random.arrayElement(columnDefinitions.find(item => item.id === 'select')?.options?.map(item => item.id))),
        multiSelect: faker.random.arrayElements(columnDefinitions.find(item => item.id === 'multiSelect')?.options?.map(item => item.id)),
        chart: {
            labels: ['0s', '10s', '20s', '40s', '50s', '60s'],
            datasets: [{
                data: [0, 59, 75, 20, 20, 55, 40],
            }],
        },
        string: faker.lorem.sentence(),
        link: 'www.google.com',
        json: { 'field1': 'value1', 'field2': 'value2' },
    };
}

function genData(count)
{
    const result = [];
    for (var i = 0; i < count; i++)
    {
        result.push(generateUser(i));
    }
    return result;
}

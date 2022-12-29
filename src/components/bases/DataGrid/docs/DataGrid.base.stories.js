import React, { useEffect, useState } from 'react';
import faker from 'faker';
import moment from 'moment';

import DataGrid from 'components/bases/DataGrid/DataGrid';
import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { Paging } from 'components/bases/Paging/Paging';
import { DATA_TYPE, isFilterActive } from 'helper/data.helper';
import { Col2 } from 'components/bases/Layout/Column';
import { Row2 } from 'components/bases/Layout/Row';
import { Button } from 'components/bases/Button/Button';
import { AppBody } from 'components/bases/AppBody';
import { StoryDoc } from 'components/story/blocks';

import docs from './DataGrid.docs.mdx';
import changelog from './DataGrid.changelog.md';

export default {
    title: 'Display/DataGrid',
    component: DataGrid,
    decorators: [(Story) => <div style={{ width: '100vw', height: '100vh', margin: '-1rem' }}><AppBody><Story /></AppBody></div>],
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

export function Default()
{
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [columns, setColumns] = useState([{ id: 'code', direction: 'asc' }]);
    const [searchKey, setSearchKey] = useState();
    const [conds, setConds] = useState([]);

    useEffect(() =>
    {
        fetchUsers(pageIndex, pageSize, columns, searchKey, conds).then((value) => setItems(value));
    }, [columns, searchKey, pageIndex, pageSize, conds]);

    useEffect(() =>
    {
        fetchUsersSize().then((total) => setTotal(total));
    }, []);

    const actionsColumn = {
        id: 'guid',
        headerCellRender: <span>Actions</span>,
        width: 100,
        freezeEnd: true,
        rowCellRender: function ActionsField(row, index)
        {
            return (
                <Row2
                    gap={1}
                    items='start'
                >
                    <Button
                        icon={'edit'}
                        size={'1rem'}
                        onlyIcon
                        onClick={() =>
                        {
                            console.log('Edit ' + row['guid']);
                        }}
                    />
                    <Button
                        icon={'trash-alt'}
                        size={'1rem'}
                        onlyIcon
                        onClick={() =>
                        {
                            console.log('Delete ' + row['guid']);
                        }}
                    />
                </Row2>
            );
        },
    };

    return (
        <DataGrid
            columns={userColumns}
            items={items}
            rowClassName={(row, index) => row.status === 2 ? 'disabled' : ''}
            sorting={{ columns, onSort: setColumns, isSingleSort: false }}
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
            searching={{
                searchKey,
                onSearch: setSearchKey,
            }}
            filter={{
                conditions: conds,
                onChange: setConds,
            }}
            total={total}
            rowKey={'guid'}
            trailingControlColumns={[actionsColumn]}
            selectRows={{
                onChange: () =>
                {
                },
                onChangeAll: () =>
                {
                },
            }}
            summary={{ stick: true }}
            rowNumber
        />
    );
}

export function PaginationOutside()
{
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() =>
    {
        fetchUsersSize().then((total) => setTotal(total));
    }, []);

    const pageSizeOptions = [10, 20, 50, 100, 200];
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() =>
    {
        fetchUsers(pageIndex, pageSize).then((value) => setItems(value));
    }, [pageIndex, pageSize]);

    const selectOptions = pageSizeOptions.map((pageSize) => ({
        id: pageSize,
        label: `${pageSize} rows`,
    })) || [];

    return (
        <Col2>
            <AdvanceSelect
                options={selectOptions}
                width={200}
                value={pageSize}
                onChange={setPageSize}
            />
            <DataGrid
                items={items}
                columns={userColumns}
                rowKey={'guid'}
            />
            <Paging
                total={total}
                pageSize={pageSize}
                currentPage={pageIndex}
                onChange={setPageIndex}
            />
        </Col2>
    );
}

async function fetchUsers(pageIndex = 1, pageSize = 10, sortColumns = [], searchKey = '', conds = [])
{
    const start = (pageIndex - 1) * pageSize;
    const end = pageIndex * pageSize;

    let res = users;

    if (searchKey)
    {
        res = res.filter(item => item.name.toLowerCase().includes(searchKey.toLowerCase()));
    }

    if (conds && conds.length > 0)
    {
        conds.forEach((cond) =>
        {
            if (!isFilterActive(cond))
            {
                return;
            }

            switch (cond.dataType)
            {
                case DATA_TYPE.integer:
                    res = res.filter((item) => compareInt(item[cond.columnName], cond.value, cond.operator));
                    break;
                case DATA_TYPE.string:
                    res = res.filter((item) =>
                    {
                        if (cond.operator === '=')
                        {
                            return item[cond.columnName] === cond.value;
                        }
                        if (cond.operator === 'like')
                        {
                            return String(item[cond.columnName]).includes(cond.value);
                        }
                        return ((cond.operator === 'is null' && item[cond.columnName] === '') || (cond.operator === 'is not null' && item[cond.columnName] !== ''));
                    });
                    break;
                case DATA_TYPE.boolean:
                    res = res.filter((item) =>
                    {
                        if (cond.operator === '=')
                        {
                            return !(Boolean(item[cond.columnName]) ^ Boolean(cond.value));
                        }
                        return true;
                    });
                    break;
                case DATA_TYPE.datetime:
                    res = res.filter((item) => compareDateTime(item[cond.columnName], cond.value, cond.operator));
                    break;
                case DATA_TYPE.array:
                    res = res.filter((item) =>
                    {
                        if (cond.operator === '=')
                        {
                            return item[cond.columnName] === cond.value;
                        }
                        return true;
                    });
                    break;
                default:
            }
        });
    }

    for (const sortCol of sortColumns)
    {
        res = res.sort((a, b) => sortCol.direction === 'asc' ? a[sortCol.id] - b[sortCol.id] : b[sortCol.id] - a[sortCol.id]);
    }

    return res.slice(start, end);
}

async function fetchUsersSize()
{
    return users.length;
}

function generateUser()
{
    return {
        name: faker.name.firstName('male'),
        code: faker.datatype.number(),
        guid: faker.datatype.uuid(),
        active: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        spentUSD: faker.datatype.number() * 99,
        spentVND: faker.datatype.number() * 1000,
        randomNumber: faker.datatype.number() + 0.888,
        randomNumberVN: faker.datatype.number() + 0.888,
        hideCol: 'Can you see me?',
        friendsWith: { name: faker.name.firstName('male') },
        avatar: 'https://lh3.googleusercontent.com/3AR-aNzNNccbrZISzgOF-ywpNm1qbD2tV6fmXcYV_-1ZV3w9xFjGmrqXzolelqr8SFO8iYtgunKHoXn506n15Qmb6A=w128-h128-e365-rj-sc0x00ffffff',
        profile: 'https://www.google.com',
        status: Math.floor(Math.random() * Math.floor(3)),
        location: 'Ho Chi Minh',
        cities: ['Ho Chi Minh', 'Ha Noi'],
    };
}

function compareInt(x, y, operator)
{
    if (operator === 'between')
    {
        const x_int = parseInt(x);
        const values = y.split('AND');
        if (values.length < 3)
        {
            return;
        }

        const y1_int = parseInt(values[0].trim());
        const y2_int = parseInt(values[1].trim());

        if (isNaN(y1_int) || isNaN(y2_int) || isNaN(x_int))
        {
            return true;
        }
        return ((y1_int <= x_int && x_int <= y2_int) || (y2_int <= x_int && x_int <= y1_int));
    }

    const x_int = parseInt(x);
    const y_int = parseInt(y);
    if (isNaN(x_int) || isNaN(y_int))
    {
        return true;
    }
    switch (operator)
    {
        case '=':
            return x_int === y_int;
        case '>':
            return x_int > y_int;
        case '<':
            return x_int < y_int;
        case '>=':
            return x_int >= y_int;
        case '<=':
            return x_int <= y_int;
    }
    return true;
}

function compareDateTime(x, y, operator)
{
    if (operator === 'between')
    {
        const x_m = moment(x);
        const values = y.split('AND');
        if (values.length < 3)
        {
            return;
        }

        const y1_m = moment(values[0].trim());
        const y2_m = moment(values[1].trim());

        return ((y1_m.isSameOrBefore(x_m) && x_m.isSameOrBefore(y2_m)) || (y2_m.isSameOrBefore(x_m) && x_m.isSameOrBefore(y1_m)));
    }

    const x_int = moment(x);
    const y_int = moment(y);
    switch (operator)
    {
        case '=':
            return x_int.isSame(y_int, 'day');
        case '>':
            return x_int.isAfter(y_int);
        case '<':
            return x_int.isBefore(y_int);
        case '>=':
            return x_int.isSameOrAfter(y_int);
        case '<=':
            return x_int.isSameOrBefore(y_int);
    }
    return true;
}

const users = [];

for (let i = 0; i < 110; i++)
{
    users.push(generateUser());
}

const userColumns = [
    {
        id: 'guid',
        displayAsText: 'GUID',
        width: 120,
        hidden: true,
    },
    {
        id: 'name',
        displayAsText: 'Name',
        width: 120,
        freeze: true,
    },
    {
        id: 'code',
        displayAsText: 'Code',
        display: <span style={{ color: 'red' }}>Code</span>,
        isSortable: true,
        defaultSortDirection: 'desc',
        width: 100,
    },
    {
        id: 'active',
        displayAsText: 'Active',
        schema: 'boolean',
        isSortable: true,
        width: 100,
    },
    {
        id: 'createdAt',
        displayAsText: 'HH:mm',
        schema: 'datetime',
        isSortable: true,
        format: 'HH:mm',
        width: 100,
    },
    {
        id: 'spentUSD',
        displayAsText: 'Spent USD',
        isSortable: true,
        schema: 'currency',
        locale: 'vi',
        // locale: 'en',
        width: 100,
        summary: {
            formula: 'sum',
        },
    },
    {
        id: 'spentVND',
        displayAsText: 'Spent VND',
        schema: 'currency',
        locale: 'vi',
        width: 100,
    },
    {
        id: 'randomNumber',
        displayAsText: 'Format #',
        schema: 'numeric',
        width: 100,
    },
    {
        id: 'randomNumberVN',
        displayAsText: 'Format #,##',
        schema: 'numeric',
        format: '#,##',
        width: 100,
    },
    {
        id: 'friendsWith',
        displayAsText: 'Friends With',
        schema: 'json',
        width: 150,
    },
    {
        id: 'hideCol',
        displayAsText: 'Hide Col',
        schema: 'string',
        width: 150,
        hidden: true,
    },
    {
        id: 'avatar',
        schema: 'image',
        displayAsText: 'Avatar',
        width: 100,
    },
    {
        id: 'profile',
        schema: 'link',
        displayAsText: 'Profile',
        width: 150,
    },
    {
        id: 'status',
        displayAsText: 'Status',
        schema: 'select',
        options: [
            { id: 0, label: 'offline', color: 'grey' },
            { id: 1, label: 'online', color: 'green' },
            { id: 2, label: 'busy', color: 'red' },
        ],
        width: 100,
    },
    {
        id: 'cities',
        displayAsText: 'Cities',
        schema: 'multi-select',
        options: [
            { label: 'Ho Chi Minh', id: 'Ho Chi Minh', color: 'green' },
            { label: 'Ha Noi', id: 'Ha Noi', color: 'orange' },
            { label: 'Da Nang', id: 'Da Nang', color: 'brown' },
        ],
        width: 100,
    },

];

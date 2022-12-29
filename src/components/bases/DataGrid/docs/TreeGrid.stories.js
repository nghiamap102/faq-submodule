import React, { useState, useEffect } from 'react';

import { AppBody } from 'components/bases/AppBody';
import { StoryDoc } from 'components/story/blocks';

import { TreeGrid } from '../TreeGrid';
import docs from './DataGrid.docs.mdx';
import changelog from './DataGrid.changelog.md';

export default {
    title: 'Display/DataGrid/TreeGrid',
    component: TreeGrid,
    decorators: [(Story) => <AppBody><Story /></AppBody>],
    parameters: {
        changelog,
        docs: {
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="TreeGrid"
                    componentName="TreeGrid"
                    component={TreeGrid}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
};

const columns = [
    {
        id: 'id',
        displayAsText: 'ID',
    },
    {
        id: 'type',
        displayAsText: 'Item Type',
    },
    {
        id: 'modified_at',
        displayAsText: 'Modified at',
        schema: 'datetime',
        format: 'DD/MM/YY HH:mm',
    },
    {
        id: 'test',
        displayAsText: 'Test Col',
    },
];

const initialRoot = {
    id: '1',
    label: 'root',
    children: [
        {
            id: '1.1',
            label: 'System',
            test: 'Hello',
            children: [
                {
                    id: '1.1.1',
                    label: 'External test long labellllllllllll',
                    children: [
                        {
                            id: '1.1.1.1',
                        },
                        {
                            id: '1.1.1.2',
                        },
                    ],
                },
                {
                    id: '1.1.2',
                },
            ],
        },
        {
            id: '1.2',
        },
        {
            id: '1.3',
        },
    ],
};

const Template = (args) =>
{
    const [root, setRoot] = useState(initialRoot || {});

    useEffect(() =>
    {
        setTimeout(() =>
        {
            root.children[0].children.push({
                id: '1.1.3',
                path: '/gallery',
            });
            setRoot({ ...root });
        }, 3000);

        setTimeout(() =>
        {
            root.children[0].children[0].children.push({
                id: '1.1.1.3',
                path: '/winter',
            });
            setRoot({ ...root });
        }, 3000);
    }, []);

    return (
        <TreeGrid
            {...args}
            rowKey={'id'}
            columns={columns}
            root={root}
        />
    );
};

export const Default = Template.bind({});

import { Meta, Story } from '@storybook/react';

import { Tree, TreeProps } from '../Tree';

export default {
    title: 'Display/Tree',
    component: Tree,
} as Meta;

const treeProps: TreeProps = {
    data: [
        {
            label: 'VDMS',
            value: 'vdms',
            data: [
                {
                    label: 'Tàng Thư',
                    value: 'tangthu',
                    data: [
                        {
                            label: 'Images',
                            value: 'images',
                        },
                    ],
                },
                {
                    label: 'Data',
                    value: 'data',
                    data: [
                        {
                            label: 'Videos',
                            value: 'videos',
                        },
                    ],
                },
            ],
        },
        {
            label: 'Tài liệu của tôi',
            value: 'my',
            data: [
                {
                    label: 'Images',
                    value: 'images',
                },
            ],
        },
    ],
    defaultExpandedKeys: ['my'],
    onSelect: console.log,
};

const Template: Story<TreeProps> = (args) =>
{
    return (
        <Tree {...args} />
    );
};

export const Default = Template.bind({ ...treeProps });
Default.args = { ...treeProps };

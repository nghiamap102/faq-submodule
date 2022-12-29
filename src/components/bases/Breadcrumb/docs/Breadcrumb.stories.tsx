import { Meta, Story } from '@storybook/react';

import { Breadcrumb, BreadcrumbNode, BreadcrumbProps } from '../Breadcrumb';

export default {
    title: 'Navigation/Breadcrumb',
    component: Breadcrumb,
} as Meta;

const nodes: BreadcrumbNode[] = [
    {
        id: 0,
        label: 'Level 0',
    },
    {
        id: 1,
        label: 'Level 1',
    },
    {
        id: 2,
        label: 'Level 2',
    },
];

const Template: Story<BreadcrumbProps> = (args) =>
{
    return (
        <Breadcrumb
            nodes={nodes}
            {...args}
        />
    );
};

export const Default = Template.bind({});

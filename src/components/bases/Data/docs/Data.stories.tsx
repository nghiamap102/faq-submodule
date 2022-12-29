import { Meta, Story } from '@storybook/react';

import { EmptyData } from 'components/bases/Data/EmptyData';

export default {
    title: 'Display/EmptyData',
    component: EmptyData,
    parameters: {},
    argTypes: {},
    args: {},
} as Meta;

const Template: Story = (args) =>
{
    return (
        <EmptyData />
    );
};

export const Default = Template.bind({});

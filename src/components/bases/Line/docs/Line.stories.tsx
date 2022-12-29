import { Meta, Story } from '@storybook/react';

import { Line } from '../Line';

export default {
    title: 'Layout/Line',
    component: Line,
} as Meta;

const Template: Story = (args) =>
{
    return (
        <Line {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    width: '50%',
    color: 'cyan',
    height: 3,
};

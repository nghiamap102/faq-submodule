import { Meta, Story } from '@storybook/react';

import { EmptyButton, EmptyButtonProps } from '../Button';

export default {
    title: 'Inputs/EmptyButton',
    component: EmptyButton,
    args: {
        text: 'Button',
    },
} as Meta;

const Template: Story<EmptyButtonProps> = (args) => (
    <EmptyButton {...args} />
);

export const Default = Template.bind({});
Default.args = {};

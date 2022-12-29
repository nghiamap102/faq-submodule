import { Meta, Story } from '@storybook/react';

import { Expanded, ExpandedProps } from 'components/bases/Expanded/Expanded';

export default {
    title: 'Layout/Expanded',
    component: Expanded,
} as Meta;

const Template: Story<ExpandedProps> = (args) =>
{
    return (
        <Expanded {...args}>
            Content
        </Expanded>
    );
};

export const Default = Template.bind({});

import { Meta, Story } from '@storybook/react';

import { Ul, UlProps } from 'components/bases/List/Ul';

export default {
    title: 'Display/List/Ul',
    component: Ul,
} as Meta;

const Template: Story<UlProps> = (args) =>
{
    return (
        <Ul {...args}>
            Item
        </Ul>
    );
};

export const Default = Template.bind({});

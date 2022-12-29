import { Meta, Story } from '@storybook/react';

import { TagProps, Tag } from '../Tag';

export default {
    title: 'Display/Tag',
    component: Tag,
    args: {},
} as Meta;

const Template: Story<TagProps> = (args) =>
{
    return (
        <Tag {...args} />
    );
};

export const SmallRed = Template.bind({});
SmallRed.args = {
    text: 'Put your text here',
    size: 'small',
    color: 'red',
};

export const LargeGreen = Template.bind({});
LargeGreen.args = {
    text: 'Pika pika chuuuuu',
    size: 'small',
    color: 'green',
};

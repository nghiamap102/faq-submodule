import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Li, LiProps } from 'components/bases/List/Li';

export default {
    title: 'Display/List/Li',
    component: Li,
} as Meta;

const Template: Story<LiProps> = (args) =>
{
    return (
        <Li
            {...args}
            onClick={action('onClick')}
        >
            Item
        </Li>
    );
};

export const Default = Template.bind({});

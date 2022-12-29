import { Meta, Story } from '@storybook/react';

import { NotFoundPage } from '../NotFoundPage';

export default {
    title: 'Display/NotFoundPage',
    component: NotFoundPage,
} as Meta;

const Template: Story = (args) =>
{
    return (
        <NotFoundPage />
    );
};

export const Default = Template.bind({});



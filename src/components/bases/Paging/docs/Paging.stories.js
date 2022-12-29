import React from 'react';
import { action } from '@storybook/addon-actions';


import { Paging } from 'components/bases/Paging/Paging';

export default {
    title: 'Display/Paging',
    component: Paging,
};

const Template = (args) =>
{
    return (
        <Paging
            {...args}
            onChange={action('onChange')}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    total: 100,
    currentPage: 2,
    pageSize: 20,
};

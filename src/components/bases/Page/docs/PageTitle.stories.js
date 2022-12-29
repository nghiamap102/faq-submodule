import React from 'react';

import { PageTitle } from 'components/bases/Page/PageTitle';

export default {
    title: 'Display/PageTitle',
    component: PageTitle,
};

const Template = (args) =>
{
    return (
        <PageTitle {...args}>
            Child DOM elements
        </PageTitle>
    );
};

export const Default = Template.bind({});

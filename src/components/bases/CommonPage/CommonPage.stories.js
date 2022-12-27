import React, { useState, useEffect } from 'react';

import { NotFoundPage } from 'components/bases/CommonPage/NotFoundPage';

export default {
    title: 'Bases/NotFoundPage',
    component: NotFoundPage,
}

const Template = (args) =>
{

    return (
        <NotFoundPage {...args}>
        </NotFoundPage>
    );
}

export const Default = Template.bind({});




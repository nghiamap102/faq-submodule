import React, { useState, useEffect } from 'react';

import { EmptyData } from 'components/bases/Data/EmptyData';

export default {
    title: 'Bases/Data/EmptyData',
    component: EmptyData,
    parameters: {},
    argTypes: {},
    args: {}
};

const Template = (args) =>
{
    return (
        <EmptyData {...args} />
    );
};

export const Default = Template.bind({});



import React, { useState, useEffect } from 'react';

import { DescriptionItem } from 'components/bases/Description/DescriptionItem';

export default {
    title: 'Display/DescriptionItem',
    component: DescriptionItem,
    parameters: {},
    argTypes: {},
    args: {},
};

const Template = (args) =>
{
    return (
        <DescriptionItem {...args} />
    );
};

export const Default = Template.bind({});



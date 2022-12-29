import React from 'react';

import { Status } from 'components/bases/Status/Status';

export default {
    title: 'Display/Status',
    component: Status,
    args: {},
};

const Template = (args) =>
{
    return (
        <Status {...args} />
    );
};

export const Default = Template.bind({});

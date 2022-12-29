import React from 'react';

import { ProgressBar } from 'components/bases/ProgressBar/ProgressBar';

export default {
    title: 'Display/ProgressBar',
    component: ProgressBar,
};

const Template = (args) =>
{
    return (
        <ProgressBar {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    total: 100,
    value: 50,
};

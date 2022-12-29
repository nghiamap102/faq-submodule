import React, { useState, useEffect } from 'react';

import { DialPad } from 'components/bases/DialPad/DialPad';

export default {
    title: 'Inputs/DialPad',
    component: DialPad,
};

const Template = (args) =>
{
    return <DialPad {...args} />;
};

export const Default = Template.bind({});

export const Calling = Template.bind({});
Calling.args = {
    starting: true,
    counterpart: 'Pikachu',
};

export const ActiveCall = Template.bind({});
ActiveCall.args = {
    active: true,
    counterpart: 'Songoku',
};


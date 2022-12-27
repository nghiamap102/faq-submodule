import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { AutoLogout } from 'components/bases/AutoLogout/AutoLogout';

export default {
    title: 'Bases/AutoLogout',
    component: AutoLogout,
};

const Template = (args) =>
{
    return (
        <AutoLogout {...args} />
    );
};

const onLogoutEventHandler = () =>
{
    (action('onLogout'))();
};

export const Default = Template.bind({});
Default.args = {
    minutes: 0.1,
    onLogout: onLogoutEventHandler,
    children: <div>Auto log out after 6 seconds!</div>
};



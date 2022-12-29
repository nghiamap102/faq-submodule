import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { ToolBarToggleButton } from 'components/bases/ToolBarToggleButton/ToolBarToggleButton';

export default {
    title: 'Inputs/ToolBarToggleButtonGroup/ToolBarToggleButton',
    component: ToolBarToggleButton,
};

const Template = (args) =>
{
    return (
        <ToolBarToggleButton {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    key: 'home',
    active: true,
    icon: 'tool-select',
    onClick: action('onClick'),
};

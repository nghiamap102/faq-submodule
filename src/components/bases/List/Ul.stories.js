import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { Ul } from 'components/bases/List/Ul';

export default {
    title: 'Bases/List/Ul',
    component: Ul,
};

const Template = (args) =>
{
    return (
        <Ul {...args}>
            Item
        </Ul>
    );
};

export const Default = Template.bind({});

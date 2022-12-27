import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { Li } from 'components/bases/List/Li';

export default {
    title: 'Bases/List/Li',
    component: Li,
};

const Template = (args) =>
{
    return (
        <Li
            {...args}
            onClick={action('onClick')}
        >
            Item
        </Li>
    );
};

export const Default = Template.bind({});

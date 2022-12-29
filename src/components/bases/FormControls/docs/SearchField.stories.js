import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { SearchField } from 'components/bases/FormControls/SearchField';

export default {
    title: 'Inputs/SearchField',
    component: SearchField,
};

const Template = (args) =>
{
    return (
        <SearchField
            {...args}
            onChange={action('onChange')}
        />
    );
};

export const Default = Template.bind({});

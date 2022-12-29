import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { FormField } from 'components/bases/FormField/FormField';

export default {
    title: 'Inputs/FormField',
    component: FormField,
    argTypes: {
        className: 'text',
        label: 'any',
        type: {
            control: {
                type: 'select',
                options: [
                    'vertical',
                    'horizontal',
                ],
            },
        },
    },
    args: {},
};

const Template = (args) =>
{
    return (
        <FormField {...args} />
    );
};

export const Default = Template.bind({});

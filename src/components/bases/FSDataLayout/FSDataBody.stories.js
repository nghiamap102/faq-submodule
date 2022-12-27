import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { FSDataBody } from 'components/bases/FSDataLayout/FSDataLayout';

export default {
    title: 'Bases/Layout/FSDataLayout/FSDataBody',
    component: FSDataBody,
    argTypes: {
        className: 'text',
        verticalLine: 'boolean',
        layout: 'text'
    },
    args: {}
};

const Template = (args) =>
{
    return (
        <FSDataBody {...args}>
            abc123
        </FSDataBody>
    );
};

export const Default = Template.bind({});

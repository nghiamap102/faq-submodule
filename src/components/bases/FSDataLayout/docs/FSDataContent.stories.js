import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { FSDataContent } from 'components/bases/FSDataLayout/FSDataLayout';

export default {
    title: 'Layout/FSDataLayout/FSDataContent',
    component: FSDataContent,
    argTypes: {
        className: 'text',
    },
    args: {},
};

const Template = (args) =>
{
    return (
        <FSDataContent {...args} />
    );
};

export const Default = Template.bind({});

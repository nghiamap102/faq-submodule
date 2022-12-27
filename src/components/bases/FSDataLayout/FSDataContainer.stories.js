import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { FSDataContainer } from 'components/bases/FSDataLayout/FSDataLayout';

export default {
    title: 'Bases/Layout/FSDataLayout/FSDataContainer',
    component: FSDataContainer,
    argTypes: {
        className: 'text',
    },
    args: {}
};

const Template = (args) =>
{
    return (
        <FSDataContainer {...args}>
            abc123
        </FSDataContainer>
    );
};

export const Default = Template.bind({});

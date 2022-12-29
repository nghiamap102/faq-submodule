import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { FSImage } from 'components/bases/Image/FSImage';
import altImage from 'images/map-style-boundary.png';

export default {
    title: 'Display/Image/FSImage',
    component: FSImage,
};

const Template = (args) =>
{
    // Reset event handler
    Object.keys(args).forEach((prop) =>
    {
        if (new RegExp('^on.*').test(prop))
        {
            args[prop] = action(prop + '');
        }
    });

    return (
        <FSImage {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    src: altImage,
};

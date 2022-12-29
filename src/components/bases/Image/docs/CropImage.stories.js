import React, { useState, useEffect } from 'react';

import { CropImage } from 'components/bases/Image/CropImage';
import altImage from 'images/map-style-boundary.png';

export default {
    title: 'Display/Image/CropImage',
    component: CropImage,
};

const Template = (args) =>
{
    return (
        <CropImage {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    imageData: altImage,
    box: {
        x: 50,
        y: 50,
        width: 200,
        height: 200,
    },
};

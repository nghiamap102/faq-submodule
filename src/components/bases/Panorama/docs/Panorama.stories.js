import React, { useState, useEffect } from 'react';

import { Panorama } from 'components/bases/Panorama/Panorama';
import srcImage from 'images/map-style-boundary.png';

export default {
    title: 'Display/Panorama',
    component: Panorama,
};

const Template = (args) =>
{
    return (
        <Panorama {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    img: srcImage,
    width: '100%',
    height: '100%',
};

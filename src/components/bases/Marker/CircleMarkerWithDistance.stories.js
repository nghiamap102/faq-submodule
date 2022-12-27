import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { CircleMarkerWithDistance } from 'components/bases/Marker/CircleMarkerWithDistance';

export default {
    title: 'Bases/Map/Marker/CircleMarkerWithDistance',
    component: CircleMarkerWithDistance,
};

const Template = (args) =>
{
    return (
        <CircleMarkerWithDistance
            {...args}
            onClick={action('onClick')}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    color: 'cyan',
    backgroundColor: 'lime',
};

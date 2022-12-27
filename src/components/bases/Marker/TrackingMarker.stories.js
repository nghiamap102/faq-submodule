import React from 'react';

import { TrackingMarker } from 'components/bases/Marker/TrackingMarker';

export default {
    title: 'Bases/Map/Marker/TrackingMarker',
    component: TrackingMarker,
};

const Template = (args) =>
{
    return (
        <TrackingMarker {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    icon: 'camera',
    size: 50,
    color: 'green',
    backgroundColor: 'rgb(48, 48, 48)',
    heading: 90,
};

export const WithTitle = Template.bind({});
WithTitle.args = {
    icon: 'car',
    size: 200,
    color: 'red',
    backgroundColor: 'rgb(48, 48, 48)',
    heading: 90,
    title: 'This can be a React node',
    isShowLabel: true,
};



import React from 'react';

import { CircleMarker } from 'components/bases/Marker/CircleMarker';
import { TrackingMarker } from 'components/bases/Marker/TrackingMarker';
import { WindowScreen } from 'components/bases/WindowScreen/WindowScreen';
import { WindowPopup } from 'components/bases/WindowScreen/WindowPopup';

export default {
    title: 'Layout/Window',
    component: WindowScreen,
};

const Template = (args) =>
{
    return (
        <WindowScreen {...args} />
    );
};

export const Default = Template.bind({});

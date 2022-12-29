import React from 'react';

import { Map } from 'components/bases/Map/Map';

export default {
    title: 'Display/Map',
    component: Map,
};

const Template = (args) =>
{
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Map
                center={{ lng: 106.6029738547868, lat: 10.754634350198572 }}
                zoomLevel={[12.5]}
                showLocateControl={{ autoLocate: true }}
                isMainMap
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {};

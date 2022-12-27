import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Marker as MapMarker } from 'react-mapbox-gl';

import { FAIcon } from '@vbd/vui';

class ModifyMarker extends Component
{
    dataStore = this.props.dataStore;

    render()
    {
        const location = this.dataStore.location || [0, 0];

        return (
            <MapMarker
                coordinates={[location[0], location[1]]}
                anchor="bottom"
            >
                <FAIcon
                    icon='map-marker-alt'
                    color='red'
                    type='solid'
                    size='18pt'
                />
            </MapMarker>
        );
    }
}

ModifyMarker = inject('appStore')(observer(ModifyMarker));
export default ModifyMarker;

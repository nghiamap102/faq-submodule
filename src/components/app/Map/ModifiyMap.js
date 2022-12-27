import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Map } from '@vbd/vui';

import ModifyMarker from 'components/app/Map/ModifiyMarker';

class ModifyMap extends Component
{
    mapStore = this.props.appStore.mapStore;
    dataStore = this.props.dataStore;

    state = {
        coordinates: this.dataStore.getLocation(),
    };

    handleChangeLocation = async (map) =>
    {
        if (typeof this.dataStore.setLocation === 'function')
        {
            this.dataStore.setLocation([map.transform.center.lng, map.transform.center.lat]);
        }
    };

    render()
    {
        return (
            <Map
                style={this.mapStore.defaultStyle}
                center={{
                    lng: this.state.coordinates[0],
                    lat: this.state.coordinates[1],
                }}
                zoomLevel={[12.5]}
                height='300px'
                isNotControl
                onRender={this.handleChangeLocation}
            >
                <ModifyMarker dataStore={this.dataStore}/>
            </Map>
        );
    }
}

ModifyMap = inject('appStore')(observer(ModifyMap));
export { ModifyMap };

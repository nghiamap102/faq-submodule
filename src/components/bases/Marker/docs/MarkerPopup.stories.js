import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { TrackingMarker } from 'components/bases/Marker/TrackingMarker';
import { CircleMarker } from 'components/bases/Marker/CircleMarker';
import { Marker } from 'react-mapbox-gl';

export default {
    title: 'Map/Marker/TrackingMarker',
    component: TrackingMarker,
    args: {},
};

const marker = {
    id: 1,
    lng: '121',
    lat: '121',
    size: 30,
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
        <>
            <Marker
                key={marker.id}
                coordinates={[marker.lng, marker.lat]}
                offset={[0, (marker.size || 48) / 2]}
                anchor="bottom"
            >
                {
                    marker.type === 'tracking'
                        ? (
                                <TrackingMarker
                                    {...marker}
                                    isShowLabel={this.props.appStore.layerStore.isShowLabel}
                                />
                            )
                        : <CircleMarker {...marker} />
                }
            </Marker>
        </>
    );
};

export const Default = Template.bind({});

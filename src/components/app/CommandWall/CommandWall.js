import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Map,
    WindowScreen,
    Image,
} from '@vbd/vui';

import MarkerManager from 'components/app/MapManager/MarkerManager';
import MarkerPopupManager from 'components/app/MapManager/MarkerPopupManager';
import WindowPopupManager from 'components/app/WindowScreen/WindowPopupManager';

class CommandWall extends Component
{
    appStore = this.props.appStore;

    constructor(props)
    {
        super(props);

        this.appStore.markerStore.add({
            id: 'plus',
            icon: 'plus',
            isNotify: true,
            lng: 106.667289,
            lat: 10.7803602,
            onClick: this.onMarkerClicked,
        });

        this.appStore.markerStore.add({
            id: 'trash',
            icon: 'trash',
            isNotify: false,
            lng: 106.567289,
            lat: 10.7803602,
            onClick: (event) =>
            {
                const store = this.appStore.markerPopupStore;
                store.setStates('isActivate', false);
                const popup = store.getPopup(event.id);
                if (!popup)
                {
                    store.add({
                        id: event.id,
                        title: 'Test title',
                        content: <Image
                            alt="test alt"
                            src="/ios-icon.png"
                            height="400px"
                            width="200px"
                        />,
                        lng: 106.567289,
                        lat: 10.7803602,
                        height: 230,
                        width: 200,
                        isActivate: true,
                        isNotFixed: true,
                        onFocus: this.onMarkerPopupFocus,
                        onClose: this.onMarkerPopupClose,
                    });
                }
                else
                {
                    store.setState(event.id, 'isActivate', true);
                }
            },
        });

        this.appStore.markerStore.add({
            id: 'edit',
            icon: 'edit',
            isNotify: false,
            lng: 106.167289,
            lat: 10.3803602,
            onClick: (event) =>
            {
                const store = this.appStore.markerPopupStore;
                store.setStates('isActivate', false);
                const popup = store.getPopup(event.id);
                if (!popup)
                {
                    store.add({
                        id: event.id,
                        title: 'Test edit',
                        content: <Image
                            alt="test alt"
                            src="/ios-icon.png"
                            height="400px"
                            width="200px"
                        />,
                        lng: 106.167289,
                        lat: 10.3803602,
                        height: 230,
                        width: 200,
                        isActivate: true,
                        onFocus: this.onMarkerPopupFocus,
                        onClose: this.onMarkerPopupClose,
                    });
                }
                else
                {
                    store.setState(event.id, 'isActivate', true);
                }
            },
        });

        this.appStore.markerStore.add({
            id: 'times',
            icon: 'times',
            isNotify: false,
            lng: 106.267289,
            lat: 10.5803602,
            onClick: (event) =>
            {
                const store = this.appStore.markerPopupStore;
                store.setStates('isActivate', false);
                const popup = store.getPopup(event.id);
                if (!popup)
                {
                    store.add({
                        id: event.id,
                        title: 'Test times',
                        content: <Image
                            alt="test alt"
                            src="/ios-icon.png"
                            height="400px"
                            width="200px"
                        />,
                        lng: 106.267289,
                        lat: 10.5803602,
                        height: 230,
                        width: 200,
                        isActivate: true,
                        isNotFixed: true,
                        onFocus: this.onMarkerPopupFocus,
                        onClose: this.onMarkerPopupClose,
                    });
                }
                else
                {
                    store.setState(event.id, 'isActivate', true);
                }
            },
        });
    }

    onMarkerClicked = (event) =>
    {
        this.appStore.popupStore.setStates('isActivate', false);
        const popup = this.appStore.popupStore.getPopup(event.id);

        if (!popup)
        {
            this.appStore.popupStore.add({
                id: event.id,
                title: 'title of ' + event.id,
                content: 'content of ' + event.id,
                isActivate: true,
                onClose: this.onWindowPopupClose,
                onFocus: this.onWindowPopupFocus,
            });
        }
        else
        {
            this.appStore.popupStore.setState(event.id, 'isActivate', true);
        }
    };

    onMarkerPopupFocus = (event) =>
    {
        const store = this.appStore.markerPopupStore;
        store.setStates('isActivate', false);
        store.setState(event.id, 'isActivate', true);
    };

    onMarkerPopupClose = (event) =>
    {
        const store = this.appStore.markerPopupStore;
        store.remove(event.id);
    };

    onWindowPopupFocus = (event) =>
    {
        this.appStore.popupStore.setStates('isActivate', false);
        this.appStore.popupStore.setState(event.id, 'isActivate', true);
    };

    onWindowPopupClose = (event) =>
    {
        this.appStore.popupStore.remove(event.id);
    };

    render()
    {
        return (
            <WindowScreen>
                <Map
                    center={{ lng: 106.667289, lat: 10.7803602 }}
                    zoomLevel={[12.5]}
                    mode={'dark'}
                >
                    <MarkerManager />
                    <MarkerPopupManager autoArrange />
                </Map>
                <WindowPopupManager />
            </WindowScreen>
        );
    }
}

CommandWall = inject('appStore')(observer(CommandWall));
export default CommandWall;

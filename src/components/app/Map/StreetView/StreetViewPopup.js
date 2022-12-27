import './StreetView.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Popup } from '@vbd/vui';

import MiniMap from './MiniMap/MiniMap';
import StreetView from './StreetView';

export default class StreetViewPopup extends Component
{
    streetViewStore = this.props.appStore.streetViewStore;

    render()
    {
        const { handleCloseStreetView, active } = this.streetViewStore;

        return (
            active && (
                <Popup
                    width={'90vw'}
                    height={'90vh'}
                    title={'Chế độ xem phố'}
                    className={'street-view-popup'}
                    padding={'0'}
                    onClose={handleCloseStreetView}
                >
                    <StreetView />
                    <MiniMap />
                </Popup>
            )
        );
    }
}

StreetViewPopup = inject('appStore')(observer(StreetViewPopup));
export { StreetViewPopup };

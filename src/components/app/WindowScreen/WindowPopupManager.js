import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { WindowPopup } from '@vbd/vui';

class WindowPopupManager extends Component
{
    render()
    {
        return (
            this.props.appStore.popupStore.popups.map((windowPopup) =>
            {
                return (
                    windowPopup.type === 'window' && (
                        <WindowPopup
                            key={windowPopup.id}
                            {...windowPopup}
                        />
                    )
                );
            })
        );
    }
}

WindowPopupManager = inject('appStore')(observer(WindowPopupManager));
export default WindowPopupManager;

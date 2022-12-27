import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Popup } from '@vbd/vui';

class PopupNormalManager extends Component
{
    render()
    {
        return (
            this.props.appStore.popupStore.popups.map((popup) =>
            {
                return (
                    popup.type === 'normal' &&
                    <Popup
                        key={popup.id}
                        {...popup}
                    >
                        {popup.content}
                    </Popup>
                );
            })
        );
    }
}

PopupNormalManager = inject('appStore')(observer(PopupNormalManager));
export default PopupNormalManager;

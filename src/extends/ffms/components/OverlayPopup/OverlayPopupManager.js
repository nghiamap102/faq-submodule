import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Popup, PopupFooter } from '@vbd/vui';
class OverlayPopupManager extends Component
{
    render()
    {
        return (
            this.props.fieldForceStore.overlayPopupStore.popups.map((overlayPopup) =>
            {
                const { footer, ...restProps } = overlayPopup;
                return (
                    <Popup
                        key={restProps.id}
                        title={restProps.title}
                        onClose={() =>
                        {
                            this.props.fieldForceStore.overlayPopupStore.remove(overlayPopup.id);
                            restProps.onClose && restProps.onClose();
                        }}
                        {...restProps}
                    >
                        {restProps.content}
                        {
                            footer && <PopupFooter>{footer}</PopupFooter>
                        }
                    </Popup>
                );
            })
        );
    }
}

OverlayPopupManager = inject('fieldForceStore')(observer(OverlayPopupManager));
export default OverlayPopupManager;

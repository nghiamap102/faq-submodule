import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { T } from '@vbd/vui';

class AddressText extends Component
{
    render()
    {
        const addressText = this.props.appStore.directionStore.getAddressText(this.props.code, this.props.appStore.directionStore.language.code);

        return (
            <span>
                <T>{addressText}</T>
            </span>
        );
    }
}

AddressText = inject('appStore')(observer(AddressText));
export { AddressText };

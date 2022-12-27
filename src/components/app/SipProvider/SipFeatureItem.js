import './SipFeatureItem.scss';

import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { FAIcon } from '@vbd/vui';

import { SIP_STATUS, SipStoreContext } from 'components/app/stores/SipStore';

export class SipFeatureItem extends Component
{
    getSipStatusColor()
    {
        switch (this.context.sipStatus)
        {
            default:
            case SIP_STATUS.DISCONNECTED:
                return '#5E5E5E';
            case SIP_STATUS.CONNECTING:
                return 'yellow';
            case SIP_STATUS.CONNECTED:
                return '#0F93EF';
            case SIP_STATUS.REGISTERED:
                return '#79e479';
            case SIP_STATUS.ERROR:
                return '#E83030';
        }
    }

    handleClick = () =>
    {
        this.context.visible = true;
    };

    render()
    {
        return (
            <button
                className={'feature-item'}
                onClick={this.handleClick}
            >
                <FAIcon
                    icon={'phone'}
                    type={'light'}
                    color="white"
                    size={'24px'}
                />
                <FAIcon
                    className={'sfi-status'}
                    icon={'circle'}
                    type={'solid'}
                    size={'14px'}
                    color={this.getSipStatusColor()}
                />
            </button>
        );
    }
}

SipFeatureItem.contextType = SipStoreContext;

SipFeatureItem = observer(SipFeatureItem);

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { PanelBody, PanelHeader } from '@vbd/vui';

import { AppConstant } from 'constant/app-constant';

export class ChatPanel extends Component
{
    chatUrl = AppConstant.chat.url;

    incidentStore = this.props.appStore.incidentStore;
    featureBarStore = this.props.appStore.featureBarStore;

    getUrl = () =>
    {
        let url = this.chatUrl;

        if (this.incidentStore.incident)
        {
            url += `/channels/ics-${this.incidentStore.incident.headerInfo.incidentId}`;
        }

        return url;
    };

    handleClose = () =>
    {
        this.featureBarStore.showChat = false;
    };

    handleOpen = () =>
    {
        window.open(this.getUrl());
    };

    render()
    {
        const url = this.getUrl();

        return (
            <>
                <PanelHeader
                    actions={[
                        { icon: 'external-link', onClick: this.handleOpen },
                        { icon: 'times', onClick: this.handleClose },
                    ]}
                >
                    Kênh liên lạc
                </PanelHeader>

                <PanelBody>
                    <iframe
                        src={url}
                        frameBorder="0"
                        width={'100%'}
                        height={'100%'}
                        title={'Chat Box'}
                    />
                </PanelBody>
            </>
        );
    }
}

ChatPanel = inject('appStore')(observer(ChatPanel));
export default ChatPanel;

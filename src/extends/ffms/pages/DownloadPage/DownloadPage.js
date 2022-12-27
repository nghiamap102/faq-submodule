import React, { Component } from 'react';
import { inject, observer, Provider } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {
    withI18n,
    withModal,
    withTenant,
} from '@vbd/vui';

export class DownloadFFMS extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            OS: '',
        };
    }

    async componentDidMount()
    {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let os = '';

        if (
            userAgent.match(/iPad/i) ||
            userAgent.match(/iPhone/i) ||
            userAgent.match(/iPod/i)
        )
        {
            os = 'ios';
        }
        else if (navigator.userAgent.match(/Windows/i))
        {
            os = 'window';
        }
        else if (userAgent.match(/Android/i))
        {
            os = 'android';
        }
        else
        {
            os = '';
        }

        this.setState({ OS: os });
    }


    render()
    {
        const { OS } = this.state;
        if (OS === 'android')
        {
            console.log(OS);
            window.location = 'https://play.google.com/store/apps/details?id=com.google.android.youtube&hl=vi&gl=US';
        }

        if (OS === 'ios')
        {
            console.log(OS);
            window.location = 'https://apps.apple.com/vn/app/youtube/id544007664?l=vi';
        }

        return (
            <Provider fieldForceStore={this.fieldForceStore}>
                {/* {OS} */}
            </Provider>
        );
    }
}

DownloadFFMS = inject('appStore')(observer(DownloadFFMS));
DownloadFFMS = withTenant(withModal(withI18n(withRouter(DownloadFFMS))));

export default DownloadFFMS;

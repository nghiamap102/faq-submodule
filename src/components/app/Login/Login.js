import './Login.scss';

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Loading } from '@vbd/vui';

class Login extends Component
{
    appStore = this.props.appStore;

    state = {
        profile: null,
    };

    componentDidMount()
    {
        this.appStore.loadProfile().then((profile) =>
        {
            if (!profile || Object.keys(profile).length === 0)
            {
                window.location.href = '/auth/vietbando' + window.location.search;
            }
            else
            {
                this.setState({ profile });
            }
        });

    }

    render()
    {
        const { profile } = this.state;

        return (
            profile && Object.keys(profile).length > 0
                ? <Redirect to={'/'} />
                : <Loading fullscreen />
        );
    }
}

Login = inject('appStore')(observer(Login));
export { Login };

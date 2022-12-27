import './UnauthorizedPage.scss';

import React, { Component } from 'react';
import { inject, observer, Provider } from 'mobx-react';

import { HD1, Sub1, Button, Row, Column } from '@vbd/vui';

export class UnauthorizedPage extends Component
{
    appStore = this.props.appStore;

    handleLogout = () =>
    {
        this.appStore.removeProfile();
        localStorage.clear();
        window.location.href = `/auth/logout?redirect_uri=${window.location.origin}/auth/vietbando`;
    }
    render()
    {
        return (
            <Provider>
                <Row crossAxisAlignment="center" className="unauthorized-page">
                    <Column
                        crossAxisAlignment='center'
                        mainAxisSize='min'
                    >
                        <Row
                            mainAxisSize={'min'}
                            crossAxisSize={'min'}
                            itemMargin={'lg'}
                            crossAxisAlignment={'center'}
                        >
                            <HD1>401</HD1>
                            <Sub1>Không có quyền truy cập</Sub1>
                        </Row>
                        <Row
                            itemMargin={'lg'}
                            crossAxisAlignment={'start'}
                        >
                            <Button
                                text={'Đăng xuất'}
                                color={'primary-color'}
                                onClick={this.handleLogout}
                            />
                        </Row>
                    </Column>
                </Row>
            </Provider>
        );
    }
}

UnauthorizedPage = inject('appStore')(observer(UnauthorizedPage));
export default UnauthorizedPage;


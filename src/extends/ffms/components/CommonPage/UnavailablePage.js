import './UnavailablePage.scss';

import React, { Component } from 'react';
import { inject, observer, Provider } from 'mobx-react';

import { HD2, HD3, Row, Button, Line, Column } from '@vbd/vui';

export class UnavailablePage extends Component
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
                <Row crossAxisAlignment="center" className={'unavailable-site-page'}>
                    <Column crossAxisAlignment="center">
                        <Column
                            mainAxisSize={'min'}
                            crossAxisSize={'min'}
                            itemMargin={'lg'}
                            crossAxisAlignment={'center'}
                        >
                            <HD2>Không hợp lệ</HD2>
                            <Line
                                color={'var(--border)'}
                                width={'100%'}
                            />
                            <HD3>Công ty không tồn tại</HD3>
                        </Column>
                        <Row
                            itemMargin={'lg'}
                            crossAxisAlignment={'start'}
                        >
                            <Button
                                icon={'life-ring'}
                                text={'Hỗ trợ'}
                                type={'default'}
                                tooltip={'Liên hệ tư vấn viên'}
                            />
                        </Row>
                    </Column>
                </Row>
            </Provider>
        );
    }
}

UnavailablePage = inject('appStore')(observer(UnavailablePage));
export default UnavailablePage;


import './NewUserManager.scss';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { Container, Column, Button, HD3, withTenant } from '@vbd/vui';
export class WelcomePage extends Component
{
    render()
    {
        return (
            <Container className={'welcome-page'}>
                <Column
                    itemMargin={'md'}
                    crossAxisAlignment={'center'}
                    mainAxisAlignment={'center'}
                >
                    <HD3>Tạo tài khoản thành công</HD3>
                    <Container>
                        <Button
                            icon={'sign-in-alt'}
                            iconSize={'2rem'}
                            iconLocation={'right'}
                            text={'Về trang chủ'}
                            color={'primary-color'}
                            onClick={() =>
                                (window.location.href = this.props.tenantConfig?.home)
                            }
                        />
                    </Container>
                </Column>
            </Container>
        );
    }
}

WelcomePage = inject('appStore')(observer(WelcomePage));
WelcomePage = withTenant(withRouter(WelcomePage));
export default WelcomePage;

import './NewUserManager.scss';
import React, { Component } from 'react';
import { inject, observer, Provider } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {
    Container, Panel, PanelHeader, PanelBody, PanelFooter,
    HD3, Link, Spacer,
    T, withI18n, withModal, withTenant,
} from '@vbd/vui';

import UserService from 'extends/ffms/services/UserService';
import NewAccountForm from 'extends/ffms/views/NewAccountForm/NewAccountForm';

export class NewUserManager extends Component
{
    
    constructor(props)
    {
        super(props);

        this.userSvc = new UserService(this.props.fieldForceStore?.appStore?.contexts);
    }
    
    createNewUserManager = (inviteCode, userInfo) =>
    {
        this.userSvc.checkInviteCode(inviteCode).then((isValidCode) =>
        {
            if (!isValidCode)
            {
                this.setState({
                    isValidCode: isValidCode,
                });
                return;
            }
            return this.userSvc
                .registerUserByInviteCode(inviteCode, userInfo)
                .then((data) =>
                {
                    if (data.result === 0)
                    {
                        this.props.toast({
                            type: 'success',
                            message: 'Tạo tài khoản mới thành công',
                        });

                        const path = this.props.match.path.split('/');
                        const newPath = ['', path[1], 'welcome'].join('/');
                        this.props.history.push(newPath);

                        return data;
                    }
                    else
                    {
                        let mess = '';
                        if (data.result === -2)
                        {
                            mess = data.errorMessage;
                        }
                        else
                        {
                            mess = data.message;
                        }

                        this.props.toast({
                            type: 'error',
                            message: `${this.props.t('Tạo tài khoản không thành công')}. ${this.props.t('Chi tiết')}: ${this.props.t(mess)}`, timeout: 999999,
                        });
                        return null;
                    }
                });
        });
    };

    handleCreateUser = async (newUser) =>
    {
        const { inviteCode } = this.state;
        await this.createNewUserManager(inviteCode, newUser);
    };

    handleLogin = () =>
    {
        window.location.href = this.props.tenantConfig?.home;
    };

    handleValidateUserName = (value) =>
    {
        const { inviteCode } = this.state;
        return this.userSvc.checkIfUserNameExistsByInviteCode(inviteCode, value);
    };

    handleValidateEmail = (value) =>
    {
        const { inviteCode } = this.state;
        return this.userSvc.checkIfEmailExistsByInviteCode(inviteCode, value);
    }

    render()
    {
        return (
            <Container className={'register-page'}>
                <HD3>
                    { this.props.t('Chào mừng bạn đến với %0%', [this.props.tenantConfig.title]) }
                </HD3>
                <Panel className={'theme-light register'}>
                    <PanelHeader>Đăng ký tài khoản mới</PanelHeader>
                    <PanelBody className={'register-form'}>
                        <NewAccountForm
                            data={this.props.data}
                            controls={{ ...this.props.data?.type === 'Worker' && { email: { editable: false } } }}
                            validateEmail={this.handleValidateEmail}
                            validateUserName={this.handleValidateUserName}
                            onSubmit={this.handleCreateUser}
                        />
                    </PanelBody>
                    <PanelFooter>
                        <T>Đã có tài khoản?</T>
                        <Spacer />
                        <Link
                            onClick={this.handleLogin}
                        >
                            <T>Đăng nhập</T>
                        </Link>
                    </PanelFooter>
                </Panel>
            </Container>
        );
    }
}
NewUserManager = inject('appStore', 'fieldForceStore')(observer(NewUserManager));
NewUserManager = withTenant(withModal(withI18n(withRouter(NewUserManager))));
export default NewUserManager;

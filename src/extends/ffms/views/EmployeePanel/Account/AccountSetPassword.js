import './AccountSetPassword.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Panel, PanelHeader, PanelBody,
    InputAppend, InputGroup, FAIcon, Sub2, Row,
    Input, Button, FormControlLabel, withModal,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';

import PermissionService from 'extends/ffms/services/PermissionService';
import EmailService from 'extends/ffms/services/EmailService';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';
import { toastSendMailResult } from 'extends/ffms/services/utilities/helper';

export class AccountSetPassword extends Component
{
    empStore = this.props.fieldForceStore.empStore;
    permSvc = new PermissionService();
    emailSvc = new EmailService();

    // require contain at least a number in new password ex: 6 characters -> 5 character + 1 number
    setPassword = {
        minLength: 5,
        number: 1,
    }

    state = {
        newResetPassword: '',
        isLoading: false,
        canEdit: false,
    };

    componentDidMount = () =>
    {
        const { EDIT } = this.permSvc.PERMISSION_LIST;
        const { pathPermission, hasPermissionNode } = this.props;
        this.permSvc.canPerformAction(this.empStore.empSvc.dataPath, EDIT)
            .then((permission) =>
            {
                const canEdit = permission && hasPermissionNode(pathPermission, 'resetpassword');
                this.setState({ canEdit });
            });
    }

    sendEmailResetPassword = (newPassword) =>
    {
        const userName = this.empStore.currentEmp.employee_username;
        const template = 'ResetPasswordEmail';
        const templateData = {
            'employee.employee_full_name': this.empStore.currentEmp.employee_full_name,
            'account.username': userName,
            'generated_password': newPassword,
            'tenants.name': '',
            'tenants.domain': '',
        };

        this.emailSvc.sendEmail({ toAccount: userName, template, templateData })
            .then((res) => toastSendMailResult(res, this.props.toast));
    }

    handleResetPassword = () =>
    {
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn ĐẶT LẠI MẬT KHẨU cho tài khoản nhân viên này không?',
            onOk: () =>
            {
                this.setState({ isLoading: true });
                this.empStore.resetPassword(this.empStore.currentEmp, this.setPassword).then((res) =>
                {
                    if (res && res.data)
                    {
                        this.sendEmailResetPassword(res.data);
                    }

                    this.setState({
                        newResetPassword: res && res.data ? res.data : '',
                        isLoading: false,
                    });

                });
            },
        });
    };

    render()
    {
    
        return (
            <Panel className={'panel-danger'}>
                <PanelHeader>
                    Cấp mật khẩu mới
                </PanelHeader>
                <PanelBody>
                    <Row
                        crossAxisAlignment={'center'}
                        itemMargin={'md'}
                        mainAxisSize={'max'}
                    >
                        <Container flex={1}>
                            <Sub2>Sau khi bạn đặt mật khẩu mới, người dùng sẽ không thể đăng nhập bằng mật khẩu trước đó của họ nữa</Sub2>
                        </Container>
                        <Button
                            icon={'key'}
                            color={'danger'}
                            text={'Đặt lại'}
                            disabled={!this.state.canEdit}
                            tooltip={!this.state.canEdit ? 'Bạn chưa được phân quyền thực hiện tác vụ này' : null}
                            isLoading={this.state.isLoading}
                            onClick={this.handleResetPassword}
                        />
                    </Row>
                    {
                        this.state.newResetPassword && this.state.canEdit && (
                            <FormControlLabel
                                control={(
                                    <InputGroup>
                                        <Input
                                            className={'new-password'}
                                            placeholder={'Mật khẩu mới'}
                                            value={this.state.newResetPassword}
                                            disabled
                                        />
                                        <InputAppend>
                                            <span>
                                                <FAIcon
                                                    icon={'copy'}
                                                    type='light'
                                                    size={'1rem'}
                                                    onClick={() =>
                                                    {
                                                        CommonHelper.copyToClipboard(this.state.newResetPassword);
                                                        this.props.toast({ type: 'success', message: 'Đã sao chép vào bộ nhớ' });
                                                    }}
                                                />
                                            </span>
                                        </InputAppend>
                                    </InputGroup>
                                )}
                            />
                        )}
                </PanelBody>
            </Panel>
        );
    }
}

AccountSetPassword = inject('appStore', 'fieldForceStore')(observer(AccountSetPassword));
AccountSetPassword = withModal(withPermission(AccountSetPassword));
export default AccountSetPassword;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Row, Panel, PanelHeader, PanelBody, Sub2, TB1, Spacer,
    Button, FormControlLabel, Input, InputAppend, InputGroup,
    T, withI18n, withModal, withTenant,
} from '@vbd/vui';

import appEnum from 'constant/app-enum';
import { AuthHelper } from 'helper/auth.helper';
import { CommonHelper } from 'helper/common.helper';

import PermissionService from 'extends/ffms/services/PermissionService';
import EmailService from 'extends/ffms/services/EmailService';
import UserService from 'extends/ffms/services/UserService';
import { toastSendMailResult } from 'extends/ffms/services/utilities/helper';
import { Constants } from 'extends/ffms/constant/Constants';

export class AccountSendRegisterEmail extends Component
{
    empStore = this.props.fieldForceStore.empStore;
    permSvc = new PermissionService();
    emailSvc = new EmailService();
    userSvc = new UserService();

    state = {
        isLoading: false,
        canEdit: false,
        showInvitePopup: false,
        inviteLink: '',
    };

    componentDidMount = () =>
    {
        const { EDIT } = this.permSvc.PERMISSION_LIST;
        this.permSvc.canPerformAction(this.empStore.empSvc.dataPath, EDIT).then((permission) => this.setState({ canEdit: permission }));
    }

    getInviteUrl = async (code) =>
    {
        return await new Promise((resolve, reject) =>
        {
            try
            {
                this.userSvc.getInviteLink(code).then(linkRs =>
                {
                    if (linkRs && linkRs.result === appEnum.APIStatus.Success)
                    {
                        resolve(linkRs.data);
                    }
                    else
                    {
                        reject(linkRs?.message || 'Failed get invite link');
                    }
                });
            }
            catch (e)
            {
                reject(e);
            }
        });
    }

    insertInviteCode = async () =>
    {
        const employeeEmail = this.empStore.currentEmp.employee_email;
        const dataRequest = {
            type: Constants.systemTokenType.Worker,
            token: AuthHelper.getVDMSToken(),
            data: {
                email: employeeEmail,
            },
        };

        return await new Promise((resolve, reject) =>
        {
            try
            {
                this.userSvc.insertInviteCode(dataRequest).then(inviteCodeRs =>
                {
                    if (inviteCodeRs && inviteCodeRs.result === appEnum.APIStatus.Success)
                    {
                        resolve(inviteCodeRs.data);
                    }
                    else
                    {
                        reject(inviteCodeRs?.message || 'Failed register invite code');
                    }
                });
            }
            catch (e)
            {
                reject(e);
            }
        });
    }

    sendEmailSetUpAccount = async (inviteLink) =>
    {
        const employeeEmail = this.empStore.currentEmp.employee_email;
        const template = 'AccountSetupEmail';
        const templateData = {
            'tenants.name': '',
            'tenants.domain': '',
            'setup-url': inviteLink,
        };

        return this.emailSvc.sendEmail({ toAddress: employeeEmail, template, templateData })
            .then((res) => toastSendMailResult(res, this.props.toast));
    }
    
    handleInviteEmail = async () =>
    {
        this.setState({ isLoading: true });
        try
        {
            const inviteCode = await this.insertInviteCode();

            const uuid = inviteCode.uuid;
            const inviteLink = await this.getInviteUrl(uuid);

            const emailSent = await this.sendEmailSetUpAccount(inviteLink);
            
            this.setState({ isLoading: false });

            this.props.alert({
                title: 'Mời qua email',
                message: this.renderBodyConfirm(inviteLink, emailSent),
            });

        }
        catch (error)
        {
            console.error(error);
        }
    };

    copyToClipboard = (inviteLink) =>
    {
        CommonHelper.copyToClipboard(inviteLink);
        this.props.toast({ location: 'top-right', type: 'info', message: 'Successfully copied!' });
    };

    renderBodyConfirm = (inviteLink, emailSent) =>
    {
        let content = 'Đường dẫn dùng để tạo tài khoản đăng nhập';
        if (emailSent)
        {
            content = 'Đã gửi một đường dẫn dùng để thiết lập tên đăng nhập và mật khẩu đến địa chỉ %0%.';
        }
        
        return (
            <Container>
                <TB1>
                    <T params={[this.empStore.currentEmp.employee_email]}>{content}</T>
                </TB1>
                <Spacer
                    direction={'vertical'}
                    size={'0.5rem'}
                />
                <FormControlLabel
                    control={(
                        <InputGroup>
                            <Input
                                value={inviteLink}
                                readOnly
                            />
                            <InputAppend>
                                <Button
                                    icon={'copy'}
                                    isLoading={false}
                                    color={'default'}
                                    title={''}
                                    onlyIcon
                                    onClick={() => this.copyToClipboard(inviteLink)}
                                />
                            </InputAppend>
                        </InputGroup>
                    )}
                />
            </Container>
        );
    }

    render()
    {
        const { canEdit, isLoading } = this.state;

        return (
            <Panel className={'panel-success border'}>
                <PanelHeader>
                    Mời qua email
                </PanelHeader>
                <PanelBody>
                    <Row
                        mainAxisSize={'max'}
                        crossAxisAlignment={'center'}
                        itemMargin={'md'}
                    >
                        <Container
                            flex={1}
                        >
                            <Sub2>Thông qua mail hệ thống sẽ gửi một đường dẫn giúp nhân viên tự tạo được tài khoản dùng để đăng nhập vào website</Sub2>
                        </Container>
                        <Button
                            icon={'envelope'}
                            color={'success'}
                            text={'Mời'}
                            disabled={!canEdit}
                            tooltip={!canEdit ? 'Bạn chưa được phân quyền thực hiện tác vụ này' : null}
                            isLoading={isLoading}
                            onClick={this.handleInviteEmail}
                        />
                    </Row>
                </PanelBody>
            </Panel>
        );
    }
}

AccountSendRegisterEmail = inject('appStore', 'fieldForceStore')(observer(AccountSendRegisterEmail));
AccountSendRegisterEmail = withTenant(withModal(withI18n(AccountSendRegisterEmail)));
export default AccountSendRegisterEmail;

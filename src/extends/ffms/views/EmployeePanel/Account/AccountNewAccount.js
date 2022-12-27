
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Panel, PanelHeader, PanelBody,
    Sub2, Row, Button, withModal,
} from '@vbd/vui';

import PermissionService from 'extends/ffms/services/PermissionService';
import NewAccountForm from 'extends/ffms/views/NewAccountForm/NewAccountForm';
import EmailService from 'extends/ffms/services/EmailService';
import { toastSendMailResult } from 'extends/ffms/services/utilities/helper';

export class AccountNewAccount extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    empStore = this.fieldForceStore.empStore;

    permSvc = new PermissionService();
    emailSvc = new EmailService();
    
    emailFormatGuide = '';
    passwordFormatGuide = '';
    userNameFormatGuide = '';

    state = {
        formError: {},
        formValid: false,
        activeForm: false,
        isLoading: false,

        canCreate: false,

        organization: '',
    };


    componentDidMount = () =>
    {
        const { CREATE } = this.permSvc.PERMISSION_LIST;
        this.permSvc.canPerformAction(this.empStore.empSvc.dataPath, CREATE).then((permission) => this.setState({ canCreate: permission }));

        this.fieldForceStore.loadDataReferences([ 'organizations']).then((dataRefs) =>
        {
            if (dataRefs)
            {
                const orgOptions = this.fieldForceStore.getDataReferenceOptions('organizations', 'organization_id','organization_name') ?? [];
                const currOrgId = this.empStore.currentEmp.employee_organization_id;
                const organization = orgOptions?.find(org => org.id.toString() === currOrgId.toString());
                this.setState({ organization: organization.label });
            }
        });
    }

    sendEmailNewAccount = (input) =>
    {
        const company_name = this.state.organization || '';
        const userName = input.username;
        const template = 'AccountInfoEmail';
        const templateData = {
            'company-name': company_name,
            'input.username': input.username,
            'input.password': input.password,
            'tenants.name': '',
            'tenants.domain': '',
        };

        this.emailSvc.sendEmail({ toAccount: userName, template, templateData })
            .then((res) => toastSendMailResult(res, this.props.toast));
    }

    handleCreateUser = async (newUser) =>
    {
        this.setState({ isLoading: true });

        this.empStore.currentEmp.employee_username = newUser.username;

        this.empStore.createAccount(this.empStore.currentEmp, newUser.password).then((rs) =>
        {
            if (rs)
            {
                this.sendEmailNewAccount(newUser);
                this.setState({ isLoading: false });
            }
        });
    };

    handleCancel = () => this.setState({ activeForm: false })
    
    handleValidateUserName =async (value) =>
    {
        const existed = await this.empStore.checkUserExist(value);
        return existed ? false : true;
    };
    
    handleValidateEmail = async (value) =>
    {
        const existed = await this.empStore.checkEmailExist(value, [this.empStore.currentEmp.employee_guid]);
        return existed ? false : true;
    }

    render()
    {
        return (
            <Panel className={'panel-success border'}>
                <PanelHeader>
                    Cấp tài khoản
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
                            <Sub2>Một khi bạn tạo tài khoản cho nhân viên thì bạn không thể xóa nhân viên đó. Thay vào đó bạn chỉ có thể khóa tài khoản</Sub2>
                        </Container>
                        {
                            !this.state.activeForm && (
                                <Button
                                    icon={'user-plus'}
                                    color={'success'}
                                    text={'Tạo'}
                                    isLoading={this.state.isLoading}
                                    disabled={!this.state.canCreate}
                                    tooltip={!this.state.canCreate ? 'Bạn chưa được phân quyền thực hiện tác vụ này' : 'Tạo tài khoản nhân viên'}
                                    onClick={() => this.setState({ activeForm: true })}
                                />
                            )}
                    </Row>

                    
                    {
                        this.state.activeForm && this.state.canCreate && (
                            <NewAccountForm
                                data={{
                                    email: this.empStore.currentEmp.employee_email,
                                    organization: this.state.organization,
                                }}
                                controls={{
                                    email: {
                                        editable: false,
                                    },
                                }}
                                validateEmail={this.handleValidateEmail}
                                validateUserName={this.handleValidateUserName}
                                onSubmit={this.handleCreateUser}
                                onCancel={this.handleCancel}
                            />
                        )}
                </PanelBody>
            </Panel>

        );
    }
}


AccountNewAccount = withModal(inject('appStore', 'fieldForceStore')(observer(AccountNewAccount)));
export default AccountNewAccount;

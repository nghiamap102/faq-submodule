import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Panel, PanelHeader, PanelBody,
    InputAppend, InputGroup, Sub2, FAIcon, T, Column,
    Row, Button, Input, FormControlLabel, FormGroup, withModal, HD6, Sub1,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import DataEnum from 'extends/ffms/constant/ffms-enum';

import AccountBlock from 'extends/ffms/views/EmployeePanel/Account/AccountBlock';
import AccountSetPassword from 'extends/ffms/views/EmployeePanel/Account/AccountSetPassword';
import AccountUnblock from 'extends/ffms/views/EmployeePanel/Account/AccountUnblock';
import PermissionService from 'extends/ffms/services/PermissionService';
import EmailService from 'extends/ffms/services/EmailService';
import AccountNewAccount from 'extends/ffms/views/EmployeePanel/Account/AccountNewAccount';
import AccountSendRegisterEmail from 'extends/ffms/views/EmployeePanel/Account/AccountSendRegisterEmail';

export class EmployeeAccount extends Component
{
    empStore = this.props.fieldForceStore.empStore;

    permissionService = new PermissionService();
    emailSvc = new EmailService();

    state = {
        isReset: false,
        isLoading: false,
        inviteByEmail: false,
    };

    componentDidMount = async () =>
    {
        const hasEmailConfig = await this.emailSvc.checkEmailConfig();
        this.setState({
            inviteByEmail: hasEmailConfig,
        });
    };

    handleActivateUser = () =>
    {
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn KÍCH HOẠT tài khoản của nhân viên này không?',
            onOk: () =>
            {
                this.setState({ isLoading: true });
                this.empStore.setActivate(this.empStore.currentEmp).then(() =>
                {
                    this.setState({ isLoading: false });
                });
            },
        });
    };

    copyToClipboard = (name) =>
    {
        if (name && this.empStore.currentEmp[name])
        {
            CommonHelper.copyToClipboard(this.empStore.currentEmp[name]);
            this.props.toast({ type: 'success', message: 'Đã sao chép vào bộ nhớ' });
        }
    }

    render()
    {
        const isNulOrDisabled = this.empStore.empSvc.employeeMatchStatus(this.empStore.currentEmp, [null, DataEnum.EMPLOYEE_STATUS.disabled]);
        const isDisabled = this.empStore.empSvc.employeeMatchStatus(this.empStore.currentEmp, [DataEnum.EMPLOYEE_STATUS.disabled]);
        const isNotDisabled = this.empStore.empSvc.employeeMatchStatus(this.empStore.currentEmp, null, [DataEnum.EMPLOYEE_STATUS.disabled]);
        const isNewEmployee = this.empStore.empSvc.employeeMatchStatus(this.empStore.currentEmp, [null, DataEnum.EMPLOYEE_STATUS.new]);
        const isActiveEmployee = this.empStore.empSvc.employeeMatchStatus(this.empStore.currentEmp, [DataEnum.EMPLOYEE_STATUS.active]);
        const isInactiveEmployee = this.empStore.empSvc.employeeMatchStatus(this.empStore.currentEmp, [DataEnum.EMPLOYEE_STATUS.inactive]);

        return (
            <FormGroup className={'employee-account'}>
                {
                    isNewEmployee && this.empStore.canCreateAccount && (
                        <>
                            <Panel className={'panel-success'}>
                                <PanelHeader>
                                Tài khoản nhân viên
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
                                            <Sub1>Nhân viên muốn đăng nhập vào ứng dụng cần phải cấp phép một tài khoản. Có hai cách để tạo tài khoản mới:</Sub1>

                                        </Container>
                                    </Row>
                                </PanelBody>
                            </Panel>
                            {
                                this.state.inviteByEmail
                                    ? (
                                            <Column crossAxisAlignment={'center'}>
                                                <AccountNewAccount />
                                                <HD6>HOẶC</HD6>
                                                <AccountSendRegisterEmail />
                                            </Column>
                                        )
                                    : <AccountNewAccount />
                            }
                        </>
                    )}
                {
                    !isNewEmployee && (
                        <>
                            <Panel className={`panel-${isNulOrDisabled ? 'disabled' : (isActiveEmployee ? 'success' : 'inactivated')}`}>
                                <PanelHeader>
                                    <T>Thông tin tài khoản</T> <T>{isNulOrDisabled ? '(Đang tạm khóa)' : (isActiveEmployee ? '(Đang hoạt động)' : '(Chưa kích hoạt)')}</T>
                                </PanelHeader>
                                <PanelBody>
                                    {
                                        this.empStore.isEdit && isInactiveEmployee && (
                                            <Row
                                                mainAxisSize={'max'}
                                                crossAxisAlignment={'center'}
                                                itemMargin={'md'}
                                            >
                                                <Container
                                                    flex={1}
                                                >
                                                    <Sub2>
                                                        Một khi tài khoản được kích hoạt, nhân viên này sẽ có thể đăng nhập vào hệ thống và có thể truy xuất tới những chức năng được cấp quyền
                                                    </Sub2>
                                                </Container>
                                                <Button
                                                    icon={'shield-check'}
                                                    color={'success'}
                                                    text={'Kích hoạt ngay'}
                                                    isLoading={this.state.isLoading}
                                                    onClick={this.handleActivateUser}
                                                />
                                            </Row>
                                        )}
                                    <FormGroup>
                                        <FormControlLabel
                                            label={'Tên người dùng'}
                                            control={(
                                                <InputGroup>
                                                    <Input
                                                        placeholder={'Tên người dùng'}
                                                        value={this.empStore.currentEmp ? this.empStore.currentEmp.employee_username : ''}
                                                        disabled
                                                    />
                                                    <InputAppend>
                                                        <span>
                                                            <FAIcon
                                                                icon={'copy'}
                                                                type={'light'}
                                                                size={'1rem'}
                                                                onClick={(e) => this.copyToClipboard('employee_username')}
                                                            />
                                                        </span>
                                                    </InputAppend>
                                                </InputGroup>
                                            )}
                                        />

                                        <FormControlLabel
                                            label={'Email'}
                                            control={(
                                                <InputGroup>
                                                    <Input
                                                        placeholder={'Email'}
                                                        value={this.empStore.currentEmp ? this.empStore.currentEmp.employee_email : ''}
                                                        disabled
                                                    />
                                                    <InputAppend>
                                                        <span>
                                                            <FAIcon
                                                                icon={'copy'}
                                                                type='light'
                                                                size={'1rem'}
                                                                onClick={(e) => this.copyToClipboard('employee_email')}
                                                            />
                                                        </span>
                                                    </InputAppend>
                                                </InputGroup>
                                            )}
                                        />
                                    </FormGroup>
                                </PanelBody>
                            </Panel>


                            {
                                this.empStore.canModifyAccount && this.empStore.isEdit && isDisabled &&
                                <AccountUnblock />
                            }
                            {
                                this.empStore.canModifyAccount && this.empStore.isEdit && isActiveEmployee &&
                                <AccountSetPassword />
                            }
                            {
                                this.empStore.canModifyAccount && this.empStore.isEdit && isActiveEmployee && isNotDisabled &&
                                <AccountBlock />
                            }
                        </>
                    )}

            </FormGroup>
        );
    }
}
EmployeeAccount = withModal(inject('appStore', 'fieldForceStore')(observer(EmployeeAccount)));
export default EmployeeAccount;

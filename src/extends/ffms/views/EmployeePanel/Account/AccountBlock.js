import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Panel, PanelHeader, PanelBody, Popup,
    Sub2,Button,Row,
    withI18n, withModal, HD6,
} from '@vbd/vui';
import Stepper from 'extends/ffms/bases/Stepper/Stepper';

import { CommonHelper } from 'helper/common.helper';
import PermissionService from 'extends/ffms/services/PermissionService';
import EmailService from 'extends/ffms/services/EmailService';
import EmployeeUnAssignJob from 'extends/ffms/views/EmployeePanel/EmployeeUnAssignJob';
import AccountDisable from 'extends/ffms/views/EmployeePanel/Account/AccountDisable';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';
import { toastSendMailResult } from 'extends/ffms/services/utilities/helper';

export class AccountBlock extends Component
{
    empStore = this.props.fieldForceStore.empStore;
    permSvc = new PermissionService();
    emailSvc = new EmailService();

    state = {
        isLoading: false,
        canEdit: false,
        reAssignJobForm: false,
        jobs: [],
    };

    componentDidMount = () =>
    {
        const { EDIT } = this.permSvc.PERMISSION_LIST;
        this.permSvc.canPerformAction(this.empStore.empSvc.dataPath, EDIT)
            .then((permission) =>
            {
                const { hasPermissionNode, pathPermission } = this.props;
                const canEdit = permission && hasPermissionNode(pathPermission, 'disable');
                this.setState({ canEdit });
            });
    }

    sendEmailDisableAccount = () =>
    {
        const userName = this.empStore.currentEmp.employee_username;
        const template = 'DisableUserEmail';
        const templateData = {
            'employee.employee_full_name': this.empStore.currentEmp.employee_full_name,
            'account.username': userName,
            'tenants.name': '',
            'tenants.domain': '',
        };

        this.emailSvc.sendEmail({ toAccount: userName, template, templateData })
            .then((res) => toastSendMailResult(res, this.props.toast));
    }

    handleDisableEmployee = async () =>
    {
        const emp = CommonHelper.clone(this.empStore.currentEmp);
        this.setState({ isLoading: true });
        
        // check api
        const rs = await this.empStore.empSvc.getJobs(emp?.employee_username, ['Assigned', '(In Progress)']);

        if (rs && rs.length === 0)
        {
            this.props.confirm({
                message: this.props.t('Bạn có chắc chắn muốn KHÓA TÀI KHOẢN của nhân viên \'%0%\' không?', [emp.employee_username]),
                onOk: () =>
                {
                    this.sendEmailDisableAccount();
                    this.empStore.setDisable(emp).then(() =>
                    {
                        this.setState({ isLoading: false });
                    });
                },
                onCancel: () =>
                {
                    this.setState({ isLoading: false });
                },
            });
        }
        else
        {
            this.props.confirm({
                title: 'Cảnh báo',
                message:
                `${this.props.t('Hiện tại, \'%0%\' (%1%) đang được giao %2% công việc. \'%3%\' không thể bị khoá tài khoản cho đến khi tất cả các công việc được giải quyết.', [emp.employee_full_name, emp.employee_username, rs.length, emp.employee_full_name])} ${this.props.t('Bạn có muốn tiếp tục?')}`,
                onOk: () =>
                {
                    this.setState({
                        isLoading: false,
                        reAssignJobForm: true,
                        jobs: rs,
                    });
                },
                onCancel: () =>
                {
                    this.setState({ isLoading: false });
                },
            });
        }
    };

    handleBeforeClose = () =>
    {
        let message;
        if (this.empStore.unassignDone || this.empStore.disableDone)
        {
            message = 'Bạn có thay đổi chưa lưu. Thoát khỏi tính năng này?';
        }
        else
        {
            message = 'Thoát khỏi tính năng này?';
        }
        
        if (this.state.reAssignJobForm)
        {
            this.props.confirm({
                title: 'Thoát khỏi tính năng này?',
                message: <HD6>{message}</HD6>,
                cancelText: 'Bỏ thay đổi',
                onCancel: this.closeMe,
                okText: 'Tiếp tục chỉnh sửa',
            });
            return false;
        }
        return true;
    };

    closeMe =()=>
    {
        this.setState({ reAssignJobForm: false });
        this.empStore.setUnassignDone(false);
        this.empStore.setDisableDone(false);
    }

    render()
    {

        return (
            <>
                <Panel className={'panel-danger'}>
                    <PanelHeader>
                    Khóa tài khoản nhân viên
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
                                <Sub2>Nhân viên này sẽ không thể đăng nhập vào hệ thống</Sub2>
                            </Container>
                            <Button
                                icon={'user-lock'}
                                color={'danger'}
                                text={'Khóa'}
                                disabled={!this.state.canEdit}
                                tooltip={!this.state.canEdit ? 'Bạn chưa được phân quyền thực hiện tác vụ này' : null}
                                isLoading={this.state.isLoading}
                                onClick={this.handleDisableEmployee}
                            />
                        </Row>
                    </PanelBody>
                </Panel>
                {
                    this.state.reAssignJobForm && (
                        <Popup
                            title={this.props.t('%0% công việc đang được phân công cho \'%1%\' (%2%)', [this.state.jobs.length, this.empStore.currentEmp.employee_full_name, this.empStore.currentEmp.employee_username])}
                            width={'75rem'}
                            height={'75rem'}
                            className={'unassign-grid-form'}
                            scroll={false}
                            escape={false}
                            onClose={this.closeMe}
                            onBeforeClose={this.handleBeforeClose}
                        >
                            <Stepper
                                current={this.empStore.disableCurrentStep}
                                list={[
                                    {
                                        key: 'unassign',
                                        title: this.props.t('Bước %0%', ['1']),
                                        label: 'Tất cả công việc chưa hoàn thành của nhân viên cần được hủy hoặc bỏ phân công trước khi khóa tài khoản nhân viên',
                                        isDone: this.empStore.unassignDone,
                                        component: () => <EmployeeUnAssignJob data={this.state.jobs} />,
                                    },
                                    {
                                        key: 'disable',
                                        title: this.props.t('Bước %0%', ['2']),
                                        label: 'Khóa tài khoản nhân viên',
                                        isDone: this.empStore.disableDone,
                                        component: () => <AccountDisable />,
                                    },
                                ]}
                            />
                        </Popup>
                    )}
            </>
        );
    }
}

AccountBlock.propTypes = {
};

AccountBlock = inject('appStore', 'fieldForceStore')(observer(AccountBlock));
AccountBlock = withModal(withI18n(withPermission(AccountBlock)));

export default AccountBlock;

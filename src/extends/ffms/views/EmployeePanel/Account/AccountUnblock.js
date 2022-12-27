import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Panel, PanelHeader, PanelBody, Sub2,
    withI18n, Row, withModal, Button,
} from '@vbd/vui';

import PermissionService from 'extends/ffms/services/PermissionService';
export class AccountUnblock extends Component
{
    empStore = this.props.fieldForceStore.empStore;
    permSvc = new PermissionService();

    state = {
        isLoading: false,
        canEdit: false,
    };

    componentDidMount = () =>
    {
        const { EDIT } = this.permSvc.PERMISSION_LIST;
        this.permSvc.canPerformAction(this.empStore.empSvc.dataPath, EDIT).then((permission) => this.setState({ canEdit: permission }));
    }

    handleEnableEmployee = () =>
    {
        this.props.confirm({
            message: this.props.t('Bạn có chắc chắn muốn MỞ KHÓA TÀI KHOẢN của nhân viên \'%0%\' không?', [this.empStore.currentEmp.employee_username]),
            onOk: () =>
            {
                this.setState({ isLoading: true });
                this.empStore.setEnable(this.empStore.currentEmp).then(() =>
                {
                    this.setState({ isLoading: false });
                });
            },
        });
    };

    render()
    {
        return (
            <Panel className={'panel-primary'}>
                <PanelHeader>
                    Mở khóa tài khoản nhân viên
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
                            <Sub2>Nhân viên này sẽ có thể đăng nhập lại vào hệ thống và có thể truy xuất tới những chức năng được cấp quyền</Sub2>
                        </Container>
                        <Button
                            icon={'user-unlock'}
                            color={'primary-color'}
                            text={'Mở khóa'}
                            disabled={!this.state.canEdit}
                            tooltip={!this.state.canEdit ? 'Bạn chưa được phân quyền thực hiện tác vụ này' : null}
                            isLoading={this.state.isLoading}
                            onClick={this.handleEnableEmployee}
                        />
                    </Row>
                </PanelBody>
            </Panel>
        );
    }
}

AccountUnblock = withModal(withI18n(inject('appStore', 'fieldForceStore')(observer(AccountUnblock))));
export default AccountUnblock;

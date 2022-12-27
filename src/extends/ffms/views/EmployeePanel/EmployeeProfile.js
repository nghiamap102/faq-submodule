import './EmployeeProfile.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {
    Container, Line,
    EmptyButton, Sub2, TB1, Link,
    withI18n, Row, Column, withModal, Button, ScrollView, Panel, PanelBody, PanelFooter, Expanded,
} from '@vbd/vui';

import EmployeeInfo from 'extends/ffms/views/EmployeePanel/EmployeeInfo';
import EmployeeAccount from 'extends/ffms/views/EmployeePanel/EmployeeAccount';
import AvatarInfo from 'extends/ffms/views/AvatarInfo/AvatarInfo';
import DataEnum from 'extends/ffms/constant/ffms-enum';
import PermissionService from 'extends/ffms/services/PermissionService';
import RoleAccount from 'extends/ffms/views/RolePanel/RoleAccount';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';

export class EmployeeProfile extends Component
{
    empStore = this.props.fieldForceStore.empStore;

    permissionService = new PermissionService();

    state = {
        activePanel: 1,
    };

    componentDidMount = () =>
    {
        const { CREATE, EDIT } = this.permissionService.PERMISSION_LIST;
        if (this.empStore.currentEmp)
        {
            this.permissionService.canPerformAction(this.empStore.empSvc.accountPath, CREATE).then((permission) => this.setState({ createAccountPermission: permission }));
            this.permissionService.canPerformAction(this.empStore.empSvc.accountPath, EDIT).then((permission) => this.setState({ updateAccountPermission: permission }));
        }
    }

    handleDeleteEmployee = () =>
    {
        this.props.confirm({
            message: this.props.t('Bạn có chắc chắn muốn xóa thông tin nhân viên \'%0%\' không?', [this.empStore.currentEmp?.employee_full_name]),
            onOk: () =>
            {
                this.setState({ isLoading: true });
                this.empStore.delete(this.empStore.currentEmp?.employee_guid).then(() =>
                {
                    const query = new URLSearchParams(this.props?.location?.search);
                    const mode = query.get('mode');
                    query.delete('mode');
                    mode === 'edit' && query.delete('select');

                    this.props.history.push({ search: query?.toString() });

                    this.empStore.setFormState(false);
                    this.empStore.togglePanel();
                    this.setState({ isLoading: false });

                });
            },
        });
    };


    render()
    {
        const { data, employeeFormAction, hasPermissionNode, pathPermission } = this.props;
        const isNewEmployee = this.empStore.empSvc.employeeMatchStatus(this.empStore.currentEmp, [null, DataEnum.EMPLOYEE_STATUS.new]);
        const isViewRoleEmployee = this.empStore.empSvc.employeeMatchStatus(this.empStore.currentEmp, [DataEnum.EMPLOYEE_STATUS.active, DataEnum.EMPLOYEE_STATUS.disabled]);
        return (
            <Row
                className={'ep-container'}
            >
                <Container
                    className={'ep-left-side'}
                    height={'42rem'}
                >
                    <PanelBody scroll="false">
                        <Column
                            flex={0}
                            itemMargin={'md'}
                            crossAxisSize='max'
                        >
                            <AvatarInfo data={data} />
                            <Line
                                height={'1px'}
                                color={'var(--border)'}
                            />
                            <EmptyButton
                                text={'Hồ sơ'}
                                className={this.state.activePanel === 1 ? 'active' : ''}
                                onClick={() => this.setState({ activePanel: 1 })}
                            />
                            {
                                (!isNewEmployee || this.empStore.canCreateAccount) && (
                                    <EmptyButton
                                        text={'Tài khoản'}
                                        className={this.state.activePanel === 2 ? 'active' : ''}
                                        onClick={() => this.setState({ activePanel: 2 })}
                                    />
                                )}
                            {
                                this.empStore.canCreateAccount && (
                                    <EmptyButton
                                        text={'Vai trò'}
                                        className={this.state.activePanel === 3 ? 'active' : ''}
                                        onClick={() => this.setState({ activePanel: 3 })}
                                    />
                                )}
                        </Column>
                    </PanelBody>
                    <Expanded />
                    {
                        isNewEmployee && hasPermissionNode(pathPermission, 'delete') && (
                            <PanelFooter>
                                <Container className={'delete-container'}>
                                    <Column
                                        mainAxisAlignment={'end'}
                                        crossAxisAlignment={'center'}
                                        itemMargin={'sm'}
                                    >
                                        <TB1>Thông tin chưa đúng?</TB1>
                                        <Link
                                            onClick={this.handleDeleteEmployee}
                                        >
                                            <TB1>Bạn muốn xóa nhân viên này?</TB1>
                                        </Link>
                                    </Column>
                                </Container>
                            </PanelFooter>
                        )
                    }
                </Container>
                <Line
                    width={'1px'}
                    color={'var(--border)'}
                />
                <Container
                    className={'ep-right-side'}
                    width={'100vw'}
                >
                    <Column height="42rem">
                        <ScrollView>
                            {
                                this.state.activePanel === 1 && (
                                    <EmployeeInfo
                                        teamOptions={this.empStore.teamOptions || []}
                                        typeOptions={this.empStore.typeOptions || []}
                                        orgOptions={this.empStore.orgOptions || []}
                                        shiftOptions={this.empStore.shiftOptions || []}
                                        formAction={employeeFormAction}
                                        data={this.empStore.currentEmp}
                                        onDataChanged={this.props.onDataChanged}
                                    />
                                )}
                            {
                                this.state.activePanel === 2 &&
                            <EmployeeAccount />
                            }
                            {
                                this.state.activePanel === 3 && isViewRoleEmployee &&
                            <RoleAccount />
                            }
                            {
                                this.state.activePanel === 3 && !isViewRoleEmployee && (
                                    <Container style={{ padding: '0.625rem' }}>
                                        <Row
                                            mainAxisSize={'max'}
                                            crossAxisAlignment={'start'}
                                            itemMargin={'lg'}
                                        >
                                            <Container
                                                flex={1}
                                            >
                                                <Sub2>Tài khoản nhân viên này chưa được kích hoạt. Để quản lý vai trò của nhân viên, bạn hãy kích hoạt tài khoản.</Sub2>
                                            </Container>
                                            <Button
                                                icon={'shield-check'}
                                                color={'success'}
                                                text={'Kích hoạt ngay'}
                                                onClick={() => this.setState({ activePanel: 2 })}
                                            />
                                        </Row>
                                    </Container>
                                )}
                        </ScrollView>
                    </Column>
                </Container>
            </Row>
        );
    }
}


EmployeeProfile = inject('appStore', 'fieldForceStore')(observer(EmployeeProfile));
EmployeeProfile = withModal(withI18n(withPermission(withRouter(EmployeeProfile))));

export default EmployeeProfile;

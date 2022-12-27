import './RoleAccount.scss';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {
    Container, SearchBox, Section, SectionHeader, PanelHeader, Panel, PanelBody,
    EmptyData, Row, Column, PopOver, T, withI18n, Button, withModal, ListItem, ScrollView,
} from '@vbd/vui';

import RoleService from 'extends/ffms/views/RolePanel/RoleService';


class RoleAccount extends Component
{
    empStore = this.props.fieldForceStore.empStore;
    roleStore = this.props.fieldForceStore.roleStore;
    rolSvc = new RoleService();

    addRoleRef = React.createRef();

    state={
        showAddPopup: false,
        searchKey: '',
        roles: [],
    }

    componentDidMount = async () =>
    {
        this.loadDataRoleEmployee();
        const res = await this.rolSvc.gets();
        this.setState({
            roles: res.data,
        });
    }

    loadDataRoleEmployee = async () =>
    {
        this.roleStore.setLoading(true);
        const dataEmp = await this.roleStore.getDataRoleEmployee(this.empStore.currentEmp.employee_username);
        this.roleStore.setDataRoleEmp(dataEmp);
        this.roleStore.setLoading(false);
    };

    handleAddRole = (role) =>
    {
        const emp = this.empStore.currentEmp;
        const roleName = role.Name;

        if (!roleName || !emp.employee_username)
        {
            this.props.toast({ type: 'error', message: `${this.props.t('Tác vụ không thể thực hiện')}. ${this.props.t('Chi tiết')}: ${this.props.t('Không có thông tin')}.` });
            return;
        }

        this.roleStore.addEmployeeToRole(roleName, emp.employee_username).then((res) =>
        {
            if (res.data)
            {
                this.roleStore.setDataRoleEmp([role, ...this.roleStore.empRoles]);
                this.setState({
                    showAddPopup: false,
                });
            }
        });
    }

    handleDeleteRole = (roleName) =>
    {
        const emp = this.empStore.currentEmp;

        if (!roleName || !emp.employee_username)
        {
            this.props.toast({ type: 'error', message: `${this.props.t('Tác vụ không thể thực hiện')}. ${this.props.t('Chi tiết')}: ${this.props.t('Không có thông tin')}.` });
            return;
        }

        this.props.confirm({
            message: this.props.t('Bạn có chắc chắn muốn bỏ nhân viên "%0%" (%1%) ra khỏi vai trò "%2%" không?', [emp.employee_full_name, emp.employee_username, roleName]),
            onOk: () =>
            {
                this.roleStore.deleteEmployeeRole(roleName, emp.employee_username).then((res) =>
                {
                    if (res.data)
                    {
                        this.roleStore.setDataRoleEmp(this.roleStore.empRoles.filter((r) => r.Name !== roleName));
                    }
                });
            },
        });
    }
    searchRole = async (searchKey) =>
    {
        await this.setState({ searchKey });
        const res = await this.rolSvc.gets({
            searchKey: this.state.searchKey,
            skip: 0,
            take: -1,
        });
        this.setState({
            roles: res.data,
        });
    };

    render()
    {
        const { empRoles } = this.roleStore;
        const { roles } = this.state;

        const filter = empRoles.map(rol => rol.Name);
        const availableRoles = roles && roles.length && roles.filter(rol => !filter.includes(rol.Name));

        return (
            <Panel
                className={'panel-role-account'}
            >
                <PanelHeader>
                    <T>Vai trò</T>
                    <Button
                        innerRef={this.addRoleRef}
                        icon={'user-tag'}
                        color={'primary-color'}
                        text={'Thêm vai trò'}
                        className={'btn-add-role-to-employee'}
                        onClick={() => this.setState({ showAddPopup: true })}
                    />
                    {
                        this.state.showAddPopup && (
                            <PopOver
                                anchorEl={this.addRoleRef}
                                width={'25rem'}
                                height={'30rem'}
                                className={'popup-add-role-to-employee'}
                                anchor={'left'}
                                onBackgroundClick={() => this.setState({ showAddPopup: false })}
                            >
                                <Row>
                                    <Column>
                                        <Section className={'emp-role-header'}>
                                            <SectionHeader>Vai trò phù hợp</SectionHeader>
                                            <Row itemMargin={'md'}>
                                                <SearchBox
                                                    placeholder={'Nhập từ khóa để tìm kiếm'}
                                                    value={this.state.searchKey}
                                                    onChange={this.searchRole}
                                                />
                                            </Row>
                                        </Section>
                                        <ScrollView>
                                            <Container className={'emp-role-container'}>
                                                {
                                                    availableRoles && availableRoles.length
                                                        ? availableRoles.map((role)=>
                                                        {
                                                            return (
                                                                <ListItem
                                                                    key={role.Name}
                                                                    label={`${role.Name} (${role.Title})`}
                                                                    className={'role-item'}
                                                                    splitter
                                                                    onClick={()=>this.handleAddRole(role)}
                                                                />
                                                            );
                                                        })
                                                        : <EmptyData />
                                                }
                                            </Container>
                                        </ScrollView>
                                    </Column>
                                </Row>
                            </PopOver>
                        )}
                </PanelHeader>
                <PanelBody className={'role-container-item'}>
                    {
                        empRoles && empRoles.length
                            ? empRoles.map((rol)=>
                            {
                                return (
                                    <PanelHeader
                                        key={rol.Name}
                                        actions={[
                                            {
                                                icon: 'trash-alt',
                                                tooltip: 'Loại bỏ nhân viên khỏi vai trò',
                                                onClick: ()=>this.handleDeleteRole(rol.Name),
                                            },
                                        ]}
                                    >
                                        {rol.Name}
                                    </PanelHeader>
                                );
                            })
                            : <EmptyData />
                    }
                </PanelBody>
            </Panel>
        );
    }
}

RoleAccount = inject('appStore', 'fieldForceStore')(observer(RoleAccount));
RoleAccount = withModal(withI18n(withRouter(RoleAccount)));
export default RoleAccount;

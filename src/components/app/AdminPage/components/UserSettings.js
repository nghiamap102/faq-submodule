import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    Table, TableRowCell, TableRow,
    Button,
    Image,
    withModal,
} from '@vbd/vui';

import { UserService } from 'services/user.service';

const Enum = require('constant/app-enum');

class UserSettings extends Component
{
    userStore = this.props.appStore.userStore;
    userSvc = new UserService();

    constructor(props)
    {
        super(props);

        this.userSvc.getAll().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.userStore.setUsers(rs.data);
            }
        });
    }

    handleGrant = (userId, role) =>
    {
        this.userSvc.grant(userId, role).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                const user = this.userStore.users.find((u) => u.userId === userId);
                user.user = rs.data;
                this.userStore.setUser(user);
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }
        });
    };

    handleRevoke = (userId, role) =>
    {
        this.userSvc.revoke(userId, role).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                const user = this.userStore.users.find((u) => u.userId === userId);
                user.user = rs.data;
                this.userStore.setUser(user);
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }
        });
    };

    render()
    {
        const { users } = this.userStore;

        return (
            <Container className={'list-management'}>
                <Table
                    className={'result-table'}
                    headers={[
                        { label: 'STT', width: 50 },
                        { label: 'Ảnh đại diện', width: 150 },
                        { label: 'Email', width: 150 },
                        { label: 'Họ và tên' },
                        { label: 'Administrator ?', width: 150 },
                        { label: 'Supervisor ?', width: 150 },
                    ]}
                    isFixedHeader
                >
                    {
                        Array.isArray(users) && users.map((user, index) => (
                            <TableRow
                                key={user.id}
                            >
                                <TableRowCell>{index + 1}</TableRowCell>
                                <TableRowCell>
                                    <Image
                                        src={user.profile?.photos[0]?.value}
                                        alt={user.profile?.displayName}
                                        width={'50px'}
                                        height={'50px'}
                                    />
                                </TableRowCell>
                                <TableRowCell>{user.profile?.emails[0]?.value}</TableRowCell>
                                <TableRowCell>{user.profile?.displayName}</TableRowCell>
                                <TableRowCell>
                                    {
                                        user.user.roles && user.user.roles.Administrator
                                            ? (
                                                    <Button
                                                        color={'danger'}
                                                        text={'Bỏ quyền'}
                                                        onClick={() => this.handleRevoke(user.userId, 'Administrator')}
                                                    />
                                                )
                                            : (
                                                    <Button
                                                        color={'primary'}
                                                        text={'Cấp quyền'}
                                                        onClick={() => this.handleGrant(user.userId, 'Administrator')}
                                                    />
                                                )
                                    }
                                </TableRowCell>
                                <TableRowCell>
                                    {
                                        user.user.roles && user.user.roles.Supervisor
                                            ? (
                                                    <Button
                                                        color={'danger'}
                                                        text={'Bỏ quyền'}
                                                        onClick={() => this.handleRevoke(user.userId, 'Supervisor')}
                                                    />
                                                )
                                            : (
                                                    <Button
                                                        color={'primary'}
                                                        text={'Cấp quyền'}
                                                        onClick={() => this.handleGrant(user.userId, 'Supervisor')}
                                                    />
                                                )
                                    }
                                </TableRowCell>
                            </TableRow>
                        ),
                        )
                    }
                </Table>
            </Container>
        );
    }
}

UserSettings = withModal(inject('appStore')(observer(UserSettings)));

export { UserSettings };

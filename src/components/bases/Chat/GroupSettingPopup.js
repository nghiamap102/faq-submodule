import PropTypes from 'prop-types';
import React from 'react';

import { Button } from 'components/bases/Button/Button';
import { Popup, PopupFooter } from 'components/bases/Popup/Popup';
import { useModal } from 'components/bases/Modal/hooks/useModal';

import { UserListComponent } from './UserListComponent';
import { ChatRoles } from './chat.const';

export function GroupSettingPopup(props)
{
    const { confirm } = useModal();

    const group = props.group || {};
    const members = group.members?.filter((mem) => !mem.kickedAt) || [];
    const currentMember = group.currentMember || {};
    const profile = props.profile || {};

    const handleKickMember = (userId) =>
    {
        confirm({
            title: 'Xác nhận',
            message: <div style={{ padding: '1rem' }}>Xác nhận xóa thành viên khỏi nhóm?</div>,
            width: '400px',
            onOk: () =>
            {
                props.onLeaveGroup && props.onLeaveGroup({
                    memberId: members.find((mem) => mem.userId === userId)?.id,
                    isKick: true,
                });
            },
        });
    };

    const handleLeaveGroup = () =>
    {
        confirm({
            title: 'Xác nhận',
            message: <div style={{ padding: '1rem' }}>Xác nhận rời khỏi nhóm?</div>,
            width: '400px',
            onOk: () =>
            {
                props.onLeaveGroup && props.onLeaveGroup({
                    memberId: group.currentMember.id,
                });
                props.onClose && props.onClose();
            },
        });
    };

    const isAdmin = group.currentMember?.roleName === ChatRoles.Admin;

    const getActions = (userId) =>
    {
        return [
            {
                icon: 'user-times',
                onClick: handleKickMember,
                disabled: !isAdmin || userId === profile.userId,
            },
        ];
    };

    const getInfo = (userId) =>
    {
        let roleDisplay = '';
        const member = [...members, currentMember].find((mem) => mem.userId === userId) || {};

        if (member?.roleName === ChatRoles.Admin)
        {
            roleDisplay = 'Administrator';
        }
        else if (member?.roleName === ChatRoles.Member)
        {
            roleDisplay = 'Member';
        }

        return roleDisplay;
    };

    const userList = [profile, ...members.map((mem) => mem.user)].map(user =>
    {
        return {
            ...user,
            info: getInfo(user.userId),
            actions: getActions(user.userId),
        };
    });

    profile.name = profile.displayName || '';

    return (
        <Popup
            title={'Tùy chỉnh'}
            width={'400px'}
            height={'600px'}
            onClose={props.onClose}
        >
            <UserListComponent
                userList={userList}
                hideCheckbox
            />
            <PopupFooter>
                <Button
                    color={'primary'}
                    icon={'sign-out-alt'}
                    text={'Rời nhóm'}
                    onClick={handleLeaveGroup}
                />
            </PopupFooter>
        </Popup>
    );
}

GroupSettingPopup.propTypes = {
    profile: PropTypes.object,
    group: PropTypes.object,
    onClose: PropTypes.func,
    onLeaveGroup: PropTypes.func,
};

import './CreateChatGroup.scss';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';

import {
    SearchBox,
    Button, FormControlLabel, Input,
    Popup, PopupFooter,
    UserListComponent,
    ScrollView,
} from '@vbd/vui';

export function CreateChatGroup(props)
{
    const [searchKey, setSearchKey] = useState();
    const [userList, setUserList] = useState([]);
    const [searchUserList, setSearchUserList] = useState();
    const [userSelectedList, setUserSelectedList] = useState([]);
    const [groupName, setGroupName] = useState('');

    const { chatStore: { groups, controller: chatController } } = props.appStore;

    useEffect(() =>
    {
        (async function fetchUserList()
        {
            const resUsers = await chatController.getUsers();
            setUserList(resUsers.filter((user) => !props.excludedUserIds.includes(user.userId)));
        })();
    }, []);

    const handleSearchKeyOnChange = (value) =>
    {
        setSearchKey(value);
        if (!value)
        {
            return setSearchUserList(null);
        }
        setSearchUserList(userList.filter((user) => user.displayName.toLowerCase().includes(value.toLowerCase())));
    };

    const handleClickUser = (user) =>
    {
        setUserSelectedList((currentList) =>
        {
            const existIndex = currentList.indexOf(user.userId);
            if (existIndex > -1)
            {
                return currentList.filter((_, i) => i !== existIndex);
            }
            else
            {
                return [...currentList, user.userId];
            }
        });
    };

    return (
        <Popup
            className="create-chat-group"
            title={(!props.isAddMember) ? 'Tạo nhóm mới' : 'Thêm thành viên'}
            width={'400px'}
            height={'600px'}
            scroll
            onClose={props.onActionDone}
        >
            {
                !props.isAddMember && (
                    <FormControlLabel
                        className={'create-chat-group-input'}
                        control={(
                            <Input
                                value={groupName}
                                placeholder={'Tên nhóm'}
                                autoFocus
                                onChange={setGroupName}
                            />
                        )}
                    />
                )}

            <SearchBox
                value={searchKey}
                placeholder={'Nhập từ khóa để tìm kiếm'}
                onChange={handleSearchKeyOnChange}
            />
            <ScrollView>
                <UserListComponent
                    userList={searchUserList || userList}
                    userSelectedList={userSelectedList}
                    onClickUser={handleClickUser}
                />
            </ScrollView>

            <PopupFooter>
                <Button
                    color={'primary'}
                    text={!props.isAddMember ? 'Tạo' : 'Thêm'}
                    onClick={() => props.onActionDone({ userSelectedList, groupName })}
                />
            </PopupFooter>

        </Popup>

    );
}

CreateChatGroup.propTypes = {
    userList: PropTypes.array,
    userSelectedList: PropTypes.array,
    onActionDone: PropTypes.func,
    isAddMember: PropTypes.bool,
    excludedUserIds: PropTypes.array,
};

CreateChatGroup.defaultProps = {
    userList: [],
    userSelectedList: [],
    excludedUserIds: [],
};

export default inject('appStore')(observer(CreateChatGroup));

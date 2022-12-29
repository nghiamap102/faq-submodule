import React from 'react';
import PropTypes from 'prop-types';

import { UserListItem } from './subcomponents/UserListItem';

import './UserListComponent.scss';

export function UserListComponent(props)
{
    return (
        <div className="user-list">
            {
                props.userList?.map((user) => (
                    <UserListItem
                        key={user.userId}
                        user={user}
                        value={props.userSelectedList.includes(user.userId)}
                        hideCheckbox={props.hideCheckbox}
                        onClick={props.onClickUser}
                    />
                ),
                )
            }
        </div>
    );
}

UserListComponent.propTypes = {
    userList: PropTypes.array,
    userSelectedList: PropTypes.array,
    onClickUser: PropTypes.func,
    getAction: PropTypes.func,
    getInfo: PropTypes.func,
    hideCheckbox: PropTypes.bool,
};

UserListComponent.defaultProps = {
    userList: [],
    userSelectedList: [],
};

import React from 'react';
import PropTypes from 'prop-types';
import { FAIcon } from '@vbd/vicon';

import { Row2 } from 'components/bases/Layout/Row';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { Col2 } from 'components/bases/Layout/Column';

import { UserAvatar } from './UserAvatar';

import './UserListItem.scss';

export function UserListItem(props)
{
    const user = props.user;
    const { info, actions } = user;

    const handleAction = (e, action, user) =>
    {
        e.stopPropagation();
        action.onClick && action.onClick(user.userId);
    };

    return (
        <Row2
            className='user-list-item'
            justify="between"
            items="center"
        >
            <Col2
                component="a"
                tabIndex={0}
                onClick={(_) => props.onClick && props.onClick(user)}
            >
                <Row2>
                    {
                        !props.hideCheckbox && (
                            <CheckBox
                                checked={props.value}
                            />
                        )}
                    <UserAvatar
                        src={user.avatar}
                        lastActiveAt={user.lastActiveAt}
                    />
                    <Col2>
                        <div className='user-name'>{user.displayName}</div>
                        {info && <span className="info">{info}</span>}
                    </Col2>
                </Row2>
            </Col2>
            {
                actions && (
                    <Col2
                        items="end"
                        className="actions"
                    >
                        <Row2>
                            {
                                actions.map((action, index) =>
                                {
                                    if (!action.disabled)
                                    {
                                        return (
                                            <Col2
                                                key={index}
                                                className="item"
                                                justify='center'
                                            >
                                                <FAIcon
                                                    size="1rem"
                                                    icon={action.icon}
                                                    type="solid"
                                                    onClick={(e) => handleAction(e, action, user)}
                                                />
                                            </Col2>
                                        );
                                    }
                                })
                            }
                        </Row2>
                    </Col2>
                )}
        </Row2>
    );
}

UserListItem.propTypes = {
    hideCheckbox: PropTypes.bool,
    user: PropTypes.object,
    value: PropTypes.bool,
    info: PropTypes.any,
};

export default UserListItem;

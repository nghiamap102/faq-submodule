import './ChatListItem.scss';

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { GroupAvatar } from './GroupAvatar';
import { UserAvatar } from './UserAvatar';
import { FeatureItem } from 'components/bases/FeatureBar/FeatureItem';

export function ChatListItem(props)
{
    const group = props.group || {};
    const members = props.group.members;
    const currentMember = group.currentMember || {};
    const groupItemRef = useRef();
    
    const content = (
        <>
            { members.length > 0 && members.length < 2
                ? (
                        <UserAvatar
                            src={members[0]?.user.avatar}
                            lastActiveAt={members[0].user?.lastActiveAt}
                            showOnlineStatus
                        />
                    )
                : <GroupAvatar members={members} />
            }
        </>
    );

    return (
        <>
            <div
                ref={groupItemRef}
                className='group-item'
                onMouseEnter={() => props.setShowTooltip && props.setShowTooltip(groupItemRef, group.info.groupName)}
                onMouseLeave={() => props.setShowTooltip && props.setShowTooltip(null)}
            >
                <FeatureItem
                    badgeCount={currentMember?.unreadCount}
                    content={content}
                    active={props.active}
                />
            </div>
        </>
    );
}

ChatListItem.propTypes = {
    group: PropTypes.object,
    setShowTooltip: PropTypes.func,
    active: PropTypes.bool,
};

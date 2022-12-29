import React from 'react';
import PropTypes from 'prop-types';

import { UserAvatar } from './UserAvatar';

import './GroupAvatar.scss';

export function GroupAvatar(props)
{
    const members = props.members || [];

    return (
        <div className='group-avatar'>
            {
                members.map((mem, i) =>
                {
                    if (i >= 4)
                    {
                        return;
                    }

                    return (
                        <UserAvatar
                            key={i}
                            src={mem.user.avatar}
                            lastActiveAt={mem.user?.lastActiveAt}
                            showOnlineStatus
                        />
                    );
                })
            }
        </div>
    );
}

GroupAvatar.propTypes = {
    members: PropTypes.array,
    lastActiveAt: PropTypes.string,
};

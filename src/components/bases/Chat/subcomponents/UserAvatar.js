import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './UserAvatar.scss';

export function UserAvatar(props)
{

    const isOnline = props.lastActiveAt && moment().diff(moment(props.lastActiveAt), 'm') < 5;
    return (
        <div className='user-avatar'>
            <img
                src={props.src}
                className="chat-avatar"
            />
            {
                props.showOnlineStatus && <div className={['user-status', (isOnline) ? 'online' : 'offline'].join(' ')} />
            }
        </div>
    );
}

UserAvatar.propTypes = {
    src: PropTypes.string,

    showOnlineStatus: PropTypes.bool,
    lastActiveAt: PropTypes.any,
};

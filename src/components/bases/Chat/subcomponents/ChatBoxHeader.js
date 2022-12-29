import React from 'react';
import PropTypes from 'prop-types';

export function ChatBoxHeader(props)
{
    return (
        <div className="chat-box-header">
            <p>{props.groupInfo && props.groupInfo.groupName}</p>
        </div>
    );
}

ChatBoxHeader.propTypes = {
    groupInfo: PropTypes.object,
};

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { PanelHeader } from 'components/bases/Panel/PanelHeader';
import { PanelBody2 } from 'components/bases/Panel/Panel';

import { ChatBoxHeader } from './subcomponents/ChatBoxHeader';
import { ChatView } from './subcomponents/ChatView';
import { ChatActions } from './subcomponents/ChatActions';
import { ChatRoles } from './chat.const';

import './ChatBoxComponent.scss';

export const ChatBoxComponent = (props) =>
{
    const [scrollRef, setScrollRef] = useState();

    const group = props.group || {};

    function handleSendMessage(content)
    {
        props.onSendMessage && props.onSendMessage(content);
    }


    const scrollToBottom = () =>
    {
        // Update scroll position
        if (scrollRef)
        {
            scrollRef._container.scrollTop = scrollRef._ps.contentHeight;
        }
    };

    const isMuted = group.currentMember?.config?.notification;

    const panelHeaderActions = [
        {
            icon: 'plus',
            onClick: props.onAddMember,
            disabled: group.currentMember?.roleName !== ChatRoles.Admin || group.currentMember?.kickedAt,
        },
        {
            icon: 'cog',
            onClick: props.onSetting,
            disabled: group.currentMember?.kickedAt,
        },
        {
            icon: isMuted ? 'bell-slash' : 'bell',
            onClick: props.onMute,
            disabled: group.currentMember?.kickedAt,
        },
        {
            icon: 'times',
            onClick: props.onClose,
        },
    ];

    const isKickedAt = group.currentMember?.kickedAt;

    return (
        <div
            className="chat-box"
            style={{ width: `${props.width}` }}
        >
            <PanelHeader actions={panelHeaderActions}>
                <ChatBoxHeader groupInfo={group.info} />
            </PanelHeader>
            <PanelBody2>
                <ChatView
                    profile={props.profile}
                    group={group}
                    messages={props.messages}
                    latestReadMessageId={group.lastReadMessage}
                    noMoreMessage={props.noMoreMessage}
                    setScrollRef={setScrollRef}
                    trackingReadLatestMessage={props.trackingReadLatestMessage}
                    onLoadMoreMessage={props.onLoadMoreMessage}
                />
                {
                    !isKickedAt && (
                        <ChatActions
                            scrollToBottom={scrollToBottom}
                            groupId={group.info.id}
                            onSendMessage={handleSendMessage}
                        />
                    )}
            </PanelBody2>
        </div>
    );
};

ChatBoxComponent.propTypes = {
    profile: PropTypes.object,
    group: PropTypes.object,
    messages: PropTypes.array,
    noMoreMessage: PropTypes.bool,

    onSendMessage: PropTypes.func,
    onClickUser: PropTypes.func,
    onClose: PropTypes.func,
    onAddMember: PropTypes.func,
    onLoadMoreMessage: PropTypes.func,
    onSetting: PropTypes.func,
    onMute: PropTypes.func,
    trackingReadLatestMessage: PropTypes.func,

    draft: PropTypes.string,
    setDraft: PropTypes.func,

    width: PropTypes.string,
};

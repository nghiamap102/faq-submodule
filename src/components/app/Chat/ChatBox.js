import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';

import ChatBoxComponent from '@vbd/vui';
import CreateChatGroup from '@vbd/vui';
import GroupSettingPopup from '@vbd/vui';

function ChatBox(props)
{
    // store values
    const { chatStore } = props.appStore;
    const { controller: chatController, displayingGroupId, groupMessages } = chatStore;
    const messages = groupMessages[displayingGroupId];
    const group = chatStore.getGroupById(displayingGroupId);
    const profile = props.appStore.profile || {};

    // flags
    const [noMoreMessage, setNoMoreMessage] = useState({});

    // Popup opening states
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [isSetting, setIsSetting] = useState(false);

    // Load messages on change displayingGroupId first
    useEffect(() =>
    {
        if (displayingGroupId && (!messages || messages.length === 0))
        {
            getMessages({ groupId: displayingGroupId });
        }
    }, [displayingGroupId]);

    const handleClose = () =>
    {
        chatController.handleClickGroup(null);
    };

    // Load more messages
    const handleLoadMoreMessage = () =>
    {
        return getMessages({ groupId: displayingGroupId, createdAt: messages[0].createdAt });
    };

    const getMessages = (payload) =>
    {
        if (noMoreMessage[displayingGroupId])
        {
            return Promise.resolve([]);
        }

        return chatController.getMessages(payload).then((value) =>
        {
            if (!value || value.length === 0)
            {
                setNoMoreMessage({ ...noMoreMessage, [displayingGroupId]: true });
            }
        });
    };

    const handleAddMember = (result) =>
    {
        if (result && result.userSelectedList)
        {
            chatController.addGroupMember({
                groupId: displayingGroupId,
                userIds: result.userSelectedList
            });
        }

        setIsAddingMember(false);
    };

    const handleNotificationMute = () =>
    {
        chatController.updateMemberConfig({
            memberId: group.currentMember.id,
            config: {
                notification: !group.currentMember.config.notification
            }
        });
    };

    const trackingMemberMessage = ({ message }) =>
    {
        chatController.trackingMemberMessage(message);
    };


    return (
        <>
            {
                group &&
                <ChatBoxComponent
                    profile={profile}
                    group={group}
                    messages={messages}
                    noMoreMessage={noMoreMessage[displayingGroupId]}
                    onSendMessage={(content) => chatController.sendMessage({
                        groupId: displayingGroupId,
                        textContent: content,
                        memberId: group.currentMember.id,
                        userId: props.appStore.profile.userId
                    })}
                    onClose={handleClose}
                    onAddMember={() => setIsAddingMember(true)}
                    onLoadMoreMessage={handleLoadMoreMessage}
                    onSetting={() => setIsSetting(true)}
                    onMute={handleNotificationMute}
                    trackingReadLatestMessage={(message) => trackingMemberMessage({ message })}
                    width={'25rem'}
                />
            }

            {
                isAddingMember &&
                <CreateChatGroup
                    isAddMember
                    onActionDone={handleAddMember}
                    excludedUserIds={group.members.filter((mem) => !mem.kickedAt).map((mem) => mem.user.userId)}
                />
            }

            {
                isSetting &&
                <GroupSettingPopup
                    profile={profile}
                    group={group}
                    onClose={() => setIsSetting(false)}
                    onLeaveGroup={(options) => chatController.handleLeaveGroup(options)}
                />
            }
        </>
    );
}

export default inject('appStore')(observer(ChatBox));

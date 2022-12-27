import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';

import { ChatListComponent, CreateChatGroup } from '@vbd/vui';

function ChatList(props)
{
    const { chatStore } = props.appStore;
    const { groups, controller: chatController } = chatStore;
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    const onCreateGroup = (group) =>
    {
        if (group)
        {
            const { userSelectedList, groupName } = group;

            chatController.createGroup({ userIds: userSelectedList, groupName: groupName });
        }

        setIsCreatingGroup(false);
    };

    return (
        <>
            <ChatListComponent
                groups={groups}
                displayingGroupId={chatStore.displayingGroupId}
                onClickItem={(groupId) => chatController.handleClickGroup(groupId)}
                onAddGroup={() => setIsCreatingGroup(true)}
            />
            {
                isCreatingGroup && (
                    <CreateChatGroup
                        onActionDone={onCreateGroup}
                    />
                )}
        </>
    );
}

export default inject('appStore')(observer(ChatList));


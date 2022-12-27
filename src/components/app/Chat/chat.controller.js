import moment from 'moment';

import { ChatService } from './chat.service';

import Post from '@vbd/vui';

import { MessageTypes } from 'components/app/Chat/chat.const';
import { CommonHelper } from 'helper/common.helper';

export class ChatController
{
    constructor(store)
    {
        this.store = store;
        this.service = new ChatService();
        this.service.subscribeMessage((message) => this.handleNewMessage(message));
        this.service.subscribeMember((member) => this.handleNewMember(member));
        this.initData();
    }

    async initData()
    {
        await this.getUsers();
        this.getGroups();
    }

    // USERS
    async getUsers()
    {
        const resUsers = await this.service.getUsers();
        this.store.setUsers(resUsers);
        return resUsers;
    }

    // GROUP + MEMBER
    async addGroupMember({ groupId, userIds })
    {
        await this.service.addMembers({ groupId, userIds });
    }

    async getGroups()
    {
        const resGroups = await this.service.getGroups();
        this.store.setGroups(resGroups);
        return Promise.all(resGroups.map((group) => this.getMessages({ groupId: group.group.id })))
            .then(() =>
            {
                this.store.groups = this.store.groups.sort((a, b) =>
                {
                    const aMessages = this.store.groupMessages[a.info.id];
                    const bMessages = this.store.groupMessages[b.info.id];
                    if (!aMessages || !bMessages || aMessages.length < 1 || bMessages.length < 1)
                    {
                        return 0;
                    }
                    return moment(aMessages[aMessages.length - 1].createdAt).isBefore(bMessages[bMessages.length - 1].createdAt) ? 1 : -1;
                });
            });
    }

    async createGroup(group)
    {
        return this.service.createGroup(group);
    }

    handleClickGroup(groupId)
    {
        if (this.store.displayingGroupId === groupId)
        {
            this.store.setDisplayingGroup(null);
        }
        else
        {
            this.store.setDisplayingGroup(groupId);
        }
    }

    handleClickCreateGroup(value)
    {
        this.store.setCreatingGroup(value);
    }

    async updateGroupConfig({ groupId, config })
    {
        const resGroup = await this.service.updateGroupConfig({ groupId, config });
        if (resGroup)
        {
            this.store.updateGroup(resGroup);
        }
    }

    handleLeaveGroup({ memberId, isKick })
    {
        this.service.leaveGroup({ memberId, isKick });
    }

    async updateMemberConfig({ memberId, config })
    {
        const resMember = await this.service.updateMemberConfig({ memberId, config });
        if (resMember)
        {
            this.store.updateMember({ newMember: resMember });
        }
    }

    async trackingMemberMessage(message)
    {
        const group = this.store.groups.find((group) => group.info.id === message.groupId);
        const payload = {
            groupId: group.info.id,
            memberId: group.currentMember.id,
            trackingData: {
                lastReadMessageId: message.id,
                lastReadMessageAt: message.createdAt,
            },
            userIds: group.members.map((mem) => mem.userId),
        };
        this.service.trackingMemberMessage(payload);
        this.store.updateMember({ group, newMember: { ...group.currentMember, lastReadMessageId: message.id } });
        this.store.countUnReadMessage(group.info.id);
    }

    // MESSAGES
    async getMessages({ groupId, createdAt })
    {
        const resMess = await this.service.getMessages({ groupId, createdAt });

        this.store.addMessage({ groupId, newMessages: resMess, isLoadMore: createdAt });

        return resMess;
    }

    async sendMessage(message)
    {
        const localId = CommonHelper.uuid();

        message.localId = localId;
        message.createdAt = new Date();

        this.store.addMessage({ groupId: message.groupId, newMessages: [message] });

        const resMessage = await this.service.createMessage(message);
        if (!resMessage)
        {
            return;
        }
        resMessage.localId = localId;

        return this.store.addMessage({ groupId: resMessage.groupId, newMessages: [resMessage] });
    }


    // SOCKET

    async handleNewMessage(message)
    {
        const groupId = message.groupId;

        if ([MessageTypes.Group, MessageTypes.Member].includes(message.type))
        {
            await this.syncGroup(groupId);
        }
        else
        {
            this.store.addMessage({ groupId: groupId, newMessages: [message] });
        }

        if (this.store.displayingGroupId !== groupId)
        {
            const group = this.store.getGroupById(groupId);
            const isMuted = group?.currentMember?.config?.notification;

            if (!isMuted)
            {
                this.toastMessage(message);
            }
        }
    }

    async handleNewMember(member)
    {
        const mappedMember = {
            groupId: member.groupId,
            id: member.memberId,
            ...member.trackingData,
        };
        this.store.updateMember({ newMember: mappedMember });
    }

    async syncGroup(groupId)
    {
        const resGroup = await this.service.getGroupById(groupId);

        if (!resGroup)
        {
            this.store.removeGroup(groupId);
            return;
        }

        await this.getUsers();
        this.store.addGroup(resGroup);

        const newMessages = await this.service.getMessages({ groupId: resGroup.group.id });
        this.store.addMessage({ groupId: resGroup.group.id, newMessages });
        return resGroup;
    }

    toastMessage(message)
    {
        const onClickToast = () =>
        {
            this.store.appStore.featureBarStore.showChat = true;
            this.store.setDisplayingGroup(message.groupId);
        };

        const group = this.store.groups.find((g) => g.id == message.groupId);
        const users = [...group?.members.map((mem) => mem.user) || [], this.store.appStore.profile];

        const sender = (group ? users : this.store.users).find((user) => user.userId == message.userId);
        message.textContent = message.textContent.replace(/@[\w.]+/g, (match) =>
        {
            const user = users.find((user) => user.userName == match.slice(1));
            return user && user.displayName ? `@${user.displayName}` : match;
        });

        const post = (
            <Post
                message={message}
                user={sender}
                showAvatar
                showSender
                fullWidth
            />
        );

        // need to use hook here
        // toast({
        //     child: post,
        //     onClick: onClickToast,
        // });
    }
}

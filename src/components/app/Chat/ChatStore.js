import { decorate, observable, toJS } from 'mobx';
import { action } from 'mobx';
import { ChatController } from './chat.controller';

export class ChatStore
{
    appStore = null;

    constructor(appStore)
    {
        this.appStore = appStore;
        this.controller = new ChatController(this);
    }

    users = [];
    groups = [];
    groupMessages = {};
    displayingGroupId = '';

    // GROUP

    setDisplayingGroup(groupId)
    {
        this.displayingGroupId = groupId;
    }

    getGroups()
    {
        return this.groups;
    }

    getGroupById(groupId)
    {
        return this.groups.find((group) => group.group.id === groupId);
    }

    processDataGroup(group)
    {
        const profile = this.appStore.profile;

        const members = group.members.filter((mem) => mem.userId !== profile.userId).map((mem) => ({
            ...mem,
            user: this.getUserById(mem.userId) || {}
        }));

        const groupName = group.group.groupName || members.map((mem) => mem.user).map((user) => user?.displayName || '').join(', ');

        return {
            ...group,
            members,
            info: {
                ...group.group,
                groupName
            },
            currentMember: group.members.find((mem) => mem.userId === profile.userId)
        };
    }

    setGroups(groups)
    {
        this.groups = groups.map((group) => this.processDataGroup(group));
    }

    addGroup(newGroup)
    {
        if (!newGroup)
        {
            return;
        }

        newGroup = this.processDataGroup(newGroup);

        if (this.groups.some((group) => group.group.id === newGroup.group.id))
        {
            this.updateGroup(newGroup);
        }
        else
        {
            this.groups = [newGroup, ...this.groups];
            this.groupMessages[newGroup.id] = [];
        }
    }

    updateGroup(newGroup)
    {
        this.groups = this.groups.map((group) =>
        {
            if (group.group.id === newGroup.group.id)
            {
                return { ...group, ...newGroup };
            }
            else
            {
                return group;
            }
        });
    }

    removeGroup(groupId)
    {
        this.groups = this.groups.filter((group) => group.info.id !== groupId);
    }

    updateMember({ group, newMember })
    {
        if (!newMember)
        {
            return;
        }
        const currentGroup = group || this.groups.find((g) => g.info.id === newMember.groupId);
        if (!currentGroup)
        {
            return;
        }

        currentGroup.members = currentGroup.members.map((member) =>
        {
            if (member.id === newMember.id)
            {
                return { ...member, ...newMember };
            }
            else
            {
                return member;
            }
        });

        if (currentGroup.currentMember.id === newMember.id)
        {
            currentGroup.currentMember = { ...currentGroup.currentMember, ...newMember };
        }

        this.updateGroup(currentGroup);
    }

    // USER

    setUsers(users)
    {
        this.users = users;
    }

    addUser(user)
    {
        this.users = [...this.users, user];
    }

    getUsersByUserIds(userIds)
    {
        return this.users.filter((user) => userIds?.includes(user.userId));
    }

    getUserById(userId)
    {
        return this.users.find((user) => user.userId === userId);
    }

    // MESSAGE

    addMessage({ groupId, newMessages, isLoadMore })
    {
        if (!newMessages)
        {
            return;
        }
        if (!this.groupMessages[groupId])
        {
            this.groupMessages[groupId] = newMessages;
        }
        else
        {
            const messages = this.groupMessages[groupId];
            const canAddMessages = [];
            newMessages.forEach((newMes) =>
            {
                const isDup = messages.some((mes) => this.isSameMessage(newMes, mes));
                if (isDup)
                {
                    this.updateMessage(newMes);
                }
                else
                {
                    canAddMessages.push(newMes);
                }
            });
            if (!isLoadMore && canAddMessages.length > 0)
            {
                const groupIndex = this.groups.findIndex((group) => group.info.id === groupId);
                this.groups = [this.groups[groupIndex], ...this.groups.slice(0, groupIndex), ...this.groups.slice(groupIndex + 1)];
            }
            this.groupMessages[groupId] = isLoadMore ? [...canAddMessages, ...messages] : [...messages, ...canAddMessages];
        }

        this.countUnReadMessage(groupId);
    }

    updateMessage(newMessage)
    {
        if (!newMessage)
        {
            return;
        }

        const groupMessages = this.groupMessages[newMessage.groupId];

        if (!groupMessages)
        {
            return;
        }
        const messIndex = groupMessages.findIndex((m) => this.isSameMessage(m, newMessage));
        groupMessages[messIndex] = { ...groupMessages[messIndex], ...newMessage };
    }

    isSameMessage = (a, b) => ((a.id && b.id && a.id === b.id) || (a.localId && b.localId && a.localId === b.localId));

    countUnReadMessage = (groupId) =>
    {
        const messages = this.groupMessages[groupId];
        const group = this.groups.find((group) => group.info.id === groupId);
        const currentMember = group?.currentMember;

        if (!currentMember || !messages)
        {
            return;
        }
        const readMessageIndex = messages.findIndex((message) => message.id === currentMember.lastReadMessageId);
        if (!currentMember.lastReadMessageId || readMessageIndex < 0)
        {
            currentMember.unreadCount = messages.length;
        }
        else
        {
            currentMember.unreadCount = messages.slice(readMessageIndex + 1).filter((mes) => mes.userId !== currentMember.userId).length;
        }
        
        this.updateGroup(group);
    };
}

decorate(ChatStore, {
    appStore: observable,
    users: observable,
    groups: observable,
    groupMessages: observable,
    displayingGroupId: observable,
    getGroups: action,
    setGroups: action,
    addGroups: action,
    updateGroup: action,
    addMessage: action
});

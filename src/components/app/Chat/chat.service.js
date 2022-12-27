import { WebSocketService } from '@vbd/vui';

import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { SocketChannels } from './chat.const';

export class ChatService
{
    http = new HttpClient();
    messageSubscribers = [];
    memberSubscribers = [];

    constructor(props)
    {
        WebSocketService.subscribeChanel(SocketChannels.Message, (mes) => this.handleNewMessage(mes));
        WebSocketService.subscribeChanel(SocketChannels.Member, (mem) => this.handleNewMember(mem));
    }

    // CHAT GROUP + MEMBER
    async createGroup(group)
    {
        const res = await this.http.post('/api/chat-groups', group, AuthHelper.getSystemHeader());
        return res.data;
    }

    async updateGroupConfig({ groupId, config })
    {
        const res = await this.http.put(`/api/chat-groups/${groupId}`, config, AuthHelper.getSystemHeader());
        return res.data;
    }

    async getGroups()
    {
        const res = await this.http.get('/api/chat-members', AuthHelper.getSystemHeader());
        return res.data || [];
    }

    async getGroupById(groupId)
    {
        const res = await this.http.get('/api/chat-members/?groupId=' + groupId, AuthHelper.getSystemHeader());
        return res.data && res.data.length > 0 && res.data[0];
    }

    async updateMemberConfig({ memberId, config })
    {
        const res = await this.http.put(`/api/chat-members/${memberId}`, { config: config }, AuthHelper.getSystemHeader());
        return res.data;
    }

    async addMembers({ groupId, userIds })
    {
        const res = await this.http.post('/api/chat-members', { groupId, userIds }, AuthHelper.getSystemHeader());
        return res.data;
    }

    leaveGroup({ memberId, isKick })
    {
        this.http.delete(`/api/chat-members/${memberId}${isKick ? ':kick' : ''}`, null, AuthHelper.getSystemHeader());
    }

    async trackingMemberMessage(payload)
    {
        WebSocketService.sendMessage(SocketChannels.Member, payload);
        // const res = await this.http.put(`/api/chat-members/tracking/${memberId}`, track, AuthHelper.getSystemHeader());
        // return res.data;
    }

    // CHAT USER

    async getUsers()
    {
        const res = await this.http.get('/api/chat-users', AuthHelper.getSystemHeader());
        return res.data?.users || [];
    }

    // CHAT MESSAGE

    async getMessages({ groupId, createdAt })
    {
        const res = await this.http.get('/api/chat-messages/' + `?groupId=${groupId}` + (createdAt ? `&createdAt=${createdAt}` : ''), AuthHelper.getSystemHeader());
        if (res.data)
        {
            return res.data.messages.reverse();
        }
    }

    async createMessage(message)
    {
        const res = await this.http.post('/api/chat-messages', message, AuthHelper.getSystemHeader());
        return res.data;
    }

    // SOCKET
    handleNewMessage(message)
    {
        this.messageSubscribers.forEach((sub) => sub(message));
    }

    subscribeMessage(subscriber)
    {
        this.messageSubscribers.push(subscriber);
    }

    handleNewMember(member)
    {
        this.memberSubscribers.forEach((sub) => sub(member));
    }

    subscribeMember(subscriber)
    {
        this.memberSubscribers.push(subscriber);
    }
}

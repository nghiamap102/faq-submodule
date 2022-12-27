import moment from 'moment';
import { random } from 'faker';

import { WebSocketService } from '@vbd/vui';

import HttpClient from 'helper/http.helper';

const date = new Date();
const MOCK_CURRENT_USER_ID = 'user1';
const MOCK_GROUPS = [
    {
        group: {
            id: 'group1',
            name: 'Test existing group',
        },
        members: [
            { userId: 'user1', config: {} },
            { userId: 'user2', config: {} },
        ],

    },
    {
        group: {
            id: 'group2',
            name: 'Test new group created by other user',
        },
        members: [
            { userId: 'user3', config: {} },
            { userId: '', config: {} },
        ],
    },
    {
        group: {
            id: 'group3',
            name: 'Group 3',
        },
        members: [
            { userId: 'user2', config: {} },
            { userId: '', config: {} },
        ],
    },
    {
        group: {
            id: 'group4',
            name: 'Group 4',
        },
        members: [
            { userId: 'user4', config: {} },
            { userId: '', config: {} },
        ],
    },
];

const MOCK_USERS = [
    {
        userId: 'user1',
        name: 'User 1',
        avatar: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/SI/en/999/EP3351-CUSA08250_00-AV00000000000171/1580140075000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000',
        lastActiveAt: date.toISOString(),
    },
    {
        userId: 'user2',
        name: 'User 2',
        avatar: 'https://news.artnet.com/app/news-upload/2019/01/Cat-Photog-Feat-256x256.jpg',
        lastActiveAt: moment(date).subtract(moment.duration(5, 'm')).toISOString(),
    },
    {
        userId: 'user3',
        name: 'User 3',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSehmo1u6EUWLzYeiU8wCgXxfWZ9F7J-zDRiA&usqp=CAU',
        lastActiveAt: moment(date).subtract(moment.duration(15, 'm')).toISOString(),
    },
    {
        userId: 'user4',
        name: 'User 4',
        avatar: 'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
        lastActiveAt: moment(date).subtract(moment.duration(15, 'm')).toISOString(),
    },
];

const MOCK_GROUP_MESSAGES = {};

function generateMessages(m_count, groupId)
{
    const timestamp = new Date().getTime();
    const result = [];
    for (let i = 0; i < m_count; i++)
    {

        const userId = random.arrayElement(['user1', 'user2']);
        result.push({
            id: random.uuid(),
            userId,
            groupId,
            textContent: 'Existing message[' + i + '] created by [' + userId + '] at [' + (timestamp + i) + ']',
            createdAt: new Date(timestamp + i),
        });
    }
    return result;
}

MOCK_GROUP_MESSAGES['group1'] = [...generateMessages(30, 'group1')];


export class ChatService
{
    http = new HttpClient();

    constructor(props)
    {
        WebSocketService.subscribeChanel('ws:chat-message-received', this.handleNewMessage);
        this.subscribers = [];
        // setTimeout(() => this.handleNewMessage({ id: random.uuid(), groupId: 'group3', userId: 'user2', content: 'new group' }), 4000);
        // setTimeout(() => this.handleNewMessage({ id: random.uuid(), groupId: 'group2', userId: 'user2', content: 'something from socket' }), 10000);
    }

    // CHAT GROUP + MEMBER

    getGroups()
    {
        // return this.http.get('/api/chat-members', AuthHelper.getSystemHeader());
        // get groups of current user
        return Promise.resolve(MOCK_GROUPS.filter((group) => group.members.some((user) => user.userId == MOCK_CURRENT_USER_ID)));
    }

    getGroupById(groupId)
    {
        // return this.http.get('/api/chat-members/' + groupId, AuthHelper.getSystemHeader());
        return Promise.resolve(MOCK_GROUPS.find((group) => group.group.id == groupId));
    }

    createGroup(group)
    {
        // return this.http.post('/api/chat_groups', group, AuthHelper.getSystemHeader());
        this.createMessage({
            groupId: 'group4',
            userId: 'user4',
        });
        const result = { success: true };
        return Promise.resolve(result);
    }

    addMember({ groupId, userId })
    {
        // return this.http.post('/api/members', { groupId, userId }, AuthHelper.getSystemHeader());
        this.createMessage({
            groupId,
            userId: 'user3',
            content: 'được thêm vào nhóm',
            type: 'system',
        });
        const result = { success: true };
        return Promise.resolve(result);
    }

    // CHAT USER

    getUsers()
    {
        // return this.http.get('/api/chat-users', AuthHelper.getSystemHeader());
        return Promise.resolve(MOCK_USERS);
    }

    // CHAT MESSAGE
    async generateNewMessage({ groupId, userId })
    {
        const generateId = () => new Promise(
            (resolve) => setTimeout(
                () => resolve((new Date()).getTime())
                , 10),
        );
        const id = await generateId();
        const date = new Date(id);
        return {
            id: id,
            groupId,
            content: 'Message created at ' + date.toISOString(),
            createdAt: date,
        };
    }

    async getMessages({ groupId, createdAt })
    {
        // return this.http.get('/api/chat-messages/' + groupId + '?' + createdAt ? `createdAt=${createdAt}` : '', AuthHelper.getSystemHeader());
        return new Promise((resolve) =>
        {
            const messageArray = MOCK_GROUP_MESSAGES[groupId];
            let end = messageArray.length;
            if (createdAt)
            {
                end = messageArray.findIndex((m) => moment(m.createdAt).isSameOrAfter(createdAt));
            }
            const result = messageArray.slice(Math.max(end - 5, 0), end) || [];
            setTimeout(() => resolve(result), 500);
        });
    }

    createMessage(message)
    {
        // return this.http.post('/api/chat-messages', message, AuthHelper.getSystemHeader());
        const response = {
            groupId: message.groupId,
            userId: 'user2',
            textContent: message.textContent + ' [by user 2]',
            id: random.uuid(),
            createdAt: new Date(),
        };
        setTimeout(() => this.handleNewMessage(response), 1000);

        const newMes = {
            ...message,
            textContent: message.textContent + ' server',
            userId: 'user1',
            id: random.uuid(),
            createdAt: new Date(),
        };
        return new Promise((resolve) => setTimeout(() => resolve(newMes), 500));
    }

    // SOCKET

    handleNewMessage(message)
    {
        this.subscribers.forEach((sub) => sub({ ...message, content: message.content + ' from socket ' }));
    }

    subscribeMessage(subscriber)
    {
        this.subscribers.push(subscriber);
    }
}

import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import faker from 'faker';

import { ChatBoxComponent } from './ChatBoxComponent';

export default {
    title: 'Bases/Chat/ChatBoxComponent',
    component: ChatBoxComponent,
};

const group = {
    group: {
        name: 'Test group chat',
    },
    users: ['pikachu01', 'songoku02'],
    config: {

    },
    lastReadMessage: '5',
    role: {},
};

const members = [
    {
        id: 'pikachu01',
        name: 'Pikachu',
        status: 'online',
        avatar: 'data:image/png;base64,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',
    },
    {
        id: 'songoku02',
        name: 'Songoku',
        status: 'offline',
        avatar: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/SI/en/999/EP3351-CUSA08250_00-AV00000000000171/1580140075000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000',
    },
];

const messages = [
    {
        id: '1',
        content: 'This is message 1!',
        userId: 'pikachu01',
        createdAt: '1606819334',
    },
    {
        id: '2',
        content: 'This is message 2!',
        userId: 'pikachu01',
        createdAt: '1606819694',
        diffDate: true,
    },
    {
        id: '3',
        content: 'This is message 3!',
        userId: 'pikachu01',
        createdAt: '1606819754',
        status: 'sent',
    },
    {
        id: '4',
        content: 'This is message 4!',
        userId: 'pikachu01',
        createdAt: '1606819754',
        diffDate: true,
        diffUser: true,
    },
    {
        id: '5',
        content: 'dadfasdadfadsf adf asd f asdf asd fas faf d dadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf d',
        userId: 'songoku02',
        createdAt: '1606819754',
    },
    {
        id: '6',
        content: 'This is message 6!',
        userId: 'songoku02',
        createdAt: '1606819754',
        status: 'sent',
    },
    {
        id: '7',
        content: 'This is message 7!',
        userId: 'pikachu01',
        createdAt: '1606905734',
        status: 'sent',
        diffUser: true,
    },
    {
        id: '8',
        content: 'This is message 8!',
        userId: 'pikachu01',
        createdAt: '1606905794',
        status: 'sent',
    },
    {
        id: '9',
        content: 'This is message 9!',
        userId: 'pikachu01',
        createdAt: '1606905854',
        status: 'sent',
    },
    {
        id: '10',
        content: 'This is message 1!',
        userId: 'pikachu01',
        createdAt: '1606819334',
    },
    {
        id: '12',
        content: 'This is message 2!',
        userId: 'pikachu01',
        createdAt: '1606819694',
        diffDate: true,
    },
    {
        id: '13',
        content: 'This is message 3!',
        userId: 'pikachu01',
        createdAt: '1606819754',
        status: 'sent',
    },
    {
        id: '14',
        content: 'This is message 4!',
        userId: 'songoku02',
        createdAt: '1606819754',
        diffTime: true,
        diffUser: true,
    },
    {
        id: '15',
        content: 'dadfasdadfadsf adf asd f asdf asd fas faf d dadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf ddadfasdadfadsf adf asd f asdf asd fas faf d',
        userId: 'songoku02',
        createdAt: '1606819754',
    },
    {
        id: '16',
        content: 'This is message 6!',
        userId: 'songoku02',
        createdAt: '1606819754',
        status: 'sent',
    },
    {
        id: '17',
        content: 'This is message 7!',
        userId: 'pikachu01',
        createdAt: '1606905734',
        status: 'sent',
        diffUser: true,
    },
    {
        id: '18',
        content: 'This is message 8!',
        userId: 'pikachu01',
        createdAt: '1606905794',
        status: 'sent',
    },
    {
        id: '19',
        content: 'This is message 9!',
        userId: 'pikachu01',
        createdAt: '1606905854',
        status: 'sent',
    },
];

export const Default = () =>
{

    const handleSendMessage = (msg) =>
    {
        (action('onSendMessage'))(msg);
    };

    return (
        <div style={{ height: '400px' }}>
            <ChatBoxComponent
                group={group}
                members={members}
                messages={messages}
                currentUserId={'pikachu01'}
                onSendMessage={handleSendMessage}
            />
        </div>

    );
};

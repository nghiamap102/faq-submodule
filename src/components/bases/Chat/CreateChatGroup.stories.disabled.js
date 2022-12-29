import React, { useState, useEffect } from 'react';
import CreateChatGroup from 'components/app/Chat/CreateChatGroup';


export default {
    title: 'Bases/Chat/CreateChatGroup',
    component: CreateChatGroup,
    args: {},
};

const Template = (args) =>
{
    return (
        <CreateChatGroup {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    userList: [
        {
            id: '1',
            name: 'abc def',
            status: 'online',
            avatar: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/SI/en/999/EP3351-CUSA08250_00-AV00000000000171/1580140075000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000',
        },
        {
            id: '2',
            name: 'abc def',
            status: 'offline',
            avatar: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/SI/en/999/EP3351-CUSA08250_00-AV00000000000171/1580140075000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000',
        },
        {
            id: '3',
            name: 'abc def',
            status: 'offline',
            avatar: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/SI/en/999/EP3351-CUSA08250_00-AV00000000000171/1580140075000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000',
        },

    ],
};

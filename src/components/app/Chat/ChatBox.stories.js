import React from 'react';

import { Provider } from 'mobx-react';

import {
    SideBar,
    Container,
} from '@vbd/vui';

import { ChatStore } from './ChatStore';

import ChatBox from './ChatBox';
import ChatList from './ChatList';

export default {
    title: 'Bases/Chat/Chat',
    component: ChatList,
};

class AppStore
{
    constructor()
    {
        this.chatStore = new ChatStore(this);
    }

    profile = {
        userId: 'user1',
        displayName: '',
        email: '',
        avatar: '',
    };

}

export const Default = (args) =>
{
    return (
        <Provider appStore={new AppStore()}>
            <Container
                className={'right-panel'}
                style={{ height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}
            >
                <SideBar width={'5rem'}>
                    <ChatList />
                </SideBar>
                <ChatBox />
            </Container>
        </Provider>
    );
};

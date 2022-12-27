import { decorate, observable } from 'mobx';
import { action } from '@storybook/addon-actions';

export class UserStore
{
    appStore = null;
    users = [];

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    setUsers(users)
    {
        this.users = users;
    }

    setUser(user)
    {
        for (let i = 0; i < this.users.length; i++)
        {
            if (this.users[i].id === user.id)
            {
                this.users[i] = user;
                break;
            }
        }
    }
}

decorate(UserStore, {
    appStore: observable,
    users: observable,
    setUsers: action,
    setUser: action
});

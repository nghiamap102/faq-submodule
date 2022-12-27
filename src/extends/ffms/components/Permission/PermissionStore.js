import AwesomeDebouncePromise from 'awesome-debounce-promise';
import RoleService from 'extends/ffms/services/RoleService';
import UserService from 'extends/ffms/services/UserService';
import { CommonHelper } from 'helper/common.helper';
import { action, decorate, observable, runInAction } from 'mobx';

export class PermissionStore
{
    constructor()
    {
        this.roleService = new RoleService();
        this.userService = new UserService();
    }

    roleName = '';

    accountSearch = '';
    accounts = [];
    accountLoading = false;

    permissions = null;
    recursiveMode = false;
    accountPaging = { skip: 0, take: 20 };

    init(roleName)
    {
        this.roleName = roleName;
        this.set('accountPaging', { skip: 0, take: 20 });

        this.loadAccountsWithRole();
        this.getPermissionWithRole().then(data =>
        {
            this.permissions = data;
        });

    }

    set(key, data)
    {
        if (key && this.hasOwnProperty(key))
        {
            this[key] = data;
        }
    }

    setAccountPaging = (paging) =>
    {
        this.accountPaging = paging;
    }

    loadAccountsWithRole = (append) =>
    {
        this.set('accountLoading', true);
        if (this.roleName)
        {
            const { skip, take } = this.accountPaging;
            const filter = { skip, take: take, searchKey: this.accountSearch };

            const onUpdateUser = (users) =>
            {
                runInAction(()=>
                {
                    if (!users || users.length === 0 || !this.accounts || skip === 0)
                    {
                        this.accounts = append ? this.accounts : users;
                    }
                    else
                    {
                        const userNames = CommonHelper.toDictionary(this.accounts, 'UserName');
                        users.forEach((user) =>
                        {
                            if (!userNames[user.UserName])
                            {
                                this.accounts.push(user);
                            }
                        });
                    }

                    this.set('accountPaging', { ...this.accountPaging, skip: this.accounts.length });
                });
            };

            this.roleService.getRoleAccount(this.roleName, filter).then(accReq =>
            {
                if (accReq.data)
                {
                    // check new accounts has includes new data
                    const users = accReq.data?.Users;
                    onUpdateUser(users);
                }
                this.set('accountLoading', false);
            }).catch(()=>
            {
                this.set('accountLoading', false);
            });
        }
    }

    addAccountToRole = async (account) =>
    {
        if (this.roleName)
        {
            const accRes = await this.roleService.addAccountToRole(this.roleName, [account.UserName]);

            if (accRes && accRes.data)
            {
                runInAction(() =>
                {
                    if (!this.accounts.find((x)=>x.UserName === account.UserName))
                    {
                        this.accounts = [account, ...this.accounts];
                    }
                });
            }
        }
    }


    removeAccountRole = async (accountName) =>
    {
        if (this.roleName)
        {
            const accRes = await this.roleService.removeAccountToRole(this.roleName, [accountName]);
            if (accRes && accRes.data)
            {
                this.accounts = this.accounts.filter(acc => acc.UserName !== accountName);
                this.set('accountPaging', { ...this.accountPaging, skip: this.accounts.length });
                // toast({ type: 'success', message: accRes.message });
            }
        }
    }

    searchAccountChange = (value) =>
    {
        this.accountSearch = value;
        this.accountPaging.skip = 0;
        this.handleLoadDebounce();
    }

    handleLoadDebounce = new AwesomeDebouncePromise(this.loadAccountsWithRole.bind(this), 300);

    getPermissionWithRole = async (path = '', recursive = false) =>
    {
        if (this.roleName)
        {
            const perRq = await this.roleService.getRolePermission(this.roleName, recursive, path);

            if (perRq.data)
            {
                return perRq.data;
            }
        }
        else
        {
            return null;
        }
    }

    modifyPermissionRole = async (path = '', canAccess) =>
    {
        if (this.roleName)
        {
            const perRq = await this.roleService.modifyPermission(this.roleName, path, canAccess);

            if (perRq.data)
            {
                return perRq.data;
            }
            else if (perRq.message)
            {
                return perRq;
            }
        }
        else
        {
            return null;
        }
    }

}

decorate(PermissionStore, {
    accountPaging: observable,
    accounts: observable,
    roleName: observable,
    accountSearch: observable,
    permissions: observable,
    accountLoading: observable,

    set: action,
    setAccountPaging: action,
    addAccountToRole: action,
    loadAccountsWithRole: action,
    searchAccountChange: action,
    getPermissionWithRole: action,
    modifyPermissionRole: action,
});

import './RoleAccount.scss';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { withI18n, withTenant, withModal, Button } from '@vbd/vui';

import UserService from 'extends/ffms/services/UserService';
import DataList from 'extends/ffms/components/DataList/DataList';
import PopOverSearch from 'extends/ffms/components/DataList/PopOverSearch';
import DataItem from 'extends/ffms/components/DataList/DataItem';
import { AppConstant } from 'constant/app-constant';

class RoleAccount extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    permissionStore = this.fieldForceStore.permissionStore;
    addUserButtonRef = React.createRef();

    userSvc = new UserService();

    state = {
        openPopup: false,
        popupSearchPanel: false,
        popSearchKey: '',
        popSearchItems: [],
    };

    componentDidMount()
    {
        this.loadPopupItems();
    }


    deleteAccountItem = (data) =>
    {
        const roleName = this.permissionStore.roleName;

        this.props.confirm({
            message: `${this.props.t('Bạn có chắc chắn muốn xóa %0% khỏi %1%?', [data.UserName, roleName])}`,
            onOk: () =>
            {
                this.permissionStore.removeAccountRole(data.UserName);
            },
        });
    }

    addAccountItem = (account) =>
    {
        if (this.permissionStore.accounts?.find((acc) => acc.UserName === account.UserName))
        {
            this.props.alert({
                message: 'Tài khoản đã được thêm vào nhóm',
            });
        }
        else
        {
            this.permissionStore.addAccountToRole(account);
        }
    }

    handleSearchChange = (value) =>
    {
        this.permissionStore.searchAccountChange(value);
    }

    loadPopupItems = (searchKey) =>
    {
        const user = this.fieldForceStore.appStore.profile || {};
        const { tenantConfig: tenant } = this.props;
        const path = `/root/ims/vbd/users${tenant.product ? `/${tenant.product}` : '/ffms' }/${AppConstant.sysIdPlaceholder}`;
        this.userSvc.queryUserInPath(searchKey, path).then(userRp =>
        {
            if (userRp.data)
            {
                const items = Array.isArray(userRp.data) ? userRp.data : [userRp.data];

                const popSearchItems = items?.map((u) =>
                {
                    if (!u.UserName)
                    {
                        u.UserName = u.Name;
                    }
                    return u;
                }).filter((u) => u.UserName !== user.displayName);

                this.setState({ popSearchItems });
            }
            else
            {
                this.setState({ popSearchItems: [] });
            }
        });
    };

    debouncedSearchItem = AwesomeDebouncePromise(this.loadPopupItems, 500);

    handleSearchItem = (searchKey) =>
    {
        this.setState({ popSearchKey: searchKey });
        this.debouncedSearchItem(searchKey);
    }

    renderHeaderButton = () =>
    {
        return (
            <Button
                color={'primary-color'}
                className={'btn-add ellipsis upper-case'}
                text={'Thêm người dùng'}
                icon={'user-plus'}
                innerRef={this.addUserButtonRef}
                onClick={() =>
                {
                    this.setState({ popupSearchPanel: true });
                }}
            />
        );
    }

    renderUserItem = (item)=>
    {
        const user = this.fieldForceStore.appStore.profile || {};

        return (
            <DataItem
                renderLabel={item => item?.UserName}
                data={item}
                hideDelete={user.displayName === item?.UserName}
                onDelete={this.deleteAccountItem}
            />
        );
    }

    render()
    {
        const { accountPaging, loadAccountsWithRole, accounts } = this.permissionStore;

        return (
            <React.Fragment>
                <DataList
                    actionHeader={this.renderHeaderButton()}
                    items={accounts}
                    renderItem={this.renderUserItem}
                    loading={{
                        isLoading: this.permissionStore.accountLoading,
                    }}
                    loadMore={{
                        isLoadMore: accounts?.length >= accountPaging.take,
                        onLoadMore: () => loadAccountsWithRole(true),
                    }}
                />

                <PopOverSearch
                    anchorEl={this.addUserButtonRef}
                    visible={this.state.popupSearchPanel}
                    header={'Tìm kiếm tài khoản'}
                    items={this.state.popSearchItems}
                    searchKey={this.state.popSearchKey}

                    renderLabel={item =>item?.UserName || item?.Name}
                    onBackgroundClick={() =>
                    {
                        this.setState({ popupSearchPanel: false });
                    }}
                    onSearch={this.handleSearchItem}
                    onClickItem={this.addAccountItem}
                />
            </React.Fragment>
        );
    }
}

RoleAccount = inject('appStore', 'fieldForceStore')(observer(RoleAccount));
RoleAccount = withModal(withI18n(withTenant(RoleAccount)));

export default RoleAccount;

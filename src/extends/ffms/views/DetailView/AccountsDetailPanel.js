import './DetailView.scss';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
    Container, Button,
    useI18n, useModal, useTenant,
} from '@vbd/vui';

import { AppConstant } from 'constant/app-constant';

import useDebounce from 'extends/ffms/pages/hooks/useDebounce';
import CommonService from 'extends/ffms/services/CommonService';
import UserService from 'extends/ffms/services/UserService';
import DataItem from 'extends/ffms/components/DataList/DataItem';
import DataList from 'extends/ffms/components/DataList/DataList';
import PopOverSearch from 'extends/ffms/components/DataList/PopOverSearch';

const UserUnitLayer = 'user_unit_type_roles';

const AccountsDetailPanel = (props) =>
{
    const commonSvc = new CommonService();
    const userSvc = new UserService();

    const { alert, confirm } = useModal();
    const { t } = useI18n();
    const tenant = useTenant();

    const [accounts, setAccounts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [idLoading, setIdLoading] = useState(null);

    const [searchKey, setSearchKey] = useState(null);
    const [popupSearchPanel, setPopupSearchPanel] = useState(false);
    const [popSearchItems, setPopSearchItems] = useState([]);
    const [popSearchKey, setPopSearchKey] = useState([]);
    const [pagination, setPagination] = useState({ index: 1, size: 20, total: 0 });

    const debouncedSearchKey = useDebounce(searchKey, 500);
    const debouncedSearchKeyPopup = useDebounce(popSearchKey, 500);

    const addAccountRef = useRef();
    const userUnitRef = useRef();


    useEffect(()=>
    {
        commonSvc.getLayerConfig(UserUnitLayer).then(data =>
        {
            if (data)
            {
                userUnitRef.current = data;
            }
        });
    }, []);


    useEffect(() =>
    {
        getAccountsOfProduct(debouncedSearchKeyPopup);

    }, [debouncedSearchKeyPopup]);

    useLayoutEffect(() =>
    {
        const newPagination = { ...pagination, index: 1 };
        setPagination(newPagination);
        getAccountOfLayer(debouncedSearchKey, newPagination);

    }, [debouncedSearchKey]);

    const formatFilter = (searchKey = null, pagination) =>
    {
        const { index, size } = pagination;
        const UnitType = props.layer;
        const fieldNameID = UnitType.toLowerCase() + '_id';
        const UnitId = props.data[fieldNameID];
        return {
            UnitType,
            UnitId,
            skip: (index - 1) * size,
            take: size,
            ...searchKey && { searchKey: searchKey },
        };
    };

    const getPropertyConfig = (columnName) =>
    {
        const properties = userUnitRef.current?.Properties;
        const columnConfig = properties?.find(p => p.ColumnName === columnName);
        const config = columnConfig?.Config;

        return config ? JSON.parse(config) : null;
    };

    const getValueConfig = (columnName, displayName) =>
    {
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase();

        const columnConfig = getPropertyConfig(columnName);
        const source = columnConfig?.content?.source;
        const sourceItem = source?.find(item => item.Display === displayName);
        return sourceItem?.Value ? sourceItem.Value : null;
    };

    // Call service
    const getAccountsOfProduct = (searchKey) =>
    {
        const user = props.fieldForceStore.appStore.profile || {};
        const path = `/root/ims/vbd/users${tenant.product ? `/${tenant.product}` : '/ffms' }/${AppConstant.sysIdPlaceholder}`;

        userSvc.queryUserInPath(searchKey, path).then(userRp =>
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

                setPopSearchItems(popSearchItems);
            }
            else
            {
                setPopSearchItems([]);
            }
        });
    };

    const getAccountOfLayer = async (searchKey, pagination) =>
    {
        setLoading(true);
        const filter = formatFilter(searchKey, pagination);
        const accountsRs = await commonSvc.queryData(UserUnitLayer,filter, true);

        if (accountsRs && accountsRs.data)
        {
            pagination.total = accountsRs.total;

            setAccounts(accountsRs.data);
            setPagination(pagination);
        }
        else
        {
            setAccounts([]);
        }

        setLoading(false);
    };

    const addAccountToLayer = async (user) =>
    {
        // check has exist
        const { UnitId , UnitType } = formatFilter(null, pagination);
        const unitTypeValue = getValueConfig('UnitType', props.layer);

        const countFilter = { UnitType, UnitId, UserName: user.Name };
        const count = await commonSvc.queryCount(UserUnitLayer, countFilter);

        if (count > 0)
        {
            alert({
                message: 'Tài khoản đã được thêm vào nhóm',
            });
            return;
        }

        const daaRequest = {
            UnitType: unitTypeValue,
            UnitId,
            UserName: user.Name,
            Role: 'Manager',
            Title: `${user.Name}-${UnitId}-${props.layer.toLowerCase()}-manager`,
        };

        const newAccount = await commonSvc.addLayerData(UserUnitLayer, daaRequest);
        if (newAccount)
        {
            newAccount.Id = newAccount.id;
            const newData = [newAccount, ...accounts];

            if (accounts.length > pagination.size - 1)
            {
                newData.pop();
            }

            setAccounts(newData);
            setPagination({ ...pagination,total: pagination.total + 1 });
        }
    };

    const deleteAccountItem = async (data) =>
    {
        setIdLoading(data.Id);
        const deleteRs = await commonSvc.deleteLayerData(UserUnitLayer, data.Id);
        if (deleteRs && deleteRs.count > 0)
        {
            const newAccount = accounts.filter(acc => acc.Id !== data.Id);
            setAccounts(newAccount);
            setPagination({ ...pagination,total: pagination.total - 1 });
        }

        setIdLoading(null);
    };


    const handleDeleteAccountItem = (data) =>
    {
        const layerTitle = props.data?.Title;

        confirm({
            message: `${t('Bạn có chắc chắn muốn xóa %0% khỏi %1%?', [data?.UserName,layerTitle ])}`,
            onOk: () =>
            {
                deleteAccountItem(data);
            },
        });
    };

    const handleChangePage = (pageIndex) =>
    {
        const newPagination = { ...pagination, index: pageIndex };

        setPagination(newPagination);
        getAccountOfLayer(searchKey, newPagination);
    };


    const renderHeaderButton = () =>
    {
        return (
            <Button
                color={'primary-color'}
                className={'btn-add ellipsis upper-case'}
                text={'Thêm người dùng'}
                icon={'user-plus'}
                innerRef={addAccountRef}
                onClick={() => setPopupSearchPanel(true)}
            />
        );
    };

    const renderUserItem = (item)=>
    {
        return (
            <DataItem
                key={item.Id}
                renderLabel={item => item.UserName}
                data={item}
                iconLoading={item.Id === idLoading}
                onDelete={handleDeleteAccountItem}
            />
        );
    };

    return (
        <Container className={'detail-panel'}>
            <Container className='detail-panel-body'>
                <DataList
                    actionHeader={renderHeaderButton()}
                    items={accounts}
                    renderItem={renderUserItem}
                    loading={{
                        isLoading: loading,
                    }}
                    searching={{
                        searchKey: searchKey,
                        onSearch: setSearchKey,
                    }}

                    pagination={{
                        pageIndex: pagination.index,
                        pageSize: pagination.size,
                        pageTotal: pagination.total,
                        onChangePage: handleChangePage,
                    }}

                />

                <PopOverSearch
                    anchorEl={addAccountRef}
                    visible={popupSearchPanel}
                    header={'Tìm kiếm tài khoản'}
                    items={popSearchItems}
                    searchKey={popSearchKey}
                    renderLabel={item => item?.UserName || item?.Name}
                    onBackgroundClick={() => setPopupSearchPanel(false)}
                    onSearch={setPopSearchKey}
                    onClickItem={addAccountToLayer}
                />
            </Container>
        </Container>
    );
};

AccountsDetailPanel.propTypes = {
    layer: PropTypes.string,
    data: PropTypes.object,
};

export default inject('appStore', 'fieldForceStore')(observer(AccountsDetailPanel));

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import {
    Drawer, withI18n, withModal,
    PanelBody, Row, Button, Spacer, SearchBox, DataGrid, Column,
} from '@vbd/vui';

import PermissionService from 'extends/ffms/services/PermissionService';
import { RouterParamsHelper } from 'helper/router.helper';
import { FFMSCommonHelper } from 'extends/ffms/helper/common-helper';
import { DataTypes, isEmpty } from 'helper/data.helper';
import RoleFormAction from 'extends/ffms/views/RolePanel/RoleFormAction';
import RoleDetailPanel from 'extends/ffms/views/DetailView/RoleDetailPanel';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';

class RolePanel extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    roleStore = this.props.fieldForceStore.roleStore;

    permissionService = new PermissionService();
    comSvc = this.props.fieldForceStore.comSvc;
    useInfiniteScroll = true;

    urlParams = {};

    state = {
        columns: [
            {
                hidden: false,
                id: 'Name',
                displayAsText: 'Vai trò',
                width: 120,
                // isSortable: true,
                // defaultSortDirection: 'desc',
            },
            {
                hidden: false,
                id: 'Title',
                displayAsText: 'Mô tả',
                // width: 200,
                // isSortable: true,
                // defaultSortDirection: 'desc',
            },
        ],
        // sorters: [],
        editingName: '',
        watchingName: '',
        deletingName: '',
        isRowActiveId: undefined,
    }

    async componentDidMount()
    {
        if (this.roleStore.urlParams && Object.values(this.roleStore.urlParams).length !== 0)
        {
            RouterParamsHelper.setParams(null, this.props, this.roleStore.urlParams);
        }
        this.setState({ columns: this.state.columns });
        // await this.bindDataGridColumns();
        await this.loadParams();
    }

    componentDidUpdate = (prevProps) =>
    {
        const locationSearch = RouterParamsHelper.shouldLocationChanged(this.props.location, prevProps.location);

        if (locationSearch)
        {
            this.loadParams(locationSearch);
        }
    };

    // bindDataGridColumns = async () =>
    // {
    //     const sortColumns = this.state.columns.filter((col) => col.isSortable).map((col) =>
    //     {
    //         return {
    //             id: col.id,
    //             direction: undefined,
    //         };
    //     });

    //     this.setState({
    //         columns: this.state.columns,
    //         sorters: sortColumns,
    //     });
    // }

    loadParams = async (search) =>
    {
        if (!this.isSystemLoad)
        {
            const { setSecondFeature, hasPermissionNode, pathPermission } = this.props;

            const params = {
                stringFilters: ['mode', 'select', 'pageSize', 'order', 'orderBy', 'searchKey'],
                searchKey: DataTypes.String,
            };

            const qs = RouterParamsHelper.getParams(this.props.location.search, params);

            for (const key in qs)
            {
                this.roleStore.urlParams[key] = qs[key];
            }

            const { mode, select, pageSize, order, orderBy, ...filterState } = qs;
            this.roleStore.setAllFilterState(filterState);

            if (FFMSCommonHelper.shouldHandlePageLoad(search, params))
            {
                this.roleStore.resetData();
                this.roleStore.setPaging(1, pageSize ? Number(pageSize) : 20);
                this.handlePageLoad();
            }

            this.roleStore.setPaging(this.roleStore.currentPage, pageSize ? Number(pageSize) : 20);
            this.roleStore.setFormAction(false, '');
            setSecondFeature(mode);

            if (!hasPermissionNode(pathPermission, mode))
            {
                return;
            }

            if (mode === 'edit' && select)
            {
                this.setState({ editingName: select });
                const role = await this.roleStore.getRoleData(select);
                this.setState({ editingName: '' });

                if (role)
                {
                    this.roleStore.setEdit(true);
                    this.roleStore.setRole(role);
                    this.roleStore.setFormAction(true, 'update');

                    this.setState({
                        originFormData: { ...role },
                    });
                }
            }
            else if (mode === 'create')
            {
                this.roleStore.setEdit(false);
                this.roleStore.setRole({});
                this.roleStore.setFormAction(true, 'create');

                this.setState({
                    originFormData: {},
                });
            }
            else if (select && mode === 'detail')
            {
                const role = await this.roleStore.getRoleData(select);

                if (role)
                {
                    this.roleStore.setDrawer(true);
                    this.roleStore.setRole(role);
                    this.setState({
                        isRowActiveId: select,
                    });
                }
            }

          
        }

    }

    handlePageLoad = async (page, append, debounce) =>
    {
        this.roleStore.setLoading(true);

        page = page || this.roleStore.currentPage;
        this.roleStore.setPaging(page, this.roleStore.pageSize);

        const data = debounce ? await this.roleStore.getDataDebounced(null, true) : await this.roleStore.getData(null, true);
        if (isEmpty(data))
        {
            this.roleStore.setPaging(page - 1, this.roleStore.pageSize);
            this.roleStore.setData([], append);
        }
        else
        {
            this.roleStore.setData(data, append);
        }

        this.roleStore.setLoading(false);
    };

    handleSearch = (searchKey) =>
    {
        const params = {
            searchKey: searchKey,
        };

        // TRICK TO PREVENT LOADING DATA FROM URL
        this.isSystemLoad = true;
        RouterParamsHelper.setParams(this.roleStore.urlParams, this.props, params);
        this.handlePageLoad(1, false).then(() =>
        {
            this.isSystemLoad = false;
        });
    };

    handleSearchDebounce = new AwesomeDebouncePromise(this.handleSearch.bind(this), 300);

    handleDetailSelected = (row, index, hash) =>
    {
        RouterParamsHelper.setParams(this.roleStore.urlParams, this.props, { mode: 'detail', select: row.Name });
    };

    closeDrawer = () =>
    {
        this.roleStore.setDrawer(false);
        RouterParamsHelper.setParams(this.roleStore.urlParams, this.props, { mode: '', select: '', index: '' });
    }

    Actions = (row, index) =>
    {
        const { pathPermission, hasPermissionNode } = this.props;

        return (
            <Row
                itemMargin={'sm'}
                crossAxisAlignment={'start'}
            >
                <Button
                    icon={'edit'}
                    type={'default'}
                    disabled={!hasPermissionNode(pathPermission, 'edit') || this.roleStore.isBasicRoles.includes(row.Name)}
                    isLoading={row.Name === this.state.editingName}
                    onlyIcon
                    onClick={() => RouterParamsHelper.setParams(this.roleStore.urlParams, this.props, { mode: 'edit', select: row.Name })}
                />
                <Button
                    icon={'user-tag'}
                    type={'default'}
                    disabled = {!hasPermissionNode(pathPermission, 'detail')}
                    isLoading={row.Name === this.state.watchingName}
                    onlyIcon
                    onClick={() => this.handleDetailSelected(row, index)}
                />
                <Button
                    icon={'trash-alt'}
                    type={'default'}
                    disabled = {!hasPermissionNode(pathPermission, 'delete') || this.roleStore.isBasicRoles.includes(row.Name)}
                    isLoading={row.Name === this.state.deletingName}
                    onlyIcon
                    onClick={() => this.props.confirm({
                        message: `${this.props.t('Bạn có chắc chắn muốn xóa vai trò "%0%" không?', [row.Name])}`,
                        onOk: async () =>
                        {
                            this.setState({ deletingName: row.Name });

                            await this.roleStore.delete(row.Name);

                            this.setState({ deletingName: '' });
                            if (this.roleStore.roles.length === 0)
                            {
                                this.handlePageLoad();
                            }
                        },
                    })}
                />
            </Row>
        );
    };

    handleOnChangePage = (pageIndex, done, onDone) =>
    {
        const isLoad = this.roleStore.roles.length >= (pageIndex * this.roleStore.pageSize);

        return new Promise(resolve =>
        {
            setTimeout(() =>
            {
                this.handlePageLoad(pageIndex + 1, this.useInfiniteScroll);
                onDone && onDone();
                resolve();
            }, 1000);
        });
    };

    render()
    {
        const { isShowForm, roles } = this.roleStore;
        const { pathPermission, hasPermissionNode } = this.props;

        return (
            <>
                <PanelBody className={'roles-manager'}>
                    <Column>
                        <Row
                            itemMargin={'md'}
                            crossAxisSize={'min'}
                            flex={0}
                        >
                            <Button
                                disabled = {!hasPermissionNode(pathPermission, 'create')}
                                type={'success'}
                                className={'btn-add upper-case'}
                                text={'Thêm vai trò mới'}
                                onClick={() => RouterParamsHelper.setParams(this.roleStore.urlParams, this.props, { mode: 'create' })}
                            />
                            <Button
                                type={'success'}
                                className={'btn-import  upper-case'}
                                text={'Nhập liệu vai trò'}
                            />
                            <Spacer
                                style={{ marginLeft: 'auto' }}
                                size={'1.5rem'}
                            />
                            <SearchBox
                                width={'25rem'}
                                flex="0"
                                placeholder={'Nhập từ khóa để tìm kiếm'}
                                value={this.roleStore.filterState.searchKey}
                                flex="0"
                                onChange={(keyword) =>
                                {
                                    this.roleStore.setFilterState('searchKey', keyword);
                                    this.handleSearchDebounce(keyword);
                                }}
                            />
                        </Row>
                        <DataGrid
                            columns={this.state.columns}
                            items={roles || []}
                            rowKey={'Name'}
                            pagination={{
                                useInfiniteScroll: this.useInfiniteScroll,
                                pageIndex: this.roleStore.currentPage,
                                pageSize: this.roleStore.pageSize,
                                onChangePage: this.handleOnChangePage,
                            }}
                            total={this.roleStore.totalItem}
                            toolbarVisibility={{ showColumnSelector: true, showReloadButton: true }}
                            trailingControlColumns={[
                                {
                                    width: 140,
                                    headerCellRender: 'Thao tác',
                                    rowCellRender: this.Actions,
                                    freezeEnd: true,
                                },
                            ]}
                            loading={this.roleStore.isLoading}
                            isFixedHeader
                            rowNumber
                            onReload={() => this.handlePageLoad(1, false)}
                            onCellDoubleClick={(e, row, col) => this.handleDetailSelected(row, col)}
                        />
                        {
                            isShowForm && (
                                <RoleFormAction
                                    data={this.roleStore.currentRole}
                                    formAction={this.roleStore.formAction}
                                />
                            )}
                    </Column>
                </PanelBody>
                {
                    this.roleStore.isDrawer && (
                        <Drawer
                            position={'right'}
                            width={'40rem'}
                            onClose={this.closeDrawer}
                        >
                            <RoleDetailPanel />
                        </Drawer>
                    )}
            </>
        );
    }
}

RolePanel = inject('appStore', 'fieldForceStore')(observer(RolePanel));
RolePanel = withModal(withI18n(withPermission(withRouter(RolePanel))));
export default RolePanel;

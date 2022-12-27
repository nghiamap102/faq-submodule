import './CustomerPanel.scss';

import React, { Component } from 'react';
import { inject, observer, Provider } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import _findIndex from 'lodash/findIndex';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import {
    PanelBody, PopOver, SearchBox,
    Spacer, Drawer, DataGrid,
    Row, Button, withModal, Column, IconButton,
} from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import { CommonHelper } from 'helper/common.helper';
import { DataTypes, DisplaySchema } from 'helper/data.helper';

import { FFMSCommonHelper } from 'extends/ffms/helper/common-helper';
import QuickAddCustomer from 'extends/ffms/views/JobPanel/Customer/QuickAddCustomer';
import CustomerFilterPanel from 'extends/ffms/views/CustomerPanel/CustomerFilterPanel';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';
import CustomerDetailPanel from 'extends/ffms/views/DetailView/CustomerDetailPanel';

const customerDetailTabs = [{
    id: 1,
    title: 'Thông tin chi tiết',
    hash: '#detail',
    // link: add Route
}, {
    id: 2,
    title: 'Danh sách công việc',
    hash: '#viewrelativejob',
    // link: add Route
}];
export default class CustomerPanel extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    customerStore = this.props.fieldForceStore.customerStore;
    relatedJobStore = this.props.fieldForceStore.relatedJobStore;

    comSvc = this.fieldForceStore.comSvc;

    customerFilterRef = React.createRef();

    state = {
        columns: [],
        searchKey: '',
        isAlert: false,
        filterPanelActive: false,
        sorters: [],
        editingCustomerId: '',
        deletingCustomerId: '',
        typeOptions: [],

        customerDetail: {},
        isRowActiveId: null,
        detailCustomerId: '',
    };

    async componentDidMount()
    {
        // Restore params & set to url
        if (this.customerStore.urlParams && Object.values(this.customerStore.urlParams).length !== 0)
        {
            RouterParamsHelper.setParams(null, this.props, this.customerStore.urlParams);
        }

        await this.bindDataGridColumns();

        // Load page/pageSize/sorting/searchKey params
        await this.loadParams();

        this.customerStore.appStore = this.props.appStore;
        this.comSvc.getLayerListOptions('CUSTOMER', 'customer_type_id').then((result) =>
        {
            this.setState({ typeOptions: result });
        });
    }

    componentDidUpdate = (prevProps) =>
    {
        const locationSearch = RouterParamsHelper.shouldLocationChanged(this.props.location, prevProps.location);
        if (locationSearch)
        {
            this.loadParams(locationSearch);
        }
    };

    loadParams = async (search) =>
    {
        const { location,history, pathPermission, hasPermissionNode, toast, t } = this.props;

        // init tabs
        const tabsJobDetail = customerDetailTabs.filter(tab =>
        {
            const feature = tab.hash.substring(1);
            const isAcess = hasPermissionNode(pathPermission, feature);
            return isAcess;
        });
        this.relatedJobStore.setTabs(tabsJobDetail);

        const params = {
            arrayFilters: ['customer_type_id'],
            stringFilters: ['mode', 'select', 'page', 'pageSize', 'order', 'orderBy', 'customer_fullname', 'customer_contact_no', 'customer_contact_no'],
            searchKey: DataTypes.String,
        };
        const qs = RouterParamsHelper.getParams(this.props.location.search, params);

        for (const key in qs)
        {
            this.customerStore.urlParams[key] = qs[key];
        }
        const { mode, select, page, pageSize, order, orderBy, ...filterState } = qs;

        this.customerStore.setAllFilterState(filterState);

        if (order && orderBy)
        {
            const sortColumns = [{ id: orderBy, direction: order }];
            this.setState({ sorters: sortColumns });
            this.customerStore.setSorters(sortColumns);
        }

        this.customerStore.setPaging(page ? Number(page) : 1, pageSize ? Number(pageSize) : 20);
        this.customerStore.setCustomerFormState(false, '');

        const shouldLoad = FFMSCommonHelper.shouldHandlePageLoad(search, params);
        if (shouldLoad && hasPermissionNode(pathPermission, 'view'))
        {
            this.handlePageLoad().then(() =>
            {
                if (this.customerStore.customers && Array.isArray(this.customerStore.customers))
                {
                    const index = this.customerStore.customers.findIndex((d) => d.Id === select);
                    if (index > -1)
                    {
                        this.setState({
                            customerDetail: { ...this.customerStore.customers[index] } ?? {},
                        });
                    }
                }
            });
        }

        if (!this.checkMode_initTab(mode))
        {
            RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { mode: '', select: '' });
            return null;
        }

 
        if (select && mode === 'edit' && select)
        {
            this.setState({ editingCustomerId: select });
            const customer = select ? await this.customerStore.getCustomer(select) : undefined;
            this.setState({ editingCustomerId: '' });
    
            this.customerStore.setCustomer(customer);
            this.customerStore.setCustomerFormState(true, 'update');
        }
        else if (mode === 'create')
        {
            this.customerStore.setCustomer();
            this.customerStore.setCustomerFormState(true, 'create');
        }
        else if (select && mode === 'detail')
        {
            if (this.relatedJobStore.tabs.length !== 0)
            {
                this.setState({
                    detailCustomerId: select,
                    isRowActiveId: select,
                });

                this.comSvc.queryData('customers', { Id: select, take: 1 }).then((result) =>
                {
                    this.setState({ detailCustomerId: '' });
            
                    if (result && result.data)
                    {
                        const customer = Array.isArray(result.data) ? result.data[0] : result.data;
                        if (customer)
                        {
                            this.relatedJobStore.getJobData({ job_customer_guid: customer['customer_guid'] });
                            this.setState({ customerDetail: customer });
                            this.customerStore.setDrawer(true);
                        }
                    }
                });
            }
        }
    }

       // handle check permission and intit tab with role
       checkMode_initTab = (mode)=>
       {
           const { pathPermission, hasPermissionNode, location, setSecondFeature } = this.props;
           const feature = RouterParamsHelper.getModeAction(location);
           let isAccess = true;
   
           // check permission
           if (mode === 'detail')
           {
               this.relatedJobStore.initPermissionDetailTabs(location, (tab, isPermit) =>
               {
                   setSecondFeature(tab && tab.hash ? tab?.hash.substring(1) : feature);

                   if (!isPermit)
                   {
                       isAccess = false;
                   }
               });
           }
           else
           {
               setSecondFeature(feature);
               if (!hasPermissionNode(pathPermission, feature))
               {
                   isAccess = false;
               }
           }
           return isAccess;
       }


    bindDataGridColumns = async () =>
    {
        const hiddenColumns = [
            'customer_guid',
            'customer_address_street',
            'customer_address_village',
            'customer_address_pincode',
            'customer_address_state',
            'customer_address_district',
            'customer_address_tehsil',
        ];

        const result = await this.comSvc.getDataGridColumns('customers', hiddenColumns);
        const columns = result.map((col) =>
        {
            if (col.id === 'customer_dob')
            {
                col.schema = DisplaySchema.Date;
            }
            return col;
        });

        const findPos = _findIndex(columns, (j) => j.id === 'customer_address_state');
        columns.splice(findPos, 0, {
            hidden: false,
            id: 'customer_address',
            displayAsText: 'Địa chỉ',
            width: 600,
            isSortable: true,
        });
        const columnSorters = columns.filter((col) => col.isSortable).map((col) =>
        {
            return {
                id: col.id,
                direction: undefined,
            };
        });

        this.customerStore.properties = columns;
        this.setState({
            columns: columns,
            sorters: columnSorters,
        });
        this.handlePageLoad();
    }

    handleSearch = async (searchKey) =>
    {
        const params = { searchKey: searchKey, page: 1 };
        RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, params);
    };
    handleSearchDebounce = new AwesomeDebouncePromise(this.handleSearch.bind(this), 300);

    Actions = (row, index) =>
    {
        const { location: { pathname }, pathPermission, hasPermissionNode } = this.props;
        return (
            <Row
                itemMargin={'sm'}
                crossAxisAlignment={'start'}
            >
                <Button
                    icon={'edit'}
                    type={'default'}
                    disabled = {!hasPermissionNode(pathPermission, 'edit')}
                    isLoading={row.Id === this.state.editingCustomerId}
                    onlyIcon
                    onClick={() => RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { mode: 'edit', select: row.Id })}
                />
                <Button
                    icon={'info-square'}
                    type={'default'}
                    disabled = {this.relatedJobStore.tabs.length === 0}
                    isLoading={row.Id === this.state.detailCustomerId}
                    onlyIcon
                    onClick={() => this.handleRowSelected(row)}
                />
                <Button
                    icon={'trash-alt'}
                    type={'default'}
                    disabled={!hasPermissionNode(pathPermission, 'delete')}
                    isLoading={row.Id === this.state.deletingCustomerId}
                    onlyIcon
                    onClick={() => this.props.confirm({
                        message: 'Bạn có chắc chắn muốn xóa khách hàng này không?', onOk: async () =>
                        {
                            this.setState({ deletingCustomerId: row.Id });
                            await this.customerStore.delete(row.customer_guid);
                            this.setState({ deletingCustomerId: '' });

                            if (this.customerStore.customers.length === 0)
                            {
                                if (this.customerStore.currentPage * this.customerStore.pageSize < this.customerStore.totalItem)
                                {
                                    this.handlePageLoad();
                                }
                                else
                                {
                                    RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { page: Math.max(this.customerStore.currentPage - 1, 1) });
                                }
                            }
                            else if (this.customerStore.customers.length < this.customerStore.pageSize)
                            {
                                const totalPages = Math.ceil(this.customerStore.totalItem / this.customerStore.pageSize);
                                if (this.customerStore.currentPage !== totalPages)
                                {
                                    this.handlePageLoad();
                                }
                            }
                        },
                    })}
                />
            </Row>
        );
    };

    handleRowSelected = (row, col, hash) =>
    {
        if (!hash)
        {
            this.props.location.hash = '#detail';
        }
        else
        {
            this.props.location.hash = hash;
        }
        RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { mode: 'detail', select: row.Id });
    };

    closeDrawer = () =>
    {
        this.customerStore.setDrawer(false);
        this.setState({
            isRowActiveId: null,
        });
        RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { mode: '', select: '' });
    }

    handlePageLoad = async (page, debounce) =>
    {
        this.customerStore.setLoading(true);
        page = page || this.customerStore.currentPage;
        this.customerStore.setPaging(page, this.customerStore.pageSize);
        const data = debounce ? await this.customerStore.getDataDebounced(null, true) : await this.customerStore.getData(null, true);
        this.customerStore.setData(data);

        this.customerStore.setLoading(false);
    };

    handleExportFile = async () =>
    {
        const { filterState } = this.customerStore;
        const queryFile = {
            sortInfo: [],
            searchKey: '',
            filterQuery: [],
            count: -1,
        };
        this.customerStore.setDownloading(true);
        if (filterState)
        {
            queryFile.sortInfo = this.state.sorters?.filter((x) => x.direction !== undefined)
                .map((col) =>
                {
                    return {
                        Field: col.id,
                        Direction: col.direction.toUpperCase(),
                    };
                });
            const filters = [];
            const customerTypes = CommonHelper.toDictionary(this.state.typeOptions, 'indexed', 'id');

            for (const f in filterState)
            {
                if (filterState.hasOwnProperty(f))
                {
                    const mappings = {
                        customer_type_id: [],
                    };

                    if (['customer_type_id'].indexOf(f) > -1)
                    {
                        if (Array.isArray(filterState[f]) && filterState[f].length > 0)
                        {
                            const field = `${f}_sfacet`;
                            filterState[f].map((value) =>
                            {
                                for (const t in customerTypes)
                                {
                                    if (customerTypes[t] === value)
                                    {
                                        mappings[f].push(`${field}:("${t}")`);
                                    }
                                }
                            });

                            if (mappings[f] && mappings[f].length > 0)
                            {
                                filters.push(mappings[f].length === 1 ? mappings[f] : `(${mappings[f].join(' OR ')})`);
                            }
                        }
                    }
                    if (filterState[f])
                    {
                        switch (f)
                        {
                            case 'customer_fullname':
                            case 'customer_contact_no':
                                filters.push(`${f}:(${filterState[f]}*)`);
                                break;
                            case 'searchKey':
                                queryFile.searchKey = `${filterState?.searchKey}`;
                                break;
                        }
                    }
                }
            }

            queryFile.filterQuery = [`${filters.join(' AND ')}`];
        }
        await this.comSvc.getExportQueryFile('CUSTOMER', queryFile);
        this.customerStore.setDownloading(false);
    };

    render()
    {
        const { currentCustomer, isShowForm, customerFormAction } = this.customerStore;
        const items = this.customerStore.customers;
        const { pathPermission, hasPermissionNode } = this.props;
        return (
            <Provider>
                {/* <PanelHeader>QUẢN LÝ KHÁCH HÀNG</PanelHeader> */}
                <PanelBody className={'customer-manager'}>
                    <Column>
                        <Row
                            itemMargin={'md'}
                            crossAxisSize={'min'}
                            flex={0}
                        >
                            <Button
                                type={'success'}
                                disabled = {!hasPermissionNode(pathPermission, 'create')}
                                className={'btn-add ellipsis'}
                                text={'Thêm khách hàng mới'}
                                onClick={() => RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { mode: 'create' })}
                            />

                            <Spacer
                                style={{ marginLeft: 'auto' }}
                                size={'1.5rem'}
                            />

                            {
                                hasPermissionNode(pathPermission, 'view') && (
                                    <>
                                        <Button
                                            type={'default'}
                                            className={`btn-filter ${this.state.isShowfilterPopup ? 'active' : ''} ellipsis`}
                                            icon={'filter'}
                                            text={'Lọc dữ liệu'}
                                            innerRef={this.customerFilterRef}
                                            onClick={() => this.setState({ filterPanelActive: true })}
                                        />
                                        {
                                            this.state.filterPanelActive && (
                                                <PopOver
                                                    width={'25rem'}
                                                    anchorEl={this.customerFilterRef}
                                                    onBackgroundClick={() => this.setState({ filterPanelActive: false })}
                                                >
                                                    <CustomerFilterPanel
                                                        customerTypeOptions={this.state.typeOptions}
                                                        onFilterChange={(key, value) =>
                                                        {
                                                            RouterParamsHelper.setParams(
                                                                this.customerStore.urlParams,
                                                                this.props, {
                                                                    [key]: value,
                                                                    page: 1,
                                                                });
                                                        }}
                                                    />
                                                </PopOver>
                                            )}

                                        <SearchBox
                                            flex="0"
                                            width={'25rem'}
                                            placeholder="Nhập từ khóa để tìm kiếm"
                                            value={this.customerStore.filterState.searchKey}
                                            onChange={(keyword) =>
                                            {
                                                this.customerStore.setFilterState('searchKey', keyword);
                                                this.handleSearchDebounce(keyword);
                                            }}
                                        />
                                    </>
                                )}
                        </Row>

                        {
                            hasPermissionNode(pathPermission, 'view') && (
                                <DataGrid
                                    rowKey={'Id'}
                                    columns={this.state.columns}
                                    items={items || []}
                                    pagination={{
                                        pageIndex: this.customerStore.currentPage,
                                        pageSize: this.customerStore.pageSize,
                                        pageSizeOptions: [10, 20, 50, 100],
                                        onChangePage: (pageIndex) => RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { page: pageIndex }),
                                        onChangeItemsPerPage: (pageSize) => RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { pageSize, page: 1 }),
                                    }}
                                    total={this.customerStore.totalItem}
                                    toolbarVisibility={{ showColumnSelector: true, showReloadButton: true }}
                                    toolbarActions={(
                                        <IconButton
                                            tooltip="Tải tập tin này"
                                            icon="download"
                                            variant="fade"
                                            isRound={false}
                                            isLoading={this.customerStore.isDownloading}
                                            onClick={() => this.handleExportFile()}
                                        />
                                    )}
                                    trailingControlColumns={[
                                        {
                                            width: 140,
                                            headerCellRender: 'Thao tác',
                                            rowCellRender: this.Actions,
                                            freezeEnd: true,
                                        },
                                    ]}
                                    sorting={{
                                        columns: this.state.sorters,
                                        isSingleSort: true,
                                        onSort: (columns) =>
                                        {
                                            this.setState({ sorters: columns });
                                            RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { sort: columns });
                                        },
                                    }}
                                    loading={this.customerStore.isLoading}
                                    isFixedHeader
                                    rowNumber
                                    onReload={() => this.handlePageLoad()}
                                    onCellDoubleClick={(e, row, col) => this.handleRowSelected(row, col)}
                                />
                            )}
                    </Column>
                </PanelBody>
                {/* Popup Add/Edit */}
                {
                    isShowForm && (
                        <QuickAddCustomer
                            formData={currentCustomer}
                            formAction={customerFormAction}
                            properties={this.customerStore.properties}
                        />
                    )}
                {
                    this.customerStore.isDrawer && (
                        <Drawer
                            position={'right'}
                            width={'25rem'}
                            animationIn={'slideInRight'}
                            animationOut={'slideOutRight'}
                            onClose={this.closeDrawer}
                        >
                            <CustomerDetailPanel
                                data={this.state.customerDetail}
                                properties={this.customerStore.properties}
                            />
                        </Drawer>
                    )}
            </Provider>
        );
    }
}
CustomerPanel = inject('appStore', 'fieldForceStore')(observer(CustomerPanel));
CustomerPanel = withModal(withPermission(withRouter(CustomerPanel)));

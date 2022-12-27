import './EmployeePanel.scss';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import {
    PanelBody, Popup, SearchBox, DataGrid, IconButton,
    PopOver, Spacer, Row, Button, withModal, Column, HD6,
} from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import { CommonHelper } from 'helper/common.helper';
import { DataTypes } from 'helper/data.helper';
import { DisplaySchema } from 'helper/data.helper';

import EmployeeInfo from 'extends/ffms/views/EmployeePanel/EmployeeInfo';
import EmployeeProfile from 'extends/ffms/views/EmployeePanel/EmployeeProfile';
import EmployeeFilterPanel from 'extends/ffms/views/EmployeePanel/EmployeeFilterPanel';
import PermissionService from 'extends/ffms/services/PermissionService';
import { FFMSCommonHelper } from 'extends/ffms/helper/common-helper';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';

class EmployeePanel extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    empStore = this.props.fieldForceStore.empStore;
    roleStore = this.props.fieldForceStore.roleStore;

    permissionService = new PermissionService();
    comSvc = this.props.fieldForceStore.comSvc;

    employeeFilterRef = React.createRef();
    urlParams = {};


    state = {
        pageSize: 20,
        pageIndex: 1,
        columns: [],
        searchKey: '',
        isAlert: false,
        filterPanelActive: false,
        sorters: [{ id: 'CreatedDate', direction: 'desc' }],

        createEmployeePermission: false,
        editEmployeePermission: false,

        editingId: '',
        lockingId: '',
        unlockingId: '',
        deletingId: '',

        isDirtyForm: false,
        unSavedChanges: {},

        teamOptions: [],
        typeOptions: [],
        orgOptions: [],
        shiftOptions: [],
        statusOptions: [],
    };

    async componentDidMount()
    {
        // Restore params & set to url
        if (this.empStore.urlParams && Object.values(this.empStore.urlParams).length !== 0)
        {
            RouterParamsHelper.setParams(null, this.props, this.empStore.urlParams);
        }

        await this.bindDataGridColumns();
        await this.loadParams();

        const { CREATE, EDIT, DELETE } = this.permissionService.PERMISSION_LIST;
        this.permissionService.canPerformAction(this.empStore.empSvc.dataPath, CREATE).then((permission) => this.setState({ createEmployeePermission: permission }));
        this.permissionService.canPerformAction(this.empStore.empSvc.dataPath, EDIT).then((permission) => this.setState({ editEmployeePermission: permission }));
        this.permissionService.canPerformAction(this.empStore.empSvc.dataPath, DELETE).then((permission) => this.setState({ deleteEmployeePermission: permission }));

        this.empStore.appStore = this.props.appStore;

        const models = ['employee_status', 'employee_team_id', 'employee_type_id', 'employee_organization_id', 'employee_shift_id'];
        Promise.all(models.map((field) => this.comSvc.getLayerListOptions(this.empStore.LAYER_NAME, field))).then((results) =>
        {
            const [statusOptions, teamOptions, typeOptions, orgOptions, shiftOptions] = results;
            this.setState({ statusOptions, teamOptions, typeOptions, orgOptions, shiftOptions });
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
        const { location, pathPermission, hasPermissionNode } = this.props;

        const params = {
            arrayFilters: ['employee_type_id', 'employee_organization_id', 'employee_team_id', 'employee_status'],
            stringFilters: ['mode', 'select', 'page', 'pageSize', 'order', 'orderBy', 'employee_full_name', 'employee_username', 'employee_phone', 'employee_email'],
            searchKey: DataTypes.String,
        };
        const qs = RouterParamsHelper.getParams(this.props.location.search, params);
        
        for (const key in qs)
        {
            this.empStore.urlParams[key] = qs[key];
        }

        const { mode, select, page, pageSize, order, orderBy, ...filterState } = qs;
        this.empStore.setAllFilterState(filterState);

        if (order && orderBy)
        {
            const sortColumns = [{ id: orderBy, direction: order }];
            this.setState({ sorters: sortColumns });
            this.empStore.setSorters(sortColumns);
        }
        
        this.empStore.setPaging(page ? Number(page) : 1, pageSize ? Number(pageSize) : 20);
        this.empStore.setFormState(false, '');

        const shouldLoad = FFMSCommonHelper.shouldHandlePageLoad(search, params);
        if (shouldLoad && hasPermissionNode(pathPermission, 'view'))
        {
            this.handlePageLoad();
        }
        
        const feature = RouterParamsHelper.getModeAction(location);
        this.props.setSecondFeature(feature);
        if (!hasPermissionNode(pathPermission, feature))
        {
            RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { mode: '', select: '' });
            return null;
        }
       
        if (mode === 'create')
        {
            this.empStore.setEdit(false);
            this.empStore.setEmp({});
            this.empStore.currentAcc = {};
            this.empStore.setFormState(true, 'create');
    
            this.setState({
                originFormData: {},
            });
        }
        else if (select && mode === 'edit' && select)
        {
            this.setState({ editingId: select });
            const employee = await this.empStore.getEmployee(select);
            this.setState({ editingId: '' });

            if (employee)
            {
                const emp = Array.isArray(employee) ? employee[0] : employee;
                this.empStore.togglePanel();
                this.empStore.setEdit(true);
                this.empStore.setEmp(emp);
                this.empStore.setFormState(true, 'update');
    
                this.setState({
                    originFormData: { ...emp },
                });
            }
        }

    }

    bindDataGridColumns = async () =>
    {
        // will remove this
        const hiddenColumns = [
            'employee_guid',
            'employee_code',
            'employee_image',
            'employee_vehicle_id',
        ];
        const columns = await this.comSvc.getDataGridColumns('employees', hiddenColumns);
        
        const columnSorters = columns.filter((col) => col.isSortable).map((col) =>
        {
            return {
                id: col.id,
                direction: undefined,
            };
        });

        this.empStore.properties = columns;
        this.setState({
            columns: columns,
            sorters: columnSorters,
        });
    }

    handleBeforeClose = () =>
    {
        const objDirty = this.markDirty(true);
        if (objDirty.isDirty)
        {
            this.props.confirm({
                title: 'Thoát khỏi tính năng này?',
                message: <HD6>Bạn có thay đổi chưa lưu</HD6>,
                cancelText: 'Bỏ thay đổi',
                onCancel: this.closeMe,
                okText: 'Tiếp tục chỉnh sửa',
            });
            return false;
        }
        return true;
    };

    closeMe = () =>
    {
        this.empStore.setFormState(false);
        this.empStore.togglePanel();
        this.roleStore.setDataRoleEmp();
        RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { mode: '', select: '' });
    };

    markDirty = (silent) =>
    {
        let isDirty = false;
        const unSavedChanges = {};
        const formAction = this.empStore.formAction;

        let compareData = this.empStore.currentEmp;
        let mainData = this.state.originFormData;

        if (formAction === 'create')
        {
            mainData = this.empStore.currentEmp;
            compareData = this.state.originFormData || {};
        }

        Object.keys(mainData).forEach((key) =>
        {
            const value1 = mainData[key];
            const value2 = compareData[key];

            if (value1 || value2)
            {
                const sameValue = JSON.stringify({ value: value1 }) === JSON.stringify({ value: value2 });
                if (!sameValue)
                {
                    isDirty = true;
                    if (!silent)
                    {
                        unSavedChanges[key] = {
                            previous: formAction === 'create' ? value2 : value1,
                            current: formAction === 'create' ? value1 : value2,
                        };
                    }
                }
            }
        });

        return { isDirty, unSavedChanges };
    };

    handleSearch = async (searchKey) =>
    {
        const params = {
            searchKey: searchKey,
            page: 1,
        };
        RouterParamsHelper.setParams(this.empStore.urlParams, this.props, params);
    };
    handleSearchDebounce = new AwesomeDebouncePromise(this.handleSearch.bind(this), 300);


    Actions = (row, index) =>
    {
        const editable = this.state.editEmployeePermission;
        const { pathPermission, hasPermissionNode } = this.props;

        return (
            <Row
                itemMargin={'sm'}
                crossAxisAlignment={'start'}
            >
                <Button
                    icon={'edit'}
                    color={'info'}
                    className={'btn-action'}
                    isLoading={this.state.editingId === row.Id}
                    disabled={!editable || !hasPermissionNode(pathPermission, 'edit')}
                    tooltip={!editable ? 'Bạn chưa được phân quyền thực hiện tác vụ này' : 'Sửa thông tin'}
                    onlyIcon
                    onClick={() => RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { mode: 'edit', select: row.Id })}
                />
            </Row>
        );
    };

    handlePageLoad = async (page, debounce) =>
    {
        this.empStore.setLoading(true);
        page = page || this.empStore.currentPage;
        this.empStore.setPaging(page, this.empStore.pageSize);

        const data = debounce ? await this.empStore.getDataDebounced(null, true) : await this.empStore.getData(null, true);
        this.empStore.setData(data);

        this.empStore.setLoading(false);
    };

    handleExportFile = async () =>
    {
        const { filterState } = this.empStore;
        const queryFile = {
            sortInfo: [],
            searchKey: '',
            filterQuery: [],
            count: -1,
        };
        this.empStore.setDownloading(true);
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
            
            const dictionary = {
                employee_status: CommonHelper.toDictionary(this.state.statusOptions, 'indexed', 'id'),
                employee_organization_id: CommonHelper.toDictionary(this.state.orgOptions, 'indexed', 'id'),
                employee_team_id: CommonHelper.toDictionary(this.state.teamOptions, 'indexed', 'id'),
                employee_type_id: CommonHelper.toDictionary(this.state.typeOptions, 'indexed', 'id'),
            };

            const mappings =
            {
                employee_status: [],
                employee_organization_id: [],
                employee_team_id: [],
                employee_type_id: [],
                
            };

            for (const f in filterState)
            {
                if (filterState.hasOwnProperty(f) && filterState[f])
                {
                    switch (f)
                    {
                        case 'Title':
                            filters.push(`${f}:(${filterState[f]}*)`);
                            break;
                        case 'employee_full_name':
                        case 'employee_username':
                        case 'employee_phone':
                        case 'employee_email':
                            filters.push(`${f}:(${filterState[f]}*)`);
                            break;
                        case 'searchKey':
                            queryFile.searchKey = `${filterState?.searchKey}`;
                            break;
                        default:
                            if (Array.isArray(filterState[f]) && filterState[f].length > 0)
                            {
                                const field = `${f}_sfacet`;
                                    
                                filterState[f].map((value) =>
                                {
                                    for (const t in dictionary[f])
                                    {
                                        if (dictionary[f][t] === value)
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
                            break;
                    }
                }
            }

            queryFile.filterQuery = [`${filters.join(' AND ')}`];
        }
        // Download
        await this.comSvc.getExportQueryFile('EMPLOYEE', queryFile);
        this.empStore.setDownloading(false);
    };

    render()
    {
        const { isShowForm, formAction } = this.empStore;
        const { pathPermission, hasPermissionNode } = this.props;

        return (
            <>
                {/* <PanelHeader>QUẢN LÝ NHÂN VIÊN</PanelHeader> */}
                <PanelBody className={'emp-manager'}>
                    <Column>
                        <Row
                            itemMargin={'md'}
                            crossAxisSize={'min'}
                            flex={0}
                        >
                            <Button
                                color={'success'}
                                className={'btn-add ellipsis'}
                                text={'Thêm nhân viên mới'}
                                disabled={!this.state.createEmployeePermission || !hasPermissionNode(pathPermission, 'create')}
                                tooltip={!this.state.createEmployeePermission ? 'Bạn chưa được phân quyền thực hiện tác vụ này' : null}
                                onClick={() => RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { mode: 'create' })}
                            />

                            <Spacer
                                style={{ marginLeft: 'auto' }}
                                size={'1.5rem'}
                            />

                            {
                                hasPermissionNode(pathPermission, 'view') && (
                                    <>
                                        <Button
                                            color={'default'}
                                            className={`btn-filter ${this.state.isShowfilterPopup ? 'active' : ''} ellipsis`}
                                            icon={'filter'}
                                            text={'Lọc dữ liệu'}
                                            innerRef={this.employeeFilterRef}
                                            onClick={() =>
                                            {
                                                this.setState({ filterPanelActive: true });
                                            }}
                                        />
                                        {
                                            this.state.filterPanelActive && (
                                                <PopOver
                                                    width={'25rem'}
                                                    anchorEl={this.employeeFilterRef}
                                                    onBackgroundClick={() =>
                                                    {
                                                        this.setState({ filterPanelActive: false });
                                                    }}
                                                >
                                                    <EmployeeFilterPanel
                                                        employeeTypeOptions={this.state.typeOptions}
                                                        teamOptions={this.state.teamOptions}
                                                        orgOptions={this.state.orgOptions}
                                                        statusOptions={this.state.statusOptions}
                                                        onFilterChange={(key, value) => RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { [key]: value, page: 1 })}
                                                    />
                                                </PopOver>
                                            )}

                                        <SearchBox
                                            width={'25rem'}
                                            flex="0"
                                            placeholder={'Nhập từ khóa để tìm kiếm'}
                                            value={this.empStore.filterState.searchKey}
                                            onChange={(keyword) =>
                                            {
                                                this.empStore.setFilterState('searchKey', keyword);
                                                this.handleSearchDebounce(keyword);
                                            }}
                                        />
                                    </>
                                )}
                        </Row>

                        {
                            hasPermissionNode(pathPermission, 'view') && (
                                <DataGrid
                                    columns={this.state.columns.map((col) =>
                                    {
                                        if (col.id === 'employee_dob')
                                        {
                                            col.schema = DisplaySchema.Date;
                                        }
                                        else if (col.id === 'employee_status')
                                        {
                                            col.options = this.state.statusOptions.map((opt) =>
                                            {
                                                return {
                                                    ...opt,
                                                    id: opt.indexed,
                                                    color: 'var(--default-color)',
                                                };
                                            });
                                        }
                                        return col;
                                    })}
                                    items={this.empStore.employees || []}
                                    rowKey={'Id'}
                                    pagination={{
                                        pageIndex: this.empStore.currentPage,
                                        pageSize: this.empStore.pageSize,
                                        pageSizeOptions: [10, 20, 50, 100],
                                        onChangePage: (pageIndex) => RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { page: pageIndex }),
                                        onChangeItemsPerPage: (pageSize) => RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { page: 1, pageSize }),
                                    }}
                                    total={this.empStore.totalItem}
                                    toolbarVisibility={{ showColumnSelector: true, showReloadButton: true }}
                                    toolbarActions={(
                                        <IconButton
                                            tooltip="Tải tập tin này"
                                            icon="download"
                                            variant="fade"
                                            isRound={false}
                                            isLoading={this.empStore.isDownloading}
                                            onClick={() => this.handleExportFile()}
                                        />
                                    )}
                                    trailingControlColumns={[
                                        {
                                            width: 100,
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
                                            RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { sort: columns });
                                        },
                                    }}
                                    loading={this.empStore.isLoading}
                                    isFixedHeader
                                    rowNumber
                                    onReload={() => this.handlePageLoad()}
                                    onCellDoubleClick={(e, row, col) => RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { mode: 'edit', select: row.Id })}
                                />
                            )}
                    </Column>
                </PanelBody>

                {
                    isShowForm && !this.empStore.isEdit && (
                        <Popup
                            className={'emp-manager-form'}
                            height={'45rem'}
                            width={'40rem'}
                            title={'Thêm nhân viên mới'}
                            escape={false}
                            scroll
                            onBeforeClose={this.handleBeforeClose}
                            onClose={this.closeMe}
                        >
                            <EmployeeInfo
                                teamOptions={this.state.teamOptions}
                                typeOptions={this.state.typeOptions}
                                orgOptions={this.state.orgOptions}
                                shiftOptions={this.state.shiftOptions}
                                formAction={formAction}
                                data={this.empStore.currentEmp}
                                properties={this.state.columns}

                            />
                        </Popup>
                    )}

                {/* Popup Add/Edit */}
                {
                    isShowForm && this.empStore.isEdit && (
                        <Popup
                            className={'emp-manager-form'}
                            height={'46rem'}
                            title={'QUẢN LÝ NHÂN VIÊN'}
                            padding={'0'}
                            escape={false}
                            scroll="false"
                            onBeforeClose={this.handleBeforeClose}
                            onClose={this.closeMe}
                        >
                            <EmployeeProfile
                                data={this.empStore.currentEmp}
                                employeeFormAction={formAction}
                                onDataChanged={(data) => this.setState({ originFormData: { ...data } })}
                            />
                        </Popup>
                    )}
            </>
        );
    }
}

EmployeePanel = inject('appStore', 'fieldForceStore')(observer(EmployeePanel));
EmployeePanel = withModal(withPermission(withRouter(EmployeePanel)));
export default EmployeePanel;


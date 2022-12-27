import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import _findIndex from 'lodash/findIndex';
import PropTypes from 'prop-types';

import {
    Container, PanelHeader, PanelBody, SearchBox,
    Spacer, Sub2, Expanded, T, Row, Button,
    withI18n, withTenant, withModal,
} from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import { CommonHelper } from 'helper/common.helper';
import { isEmpty } from 'helper/data.helper';

import PhotoTypeManager from 'extends/ffms/pages/Layerdata/Layer/PhotoTypeManager';
import { LayerGrid } from 'extends/ffms/pages/Layerdata/Layer/LayerGrid';
import LayerFormAction from 'extends/ffms/pages/Layerdata/Layer/LayerFormAction';
import JobTypeConfig from 'extends/ffms/pages/Layerdata/JobTypeLayer/JobTypeConfig';
import OrganizationService from 'extends/ffms/services/OrganizationService';
import MenuButton from 'extends/ffms/pages/base/MenuButton/MenuButton';
import JobTypeFilter from 'extends/ffms/pages/Layerdata/JobTypeEmployeeType/JobTypeFilter';
import EmployeeTypeFilter from 'extends/ffms/pages/Layerdata/JobTypeEmployeeType/EmployeeTypeFilter';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';


export class LayerData extends Component
{
    state = {
        formConfig: false,
        isRowActiveId: null,
    }

    fieldForceStore = this.props.fieldForceStore;
    managerLayerStore = this.props.fieldForceStore.managerLayerStore;
    comSvc = this.props.fieldForceStore.comSvc;
    orgSvc = new OrganizationService();

    handleCreateClick = () =>
    {
        RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, { mode: 'create' });
    };

    getLayerEdit = async (data) =>
    {
        this.setState({
            isRowActiveId: data.Id,
        });
        RouterParamsHelper.setParams(
            this.managerLayerStore.urlParams,
            this.props,
            { mode: 'edit', select: data.Id, layer: data.Layer },
        );
    }

    getLayerConfig = async (data, mode) =>
    {
        this.setState({
            isRowActiveId: data.Id,
        });
        RouterParamsHelper.setParams(
            this.managerLayerStore.urlParams,
            this.props,
            { mode, select: data.Id, layer: data.Layer },
        );
    }

    handleCloseConfig = () =>
    {
        this.setState({
            isRowActiveId: null,
        });
        RouterParamsHelper.setParams(
            this.managerLayerStore.urlParams,
            this.props,
            { mode: '', select: '' },
        );

    }

    handleChangeFilter = async (key, value) =>
    {
        this.managerLayerStore.setFilterState(key, value);
        RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, { [key]: isEmpty(value) ? '' : value, page: 1 });

        switch (this.props.layer?.LayerName?.toUpperCase())
        {
            case 'TEAM': {
                const res = await this.orgSvc.get(value);
                if (res)
                {
                    this.managerLayerStore.setCurrentOrg(res);
                }
                break;
            }
            case 'EMPLOYEE_TYPE':
            case 'JOB_TYPE':
                break;
        }
    };

    loadDataOrganization = (layerName) =>
    {
        const { pathPermission, hasPermissionNode } = this.props;

        if (layerName === 'TEAM')
        {
            const options = this.fieldForceStore.getDataReferenceOptions('organizations', 'organization_id','organization_name');

            const defaultOrg = { text: 'Tổ chức', icon: 'users' };
            let i;
            for (i = 0; i < options.length; i++)
            {
                options[i].icon = options[i]['organization_icon'] || 'users';
                options[i].text = options[i]['label'];
                options[i].active = false;

                if (options[i].organization_id === this.managerLayerStore.currentOrg.organization_id)
                {
                    defaultOrg.text = options[i].text;
                    defaultOrg.icon = options[i].icon;
                    options[i].active = true;
                }
            }

            if (!hasPermissionNode(pathPermission, 'view'))
            {
                return <></>;
            }

            return (
                <>
                    <Sub2>Thuộc tổ chức</Sub2>
                    <Spacer />
                    <MenuButton
                        width={['15rem','15rem']}
                        text={defaultOrg.text}
                        icon={defaultOrg.icon}
                        menu={options}
                        iconVisible
                        selectable
                        onMenuItemClick={(item) => this.handleChangeFilter('team_organization_id', item.organization_id)}
                    />
                    <Spacer />
                </>
            );
        }
    }

    renderCreateButton = (layerName) =>
    {
        const { pathPermission, hasPermissionNode } = this.props;

        if (layerName)
        {
            const ableToCreate = layerName !== 'JOB_STATUS' && layerName !== 'DEVICE_STATUS' && layerName !== 'PHOTO_TYPE';

            return (
                <Button
                    type={'success'}
                    text={'Thêm mới'}
                    className={'upper-case'}
                    disabled={!ableToCreate || !hasPermissionNode(pathPermission, 'create')}
                    tooltip={ableToCreate ? 'Thêm mới' : 'Lớp dữ liệu này không được phép thêm mới'}
                    onClick={this.handleCreateClick}
                />
            );
        }
    }

    handleDeleteLayerData = (data) =>
    {

        this.props.confirm({
            message: `${this.props.t('Bạn có chắc chắn muốn xóa dữ liệu "%0%" không?', [data.Title])}`,
            onOk: async () =>
            {
                const res = await this.comSvc.deleteLayerDataByNodeId(data.Layer, [data.Id]);
                if (res && res.errorMessage)
                {
                    this.props.toast({ type: 'error', message: res.errorMessage });
                }
                else
                {
                    this.props.toast({ type: 'success', message: 'Đã xóa dữ liệu thành công' });
                    this.managerLayerStore.reload();

                    const model = this.comSvc.getModelName(data.Layer);
                    this.comSvc.updateDataReferences([model]);

                    this.fieldForceStore.setReadyToStart(this.props.tenantConfig);
                }
            },
        });
    };


    handleActionClick = (row, actionType) =>
    {
        switch (actionType)
        {
            case 'delete':
                this.handleDeleteLayerData(row);
                break;
            default:
                this.getLayerConfig(row, actionType);
                break;
        }
    }

    handleSearch = (keyword) =>
    {
        RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, { searchKey: keyword, page: 1 });
    }
    handleSearchDebounced = new AwesomeDebouncePromise(this.handleSearch.bind(this), 300);


    ActionButtons = (row, index, onActionClick) =>
    {
        const layerName = this.props.layer.LayerName?.toUpperCase();
        const required = ['EMPLOYEE_TYPE', 'JOB_TYPE', 'CUSTOMER_TYPE', 'TEAM', 'ORGANIZATION', 'SHIFT', 'ORGANIZATION_TYPE', 'JOBTYPE_EMPLOYEETYPE','JOB_STATUS','DEVICE_STATUS'];
        const ableToDelete = required.indexOf(layerName) === -1;
        const { pathPermission, hasPermissionNode } = this.props;
        return (
            <Row
                itemMargin={'sm'}
                crossAxisAlignment={'start'}
            >
                <Button
                    icon={'edit'}
                    type={'default'}
                    disabled = {!hasPermissionNode(pathPermission, 'edit')}
                    tooltip={'Chỉnh sửa'}
                    onlyIcon
                    onClick={() => onActionClick(row, 'edit')}
                />

                {
                    ['TEAM' ,'ORGANIZATION'].includes(layerName) && (
                        <Button
                            icon={'users'}
                            type={'default'}
                            disabled = {!hasPermissionNode(pathPermission, 'detail')}
                            onlyIcon
                            onClick={() =>
                            {
                                this.setState({ isRowActiveId: row.Id });
                                onActionClick(row, 'detail');
                            }}
                        />
                    )}

                {
                    layerName === 'JOB_TYPE' && (
                        <Button
                            icon={'cog'}
                            type={'default'}
                            disabled = {!hasPermissionNode(pathPermission, 'edit')}
                            tooltip={'Cấu hình'}
                            onlyIcon
                            onClick={() => onActionClick(row, 'config')}
                        />
                    )}
                <Button
                    icon={'trash-alt'}
                    type={'default'}
                    disabled={!ableToDelete || !hasPermissionNode(pathPermission, 'delete')}
                    tooltip={ableToDelete ? 'Xóa' : 'Lớp dữ liệu này không được phép xóa'}
                    onlyIcon
                    onClick={() => onActionClick(row, 'delete')}
                />
            </Row>
        );
    }

    handleRowSelected = (row, col, hash) =>
    {
        if (!hash)
        {
            this.props.location.hash = '#accounts';
        }
        else
        {
            this.props.location.hash = hash;
        }
        if (row.Layer === 'TEAM' || row.Layer === 'ORGANIZATION')
        {
            this.setState({
                isRowActiveId: row.Id,
            });
            RouterParamsHelper.setParams(
                this.managerLayerStore.urlParams,
                this.props,
                { mode: 'detail', select: row.Id, layer: row.Layer },
            );
            this.managerLayerStore.setMainTab(1);
        }
    };

    handleMappingTypeChange = async (layerName, primaryData, formAction) =>
    {
        const modelInfo = await this.managerLayerStore.getModelInfo(layerName);

        // update record on grid
        this.bindSubmitDataToGrid(primaryData, formAction, modelInfo);

        const { primary, primaryField, mappingModelName, linkField, link } = modelInfo;
        const [ dataRefs, mappingData ] = await Promise.all([
            this.comSvc.getDataReferences([link.modelName]),
            this.comSvc.queryData(mappingModelName, { [primaryField]: primaryData[primary.idField] }),
        ]);

        const linkDataDict = CommonHelper.toDictionary(dataRefs[link.modelName], link.displayField, link.idField);
        const mappingTypes = mappingData?.data || [];
        const mappingTypeIds = mappingTypes.map((x) => `${linkDataDict[x[linkField]]}`) || {};

        // delete jobtype_employeetype
        const itemsToDelete = mappingTypes.filter((x) => !primaryData[linkField].includes(`${linkDataDict[x[linkField]]}`));

        if (itemsToDelete?.length > 0)
        {
            await this.comSvc.deleteLayerDataByNodeId(mappingModelName, itemsToDelete.map((x) => x.Id));
        }

        // Create new jobtype_employeetype
        const itemsToInsert = mappingTypeIds.length ? primaryData[linkField]?.filter((x) => !mappingTypeIds?.includes(x)) : primaryData[linkField];

        if (itemsToInsert?.length > 0)
        {
            const linkDataDictById = CommonHelper.toDictionary(dataRefs[link.modelName], link.idField, link.displayField);
            await Promise.allSettled(itemsToInsert.map((linkId) =>
            {
                return this.comSvc.addLayerData(mappingModelName, {
                    [primaryField]: primaryData[primary.idField],
                    [linkField]: linkId,
                    Title: primaryField === 'jobtype_id' ? `${linkDataDictById[linkId]} - ${primaryData[primary.displayField]}` : `${primaryData[primary.displayField]} - ${linkDataDictById[linkId]}`,
                });
            }));
        }

        this.comSvc.updateDataReferences([primary.modelName, mappingModelName]);
    };

    bindSubmitDataToGrid = async (data, formAction, modelInfo = {}) =>
    {
        const { primary, linkField } = modelInfo;
        const { modelName, idField } = primary;

        if (formAction === 'create')
        {
            const gridItem = await this.comSvc.getById(modelName, data[idField]);
            gridItem[linkField] = data[linkField];
            this.managerLayerStore.currentNodes = [gridItem || data, ...this.managerLayerStore.currentNodes];
            if (this.managerLayerStore.currentNodes.length > this.managerLayerStore.pageSize)
            {
                this.managerLayerStore.currentNodes.pop();
            }
        }
        else
        {
            const findPos = _findIndex(this.managerLayerStore.currentNodes, (j) => j[idField] === data[idField]);

            if (findPos > -1)
            {
                this.managerLayerStore.currentNodes[findPos] = data;
            }
        }
    };

    render()
    {
        const { layer } = this.props;
        const { isShow, action, currentLayerItem, currentLayer, urlParams } = this.managerLayerStore;
        const { showConfig, currentConfig } = this.managerLayerStore;

        const isPhotoType = currentLayer && currentLayer.LayerName && currentLayer.LayerName.toUpperCase() === 'PHOTO_TYPE';
        const { pathPermission, hasPermissionNode } = this.props;

        return (
            <>
                <PanelHeader>
                    {
                        layer && layer.Caption &&
                        <T params={[layer.Caption.replace('_', ' ')]}>Quản lý dữ liệu %0%</T>
                    }
                </PanelHeader>
                <PanelBody>
                    <Container>
                        <Row
                            mainAxisAlignment='space-between'
                            crossAxisAlignment='center'
                            itemMargin={'md'}
                        >
                            { layer.LayerName === 'TEAM' && this.loadDataOrganization(layer.LayerName) }

                            <Container
                                className={'layer-manager-tool ellipsis'}
                            >
                                { this.renderCreateButton(layer.LayerName) }
                            </Container>
                            <Spacer />
                            <Expanded />

                            {
                                hasPermissionNode(pathPermission, 'view') && (
                                    <>
                                        <JobTypeFilter onChange={this.handleChangeFilter} />
                                        <EmployeeTypeFilter onChange={this.handleChangeFilter} />

                                        <Container style={{ width: '25rem' }}>
                                            <SearchBox
                                                placeholder={'Nhập từ khóa để tìm kiếm'}
                                                value={this.managerLayerStore.filterState.searchKey}
                                                onChange={(keyword) =>
                                                {
                                                    this.managerLayerStore.setFilterState('searchKey', keyword);
                                                    this.handleSearchDebounced(keyword);
                                                }}
                                            />
                                        </Container>
                                    </>
                                )}
                        </Row>
                    </Container>
                    {
                        isPhotoType
                            ? (
                                    <PhotoTypeManager
                                        data={this.managerLayerStore.currentNodes}
                                    />
                                )
                            : (
                                    this.managerLayerStore.currentLayer && hasPermissionNode(pathPermission, 'view') && (
                                        <LayerGrid
                                            properties={this.managerLayerStore.currentLayer.Properties}
                                            data={this.managerLayerStore.currentNodes}
                                            layerName={currentLayer.LayerName}
                                            total={this.managerLayerStore.totalNodes}
                                            pageSize={this.managerLayerStore.pageSize}
                                            pageIndex={this.managerLayerStore.pageIndex}
                                            isLoading={this.managerLayerStore.isLoading}
                                            sortingColumns={this.managerLayerStore.sortingColumns}
                                            actionWidth={['JOB_TYPE', 'TEAM', 'ORGANIZATION'].includes(currentLayer.LayerName) ? 130 : 100}
                                            actions={(row, index) =>
                                            {
                                                return this.ActionButtons(row, index, this.handleActionClick);
                                            }}
                                            onChangePage={(pageIndex) =>
                                            {
                                                RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, { page: pageIndex });
                                            }}
                                            onChangeItemsPerPage={(pageSize) =>
                                            {
                                                RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, { pageSize, page: 1 });
                                            }}
                                            onReload={()=>this.managerLayerStore.reload()}
                                            onSort={(columns) =>
                                            {
                                                const [{ id: order = '', direction: orderBy = '' }] = columns;

                                                RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, {
                                                    order: order,
                                                    orderBy: orderBy,
                                                });
                                            }}
                                            onCellDoubleClick={(e, row, col) => this.handleRowSelected(row, col)}
                                        />
                                    )
                                )
                    }
                </PanelBody>
                {
                    isShow && layer && layer.LayerName && (
                        <LayerFormAction
                            layerName={layer.LayerName}
                            layerCaption={layer.Caption}
                            properties={layer.Properties}
                            formData={currentLayerItem}
                            formAction={action}
                            onCloseForm={(value)=>this.setState({ isRowActiveId: value })}
                            onAfterFormSubmit={async (data, formAction)=>
                            {
                                if (layer.LayerName === 'JOB_TYPE' || layer.LayerName === 'EMPLOYEE_TYPE')
                                {
                                    await this.handleMappingTypeChange(layer.LayerName, data, formAction);
                                }
                                else
                                {
                                    this.managerLayerStore.reload();
                                    this.comSvc.updateDataReferences([layer.LayerName]);
                                }

                                RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, { mode: '', select: '' });
                                this.managerLayerStore.setShowForm(false);
                                this.setState({ isRowActiveId: null });

                                this.fieldForceStore.setReadyToStart(this.props.tenantConfig);
                            }}
                        />
                    )}
                {
                    showConfig && (
                        <JobTypeConfig
                            data={currentConfig}
                            layerNode={currentLayerItem}
                            onClose={()=>this.handleCloseConfig()}
                        />
                    )}
            </>
        );
    }
}

LayerData.propTypes = {
    data: PropTypes.object,
    properties: PropTypes.array,
};
LayerData.defaultProps = {
    data: {},
    properties: [],
};

LayerData = inject('appStore', 'fieldForceStore')(observer(LayerData));
LayerData = withTenant(withModal(withI18n(withPermission(withRouter(LayerData)))));
export default LayerData;

import './LayerTreeView.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { runInAction } from 'mobx';

import {
    Container, PanelHeader, BorderPanel,
    Expanded, Sub1, Drawer, Row, Column, Button,
    withI18n, withTenant, withModal,
} from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

import { RouterParamsHelper } from 'helper/router.helper';
import LayerService from 'services/layer.service';
import { DataTypes } from 'helper/data.helper';
import { CommonHelper } from 'helper/common.helper';

import { FFMSCommonHelper } from 'extends/ffms/helper/common-helper';
import LayerData from 'extends/ffms/pages/Layerdata/Layer/LayerData';
import LayerItem from 'extends/ffms/pages/Layerdata/Layer/LayerItem';
import { defaultLayerGridPageSize } from 'extends/ffms/pages/Layerdata/ManagerLayerStore';
import { TENANT_STATUS } from 'extends/ffms/constant/ffms-enum';
import SampleConfig from 'extends/ffms/pages/Config/SampleConfig';
import TeamDetail from 'extends/ffms/views/DetailView/TeamDetail';
import OrganizationDetail from 'extends/ffms/views/DetailView/OrganizationDetail';
import * as Routers from 'extends/ffms/routes';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';

const layerPath = '/root/vdms/tangthu/data/ffms';
const layerList = [
    { LayerName: 'HUB', path: `${layerPath}/hub` },
    { LayerName: 'ORGANIZATION_TYPE', path: `${layerPath}/organization_type` },
    { LayerName: 'ORGANIZATION', path: `${layerPath}/organization` },
    { LayerName: 'TEAM', path: `${layerPath}/team` },
    { LayerName: 'SHIFT', path: `${layerPath}/shift` },
    { LayerName: 'JOB_TYPE', path: `${layerPath}/job_type` },
    { LayerName: 'EMPLOYEE_TYPE', path: `${layerPath}/employee_type` },
    { LayerName: 'CUSTOMER_TYPE', path: `${layerPath}/customer_type` },
    // { LayerName: 'JOBTYPE_EMPLOYEETYPE', path: `${layerPath}/jobtype_employeetype` },
    { LayerName: 'JOB_STATUS', path: `${layerPath}/job_status` },
    { LayerName: 'DEVICE_STATUS', path: `${layerPath}/device_status` },
    // { LayerName: 'PHOTO_TYPE', path: `${layerPath}/photo_type` },
];

export class LayerTreeView extends Component
{
    layerFeatureName = RouterParamsHelper.getRouteFeature(Routers.MANAGER_LAYER_DATA, Routers.baseUrl + '/app-config');

    fieldForceStore = this.props.fieldForceStore;
    managerLayerStore = this.props.fieldForceStore.managerLayerStore;

    layerSvc = new LayerService();
    comSvc = this.props.fieldForceStore.comSvc;
    
    state = {
        layerList: [],
        orgOptions: [],
        detailItem: {},
    };

    loaded = false;

    getPermissionPath = (layerList, permissionData) =>
    {
        const layerPermissionObj = permissionData?.Children
            ? CommonHelper.toDictionary(permissionData.Children ,'Path')
            : null;

        const permLayList = layerList.filter(layer =>
        {
            let perPath = layer.path.replace(layerPath, '');
            perPath = this.layerFeatureName + perPath.replace('_', '');

            if (layerPermissionObj && layerPermissionObj[perPath])
            {
                return layerPermissionObj[perPath].CanView;
            }
        });

        return permLayList;
    }

    permLayerList = this.getPermissionPath(layerList, this.props.appcustomizePermission);

    componentDidMount = async () =>
    {
        this.loaded = true;

        // Restore params & set to url
        if (this.managerLayerStore.urlParams && Object.values(this.managerLayerStore.urlParams).length !== 0)
        {
            RouterParamsHelper.setParams(null, this.props, this.managerLayerStore.urlParams);
        }
     
        Promise.all(this.permLayerList.map((l) => this.comSvc.getLayerConfig(l.LayerName))).then((results) =>
        {
            this.setState({
                layerList: results,
                currentLayer: results[0],
            });
        });

        this.loadParams();
    }

    componentDidUpdate = (prevProps) =>
    {
        const locationSearch = RouterParamsHelper.shouldLocationChanged(this.props.location, prevProps.location);
        if (locationSearch)
        {
            this.loadParams(locationSearch);
        }
    };
    
    loadOrganizations = (orgId) =>
    {
        this.fieldForceStore.loadDataReferences(['organizations']).then((dataRefs) =>
        {
            if (dataRefs)
            {
                const orgOptions = this.fieldForceStore.getDataReferenceOptions('organizations', 'organization_id','organization_name').sort((a, b) => a.Title.localeCompare(b.Title)) ?? [];
                this.setState({ orgOptions });

                const currentOrg = (orgId && orgOptions.find((x) => x.organization_id === parseInt(orgId))) || orgOptions[0];
                this.managerLayerStore.setCurrentOrg(currentOrg);
            }
        });
    }

    loadParams = async (search) =>
    {
        const { hasPermissionNode } = this.props;
        let pathPermissionData = CommonHelper.clone(this.props.pathPermission);
        const params = {
            arrayFilters: ['jobtype_id', 'employee_type_id'],
            stringFilters: ['select', 'mode', 'layer', 'path', 'searchKey', 'order', 'orderBy', 'page', 'pageSize', 'team_organization_id'],
        };

        const qs = {
            layer: this.managerLayerStore.currentLayer.LayerName,
            path: this.managerLayerStore.currentLayer.path || (this.permLayerList && this.permLayerList[0]?.path),
            searchKey: this.managerLayerStore.filterState.searchKey || '',
            page: this.managerLayerStore.pageIndex,
            pageSize: this.managerLayerStore.pageSize,
            ...RouterParamsHelper.getParams(this.props.location.search, params),
        };

        // init layer get path permission data
        this.initPermissionLayer(qs, (layerData) =>
        {
            qs.layer = qs.layer ? qs.layer : layerData.LayerName;
            qs.path = qs.path ? qs.path : layerData.path;
        });
         
        const { layer, path, select, mode, order, orderBy, page, pageSize, ...filterState } = qs;
        const changed = RouterParamsHelper.getParams(search, { layer: DataTypes.String, path: DataTypes.String });

        if (!search || (changed && changed.layer))
        {
            (changed.layer || layer) === 'TEAM' && this.loadOrganizations(filterState['team_organization_id']);

            this.comSvc.getLayerConfig(changed.layer || layer).then((layerInfo) =>
            {
                this.managerLayerStore.setGridOptions(filterState, {
                    page: page ? Number(page) : 1,
                    pageSize: pageSize ? Number(pageSize) : defaultLayerGridPageSize,
                }, [{ id: order, direction: orderBy }], { ...layerInfo, path: changed.path || path });
            });
        }
        else if (FFMSCommonHelper.shouldHandlePageLoad(search, params))
        {
            this.managerLayerStore.setGridOptions(filterState, {
                page: page ? Number(page) : 1,
                pageSize: pageSize ? Number(pageSize) : defaultLayerGridPageSize,
            }, [{ id: order, direction: orderBy }]);
        }

        runInAction(() =>
        {
            this.managerLayerStore.setShowForm(false, '');
            this.managerLayerStore.setShowDetail(false);
            this.managerLayerStore.setShowConfig(false);
        });

        if (path)
        {
            let perPath = path.replace(layerPath, '');
            perPath = this.layerFeatureName + perPath.replace('_', '');

            if (perPath !== pathPermissionData?.Path)
            {
                pathPermissionData = await this.props.loadPathPermission(perPath, false);

                this.props.setCurrentPath(perPath);
                this.props.setPathPermission(pathPermissionData);
            }
        }


        if (!this.checkMode_initTab(mode, pathPermissionData))
        {
            RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, { mode: '', select: '' });
            return null;
        }

        if (mode === 'create')
        {
            if (layer === 'TEAM')
            {
                this.managerLayerStore.setLayerItem(mode, {
                    team_organization_id: this.managerLayerStore.filterState.team_organization_id,
                });
            }
            else
            {
                this.managerLayerStore.setLayerItem(mode);
            }
            this.managerLayerStore.setShowForm(true, mode);
        }
        else if (select)
        {
            if (mode === 'edit' || mode === 'config')
            {
                const _layerItem = await this.managerLayerStore.getLayerItemEdit(layer || this.managerLayerStore.currentLayer?.LayerName, select);

                if (_layerItem && (layer === 'JOB_TYPE' || layer === 'EMPLOYEE_TYPE'))
                {
                    if (mode === 'config')
                    {
                        const itemConfig = _layerItem['jobtype_config'] ? JSON.parse(_layerItem['jobtype_config']) : {};
                        this.managerLayerStore.setCurrentConfig(itemConfig);
                    }

                    const modelInfo = await this.managerLayerStore.getModelInfo(layer);
                    const newItems = await this.managerLayerStore.getMappingTypes([_layerItem], modelInfo);
                    
                    this.managerLayerStore.setLayerItem(mode, newItems[0]);
                }
                else
                {
                    this.managerLayerStore.setLayerItem(mode, _layerItem);
                }
                
                runInAction(() =>
                {
                    this.managerLayerStore.setShowForm(mode === 'edit', mode);
                    this.managerLayerStore.setShowConfig(mode === 'config');
                });
            } // Detail is view permission in layer screen
            else if (mode === 'detail' && hasPermissionNode(pathPermissionData, 'view'))
            {
                this.comSvc.queryData(layer, { Id: select, take: 1 }).then((result) =>
                {
                    if (result && result.data)
                    {
                        const d = Array.isArray(result.data) ? result.data[0] : result.data;
                        if (d)
                        {
                            this.setState({ detailItem: d });
                            this.managerLayerStore.setShowDetail(true);
                        }
                    }
                });
            }
        }

        // temporarily disable
        // this.fieldForceStore.setReadyToStart(this.props.tenantConfig);
    };

    // handle check permission and intit tab with role
    checkMode_initTab = (mode, pathPermission)=>
    {
        const { hasPermissionNode, location,setSecondFeature } = this.props;
        let isAccess = true;

        // check permission
        if (mode)
        {
            // Tempfix: mode = config should check edit permission
            const feature = mode === 'config' ? 'edit' : RouterParamsHelper.getModeAction(location);
            setSecondFeature(feature);
            if (!hasPermissionNode(pathPermission, feature))
            {
                isAccess = false;
            }
        }
        return isAccess;
    }

    initPermissionLayer = (qs, cb) =>
    {
        let layer = qs.layer;
        let layerData = {};

        if (!layer || !this.permLayerList.some(item=> item.LayerName === layer))
        {
            layer = this.permLayerList?.length > 0 ? this.permLayerList[0].LayerName : null;
            RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, { layer });
        }

        layerData = layer ? layerList.find(item=> item.LayerName === (qs.layer ? qs.layer : layer)) : null;
        cb && cb(layerData || {});
    }


    handleSelect = async (layer) =>
    {
        const orgId = this.managerLayerStore.currentOrg?.organization_id;
        // if (orgId)
        // {
        const filter = {
            'layer': layer.LayerName,
            'path': layer.path,
            'page': 1,
            'order': '',
            'orderBy': '',
            'searchKey': '',
            'team_organization_id': layer.LayerName === 'TEAM' ? orgId : '',
        };
        RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, filter);
        // }
    }

    renderTrailControl = (layer) =>
    {
        if (this.fieldForceStore?.systemValidation?.hasOwnProperty(layer.LayerName.toUpperCase()))
        {
            const validations = this.fieldForceStore?.systemValidation[layer.LayerName];
            let tooltip = validations?.join(',');
            if (validations && layer.LayerName.toUpperCase() === 'JOBTYPE_EMPLOYEETYPE')
            {
                tooltip = validations.map((v) => this.props.t(v, ['JOB_TYPE', this.props.t('thiếu thông tin loại nhân viên')])).join('\r\n');
            }

            return (
                <Container className={'invalid-section'}>
                    <FAIcon
                        icon={'exclamation-triangle'}
                        color={'var(--danger-color)'}
                        size={'1rem'}
                        tooltip={tooltip}
                    />
                </Container>
            );
        }
    };


    handleCloseDetail = () =>
    {
        RouterParamsHelper.setParams(
            this.managerLayerStore.urlParams,
            this.props,
            { mode: '', select: '' },
        );
    }

    render()
    {
        const { currentLayer, currentNodes, urlParams, showDetail } = this.managerLayerStore;
        const { layerList, detailItem } = this.state;

        return (
            <Container
                className={'ltv-container'}
                style={{ width: '100%', height: '100%', display: 'flex' }}
            >
                <Column>
                    {
                        (!this.fieldForceStore.readyToStart || this.props.tenantConfig?.status < TENANT_STATUS.ready) && (
                            <Container className={this.fieldForceStore.readyToStart ? 'ltv-success' : 'ltv-danger'}>
                                <Row itemMargin={'md'}>
                                    <Sub1>Hệ thống đang chờ thiết lập dữ liệu</Sub1>
                                    <Expanded />
                                    <SampleConfig className={'btn btn-outline-lg'} />
                                    <Button
                                        color={'primary-color'}
                                        text={'Hoàn tất'}
                                        icon={'sync'}
                                        disabled={!this.fieldForceStore.readyToStart}
                                        onClick={() =>
                                        {
                                            this.fieldForceStore.tenantSvc.setTenantStatus(TENANT_STATUS.ready).then(() =>
                                            {
                                                window.location.reload();
                                            });
                                        }}
                                    />
                                </Row>
                            </Container>
                        )}
                    <Row>
                        <BorderPanel
                            width={'18rem'}
                            className={'sidebar-layer'}
                        >
                            <PanelHeader>Danh sách lớp dữ liệu</PanelHeader>
                            {
                                layerList.map((layer) =>
                                {
                                    return (
                                        layer && (
                                            <LayerItem
                                                key={layer.LayerName}
                                                data={layer}
                                                highLightClass={layer.LayerName === currentLayer.LayerName ? 'active' : ''}
                                                trailControl={this.renderTrailControl(layer)}
                                                onSelect={this.handleSelect}
                                            />
                                        )
                                    );
                                })
                            }
                        </BorderPanel>
                        <BorderPanel flex={1}>

                            <LayerData
                                layer={currentLayer}
                                nodes={currentNodes}
                            />

                            {
                                showDetail && detailItem && (
                                    <Drawer
                                        position={'right'}
                                        width={'40rem'}
                                        animationIn={'slideInRight'}
                                        animationOut={'slideOutRight'}
                                        onClose={this.handleCloseDetail}
                                    >
                                        {
                                            urlParams.layer === 'TEAM'
                                                ? (
                                                        <TeamDetail
                                                            data={detailItem}
                                                            layer={currentLayer.LayerName}
                                                            properties={currentLayer.Properties}
                                                        />
                                                    )
                                                : (
                                                        <OrganizationDetail
                                                            data={detailItem}
                                                            layer={currentLayer.LayerName}
                                                            properties={currentLayer.Properties}
                                                        />
                                                    )
                                        }
                                    </Drawer>
                                )}
                        </BorderPanel>
                    </Row>
                </Column>
            </Container>
        );
    }
}

LayerTreeView = inject('appStore', 'fieldForceStore')(observer(LayerTreeView));
LayerTreeView = withI18n(withTenant(withModal((withRouter(withPermission(LayerTreeView))))));
export default LayerTreeView;

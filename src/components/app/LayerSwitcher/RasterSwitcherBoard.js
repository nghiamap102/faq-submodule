import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withTenant, EmptyData } from '@vbd/vui';

import { AppConstant } from 'constant/app-constant';
import { CommonHelper } from 'helper/common.helper';
import { isEmpty } from 'helper/data.helper';
import LayerService from 'services/layer.service';

import { LayerSwitcherBoard } from './LayerSwitcherBoard';

export class RasterSwitcherBoard extends Component
{
    layerSvc = new LayerService();

    mapStore = this.props.appStore.mapStore;
    layerStore = this.props.appStore.layerStore;
    layerData = this.props.appStore.layerStore.layerData;

    state = { isDataLoaded: false };

    async componentDidMount()
    {
        // only get data first time
        if (!this.layerData || this.layerData.length === 0)
        {
            let path = '/root/vdms/hethong/maplayer/default';
            if (this.props.tenantConfig.sysId)
            {
                path += `${this.props.tenantConfig.product ? ('/' + this.props.tenantConfig.product) : ''}/${this.props.tenantConfig.sysId}`;
            }
            const rs = await this.layerSvc.getLayers({ path });

            if (rs?.data)
            {
                for (const group of rs.data)
                {
                    group.checkingType = isEmpty(this.props.toggleOn) || this.props.toggleOn[group.Id] ? 1 : 0;

                    // reason for re-assign group to layer because group is not observable, but layer is
                    // using layer to load child will auto trigger render for us
                    const layer = this.props.appStore.layerStore.addLayerData(group);
                    await this.loadChild(layer, this.props.preloadData);

                    this.setState({ isDataLoaded: true });
                }
            }
        }
    }

    recursiveChangeCheck = (layer, zoom) =>
    {
        if (layer.childes)
        {
            for (const child of layer.childes)
            {
                this.recursiveChangeCheck(child, zoom);
            }
        }
        else
        {
            if (layer.layerInfo)
            {
                if (zoom >= layer.layerInfo.LayerStyle.RenderLevelMin && zoom <= layer.layerInfo.LayerStyle.RenderLevelMax)
                {
                    if (layer.checkingType === -1)
                    {
                        layer.checkingType = 0;
                    }
                    else if (layer.checkingType !== 0)
                    {
                        this.handleChange(layer, true);
                    }
                }
                else
                {
                    this.handleChange(layer, false);
                    layer.checkingType = -1;
                }
            }
        }
    };

    loadChild = async (parent, preloadData, defaultValues) =>
    {
        const res = await this.layerSvc.getLayers({ path: parent.Path, isInTree: preloadData });

        const data = res.data.map((child) =>
        {
            if (child.Content && typeof (child.Content) === 'string')
            {
                const layerInfo = JSON.parse(child.Content);
                if (layerInfo.LayerType === 'MAPNIK' && layerInfo.MapnikIcon)
                {
                    child.iconPath = `${AppConstant.vdms.url}/app/render/GetMapnikIcon.ashx?MapName=${layerInfo.MapName}`;
                }

                child.layerInfo = layerInfo;
            }

            return {
                ...child,
                ParentPath: child.Path.split('/').slice(0, -1).join('/'),
                checkingType: 0,
                isLoaded: preloadData,
                ...(defaultValues || {}),
            };
        }).sort((a, b) => a.layerInfo?.Order - b.layerInfo?.Order);

        const treeData = CommonHelper.arrayToTree(data, {
            idKey: 'Path',
            parentKey: 'ParentPath',
            childrenKey: 'childes',
            rootId: parent.Path,
        });

        parent.isLoaded = true;
        parent.childes = treeData;

        this.prepareTreeData(parent);
    };

    // todo: need to check again this `parent` store
    prepareTreeData = (parent) =>
    {
        if (parent.childes)
        {
            parent.childes.forEach((child) =>
            {
                child.parent = parent;
                child.group = parent.group || parent;
                this.prepareTreeData(child);
            });
        }
    };

    handleExpand = async (layer) =>
    {
        layer.expanded = true;
        if (layer.Path && layer.Path !== '' && !layer.isLoaded)
        {
            await this.loadChild(layer);
        }
    };

    handleCollapse = (layer) =>
    {
        layer.expanded = false;
    };

    handleChange = async (item, checked, header) =>
    {
        if (checked)
        {
            if (item.layerInfo)
            {
                try
                {
                    const layerInfo = item.layerInfo;
                    const layerStyle = await this.layerSvc.getLayerStyle(layerInfo.LayerName);

                    if (layerStyle && layerStyle.data)
                    {
                        layerInfo.LayerStyle = layerStyle.data;
                    }
                }
                catch (ex)
                {
                    console.warn(ex.message);
                }
            }

            if (item.layerInfo)
            {
                this.props.appStore.layerStore.add({ id: item.Id, ...item.layerInfo });
            }

        }
        else
        {
            this.props.appStore.layerStore.remove(item.Id, item);
        }

        if (!item.isLoaded)
        {
            await this.loadChild(item, false, { checkingType: checked ? 1 : 0 });

            if (item.childes?.length > 0)
            {
                item.childes.forEach((c) => this.handleChange(c, checked));
            }
        }

        if (this.props.onChange)
        {
            this.props.onChange(item, checked, header);
        }
    };

    render()
    {
        const boardChild = [];

        if (Array.isArray(this.layerData) && this.layerData.length > 0)
        {
            for (const c of this.layerData)
            {
                boardChild.push(
                    <LayerSwitcherBoard
                        key={c.Id}
                        data={c}
                        toggleOn={this.props.toggleOn[c.Id]}
                        itemComponent={this.props.itemComponent}
                        onChange={this.handleChange}
                        onExpand={this.handleExpand}
                        onCollapse={this.handleCollapse}
                    />,
                );
            }
        }
        else
        {
            boardChild.push(<EmptyData key={'empty'} />);
        }

        return boardChild;
    }
}

RasterSwitcherBoard.propTypes = {
    preloadData: PropTypes.bool,
    itemComponent: PropTypes.elementType,
    toggleOn: PropTypes.object,
};

RasterSwitcherBoard.defaultProps = {
    preloadData: true,
    toggleOn: {},
};

RasterSwitcherBoard = withTenant(inject('appStore')(observer(RasterSwitcherBoard)));

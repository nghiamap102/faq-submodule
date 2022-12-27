import './PermissionTreeView.scss';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { isEmpty } from 'helper/data.helper';

import {
    Container, EmptyData, Row, Expanded, Button, CheckBox,
    withModal , withI18n,
} from '@vbd/vui';
import Loading from 'extends/ffms/pages/base/Loading';
import useTree from 'extends/ffms/bases/Tree/TreeHandle';

import PermissionTreeNode from 'extends/ffms/components/Permission/PermissionTreeNode';

const updateTreeData = (treeData = [], oldData = []) =>
{
    return treeData.Children.reduce((res, curr, index) =>
    {
        if (!curr.Children || curr.Children.length === 0)
        {
            delete curr.Children;

            return [...res, curr];
        }
        else
        {
            const child = updateTreeData(curr, oldData[index]?.child || []);

            curr.child = child;

            if (oldData[index] && oldData[index].expand)
            {
                curr.expand = oldData[index].expand;
            }

            delete curr.Children;

            res.push(curr);
            return res;
        }
    }, []);
};

let PermissionTreeView = (props) =>
{
    const fieldForceStore = props.fieldForceStore;
    const permissionStore = fieldForceStore.permissionStore;

    const treeData = updateTreeData(props.data);
    const [{ data }, { expand , updateNode, loadTree, expandAll }] = useTree({ data: treeData });
    const [panelLoading, setPanelLoading] = useState(false);
    const [expandLoading, setExpandLoading] = useState(false);


    useEffect(() =>
    {
        return () =>
        {
            props.onChangeRecursive(props.recursive);
        };
    }, []);

    const handleSwitcherChange = async (node, isCanAccess) =>
    {
        const data = await permissionStore.modifyPermissionRole(node.Path, isCanAccess);
        if (data)
        {
            if (data.result === -1 && data.message)
            {
                props.toast({ type: 'error', message: data.message });
            }
            else
            {
                updateNode(node, { CanAccess: isCanAccess });
            }
        }
    };

    const handleExpand = async (node) =>
    {
        const preExpand = !!node.expand;
        node.expand = !preExpand;

        if (!props.recursive && !preExpand)
        {
            node.child = null;
            node.isLoading = true;
        }

        updateNode(node, { ...node });

        if (!props.recursive)
        {
            if (!preExpand)
            {
                const newNode = await loadNodeChild(node);
                updateNode(node, { ...newNode, isLoading: false });

            }
            else
            {
                setTimeout(()=>
                {
                    node.child = null;
                    updateNode(node, { ...node, isLoading: false });
                },500);
            }
        }
    };

    const loadNodeChild = async (node) =>
    {
        const data = await permissionStore.getPermissionWithRole(node.Path, props.recursive);
        if (data && !isEmpty(data.Children))
        {
            node.child = node.child || [];

            const newNode = { ...node, child: data.Children };

            return newNode;
        }
        else
        {
            props.toast({ type: 'error', message: 'Bạn chưa được phân quyền thực hiện tác vụ này' });
            const newNode = { ...node, expand: false };
            return newNode;
        }
    };


    const expandAllNotRecursive = async (data) =>
    {
        if (data && data.length)
        {
            for (let i = 0; i < data.length; i++)
            {
                const node = data[i];

                if (node.Type === 'folder')
                {
                    const isExpand = !!node.expand;
                    if (isExpand)
                    {
                        expandAllNotRecursive(node.child);
                    }
                    else
                    {
                        handleExpand(node).then((n) =>
                        {
                            expandAllNotRecursive(n?.child || node.child);
                        });
                    }
                }

            }
        }
    };

    const handleExpandAll = async () =>
    {
        setExpandLoading(true);

        if (props.recursive)
        {
            expandAll(data, true);
        }
        else
        {
            // expandAllNotRecursive(data);

            permissionStore.getPermissionWithRole('', true).then((allData) =>
            {
                if (allData)
                {
                    const treeData = updateTreeData(allData, data);
                    loadTree(treeData, () =>
                    {
                        expandAll(treeData, true);
                    });
                }
                setExpandLoading(false);
            });

        }

    };

    const handleCollapseAll = async () =>
    {
        expandAll(data, false);
    };

    const renderTreeItem = (node) =>
    {
        return (
            <PermissionTreeNode
                key={node?.Id || node.Path}
                title={node.Description || node.Title}
                node={node}
                readOnly={props.readOnly}
                onSwitchChange={(...params) =>!panelLoading && handleSwitcherChange(...params)}
                onExpand={(...params) =>!panelLoading && handleExpand(...params)}
                isLoading={node.isLoading && !props.recursive}
            >
                {
                    node.child && node.child.map((child) => renderTreeItem(child))
                }
            </PermissionTreeNode>
        );
    };

    const handleChangeRecursive = (recursive) =>
    {
        if (recursive)
        {
            props.confirm({
                message: 'Chế độ lấy toàn bộ dữ liệu sẽ mất một lúc cho lấy dữ liệu. Bạn đã chắc chắn?',
                onOk: ()=>
                {
                    props.onChangeRecursive(recursive);

                    setPanelLoading(true);

                    permissionStore.getPermissionWithRole('',recursive).then(allData =>
                    {
                        const treeData = updateTreeData(allData, data);
                        loadTree(treeData, ()=> setPanelLoading(false));
                    });
                }
                ,
            });
        }
        else
        {
            props.onChangeRecursive(recursive);
        }
    };

    return (
        <Container className={'permission-tree-container'}>
            <Row
                className='permission-tree-header-expand'
                mainAxisAlignment={'space-between'}
                itemMargin={'sm'}
            >
                {
                    props.switchRecursive &&
                    <CheckBox
                        className={'permission-tree-header-checkbox'}
                        label={'Chế độ lấy toàn bộ dữ liệu'}
                        checked={props.recursive}
                        onChange={handleChangeRecursive}
                    />
                }
                <Expanded flex={1}/>

                <Button
                    // icon={'minus-square'}
                    iconSize={'1rem'}
                    text={'Mở toàn bộ'}
                    isLoading={expandLoading}
                    onClick={handleExpandAll}
                />
                <Button
                    // icon={'plus-square'}
                    iconSize={'1rem'}
                    text={'Thu gọn toàn bộ'}
                    onClick={handleCollapseAll}
                />
            </Row>

            {
                data && data?.length > 0 ?
                    data.map((node) => renderTreeItem(node)) :
                    <EmptyData />
            }

            {panelLoading && <Loading />}
        </Container>
    );
};

PermissionTreeView.propTypes = {
    data: PropTypes.array.isRequired,
    recursive: PropTypes.bool,
    switchRecursive: PropTypes.bool,
    readOnly: PropTypes.bool,
};

PermissionTreeView.defaultProps = {
    recursive: false,
};

PermissionTreeView = inject('appStore', 'fieldForceStore')(observer(PermissionTreeView));
PermissionTreeView = withModal(withI18n(PermissionTreeView));
export default PermissionTreeView;

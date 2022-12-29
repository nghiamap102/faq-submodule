import './Tree.scss';

import React, { ReactNode, useEffect, useState } from 'react';
import { Row2 } from 'components/bases/Layout/Row';
import { Col2 } from 'components/bases/Layout/Column';
import { FAIcon } from '@vbd/vicon';

export interface TreeProps {
    key?: string; // tree item
    label?: string; // tree item
    value?: any; // tree item
    isLeaf?: boolean; // tree item
    data?: TreeProps[];
    defaultExpandedKeys?: any[];
    defaultCheckedKeys?: any[];
    treeItemDisplay?: (_prop: TreeProps) => ReactNode;
    onExpand?: (_prop: TreeProps) => void;
    onSelect?: (_prop: TreeProps) => void;
    onCollapse?: (_prop: TreeProps) => void;
    selectedKey?: any;
}

export const Tree = (props: TreeProps): any =>
{
    const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
    const [selectedKey, setSelectedKey] = useState<string>();

    useEffect(() =>
    {
        setExpandedKeys(props.defaultExpandedKeys || []);
    }, [props.defaultExpandedKeys]);

    const handleExpand = (item: TreeProps): void =>
    {
        if (expandedKeys.includes(item.key ?? item.value))
        {
            const newExpandedKeys = expandedKeys.filter((key) => key !== item.key ?? item.value);
            props.onCollapse && props.onCollapse({ ...item, defaultExpandedKeys: newExpandedKeys });
            setExpandedKeys(newExpandedKeys);
        }
        else
        {
            props.onExpand && props.onExpand(item);
            setExpandedKeys([...expandedKeys, item.key ?? item.value]);
        }
    };

    const handleSelect = (item: TreeProps): void =>
    {
        setSelectedKey(item.key ?? item.value);
        props.onSelect && props.onSelect(item);
    };

    return TreeView({
        ...props,
        defaultExpandedKeys: expandedKeys,
        onExpand: handleExpand,
        onSelect: handleSelect,
        selectedKey: selectedKey,
    });
};

export const TreeView = (props: TreeProps): any =>
{
    return (
        <div className='tree'>
            {
                props.data && props.data.map((item) =>
                    TreeItem({
                        ...props,
                        ...item,
                        data: item.data || [],
                    }),
                )
            }
        </div>
    );
};

export const TreeItem = (props: TreeProps) =>
{
    const onClick = (e: any) =>
    {
        e.preventDefault();
        props.onSelect && props.onSelect(props);
    };

    const hasChildren = props.data?.length || false;
    const isExpanded = props.defaultExpandedKeys?.includes(props.key ?? props.value);

    return (
        <div key={props.key ?? props.value}>
            <div
                className={`tree-item${props.selectedKey === (props.key ?? props.value) ? ' selected' : ''}`}
                onClick={onClick}
            >
                <Row2 items="center">
                    <Col2 panel={false}>
                        {!props.isLeaf && (
                            <FAIcon
                                type='duotone'
                                className='icon'
                                icon={isExpanded ? 'angle-down' : 'angle-right'}
                                size='1.2rem'
                                onClick={(e: any) =>
                                {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    props.onExpand && props.onExpand(props);
                                }}
                            />
                        )}
                    </Col2>
                    <Col2>
                        <div>
                            { props.treeItemDisplay?.(props) || props.label || props.value }
                        </div>
                    </Col2>
                </Row2>
            </div>
            {isExpanded && hasChildren && TreeView(props)}
        </div>

    );
};

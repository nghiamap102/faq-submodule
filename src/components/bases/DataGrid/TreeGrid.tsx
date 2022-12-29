import './TreeGrid.scss';

import React, { ReactElement, ReactNode } from 'react';

import { DataGrid } from './DataGrid';
import { FAIcon } from '@vbd/vicon';

export interface TreeNode
{
    children?: TreeNode[];

    label?: string;
    isExpandable?: boolean;

    [key: string]: any; // other fields

    // Internally used
    _level?: number;
    _isExpanded?: boolean;
    _treeHandler?: ReactNode;
}

export interface Column
{
    id: string;
    displayAsText?: string;
    schema?: string;
    format?: string;
    locale?: string;
    width?: number;
    isSortable?: boolean;
    defaultSortDirection?: string;
}

export interface TreeGridProps
{
    rowKey: string;
    root: TreeNode;
    columns: Column[];
    expandedItems?: string[];
    treeWidth?: number;

    renderIcon?: Function;
    onExpand?: (node: TreeNode) => void;
    onCollapse?: (node: TreeNode) => void;
    onRowClick?: (node: TreeNode) => void;
    showRoot?: boolean
}

export const TreeGrid = (props: TreeGridProps): ReactElement =>
{
    // Utils
    const flattenNode = (treeNode: TreeNode, level: number): Array<TreeNode> =>
    {
        const result: Array<TreeNode> = [];
        const newNode: TreeNode = { ...treeNode, _level: level };
        newNode._isExpanded =
            level === 0 ||
            props.expandedItems?.some((id) => id === newNode[props.rowKey]);

        if (props.showRoot || level > 0)
        {
            result.push(newNode);
        }

        if (newNode._isExpanded)
        {
            for (let i = 0; newNode.children && i < newNode.children.length; i++)
            {
                result.push(...flattenNode(newNode.children[i], level + 1));
            }
        }
        return result;
    };

    // Handlers
    const handleClickExpander = (e: React.MouseEvent, node: TreeNode) =>
    {
        e.stopPropagation();
        if (node._isExpanded)
        {
            props.onCollapse && props.onCollapse(node);
        }
        else
        {
            props.onExpand && props.onExpand(node);
        }
    };

    const handleClickCell = (e: Event, node: TreeNode) =>
    {
        props.onRowClick && props.onRowClick(node);
    };

    // Preprocess
    const columns = [
        {
            id: '_treeHandler',
            displayAsText: 'Tên',
            width: props.treeWidth || 200,
            schema: 'react-node',
        },
        ...(props.columns || []),
    ];

    const gridItems = flattenNode(props.root, 0);
    gridItems.forEach((item: TreeNode) =>
    {
        if (item._level === undefined)
        {
            return;
        }
        const hideIcon = typeof item.isExpandable === 'boolean' && !item.isExpandable;
        const iconJsx = props.renderIcon && props.renderIcon(item);
        item._treeHandler = (
            <div
                className='tree_handler'
                style={{
                    paddingLeft: (props.showRoot ? item._level : item._level - 1) + 'rem',
                }}
            >
                <div
                    className='tree_handler-icon'
                    onClick={(e) => handleClickExpander(e, item)}
                >
                    {iconJsx
                        ? iconJsx
                        : !hideIcon && (
                                <FAIcon
                                    type='light'
                                    icon={item._isExpanded ? 'chevron-down' : 'chevron-right'}
                                    size={'16px'}
                                />
                            )}
                </div>
                <div className='tree_handler-label'>{item.label ? item.label : String(item.id)}</div>
            </div>
        );
    });

    return (
        <div
            className='tree_grid'
            style={{ width: '100%', height: '100%' }}
        >
            <DataGrid
                rowKey={props.rowKey}
                columns={columns}
                items={gridItems}
                toolbarVisibility={false}
                onCellClick={handleClickCell}
            />
        </div>
    );
};

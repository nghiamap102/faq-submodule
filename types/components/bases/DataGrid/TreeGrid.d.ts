import './TreeGrid.scss';
import { ReactElement, ReactNode } from 'react';
export interface TreeNode {
    children?: TreeNode[];
    label?: string;
    isExpandable?: boolean;
    [key: string]: any;
    _level?: number;
    _isExpanded?: boolean;
    _treeHandler?: ReactNode;
}
export interface Column {
    id: string;
    displayAsText?: string;
    schema?: string;
    format?: string;
    locale?: string;
    width?: number;
    isSortable?: boolean;
    defaultSortDirection?: string;
}
export interface TreeGridProps {
    rowKey: string;
    root: TreeNode;
    columns: Column[];
    expandedItems?: string[];
    treeWidth?: number;
    renderIcon?: Function;
    onExpand?: (node: TreeNode) => void;
    onCollapse?: (node: TreeNode) => void;
    onRowClick?: (node: TreeNode) => void;
    showRoot?: boolean;
}
export declare const TreeGrid: (props: TreeGridProps) => ReactElement;
//# sourceMappingURL=TreeGrid.d.ts.map
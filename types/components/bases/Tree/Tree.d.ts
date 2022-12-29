import './Tree.scss';
import { ReactNode } from 'react';
export interface TreeProps {
    key?: string;
    label?: string;
    value?: any;
    isLeaf?: boolean;
    data?: TreeProps[];
    defaultExpandedKeys?: any[];
    defaultCheckedKeys?: any[];
    treeItemDisplay?: (_prop: TreeProps) => ReactNode;
    onExpand?: (_prop: TreeProps) => void;
    onSelect?: (_prop: TreeProps) => void;
    onCollapse?: (_prop: TreeProps) => void;
    selectedKey?: any;
}
export declare const Tree: (props: TreeProps) => any;
export declare const TreeView: (props: TreeProps) => any;
export declare const TreeItem: (props: TreeProps) => JSX.Element;
//# sourceMappingURL=Tree.d.ts.map
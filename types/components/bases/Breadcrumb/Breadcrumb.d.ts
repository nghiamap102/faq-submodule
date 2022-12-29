import React from 'react';
import './Breadcrumb.scss';
export declare type BreadcrumbNode = {
    id: number;
    label: string;
    childNodes?: BreadcrumbNode[];
    onClick?: () => void;
    [key: string]: any;
};
export declare type BreadcrumbProps = {
    className?: string;
    nodes?: BreadcrumbNode[];
    separator?: string | JSX.Element;
    onCommonClick?: (node: BreadcrumbNode) => void;
    maxHeightOfChildNodes?: string;
};
export declare const Breadcrumb: React.FC<BreadcrumbProps>;
//# sourceMappingURL=Breadcrumb.d.ts.map
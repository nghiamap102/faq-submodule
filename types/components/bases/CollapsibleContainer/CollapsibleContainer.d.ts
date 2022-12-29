import './CollapsibleContainer.scss';
interface ICollapsibleContainer {
    className?: string;
    isCollapsible: boolean;
    defaultLevel?: number;
    onCollapse?: (level: number) => void;
    isScrollbar?: boolean;
    children?: any;
    width?: string;
    left?: string;
    top?: string;
    bottom?: string;
    isToolbar?: boolean;
}
export declare const CollapsibleContainer: (props: ICollapsibleContainer) => JSX.Element;
export {};
//# sourceMappingURL=CollapsibleContainer.d.ts.map
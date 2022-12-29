export default useTree;
declare function useTree(props: any): ({
    data: never[];
    nodeSelected: null;
    expand?: undefined;
    expandIds?: undefined;
    expandAll?: undefined;
    filter?: undefined;
    check?: undefined;
    checkAll?: undefined;
    checkIds?: undefined;
    getNodeById?: undefined;
    updateNode?: undefined;
    loadTree?: undefined;
} | {
    expand: (node: any, isExpand: any) => void;
    expandIds: (ids: any, isExpand: any) => void;
    expandAll: (nodes: any, expand: any, saveOrigin?: boolean) => void;
    filter: (keyFilter: any) => void;
    check: (node: any, checkingType: any, cb: any) => void;
    checkAll: (data: any, checkingType: any, done: any) => void;
    checkIds: (ids: any, checkingType: any, clearOld: any, cb: any) => void;
    getNodeById: (id: any) => undefined;
    updateNode: (node: any, config: any) => void;
    loadTree: (data: any, cb?: any) => void;
    data?: undefined;
    nodeSelected?: undefined;
})[];
declare namespace useTree {
    namespace propTypes {
        const data: PropTypes.Requireable<any[]>;
        const nodeSelected: PropTypes.Requireable<any[]>;
        const multiple: PropTypes.Requireable<boolean>;
        const onlySelectLeaves: PropTypes.Requireable<boolean>;
        const recursiveChildren: PropTypes.Requireable<boolean>;
        const canCheck: PropTypes.Requireable<boolean>;
        const onAfterInit: PropTypes.Requireable<(...args: any[]) => any>;
        const defaultExpandIds: PropTypes.Requireable<any[]>;
        const defaultCheckedIds: PropTypes.Requireable<any[]>;
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=TreeHandle.d.ts.map
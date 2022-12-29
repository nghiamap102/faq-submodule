export function TreeSelect({ showTag, height, hasSearch, ...treeProps }: {
    [x: string]: any;
    showTag: any;
    height: any;
    hasSearch: any;
}): JSX.Element;
export namespace TreeSelect {
    namespace propTypes {
        const data: PropTypes.Requireable<any[]>;
        const nodeSelected: PropTypes.Requireable<any[]>;
        const onlySelectLeaves: PropTypes.Requireable<boolean>;
        const showTag: PropTypes.Requireable<boolean>;
        const height: PropTypes.Requireable<string>;
        const expandAll: PropTypes.Requireable<boolean>;
        const onChecked: PropTypes.Requireable<(...args: any[]) => any>;
        const hasSearch: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        const data_1: never[];
        export { data_1 as data };
        const hasSearch_1: boolean;
        export { hasSearch_1 as hasSearch };
        const onlySelectLeaves_1: boolean;
        export { onlySelectLeaves_1 as onlySelectLeaves };
        const height_1: string;
        export { height_1 as height };
        const showTag_1: boolean;
        export { showTag_1 as showTag };
        const expandAll_1: boolean;
        export { expandAll_1 as expandAll };
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=TreeSelect.d.ts.map
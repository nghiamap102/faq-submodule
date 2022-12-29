export function ResizeableHeader(props: any): JSX.Element;
export namespace ResizeableHeader {
    namespace propTypes {
        const id: PropTypes.Requireable<string>;
        const style: PropTypes.Requireable<object>;
        const displayAsText: PropTypes.Requireable<string>;
        const isResizable: PropTypes.Requireable<boolean>;
        const isDraggable: PropTypes.Requireable<boolean>;
        const width: PropTypes.Requireable<number>;
        const format: PropTypes.Requireable<string>;
        const schema: PropTypes.Requireable<string>;
        const locale: PropTypes.Requireable<string>;
        const display: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
        const onResize: PropTypes.Requireable<(...args: any[]) => any>;
        const isSortable: PropTypes.Requireable<boolean>;
        const defaultSortDirection: PropTypes.Requireable<string>;
        const sortDirection: PropTypes.Requireable<string>;
        const filter: PropTypes.Requireable<PropTypes.InferProps<{
            conditions: PropTypes.Requireable<(PropTypes.InferProps<{
                operator: PropTypes.Requireable<string>;
                value: PropTypes.Requireable<any>;
                options: PropTypes.Requireable<any[]>;
            }> | null | undefined)[]>;
            onChange: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
        const onFilterChange: PropTypes.Requireable<(...args: any[]) => any>;
        const isExpandable: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        const isResizable_1: boolean;
        export { isResizable_1 as isResizable };
        const isDraggable_1: boolean;
        export { isDraggable_1 as isDraggable };
        const width_1: number;
        export { width_1 as width };
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=ResizeableHeader.d.ts.map
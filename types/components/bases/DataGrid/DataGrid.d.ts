export function DataGrid(props: any): JSX.Element;
export namespace DataGrid {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const header: PropTypes.Requireable<string>;
        const columns: PropTypes.Requireable<(PropTypes.InferProps<{
            width: PropTypes.Requireable<number>;
            hidden: PropTypes.Requireable<boolean>;
            id: PropTypes.Requireable<string>;
            displayAsText: PropTypes.Requireable<string>;
            display: PropTypes.Requireable<PropTypes.ReactNodeLike>;
            schema: PropTypes.Requireable<string>;
            locale: PropTypes.Requireable<string>;
            format: PropTypes.Requireable<string>;
            isSortable: PropTypes.Requireable<boolean>;
            defaultSortDirection: PropTypes.Requireable<string>;
            isMiniStyle: PropTypes.Requireable<boolean>;
            options: PropTypes.Requireable<any[]>;
        }> | null | undefined)[]>;
        const items: PropTypes.Requireable<(object | null | undefined)[]>;
        const pagination: PropTypes.Requireable<PropTypes.InferProps<{
            useInfiniteScroll: PropTypes.Requireable<boolean>;
            pageIndex: PropTypes.Requireable<number>;
            pageSize: PropTypes.Requireable<number>;
            pageSizeOptions: PropTypes.Requireable<(number | null | undefined)[]>;
            onChangePage: PropTypes.Requireable<(...args: any[]) => any>;
            onChangeItemsPerPage: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
        const externalPaginationRow: PropTypes.Requireable<boolean>;
        const total: PropTypes.Requireable<number>;
        const sorting: PropTypes.Requireable<PropTypes.InferProps<{
            isSingleSort: PropTypes.Requireable<boolean>;
            columns: PropTypes.Requireable<(PropTypes.InferProps<{
                id: PropTypes.Requireable<string>;
                direction: PropTypes.Requireable<string>;
            }> | null | undefined)[]>;
            onSort: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
        const filter: PropTypes.Requireable<PropTypes.InferProps<{
            conditions: PropTypes.Requireable<(PropTypes.InferProps<{
                operator: PropTypes.Requireable<string>;
                value: PropTypes.Requireable<any>;
                options: PropTypes.Requireable<any[]>;
            }> | null | undefined)[]>;
            onChange: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
        const searching: PropTypes.Requireable<PropTypes.InferProps<{
            searchKey: PropTypes.Requireable<string>;
            onSearch: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
        const rowKey: PropTypes.Requireable<string>;
        const leadingControlColumns: PropTypes.Requireable<any[]>;
        const trailingControlColumns: PropTypes.Requireable<any[]>;
        const rowNumber: PropTypes.Requireable<boolean>;
        const selectRows: PropTypes.Requireable<PropTypes.InferProps<{
            onChange: PropTypes.Requireable<(...args: any[]) => any>;
            onChangeAll: PropTypes.Requireable<(...args: any[]) => any>;
        }>>;
        const loading: PropTypes.Requireable<boolean>;
        const onReload: PropTypes.Requireable<(...args: any[]) => any>;
        const toolbarVisibility: PropTypes.Requireable<boolean | PropTypes.InferProps<{
            showColumnSelector: PropTypes.Requireable<boolean>;
            showStyleSelector: PropTypes.Requireable<boolean>;
            showSortSelector: PropTypes.Requireable<boolean>;
            showFullScreenSelector: PropTypes.Requireable<boolean>;
            showReloadButton: PropTypes.Requireable<boolean>;
        }>>;
        const summary: PropTypes.Requireable<PropTypes.InferProps<{
            stick: PropTypes.Requireable<boolean>;
        }>>;
        const toolbarActions: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        const onDataChanged: PropTypes.Requireable<(...args: any[]) => any>;
        const onColumnsVisibilityChanged: PropTypes.Requireable<(...args: any[]) => any>;
        const selectedRow: PropTypes.Requireable<object>;
        const border: PropTypes.Requireable<string>;
        const stripes: PropTypes.Requireable<boolean>;
        const onRowClick: PropTypes.Requireable<(...args: any[]) => any>;
        const onCellClick: PropTypes.Requireable<(...args: any[]) => any>;
        const onCellDoubleClick: PropTypes.Requireable<(...args: any[]) => any>;
        const hideBottomBar: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        export const currentPage: number;
        export const pageSize: number;
        const toolbarVisibility_1: boolean;
        export { toolbarVisibility_1 as toolbarVisibility };
        const rowNumber_1: boolean;
        export { rowNumber_1 as rowNumber };
        const loading_1: boolean;
        export { loading_1 as loading };
        const border_1: string;
        export { border_1 as border };
        const stripes_1: boolean;
        export { stripes_1 as stripes };
    }
}
export default DataGrid;
import PropTypes from "prop-types";
//# sourceMappingURL=DataGrid.d.ts.map
export function DataGridToolbar(props: any): JSX.Element | undefined;
export namespace DataGridToolbar {
    namespace propTypes {
        const items: PropTypes.Requireable<(object | null | undefined)[]>;
        const searching: PropTypes.Requireable<object>;
        const loading: PropTypes.Requireable<boolean>;
        const cols: PropTypes.Requireable<any[]>;
        const setCols: PropTypes.Requireable<(...args: any[]) => any>;
        const toolbarVisibility: PropTypes.Requireable<boolean | PropTypes.InferProps<{
            showColumnSelector: PropTypes.Requireable<boolean>;
            showStyleSelector: PropTypes.Requireable<boolean>;
            showSortSelector: PropTypes.Requireable<boolean>;
            showFullScreenSelector: PropTypes.Requireable<boolean>;
            showReloadButton: PropTypes.Requireable<boolean>;
        }>>;
        const toggleColumnVisibility: PropTypes.Requireable<(...args: any[]) => any>;
        const defaultColumns: PropTypes.Requireable<(...args: any[]) => any>;
        const hideAllColumns: PropTypes.Requireable<(...args: any[]) => any>;
        const showAllColumns: PropTypes.Requireable<(...args: any[]) => any>;
        const toolbarActions: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    }
}
export default DataGridToolbar;
import PropTypes from "prop-types";
//# sourceMappingURL=DataGridToolbar.d.ts.map
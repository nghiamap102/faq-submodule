export function DataToolBar(props: any): JSX.Element;
export namespace DataToolBar {
    namespace propTypes {
        const fields: PropTypes.Requireable<(PropTypes.InferProps<{
            ColumnName: PropTypes.Requireable<string>;
            DisplayName: PropTypes.Requireable<string>;
            DataType: PropTypes.Requireable<number>;
        }> | null | undefined)[]>;
        const defaultFields: PropTypes.Requireable<(string | null | undefined)[]>;
        const primaryFields: PropTypes.Requireable<(string | null | undefined)[]>;
        const fieldsShow: PropTypes.Requireable<(string | null | undefined)[]>;
        const onFeatureClick: PropTypes.Requireable<(...args: any[]) => any>;
        const onSearch: PropTypes.Requireable<(...args: any[]) => any>;
        const onSort: PropTypes.Requireable<(...args: any[]) => any>;
        const onFilter: PropTypes.Requireable<(...args: any[]) => any>;
        const onColumnToggle: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=DataToolBar.d.ts.map
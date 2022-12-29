export function PaginationRow(props: any): JSX.Element;
export namespace PaginationRow {
    namespace propTypes {
        const total: PropTypes.Requireable<number>;
        const pageIndex: PropTypes.Requireable<number>;
        const pageSize: PropTypes.Requireable<number>;
        const pageSizeOptions: PropTypes.Requireable<(number | null | undefined)[]>;
        const onChangePage: PropTypes.Requireable<(...args: any[]) => any>;
        const onChangeItemsPerPage: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
export function usePagination(total: any, pagination?: {}): any[];
import PropTypes from "prop-types";
//# sourceMappingURL=PaginationRow.d.ts.map
export function FilterInput(props: any): JSX.Element;
export namespace FilterInput {
    namespace propTypes {
        const isStandalone: PropTypes.Requireable<boolean>;
        const onFilterChange: PropTypes.Requireable<(...args: any[]) => any>;
        const showVertical: PropTypes.Requireable<boolean>;
        const clearable: PropTypes.Requireable<boolean>;
        const index: PropTypes.Requireable<number>;
        const combinations: PropTypes.Requireable<any[]>;
        const columnNames: PropTypes.Requireable<any[]>;
        const operators: PropTypes.Requireable<any[]>;
        const onRemove: PropTypes.Requireable<(...args: any[]) => any>;
        const onChangeCombination: PropTypes.Requireable<(...args: any[]) => any>;
        const onChangeColumnName: PropTypes.Requireable<(...args: any[]) => any>;
        const onChangeOperator: PropTypes.Requireable<(...args: any[]) => any>;
        const onChangeFilterValue: PropTypes.Requireable<(...args: any[]) => any>;
        const config: PropTypes.Requireable<(PropTypes.InferProps<{
            Value: PropTypes.Requireable<string>;
            Display: PropTypes.Requireable<string>;
        }> | null | undefined)[]>;
        const filter: PropTypes.Requireable<PropTypes.InferProps<{
            combination: PropTypes.Requireable<string>;
            dataType: PropTypes.Requireable<number>;
            columnName: PropTypes.Requireable<string>;
            operator: PropTypes.Requireable<string>;
            value: PropTypes.Requireable<any>;
        }>>;
    }
}
export default FilterInput;
import PropTypes from "prop-types";
//# sourceMappingURL=FilterInput.d.ts.map
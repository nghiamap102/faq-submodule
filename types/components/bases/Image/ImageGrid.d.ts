export function ImageGrid(props: any): JSX.Element;
export namespace ImageGrid {
    namespace propTypes {
        const isLoading: PropTypes.Requireable<boolean>;
        const data: PropTypes.Requireable<(PropTypes.InferProps<{
            isSelected: PropTypes.Requireable<boolean>;
            onClick: PropTypes.Requireable<(...args: any[]) => any>;
            src: PropTypes.Requireable<any>;
        }> | null | undefined)[]>;
        const onSelect: PropTypes.Requireable<(...args: any[]) => any>;
        const imageKey: PropTypes.Requireable<string>;
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=ImageGrid.d.ts.map
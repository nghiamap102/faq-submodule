export default TagSelected;
declare function TagSelected({ data, onRemoveTag }: {
    data: any;
    onRemoveTag: any;
}): false | JSX.Element;
declare namespace TagSelected {
    namespace propTypes {
        const data: PropTypes.Requireable<any[]>;
        const onRemoveTag: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const data_1: never[];
        export { data_1 as data };
        export function onRemoveTag_1(): void;
        export { onRemoveTag_1 as onRemoveTag };
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=TagSelected.d.ts.map
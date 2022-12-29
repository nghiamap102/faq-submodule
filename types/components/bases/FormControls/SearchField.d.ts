export class SearchField extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleChange: (value: any) => void;
    handleClearText: () => void;
}
export namespace SearchField {
    namespace propTypes {
        const disabled: PropTypes.Requireable<boolean>;
        const placeholder: PropTypes.Requireable<string>;
        const type: PropTypes.Requireable<string>;
        const value: PropTypes.Requireable<any>;
        const className: PropTypes.Requireable<string>;
        const width: PropTypes.Requireable<string>;
        const fullwidth: PropTypes.Requireable<boolean>;
        const onChange: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const disabled_1: boolean;
        export { disabled_1 as disabled };
        const placeholder_1: string;
        export { placeholder_1 as placeholder };
        const type_1: string;
        export { type_1 as type };
        const value_1: string;
        export { value_1 as value };
        const className_1: string;
        export { className_1 as className };
        const width_1: string;
        export { width_1 as width };
        export const fullWidth: boolean;
        export function onChange_1(): void;
        export { onChange_1 as onChange };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=SearchField.d.ts.map
export class Select extends React.Component<any, any, any> {
    constructor(props: any);
    handleChange(event: any): void;
    fireOnSelect(event: any): void;
}
export namespace Select {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const value: PropTypes.Requireable<any>;
        const width: PropTypes.Requireable<string>;
        const disabled: PropTypes.Requireable<boolean>;
        const onChange: PropTypes.Requireable<(...args: any[]) => any>;
        const padding: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
        const width_1: string;
        export { width_1 as width };
        const disabled_1: boolean;
        export { disabled_1 as disabled };
        const padding_1: null;
        export { padding_1 as padding };
        export function onChange_1(): void;
        export { onChange_1 as onChange };
    }
}
import React from "react";
import PropTypes from "prop-types";
export class SelectOption extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
}
export namespace SelectOption {
    export namespace propTypes_1 {
        const value_1: PropTypes.Requireable<any>;
        export { value_1 as value };
        export const text: PropTypes.Validator<string>;
    }
    export { propTypes_1 as propTypes };
    export namespace defaultProps_1 {
        const text_1: string;
        export { text_1 as text };
    }
    export { defaultProps_1 as defaultProps };
}
//# sourceMappingURL=Select.d.ts.map
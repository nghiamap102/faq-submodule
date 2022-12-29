export class ColorPicker extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    controlRef: React.RefObject<any>;
    handleClick: () => void;
    handleClose: () => void;
    handleChange: (color: any) => void;
    handleClosePopup: () => void;
}
export namespace ColorPicker {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const value: PropTypes.Requireable<string>;
        const changeType: PropTypes.Requireable<string>;
        const onChange: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
        const value_1: string;
        export { value_1 as value };
        const changeType_1: string;
        export { changeType_1 as changeType };
        export function onChange_1(): void;
        export { onChange_1 as onChange };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=ColorPicker.d.ts.map
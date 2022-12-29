export class DialPad extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleAddDigit: (digit: any) => void;
    handleRemoveDigit: () => void;
    handleChange: (event: any) => void;
    handleCallClick: () => void;
}
export namespace DialPad {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const onStopClick: PropTypes.Requireable<(...args: any[]) => any>;
        const onCallClick: PropTypes.Requireable<(...args: any[]) => any>;
        const onAnswerClick: PropTypes.Requireable<(...args: any[]) => any>;
        const active: PropTypes.Requireable<boolean>;
        const starting: PropTypes.Requireable<boolean>;
        const incoming: PropTypes.Requireable<boolean>;
        const counterpart: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=DialPad.d.ts.map
export class ProgressBar extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    formatter: (val: any) => any;
}
export namespace ProgressBar {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const value: PropTypes.Requireable<number>;
        const total: PropTypes.Requireable<number>;
        const percent: PropTypes.Requireable<boolean>;
        const color: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=ProgressBar.d.ts.map
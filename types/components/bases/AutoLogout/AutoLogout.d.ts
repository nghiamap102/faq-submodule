export class AutoLogout extends Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    logoutTimeout: any;
    events: string[];
    timeout: number;
    onClearInActiveTimeOut: () => void;
    onLogout: () => void;
    resetUserActivityTimeout: () => void;
}
export namespace AutoLogout {
    namespace propTypes {
        const minutes: PropTypes.Requireable<number>;
        const onLogout: PropTypes.Validator<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const minutes_1: number;
        export { minutes_1 as minutes };
    }
}
import { Component } from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=AutoLogout.d.ts.map
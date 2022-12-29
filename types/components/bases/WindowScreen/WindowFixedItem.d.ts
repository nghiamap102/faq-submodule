export class WindowFixedItem extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    notifyDirection: number;
    notifyInternal: NodeJS.Timer | undefined;
}
export namespace WindowFixedItem {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const icon: PropTypes.Validator<string>;
        const notifyIcon: PropTypes.Validator<string>;
        const isNotify: PropTypes.Requireable<boolean>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
        const icon_1: string;
        export { icon_1 as icon };
        const notifyIcon_1: string;
        export { notifyIcon_1 as notifyIcon };
        const isNotify_1: boolean;
        export { isNotify_1 as isNotify };
        export function onClick_1(): void;
        export { onClick_1 as onClick };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=WindowFixedItem.d.ts.map
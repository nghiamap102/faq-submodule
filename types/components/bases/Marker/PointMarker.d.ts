export class PointMarker extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    animationDuration: number;
    notifyInterval: any;
    handleClick: (e: any) => void;
    notifyIconHandler: () => void;
}
export namespace PointMarker {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const icon: PropTypes.Validator<string>;
        const notifyIcon: PropTypes.Validator<string>;
        const isNotify: PropTypes.Requireable<boolean>;
        const size: PropTypes.Validator<number>;
        const color: PropTypes.Requireable<string>;
        const directional: PropTypes.Requireable<number>;
        const typeMarker: PropTypes.Requireable<string>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
        const icon_1: string;
        export { icon_1 as icon };
        const notifyIcon_1: string;
        export { notifyIcon_1 as notifyIcon };
        export const notifyIconSize: string;
        const isNotify_1: boolean;
        export { isNotify_1 as isNotify };
        const size_1: number;
        export { size_1 as size };
        const directional_1: number;
        export { directional_1 as directional };
        const color_1: string;
        export { color_1 as color };
        const typeMarker_1: string;
        export { typeMarker_1 as typeMarker };
        export function onClick_1(): void;
        export { onClick_1 as onClick };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=PointMarker.d.ts.map
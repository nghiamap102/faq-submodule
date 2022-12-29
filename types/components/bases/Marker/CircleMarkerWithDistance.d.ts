export class CircleMarkerWithDistance extends CircleMarker {
}
export namespace CircleMarkerWithDistance {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const icon: PropTypes.Validator<string>;
        const notifyIcon: PropTypes.Validator<string>;
        const isNotify: PropTypes.Requireable<boolean>;
        const size: PropTypes.Validator<number>;
        const color: PropTypes.Requireable<string>;
        const backgroundColor: PropTypes.Requireable<string>;
        const directional: PropTypes.Requireable<number>;
        const distance: PropTypes.Requireable<string>;
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
        const backgroundColor_1: string;
        export { backgroundColor_1 as backgroundColor };
        const distance_1: string;
        export { distance_1 as distance };
        export function onClick_1(): void;
        export { onClick_1 as onClick };
    }
}
import { CircleMarker } from "./CircleMarker";
import PropTypes from "prop-types";
//# sourceMappingURL=CircleMarkerWithDistance.d.ts.map
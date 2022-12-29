export class WindowPopup extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    myRef: React.RefObject<any>;
    isMoving: boolean;
    isResizing: boolean;
    currentX: any;
    currentY: any;
    borderWidth: number;
    borderHeight: number;
    onWindowFocus: () => void;
    onWindowClose: () => void;
    moving: (event: any) => void;
    resizing: (event: any) => void;
    onMouseUp: () => void;
    onMouseMove: (event: any) => void;
    calculateSize(newWidth: any, newHeight: any): {
        width: any;
        height: any;
    };
    validateParentBound(newTop: any, newLeft: any): {
        top: any;
        left: any;
    };
}
export namespace WindowPopup {
    namespace propTypes {
        const id: PropTypes.Requireable<string>;
        const className: PropTypes.Requireable<string>;
        const visible: PropTypes.Requireable<boolean>;
        const title: PropTypes.Requireable<any>;
        const isMinimize: PropTypes.Requireable<boolean>;
        const width: PropTypes.Requireable<number>;
        const height: PropTypes.Requireable<number>;
        const left: PropTypes.Requireable<number>;
        const top: PropTypes.Requireable<number>;
        const resizable: PropTypes.Requireable<boolean>;
        const isActivate: PropTypes.Requireable<boolean>;
        const onFocus: PropTypes.Requireable<(...args: any[]) => any>;
        const onClose: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const id_1: string;
        export { id_1 as id };
        const className_1: string;
        export { className_1 as className };
        const visible_1: boolean;
        export { visible_1 as visible };
        const title_1: string;
        export { title_1 as title };
        const isMinimize_1: boolean;
        export { isMinimize_1 as isMinimize };
        const width_1: number;
        export { width_1 as width };
        const height_1: number;
        export { height_1 as height };
        const top_1: number;
        export { top_1 as top };
        const left_1: number;
        export { left_1 as left };
        const resizable_1: boolean;
        export { resizable_1 as resizable };
        const isActivate_1: boolean;
        export { isActivate_1 as isActivate };
        export function onFocus_1(): void;
        export { onFocus_1 as onFocus };
        export function onClose_1(): void;
        export { onClose_1 as onClose };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=WindowPopup.d.ts.map
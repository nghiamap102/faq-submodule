declare class ScrollBar extends React.Component<any, any, any> {
    constructor(props: any);
    handleRef(ref: any): void;
    _handlerByEvent: {};
    _ps: PerfectScrollbar | null | undefined;
    _updateEventHook(prevProps?: {}): void;
    _updateClassName(): void;
    updateScroll(): void;
    _container: any;
}
declare namespace ScrollBar {
    namespace defaultProps {
        const className: string;
        const style: undefined;
        const option: undefined;
        const options: undefined;
        function containerRef(): void;
        const onScrollY: undefined;
        const onScrollX: undefined;
        const onScrollUp: undefined;
        const onScrollDown: undefined;
        const onScrollLeft: undefined;
        const onScrollRight: undefined;
        const onYReachStart: undefined;
        const onYReachEnd: undefined;
        const onXReachStart: undefined;
        const onXReachEnd: undefined;
        function onSync(ps: any): any;
        const component: string;
    }
    namespace propTypes {
        export const children: any;
        const className_1: any;
        export { className_1 as className };
        const style_1: any;
        export { style_1 as style };
        const option_1: any;
        export { option_1 as option };
        const options_1: any;
        export { options_1 as options };
        const containerRef_1: any;
        export { containerRef_1 as containerRef };
        const onScrollY_1: any;
        export { onScrollY_1 as onScrollY };
        const onScrollX_1: any;
        export { onScrollX_1 as onScrollX };
        const onScrollUp_1: any;
        export { onScrollUp_1 as onScrollUp };
        const onScrollDown_1: any;
        export { onScrollDown_1 as onScrollDown };
        const onScrollLeft_1: any;
        export { onScrollLeft_1 as onScrollLeft };
        const onScrollRight_1: any;
        export { onScrollRight_1 as onScrollRight };
        const onYReachStart_1: any;
        export { onYReachStart_1 as onYReachStart };
        const onYReachEnd_1: any;
        export { onYReachEnd_1 as onYReachEnd };
        const onXReachStart_1: any;
        export { onXReachStart_1 as onXReachStart };
        const onXReachEnd_1: any;
        export { onXReachEnd_1 as onXReachEnd };
        const onSync_1: any;
        export { onSync_1 as onSync };
        const component_1: any;
        export { component_1 as component };
    }
}
export default ScrollBar;
import React from "react";
import PerfectScrollbar from "../../lib/perfect-scrollbar";
//# sourceMappingURL=scrollbar.d.ts.map
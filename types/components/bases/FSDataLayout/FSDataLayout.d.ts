export function FSDataContainer({ className, children }: {
    className: any;
    children: any;
}): JSX.Element;
export namespace FSDataContainer {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
    }
}
export function FSDataBody({ className, children, layout, verticalLine }: {
    className: any;
    children: any;
    layout: any;
    verticalLine: any;
}): JSX.Element;
export namespace FSDataBody {
    export namespace propTypes_1 {
        const className_2: PropTypes.Requireable<string>;
        export { className_2 as className };
        export const verticalLine: PropTypes.Requireable<boolean>;
        export const layout: PropTypes.Requireable<string>;
    }
    export { propTypes_1 as propTypes };
    export namespace defaultProps_1 {
        const className_3: string;
        export { className_3 as className };
        const verticalLine_1: boolean;
        export { verticalLine_1 as verticalLine };
        const layout_1: string;
        export { layout_1 as layout };
    }
    export { defaultProps_1 as defaultProps };
}
export function FSDataContent({ className, children }: {
    className: any;
    children: any;
}): JSX.Element;
export namespace FSDataContent {
    export namespace propTypes_2 {
        const className_4: PropTypes.Requireable<string>;
        export { className_4 as className };
    }
    export { propTypes_2 as propTypes };
    export namespace defaultProps_2 {
        const className_5: string;
        export { className_5 as className };
    }
    export { defaultProps_2 as defaultProps };
}
export function VerticalLine(): JSX.Element;
import PropTypes from "prop-types";
//# sourceMappingURL=FSDataLayout.d.ts.map
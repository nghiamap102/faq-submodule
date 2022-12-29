export function ItemGroup({ className, children, title, id, control, ...itemProps }: {
    [x: string]: any;
    className: any;
    children: any;
    title: any;
    id: any;
    control: any;
}): JSX.Element;
export namespace ItemGroup {
    namespace propTypes {
        const control: PropTypes.Requireable<PropTypes.ReactElementLike>;
        const className: PropTypes.Requireable<string>;
        const title: PropTypes.Requireable<string>;
        const id: PropTypes.Requireable<string>;
        const children: PropTypes.Requireable<PropTypes.ReactElementLike>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
        const control_1: null;
        export { control_1 as control };
        const onClick_1: null;
        export { onClick_1 as onClick };
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=ItemGroup.d.ts.map
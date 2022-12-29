export function SubMenu({ id, children, offset, title, popupClassName, control, ...itemProps }: {
    [x: string]: any;
    id: any;
    children: any;
    offset: any;
    title: any;
    popupClassName: any;
    control: any;
}): JSX.Element;
export namespace SubMenu {
    namespace propTypes {
        const control: PropTypes.Requireable<PropTypes.ReactElementLike>;
        const className: PropTypes.Requireable<string>;
        const popupClassName: PropTypes.Requireable<string>;
        const title: PropTypes.Requireable<string>;
        const id: PropTypes.Requireable<string>;
        const disabled: PropTypes.Requireable<boolean>;
        const anchor: PropTypes.Requireable<string>;
        const offset: PropTypes.Requireable<any[]>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const control_1: null;
        export { control_1 as control };
        const offset_1: number[];
        export { offset_1 as offset };
        const className_1: string;
        export { className_1 as className };
        const popupClassName_1: string;
        export { popupClassName_1 as popupClassName };
        const title_1: string;
        export { title_1 as title };
        const id_1: string;
        export { id_1 as id };
        const disabled_1: boolean;
        export { disabled_1 as disabled };
        const onClick_1: null;
        export { onClick_1 as onClick };
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=SubMenu.d.ts.map
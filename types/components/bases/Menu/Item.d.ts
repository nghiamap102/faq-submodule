export function Item({ children, className, icon, iconInfo, disabled, mode, id, onClick, }: {
    children: any;
    className: any;
    icon: any;
    iconInfo: any;
    disabled: any;
    mode: any;
    id: any;
    onClick: any;
}): JSX.Element;
export namespace Item {
    namespace propTypes {
        const active: PropTypes.Requireable<boolean>;
        const disabled: PropTypes.Requireable<boolean>;
        const className: PropTypes.Requireable<string>;
        const iconInfo: PropTypes.Requireable<string>;
        const icon: PropTypes.Requireable<string>;
        const id: PropTypes.Requireable<string>;
        const mode: PropTypes.Requireable<string>;
        const parentMode: PropTypes.Requireable<string>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
        const children: PropTypes.Validator<string>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
        const disabled_1: boolean;
        export { disabled_1 as disabled };
        export const index: number;
        const active_1: boolean;
        export { active_1 as active };
        const id_1: string;
        export { id_1 as id };
        export function onClick_1(): void;
        export { onClick_1 as onClick };
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=Item.d.ts.map
import './Nav.scss';
interface NavProps {
    className?: string;
    direction?: 'column' | 'row';
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
    actions?: [] | {
        icon?: string;
        iconPosition?: 'start' | 'end';
        iconSize?: string;
        iconType?: 'solid' | 'regular' | 'light';
        label?: string;
        labelPosition?: 'left' | 'right' | 'center';
        onClick?: void;
    }[];
}
export declare const Nav: (props: NavProps) => JSX.Element;
interface NavItemProps {
    icon?: string;
    iconPosition?: 'start' | 'end';
    iconSize?: string;
    iconType?: 'solid' | 'regular' | 'light';
    label?: string;
    labelPosition?: 'left' | 'right' | 'center';
    direction?: 'row' | 'column';
    onClick?: void;
}
export declare const NavItem: (props: NavItemProps) => JSX.Element;
export {};
//# sourceMappingURL=Nav.d.ts.map
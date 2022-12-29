export class NavigationMenu extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleChange: (menuId: any, event: any) => void;
}
export namespace NavigationMenu {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const header: PropTypes.Requireable<string>;
        const menus: PropTypes.Requireable<any[]>;
        const activeMenu: PropTypes.Requireable<string>;
        const onChange: PropTypes.Requireable<(...args: any[]) => any>;
        const type: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        const menus_1: never[];
        export { menus_1 as menus };
        const type_1: string;
        export { type_1 as type };
    }
}
export function MenuItem({ children, id, onClick, active }: {
    children: any;
    id: any;
    onClick: any;
    active: any;
}): JSX.Element;
export namespace MenuItem {
    export namespace propTypes_1 {
        const id: PropTypes.Requireable<string>;
        const active: PropTypes.Requireable<boolean>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
    }
    export { propTypes_1 as propTypes };
    export namespace defaultProps_1 {
        const active_1: boolean;
        export { active_1 as active };
    }
    export { defaultProps_1 as defaultProps };
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=NavigationMenu.d.ts.map
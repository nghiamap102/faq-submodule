export const MenuContext: React.Context<any>;
export function MenuProvider(props: any): JSX.Element;
export namespace MenuProvider {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const itemClassName: PropTypes.Requireable<string>;
        const inlineIndent: PropTypes.Requireable<number>;
        const mode: PropTypes.Validator<string>;
        const defaultOpenIds: PropTypes.Requireable<any[]>;
        const defaultSelectedIds: PropTypes.Requireable<any[]>;
        const openIds: PropTypes.Requireable<any[]>;
        const selectedIds: PropTypes.Requireable<any[]>;
        const multiple: PropTypes.Requireable<boolean>;
        const selectable: PropTypes.Requireable<boolean>;
        const inlineCollapsed: PropTypes.Requireable<boolean>;
        const expandIcon: PropTypes.Requireable<PropTypes.ReactElementLike>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
        const onSelect: PropTypes.Requireable<(...args: any[]) => any>;
        const onExpand: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=MenuContext.d.ts.map
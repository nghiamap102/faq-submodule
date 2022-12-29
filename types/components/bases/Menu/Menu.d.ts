export default Menu;
export { Item } from "../../../components/bases/Menu/Item";
export { SubMenu } from "../../../components/bases/Menu/SubMenu";
export { ItemGroup } from "../../../components/bases/Menu/ItemGroup";
export { MenuItem } from "../../../components/bases/Menu/MenuItem";
declare function Menu(props: any): JSX.Element;
declare namespace Menu {
    namespace propTypes {
        const data: PropTypes.Requireable<any[]>;
        const className: PropTypes.Requireable<string>;
        const itemClassName: PropTypes.Requireable<string>;
        const style: PropTypes.Requireable<object>;
        const inlineIndent: PropTypes.Requireable<number>;
        const mode: PropTypes.Validator<string>;
        const defaultOpenIds: PropTypes.Requireable<any[]>;
        const defaultSelectedIds: PropTypes.Requireable<any[]>;
        const openIds: PropTypes.Requireable<any[]>;
        const selectedIds: PropTypes.Requireable<any[]>;
        const multiple: PropTypes.Requireable<boolean>;
        const selectable: PropTypes.Requireable<boolean>;
        const inlineCollapsed: PropTypes.Requireable<boolean>;
        const defaultSelectedAll: PropTypes.Requireable<boolean>;
        const defaultOpenAll: PropTypes.Requireable<boolean>;
        const expandIcon: PropTypes.Requireable<PropTypes.ReactElementLike>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
        const onSelect: PropTypes.Requireable<(...args: any[]) => any>;
        const onExpand: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const data_1: never[];
        export { data_1 as data };
        const className_1: string;
        export { className_1 as className };
        const itemClassName_1: string;
        export { itemClassName_1 as itemClassName };
        const mode_1: string;
        export { mode_1 as mode };
        const inlineIndent_1: number;
        export { inlineIndent_1 as inlineIndent };
        const defaultOpenIds_1: never[];
        export { defaultOpenIds_1 as defaultOpenIds };
        const defaultSelectedIds_1: never[];
        export { defaultSelectedIds_1 as defaultSelectedIds };
        const openIds_1: never[];
        export { openIds_1 as openIds };
        const selectedIds_1: never[];
        export { selectedIds_1 as selectedIds };
        const multiple_1: boolean;
        export { multiple_1 as multiple };
        const selectable_1: boolean;
        export { selectable_1 as selectable };
        const inlineCollapsed_1: boolean;
        export { inlineCollapsed_1 as inlineCollapsed };
        const defaultSelectedAll_1: boolean;
        export { defaultSelectedAll_1 as defaultSelectedAll };
        const defaultOpenAll_1: boolean;
        export { defaultOpenAll_1 as defaultOpenAll };
        const onClick_1: null;
        export { onClick_1 as onClick };
        const onSelect_1: null;
        export { onSelect_1 as onSelect };
        const onExpand_1: null;
        export { onExpand_1 as onExpand };
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=Menu.d.ts.map
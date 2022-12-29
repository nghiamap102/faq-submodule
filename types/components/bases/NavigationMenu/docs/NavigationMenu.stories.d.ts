declare namespace _default {
    export const title: string;
    export { NavigationMenu as component };
    export namespace subcomponents {
        export { MenuItem };
    }
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        export const header: string;
        export { menuItems as menus };
        export { activeItem as activeMenu };
    }
}
import { NavigationMenu } from "../../../../components/bases/NavigationMenu/NavigationMenu";
import { MenuItem } from "../../../../components/bases/NavigationMenu/NavigationMenu";
declare const menuItems: {
    id: number;
    name: string;
}[];
declare const activeItem: 1;
//# sourceMappingURL=NavigationMenu.stories.d.ts.map
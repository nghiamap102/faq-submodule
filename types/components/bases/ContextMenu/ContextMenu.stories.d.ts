declare namespace _default {
    export const title: string;
    export { ContextMenu as component };
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        const width: number;
        const maxHeight: number;
        const header: string;
        const isCloseOnBlur: boolean;
        const actions: ({
            label: string;
            icon: string;
            onClick: () => import("@storybook/addon-actions").HandlerFunction;
        } | {
            label: string;
            icon?: undefined;
            onClick?: undefined;
        })[];
    }
}
import ContextMenu from "../../../components/bases/ContextMenu/ContextMenu";
//# sourceMappingURL=ContextMenu.stories.d.ts.map
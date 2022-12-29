declare namespace _default {
    export const title: string;
    export { TreeSelect as component };
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        export { treeData as data };
        export const onChecked: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
    }
}
import { TreeSelect } from "../../../../components/bases/Tree/TreeSelect";
declare let treeData: any[];
//# sourceMappingURL=TreeSelect.stories.d.ts.map
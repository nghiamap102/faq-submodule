declare namespace _default {
    export const title: string;
    export { AutoLogout as component };
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        export const minutes: number;
        export { onLogoutEventHandler as onLogout };
        export const children: JSX.Element;
    }
}
import { AutoLogout } from "../../../components/bases/AutoLogout/AutoLogout";
declare function onLogoutEventHandler(): void;
//# sourceMappingURL=AutoLogout.stories.d.ts.map
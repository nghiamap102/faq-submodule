declare namespace _default {
    export const title: string;
    export { DialPad as component };
}
export default _default;
export function Default(args: any): JSX.Element;
export function Calling(args: any): JSX.Element;
export namespace Calling {
    namespace args {
        const starting: boolean;
        const counterpart: string;
    }
}
export function ActiveCall(args: any): JSX.Element;
export namespace ActiveCall {
    export namespace args_1 {
        export const active: boolean;
        const counterpart_1: string;
        export { counterpart_1 as counterpart };
    }
    export { args_1 as args };
}
import { DialPad } from "../../../../components/bases/DialPad/DialPad";
//# sourceMappingURL=DialPad.stories.d.ts.map
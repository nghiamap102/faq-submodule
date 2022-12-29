declare namespace _default {
    export const title: string;
    export { Row2 as component };
    export namespace args {
        namespace style {
            const backgroundColor: string;
        }
    }
    export const decorators: ((Story: any) => JSX.Element)[];
}
export default _default;
export function Default(args: any): JSX.Element;
export function Center(args: any): JSX.Element;
export namespace Center {
    export namespace args_1 {
        const justify: string;
        const items: string;
    }
    export { args_1 as args };
}
export function WithSpacing(args: any): JSX.Element;
export namespace WithSpacing {
    export namespace args_2 {
        const spacing: number;
    }
    export { args_2 as args };
}
import { Row2 } from "../../../components/bases/Layout/Row";
//# sourceMappingURL=Row.stories.d.ts.map
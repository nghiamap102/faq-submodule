declare namespace _default {
    export const title: string;
    export { AdvanceSelect as component };
    export namespace argTypes {
        namespace onTextChange {
            const action: string;
        }
    }
    export namespace parameters {
        namespace docs {
            const inlineStories: boolean;
            const iframeHeight: number;
        }
    }
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        export { options };
    }
}
export function WithSearchBox(args: any): JSX.Element;
export namespace WithSearchBox {
    export namespace args_1 {
        export const hasSearch: boolean;
        export { options };
    }
    export { args_1 as args };
}
export function WithDividers(args: any): JSX.Element;
export namespace WithDividers {
    export namespace args_2 {
        export const hasDividers: boolean;
        export { options };
    }
    export { args_2 as args };
}
import { AdvanceSelect } from "./AdvanceSelect";
declare const options: ({
    id: string;
    label: string;
    dropdownDisplay?: undefined;
    inputDisplay?: undefined;
} | {
    id: string;
    dropdownDisplay: string;
    inputDisplay: string;
    label?: undefined;
})[];
//# sourceMappingURL=AdvanceSelect.stories.d.ts.map
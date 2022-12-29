declare namespace _default {
    export const title: string;
    export { Slider as component };
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        const min: number;
        const max: number;
        const step: number;
        const value: number;
    }
}
export function Wrapper(args: any): JSX.Element;
export namespace Wrapper {
    export namespace args_1 {
        const max_1: number;
        export { max_1 as max };
        const min_1: number;
        export { min_1 as min };
        const step_1: number;
        export { step_1 as step };
        const value_1: number;
        export { value_1 as value };
        export namespace wrapper {
            const left: number;
            const right: number;
        }
    }
    export { args_1 as args };
}
export function Marks(args: any): JSX.Element;
export namespace Marks {
    export namespace args_2 {
        const max_2: number;
        export { max_2 as max };
        const min_2: number;
        export { min_2 as min };
        const step_2: number;
        export { step_2 as step };
        const value_2: number;
        export { value_2 as value };
        export const marks: {
            0: {
                label: string;
                style: {
                    color: string;
                };
            };
            26: string;
            37: string;
            100: string;
        };
    }
    export { args_2 as args };
}
export function CustomThumb(args: any): JSX.Element;
export namespace CustomThumb {
    export namespace args_3 {
        const max_3: number;
        export { max_3 as max };
        const min_3: number;
        export { min_3 as min };
        const step_3: number;
        export { step_3 as step };
        const value_3: number;
        export { value_3 as value };
        export const thumbCustom: JSX.Element;
    }
    export { args_3 as args };
}
export function CustomThumbRange(args: any): JSX.Element;
export namespace CustomThumbRange {
    export namespace args_4 {
        const max_4: number;
        export { max_4 as max };
        const min_4: number;
        export { min_4 as min };
        const step_4: number;
        export { step_4 as step };
        const value_4: number;
        export { value_4 as value };
        export const range: boolean;
        export namespace thumbCustom_1 {
            const start: JSX.Element;
            const end: JSX.Element;
        }
        export { thumbCustom_1 as thumbCustom };
    }
    export { args_4 as args };
}
import { Slider } from "./Slider";
//# sourceMappingURL=Slider.stories.d.ts.map
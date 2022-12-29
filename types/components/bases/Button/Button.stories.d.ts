declare namespace _default {
    export const title: string;
    export { Button as component };
    export namespace parameters {
        namespace controls {
            const expanded: boolean;
        }
        namespace backgrounds {
            const _default: string;
            export { _default as default };
            export const values: {
                name: string;
                value: string;
            }[];
        }
    }
    export namespace argTypes {
        namespace iconColor {
            const control: string;
        }
        namespace color {
            const control_1: string;
            export { control_1 as control };
        }
        namespace backgroundColor {
            const control_2: string;
            export { control_2 as control };
        }
    }
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    const args: {};
}
export function Primary(args: any): JSX.Element;
export namespace Primary {
    export namespace args_1 {
        const color_1: string;
        export { color_1 as color };
    }
    export { args_1 as args };
}
export function Success(args: any): JSX.Element;
export namespace Success {
    export namespace args_2 {
        const color_2: string;
        export { color_2 as color };
    }
    export { args_2 as args };
}
export function Info(args: any): JSX.Element;
export namespace Info {
    export namespace args_3 {
        const color_3: string;
        export { color_3 as color };
    }
    export { args_3 as args };
}
export function Danger(args: any): JSX.Element;
export namespace Danger {
    export namespace args_4 {
        const color_4: string;
        export { color_4 as color };
    }
    export { args_4 as args };
}
export function Warning(args: any): JSX.Element;
export namespace Warning {
    export namespace args_5 {
        const color_5: string;
        export { color_5 as color };
    }
    export { args_5 as args };
}
export function WithIcon(args: any): JSX.Element;
export namespace WithIcon {
    export namespace args_6 {
        const icon: string;
        const iconType: string;
        const iconLocation: string;
        const border: string;
        const padding: string;
    }
    export { args_6 as args };
}
export function Disabled(args: any): JSX.Element;
export namespace Disabled {
    export namespace args_7 {
        const disabled: boolean;
    }
    export { args_7 as args };
}
import { Button } from "../../../components/bases/Button";
//# sourceMappingURL=Button.stories.d.ts.map
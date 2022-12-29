declare namespace _default {
    export const title: string;
    export { FAIcon as component };
    export namespace parameters {
        namespace controls {
            const expanded: boolean;
        }
    }
    export namespace argTypes {
        namespace color {
            const control: string;
        }
        namespace backgroundColor {
            const control_1: string;
            export { control_1 as control };
        }
    }
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        export const icon: string;
        const color_1: string;
        export { color_1 as color };
        export const size: string;
    }
}
export function Spin(args: any): JSX.Element;
export namespace Spin {
    export namespace args_1 {
        const icon_1: string;
        export { icon_1 as icon };
        const color_2: string;
        export { color_2 as color };
        export const type: string;
        export const spin: boolean;
        const size_1: string;
        export { size_1 as size };
    }
    export { args_1 as args };
}
import { FAIcon } from "@vbd/vicon/types/components/bases/Icon/FAIcon";
//# sourceMappingURL=FAIcon.stories.d.ts.map
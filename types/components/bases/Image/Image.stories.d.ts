/// <reference types="declaration" />
declare namespace _default {
    export const title: string;
    export { Image as component };
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        const width: string;
        const height: string;
        const background: string;
    }
}
export function WithEnlarger(args: any): JSX.Element;
export namespace WithEnlarger {
    export namespace args_1 {
        const width_1: string;
        export { width_1 as width };
        const height_1: string;
        export { height_1 as height };
        export const src: string;
        export { altImage as altSrc };
        const background_1: string;
        export { background_1 as background };
        export const canEnlarge: boolean;
    }
    export { args_1 as args };
}
export function WithAlternativeImage(args: any): JSX.Element;
export namespace WithAlternativeImage {
    export namespace args_2 {
        const width_2: string;
        export { width_2 as width };
        const height_2: string;
        export { height_2 as height };
        const background_2: string;
        export { background_2 as background };
        export { altImage as altSrc };
    }
    export { args_2 as args };
}
import { Image } from "../../../components/bases/Image/Image";
import altImage from "*.png";
//# sourceMappingURL=Image.stories.d.ts.map
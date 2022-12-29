/// <reference types="declaration" />
declare namespace _default {
    export const title: string;
    export { CropImage as component };
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        export { altImage as imageData };
        export namespace box {
            const x: number;
            const y: number;
            const width: number;
            const height: number;
        }
    }
}
import { CropImage } from "../../../../components/bases/Image/CropImage";
import altImage from "*.png";
//# sourceMappingURL=CropImage.stories.d.ts.map
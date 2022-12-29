export class CropImage extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    canvasRef: React.RefObject<any>;
    imgRef: React.RefObject<any>;
}
export namespace CropImage {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const imageData: PropTypes.Requireable<string>;
        const box: PropTypes.Requireable<object>;
        const unit: PropTypes.Requireable<string>;
        const borderColor: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=CropImage.d.ts.map
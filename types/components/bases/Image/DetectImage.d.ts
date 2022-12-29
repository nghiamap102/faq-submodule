export class DetectImage extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    canvasRef: React.RefObject<any>;
    handleImageLoad: (event: any) => void;
}
export namespace DetectImage {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const imageData: PropTypes.Requireable<string>;
        const boxes: PropTypes.Requireable<any[]>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=DetectImage.d.ts.map
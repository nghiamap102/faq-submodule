export class BoxImage extends React.Component<any, any, any> {
    static getDerivedStateFromProps: (nextProps: any, prevState: any) => {
        src: any;
        loaded: boolean;
    } | null;
    constructor(props: any);
    constructor(props: any, context: any);
    borderWidth: number;
    canvasRef: React.RefObject<any>;
    currentTarget: any;
    handleImageLoad: (event: any) => void;
    handleOnClick: (box: any) => void;
    getMarkupImage: () => any;
    getBoxStyle: (b: any) => {
        position: string;
        left: string;
        top: string;
        width: string;
        height: string;
        opacity: number;
    };
}
export namespace BoxImage {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const imageData: PropTypes.Requireable<string>;
        const boxes: PropTypes.Requireable<any[]>;
        const width: PropTypes.Requireable<string>;
        const height: PropTypes.Requireable<string>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
        const choosingColor: PropTypes.Requireable<string>;
        const choosingId: PropTypes.Requireable<string>;
        const onImageLoaded: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=BoxImage.d.ts.map
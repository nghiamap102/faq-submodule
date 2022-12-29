export class Image extends React.Component<any, any, any> {
    static getDerivedStateFromProps: (nextProps: any, prevState: any) => false | {
        src: any;
        imgSrcError: boolean;
    };
    constructor(props: any);
    imageRef: React.RefObject<any>;
    inputRef: React.RefObject<any>;
    handleClick: (event: any) => void;
    handleDownloadImage: () => void;
    handleZoomClick: (event: any) => void;
    handleImageChange: (event: any) => void;
    handleChangeClick: (event: any) => void;
    handleDeleteClick: (event: any) => void;
    handleImgSrcError: (_error: any) => void;
}
export namespace Image {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const id: PropTypes.Requireable<any>;
        const canEnlarge: PropTypes.Requireable<boolean>;
        const width: PropTypes.Requireable<string>;
        const height: PropTypes.Requireable<string>;
        const src: PropTypes.Validator<string>;
        const altSrc: PropTypes.Requireable<string>;
        const alt: PropTypes.Requireable<string>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
        const background: PropTypes.Requireable<string>;
        const fitMode: PropTypes.Requireable<string>;
        const onChange: PropTypes.Requireable<(...args: any[]) => any>;
        const onDelete: PropTypes.Requireable<(...args: any[]) => any>;
        const onLoad: PropTypes.Requireable<(...args: any[]) => any>;
        const label: PropTypes.Requireable<any>;
        const circle: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
        const canEnlarge_1: boolean;
        export { canEnlarge_1 as canEnlarge };
        const width_1: string;
        export { width_1 as width };
        const height_1: string;
        export { height_1 as height };
        const src_1: string;
        export { src_1 as src };
        const alt_1: string;
        export { alt_1 as alt };
        const background_1: string;
        export { background_1 as background };
        const fitMode_1: string;
        export { fitMode_1 as fitMode };
        const circle_1: boolean;
        export { circle_1 as circle };
        export function onClick_1(): void;
        export { onClick_1 as onClick };
        export function onChange_1(): void;
        export { onChange_1 as onChange };
        export function onDelete_1(): void;
        export { onDelete_1 as onDelete };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=Image.d.ts.map
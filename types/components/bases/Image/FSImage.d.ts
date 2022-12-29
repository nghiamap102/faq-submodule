export function FSImage({ fitMode, score, accuracy, title, active, onClick, backgroundImage, widthImage, heightImage, src, ...props }: {
    [x: string]: any;
    fitMode: any;
    score: any;
    accuracy: any;
    title: any;
    active: any;
    onClick: any;
    backgroundImage: any;
    widthImage: any;
    heightImage: any;
    src: any;
}): JSX.Element;
export namespace FSImage {
    namespace propTypes {
        const fitMode: PropTypes.Requireable<string>;
        const src: PropTypes.Requireable<any>;
        const canEnlarge: PropTypes.Requireable<boolean>;
        const score: PropTypes.Requireable<number>;
        const accuracy: PropTypes.Requireable<number>;
        const widthImage: PropTypes.Requireable<string>;
        const heightImage: PropTypes.Requireable<string>;
        const title: PropTypes.Requireable<string>;
        const active: PropTypes.Requireable<boolean>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
        const backgroundImage: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        const fitMode_1: string;
        export { fitMode_1 as fitMode };
        const canEnlarge_1: boolean;
        export { canEnlarge_1 as canEnlarge };
        const score_1: null;
        export { score_1 as score };
        const accuracy_1: null;
        export { accuracy_1 as accuracy };
        const title_1: string;
        export { title_1 as title };
        const widthImage_1: string;
        export { widthImage_1 as widthImage };
        const heightImage_1: string;
        export { heightImage_1 as heightImage };
        const active_1: boolean;
        export { active_1 as active };
        const backgroundImage_1: string;
        export { backgroundImage_1 as backgroundImage };
        export function onClick_1(): void;
        export { onClick_1 as onClick };
    }
}
export default FSImage;
import PropTypes from "prop-types";
//# sourceMappingURL=FSImage.d.ts.map
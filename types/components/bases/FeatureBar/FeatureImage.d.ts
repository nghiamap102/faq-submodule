export class FeatureImage extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleClick: (event: any) => void;
}
export namespace FeatureImage {
    namespace propTypes {
        const id: PropTypes.Requireable<string>;
        const className: PropTypes.Requireable<string>;
        const src: PropTypes.Validator<string>;
        const active: PropTypes.Requireable<boolean>;
        const tooltip: PropTypes.Requireable<string>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const id_1: string;
        export { id_1 as id };
        const className_1: string;
        export { className_1 as className };
        export const badgeCount: null;
        const active_1: boolean;
        export { active_1 as active };
        export const icon: string;
        export function onClick_1(): void;
        export { onClick_1 as onClick };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=FeatureImage.d.ts.map
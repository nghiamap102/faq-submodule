export class FeatureItem extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleClick: (e: any) => void;
}
export namespace FeatureItem {
    namespace propTypes {
        const id: PropTypes.Requireable<string>;
        const className: PropTypes.Requireable<string>;
        const icon: PropTypes.Validator<string>;
        const content: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        const active: PropTypes.Requireable<boolean>;
        const badgeCount: PropTypes.Requireable<number>;
        const tooltip: PropTypes.Requireable<string>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const id_1: string;
        export { id_1 as id };
        const className_1: string;
        export { className_1 as className };
        const badgeCount_1: null;
        export { badgeCount_1 as badgeCount };
        const active_1: boolean;
        export { active_1 as active };
        const icon_1: string;
        export { icon_1 as icon };
        export function onClick_1(): void;
        export { onClick_1 as onClick };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=FeatureItem.d.ts.map
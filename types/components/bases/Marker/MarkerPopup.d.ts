export class MarkerPopup extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    animationDuration: number;
    onFocus: (event: any) => void;
    onClose: (event: any) => void;
}
export namespace MarkerPopup {
    namespace propTypes {
        const id: PropTypes.Requireable<any>;
        const className: PropTypes.Requireable<string>;
        const title: PropTypes.Requireable<string>;
        const sub: PropTypes.Requireable<string>;
        const lng: PropTypes.Requireable<number>;
        const lat: PropTypes.Requireable<number>;
        const offset: PropTypes.Requireable<any[]>;
        const isActivate: PropTypes.Requireable<boolean>;
        const location: PropTypes.Requireable<string>;
        const width: PropTypes.Validator<number>;
        const height: PropTypes.Validator<number>;
        const isNotFixed: PropTypes.Requireable<boolean>;
        const markerSize: PropTypes.Requireable<number>;
        const headerActions: PropTypes.Requireable<any[]>;
        const actions: PropTypes.Requireable<any[]>;
        const onFocus: PropTypes.Requireable<(...args: any[]) => any>;
        const onClose: PropTypes.Requireable<(...args: any[]) => any>;
        const markerOffset: PropTypes.Requireable<number>;
        const spacing: PropTypes.Requireable<number>;
    }
    namespace defaultProps {
        const id_1: string;
        export { id_1 as id };
        const className_1: string;
        export { className_1 as className };
        const title_1: string;
        export { title_1 as title };
        const sub_1: string;
        export { sub_1 as sub };
        const lng_1: number;
        export { lng_1 as lng };
        const lat_1: number;
        export { lat_1 as lat };
        const isActivate_1: boolean;
        export { isActivate_1 as isActivate };
        const location_1: string;
        export { location_1 as location };
        const isNotFixed_1: boolean;
        export { isNotFixed_1 as isNotFixed };
        const markerSize_1: number;
        export { markerSize_1 as markerSize };
        const headerActions_1: never[];
        export { headerActions_1 as headerActions };
        const actions_1: never[];
        export { actions_1 as actions };
        export function onFocus_1(): void;
        export { onFocus_1 as onFocus };
        export function onClose_1(): void;
        export { onClose_1 as onClose };
        const spacing_1: number;
        export { spacing_1 as spacing };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=MarkerPopup.d.ts.map
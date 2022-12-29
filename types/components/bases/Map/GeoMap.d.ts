export class GeoMap extends React.Component<any, any, any> {
    constructor(props: any);
    map: React.RefObject<any>;
}
export namespace GeoMap {
    export namespace propTypes {
        const id: PropTypes.Requireable<string>;
        const width: PropTypes.Requireable<string>;
        const height: PropTypes.Requireable<string>;
        const center: PropTypes.Requireable<object>;
        const zoomLevel: PropTypes.Requireable<any[]>;
    }
    export namespace defaultProps {
        const width_1: string;
        export { width_1 as width };
        const height_1: string;
        export { height_1 as height };
    }
    export { ThemeContext as contextType };
}
import React from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "../../../components/bases/Theme/ThemeContext";
//# sourceMappingURL=GeoMap.d.ts.map
export const mapStyleList: {
    id: string;
    label: string;
}[];
export class Map extends React.Component<any, any, any> {
    constructor(props: any);
    pressTimeout: any;
    rotating: boolean;
    showLocate: boolean;
    map: React.RefObject<any>;
    themeBase: any;
    mapStyles: any;
    mapOverlays: {
        id: string;
        label: string;
        image: any;
    }[];
    defaultOverlays: {
        id: string;
        label: string;
        image: any;
    }[];
    overrideStyle: (origin: any, override: any) => void;
    overrideObject: (origin: any, override: any) => void;
    getViewport: () => {
        left: any;
        top: any;
        right: any;
        bottom: any;
        level: number;
    } | undefined;
    onRender: (map: any) => void;
    findFirstLayerType: (type: any) => any;
    onStyleLoad: (map: any) => void;
    handleChangeMapStyle: (mapStyle: any) => void;
    handleToggleMapOverlay: (overlay: any, checked: any) => void;
    onMove: (map: any, event: any) => void;
    saveMapState: () => void;
    onMoveEnd: (map: any, event: any) => void;
    onZoomEnd: (map: any) => void;
    onContextMenu: (map: any, event: any) => void;
    onRotateStart: () => void;
    onRotateEnd: () => void;
    onTouchStart: (map: any, event: any) => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
    onTouchMove: () => void;
    cancelContextMenuMobile: () => void;
}
export namespace Map {
    export namespace propTypes {
        const map: PropTypes.Requireable<object>;
        const width: PropTypes.Requireable<string>;
        const height: PropTypes.Requireable<string>;
        const center: PropTypes.Requireable<object>;
        const zoomLevel: PropTypes.Requireable<any[]>;
        const preserveDrawingBuffer: PropTypes.Requireable<boolean>;
        const onViewportChange: PropTypes.Requireable<(...args: any[]) => any>;
        const onStyleLoad: PropTypes.Requireable<(...args: any[]) => any>;
        const onRender: PropTypes.Requireable<(...args: any[]) => any>;
        const onZoomEnd: PropTypes.Requireable<(...args: any[]) => any>;
        const onMoveEnd: PropTypes.Requireable<(...args: any[]) => any>;
        const onContextMenu: PropTypes.Requireable<(...args: any[]) => any>;
        const onMove: PropTypes.Requireable<(...args: any[]) => any>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
        const saveViewport: PropTypes.Requireable<boolean>;
        const droneURL: PropTypes.Requireable<string>;
        const fontURL: PropTypes.Requireable<string>;
        const mapStyle: PropTypes.Requireable<string>;
        const mapStyles: PropTypes.Requireable<any[]>;
        const lightStyleOverride: PropTypes.Requireable<object>;
        const darkStyleOverride: PropTypes.Requireable<object>;
        const defaultStyleOverride: PropTypes.Requireable<object>;
        const satelliteStyleOverride: PropTypes.Requireable<object>;
        const terrainStyleOverride: PropTypes.Requireable<object>;
        const boundaryStyleOverride: PropTypes.Requireable<object>;
        const showOverlays: PropTypes.Requireable<boolean>;
        const scrollZoom: PropTypes.Requireable<boolean>;
        const showLocateControl: PropTypes.Requireable<PropTypes.InferProps<{
            autoLocate: PropTypes.Requireable<boolean>;
        }>>;
    }
    export namespace defaultProps {
        const width_1: string;
        export { width_1 as width };
        const height_1: string;
        export { height_1 as height };
        const saveViewport_1: boolean;
        export { saveViewport_1 as saveViewport };
        const showOverlays_1: boolean;
        export { showOverlays_1 as showOverlays };
        const scrollZoom_1: boolean;
        export { scrollZoom_1 as scrollZoom };
        const preserveDrawingBuffer_1: boolean;
        export { preserveDrawingBuffer_1 as preserveDrawingBuffer };
    }
    export { ThemeContext as contextType };
}
import React from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "../../../components/bases/Theme/ThemeContext";
//# sourceMappingURL=Map.d.ts.map
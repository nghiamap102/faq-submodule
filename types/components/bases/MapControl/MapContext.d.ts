export const MapContext: React.Context<{
    map: null;
    open: boolean;
    drawObj: null;
    draw: MapboxDraw;
    value: string;
    getBounds: (map: any) => {
        north: any;
        east: any;
        south: any;
        west: any;
    };
}>;
export function MapStateProvider({ children, initState }: {
    children: any;
    initState?: {} | undefined;
}): JSX.Element;
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import React from "react";
//# sourceMappingURL=MapContext.d.ts.map
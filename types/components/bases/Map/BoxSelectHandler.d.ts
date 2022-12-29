export class BoxSelectHandler {
    constructor(map: any);
    map: any;
    canvas: any;
    start: any;
    current: any;
    box: any;
    minLatLng: any;
    maxLatLng: any;
    mousePos: (e: any) => mapboxgl.Point;
    onKeyDown: (e: any) => void;
    onMouseMove: (e: any) => void;
    finish: (bbox: any) => void;
    onMouseUp: () => void;
    mouseDown: (e: any) => void;
    initBoxSelectEvent(): void;
}
import mapboxgl from "mapbox-gl";
//# sourceMappingURL=BoxSelectHandler.d.ts.map
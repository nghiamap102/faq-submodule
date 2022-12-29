export class MapUtil {
    constructor(map: any);
    sources: {};
    map: any;
    initBufferLayers: () => void;
    initGeofenceLayers: () => void;
    initBlockadeLayers: () => void;
    initAdvanceSearchLinesBuffer: () => void;
    initAdvanceSearchPointsBuffer: () => void;
    initGeofenceLinesBuffer: () => void;
    initGeofencePointsBuffer: () => void;
    initBlockadeLinesBuffer: () => void;
    initBlockadePointsBuffer: () => void;
    drawMyMapOnDragObjectTypeLines: (coords: any, color: any) => void;
    drawMyMapObjectTypePolygons: (polygons: any) => void;
    drawMyMapObjectTypeGeofencePolygons: (polygons: any) => void;
    drawMapObjectTypeLinesBuffer: (polygons: any) => void;
    drawMapObjectTypePointsBuffer: (polygons: any) => void;
    drawGeofenceLinesBuffer: (polygons: any) => void;
    drawGeofencePointsBuffer: (polygons: any) => void;
    drawBlockadeLinesBuffer: (polygons: any) => void;
    drawBlockadePointsBuffer: (polygons: any) => void;
    drawMyMapDrawingObjectTypeLines: (coords: any) => void;
    clearMapObjectPopup: (popup: any) => null;
    initSource: (sourceId: any) => void;
    clearAllSourceExcept: (exceptSourceIds: any) => void;
    clearSourceData: (sourceId: any) => void;
    setSourceData: (sourceId: any, data: any) => void;
    drawCircleSearchNearbyLayer: (centerCoords: any, radius: any) => void;
    createGeoJSONCircle: (center: any, radiusInMeters: any, points: any) => {
        type: string;
        geometry: {
            type: string;
            coordinates: any[][][];
        };
    };
    getBoundsPadding: (padding: any) => any;
    isPointInBounds: (point: any, padding: any) => boolean;
    addLayerBelowLabel: (data: any) => void;
    pointsToCoords(points: any): any;
    getBufferCoords(obj: any, radius: any): any;
    getMapObjectType(geometry: any): number;
    getDistance({ X: lon1, Y: lat1 }: {
        X: any;
        Y: any;
    }, { X: lon2, Y: lat2 }: {
        X: any;
        Y: any;
    }): number;
    getTotalDistanceWithCoordinates: (coords: any) => number;
    fitBound: (data: any) => void;
}
//# sourceMappingURL=MapUtil.d.ts.map
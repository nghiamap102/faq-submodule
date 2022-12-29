export class CommonHelper {
    static formatDate(date: any): string;
    static formatDategetTime(date: any): string;
    static clone(item: any): any;
    static coordsDecode(str: any, precision: any): number[][];
    static coordsEncode(coordinates: any, precision: any): string;
    static uuid(): string;
    static removeItemInArray(array: any, index: any): any[];
    static getFontAwesomeStringFromClassName: (className: any, type?: string) => any;
    static copyToClipboard(str: any): null | undefined;
    static arrayIntersection: (array1: any, array2: any) => any;
    static getCentroid: (geoJson: any) => mapboxgl.LngLat;
    static getUniqueValues: (array: any, key: any) => any[];
    static toDictionary: (array: any, key: any, value: any) => {};
}
import mapboxgl from "mapbox-gl";
//# sourceMappingURL=common.helper.d.ts.map
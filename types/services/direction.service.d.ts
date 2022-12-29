export class DirectionService {
    client: Client;
    getAddress(item: any): string;
    getShortAddress(item: any): string;
    getThumbnail(thumbnail: any): string;
    searchAll: (text: any, bounds: any) => Promise<any>;
    reverseGeocode: (lng: any, lat: any) => Promise<any>;
    addBarrier: (user: any, type: any, loc: any) => Promise<any>;
    removeBarrier: (user: any) => Promise<any>;
    getRouteAvoidBarrier: (locs: any, veh: any, crit: any, user: any, isAvoidBarrier: any, step?: number) => Promise<any>;
    getRouteAvoidBarrierDebounced: (locs: any, veh: any, crit: any, user: any, isAvoidBarrier: any, step?: number) => Promise<any>;
    getSuggestsDebounced: any;
    searchAllDebounced: (text: any, bounds: any) => Promise<any>;
}
import Client from "./Client";
//# sourceMappingURL=direction.service.d.ts.map
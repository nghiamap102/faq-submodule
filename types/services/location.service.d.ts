export class LocationService {
    http: HttpClient;
    gets: () => Promise<any>;
    get: (id: any) => Promise<any>;
    add: (location: any) => Promise<any>;
    getLocationDataByGeo: (lng: any, lat: any) => Promise<any>;
}
import HttpClient from "../helper/http.helper";
//# sourceMappingURL=location.service.d.ts.map
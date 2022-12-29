export declare enum AdminFields {
    location = "location",
    province = "province",
    district = "district",
    ward = "ward",
    street = "street",
    address = "address",
    shortAddress = "shortAddress",
    floor = "floor",
    postalCode = "postalCode"
}
export declare type ReverseGeocodeResponse = {
    address: string;
    country: string;
    district: string;
    province: string;
    shortAddress: string;
    street: string;
    ward: string;
};
export declare type GetChildByParentIdResponse = {
    AdminID: string | number;
    AdministrativeID: number;
    Id: string;
    Latitude: number;
    Longitude: number;
    Title: string;
}[];
export declare type SearchResponse = {
    id: string;
    address: string;
    latitude: number;
    longitude: number;
    name: string;
    provider: string;
}[];
export declare type GetAdminIdByNameResponse = {
    province?: number;
    district?: number;
    ward?: number;
};
export declare type Bounds = {
    north?: number;
    east?: number;
    south?: number;
    west?: number;
};
export interface AdministrativeSvc {
    search(text: string, bounds: Bounds): Promise<SearchResponse>;
    getChildByParentId(parentId: number, type: string): Promise<GetChildByParentIdResponse>;
    reverseGeocode(lng: number, lat: number): Promise<ReverseGeocodeResponse>;
    getAdminIdByName(province: string, district: string, ward: string): Promise<GetAdminIdByNameResponse>;
}
export declare type AdministrativeData = {
    location: any;
    province: number | null | undefined;
    district: number | null | undefined;
    ward: number | null | undefined;
    street?: string;
    address?: string;
    floor?: string;
    postalCode?: string;
};
declare type AdministrativeProps = {
    data?: AdministrativeData;
    required?: boolean;
    isReadOnly?: boolean;
    onChange?: Function;
    fields?: AdminFields[];
    dirtyFields?: any;
    mapHeight?: string;
    lngLat?: {
        lng: number;
        lat: number;
    };
    administrativeSvc: AdministrativeSvc;
    displayField: string;
    valueField: string;
    labelWidth?: string;
};
export declare const Administrative: (props: AdministrativeProps) => JSX.Element;
export {};
//# sourceMappingURL=Administrative.d.ts.map
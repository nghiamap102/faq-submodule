import { FC } from 'react';
declare type AdministrativeMapProps = {
    onLocationChange?: Function;
    center?: {
        lng: number;
        lat: number;
    };
    zoom?: number;
    height?: string;
    scrollZoom?: boolean;
    isNotControl?: boolean;
};
declare const AdministrativeMap: FC<AdministrativeMapProps>;
export { AdministrativeMap };
//# sourceMappingURL=AdministrativeMap.d.ts.map
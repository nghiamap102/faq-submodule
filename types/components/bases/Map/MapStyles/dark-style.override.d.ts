export default darkStyleOverride;
declare namespace darkStyleOverride {
    const layers: ({
        id: string;
        paint: {
            'background-color': string;
            'fill-color'?: undefined;
            'line-color'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'text-color'?: undefined;
            'text-halo-color'?: undefined;
            'text-halo-width'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint: {
            'fill-color': string;
            'background-color'?: undefined;
            'line-color'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'text-color'?: undefined;
            'text-halo-color'?: undefined;
            'text-halo-width'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': {
                base: number;
                stops: (string | number)[][];
            };
            'background-color'?: undefined;
            'fill-color'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'text-color'?: undefined;
            'text-halo-color'?: undefined;
            'text-halo-width'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': string;
            'background-color'?: undefined;
            'fill-color'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'text-color'?: undefined;
            'text-halo-color'?: undefined;
            'text-halo-width'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        add: boolean;
        paint?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': string;
            'line-opacity': number;
            'background-color'?: undefined;
            'fill-color'?: undefined;
            'fill-extrusion-color'?: undefined;
            'text-color'?: undefined;
            'text-halo-color'?: undefined;
            'text-halo-width'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': {
                stops: (string | number)[][];
                base?: undefined;
            };
            'background-color'?: undefined;
            'fill-color'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'text-color'?: undefined;
            'text-halo-color'?: undefined;
            'text-halo-width'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint: {
            'fill-extrusion-color': string;
            'background-color'?: undefined;
            'fill-color'?: undefined;
            'line-color'?: undefined;
            'line-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-color'?: undefined;
            'text-halo-width'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint: {
            'text-color': string;
            'background-color'?: undefined;
            'fill-color'?: undefined;
            'line-color'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'text-halo-color'?: undefined;
            'text-halo-width'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint: {
            'text-color': string;
            'text-halo-color': string;
            'background-color'?: undefined;
            'fill-color'?: undefined;
            'line-color'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'text-halo-width'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint: {
            'text-color': string;
            'text-halo-color': string;
            'text-halo-width': number;
            'background-color'?: undefined;
            'fill-color'?: undefined;
            'line-color'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint: {
            'text-halo-width': number;
            'background-color'?: undefined;
            'fill-color'?: undefined;
            'line-color'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'text-color'?: undefined;
            'text-halo-color'?: undefined;
        };
        add?: undefined;
    } | {
        id: string;
        paint?: undefined;
        add?: undefined;
    })[];
}
//# sourceMappingURL=dark-style.override.d.ts.map
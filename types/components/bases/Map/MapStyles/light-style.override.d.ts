export default override;
declare namespace override {
    const layers: ({
        id: string;
        paint: {
            'fill-color': {
                stops: (string | number)[][];
            };
            'fill-opacity': {
                stops: number[][];
            };
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'fill-color': {
                stops: (string | number)[][];
            };
            'fill-opacity': number;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'fill-color': {
                stops: (string | number)[][];
            };
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'fill-color': string;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'line-opacity': number;
            'line-color': {
                stops: (string | number)[][];
                base?: undefined;
            };
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': string;
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': {
                stops: (string | number)[][];
                base?: undefined;
            };
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': {
                stops: (string | number)[][];
                base?: undefined;
            };
            'line-width': {
                stops: number[][];
                base?: undefined;
            };
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': string;
            'line-width': {
                base: number;
                stops: number[][];
            };
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': {
                base: number;
                stops: (string | number)[][];
            };
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'line-color': string;
            'line-width': {
                stops: number[][];
                base?: undefined;
            };
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'fill-extrusion-color': string;
            'fill-extrusion-opacity': number;
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'text-color': string;
            'text-halo-width': number;
            'text-halo-color': string;
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'icon-opacity': (string | number | (string | boolean | string[])[])[];
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-color'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'text-halo-color': string;
            'text-color': string;
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-halo-width'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        layout: {
            'text-transform': string;
            'text-size'?: undefined;
        };
        paint: {
            'text-halo-color': string;
            'text-color': string;
            'text-halo-width': number;
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'icon-opacity'?: undefined;
        };
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'text-color': string;
            'icon-opacity': (string | number | (string | boolean | string[])[])[];
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        layout: {
            'text-size': {
                stops: number[][];
            };
            'text-transform'?: undefined;
        };
        paint: {
            'text-color': string;
            'text-halo-color': string;
            'text-halo-width': number;
            'icon-opacity': (string | number | (string | boolean | string[])[])[];
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
        };
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'text-color': {
                stops: (string | number)[][];
            };
            'text-halo-color': string;
            'text-halo-width': number;
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        paint: {
            'text-color': {
                stops: (string | number)[][];
            };
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-halo-width'?: undefined;
            'text-halo-color'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    } | {
        id: string;
        maxzoom: number;
        paint: {
            'text-color': {
                stops: (string | number)[][];
            };
            'text-halo-color': string;
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
            'text-halo-width'?: undefined;
            'icon-opacity'?: undefined;
        };
        layout?: undefined;
    } | {
        id: string;
        paint: {
            'text-color': {
                stops: (string | number)[][];
            };
            'text-halo-color': string;
            'text-halo-width': number;
            'icon-opacity': (string | number | (string | boolean | string[])[])[];
            'fill-color'?: undefined;
            'fill-opacity'?: undefined;
            'line-opacity'?: undefined;
            'line-color'?: undefined;
            'line-width'?: undefined;
            'fill-extrusion-color'?: undefined;
            'fill-extrusion-opacity'?: undefined;
        };
        layout?: undefined;
        maxzoom?: undefined;
    })[];
}
//# sourceMappingURL=light-style.override.d.ts.map
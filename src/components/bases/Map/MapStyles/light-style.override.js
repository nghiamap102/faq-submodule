const override = {
    layers: [
        {
            id: 'region_water_index',
            paint: {
                'fill-color': {
                    stops: [
                        [6, 'rgba(192, 201, 203, 1)'],
                        [10, '#C0C9CB'],
                    ],
                },
                'fill-opacity': {
                    stops: [
                        [6, 1],
                        [10, 1],
                    ],
                },
            },
        },
        {
            id: 'region-bathymetry-index',
            paint: {
                'fill-color': {
                    stops: [
                        [6, '#AFB6B9'],
                        [10, '#AFB6B9'],
                    ],
                },
                'fill-opacity': 0.15,
            },
        },
        {
            id: 'region_island_index',
            paint: {
                'fill-color': {
                    stops: [
                        [6, '#eeeeee'],
                        [10, '#eeeeee'],
                    ],
                },
            },
        },
        {
            id: 'region-river-index',
            paint: {
                'fill-color': {
                    stops: [
                        [6, '#C9D0D4'],
                        [10, '#C9D0D4'],
                    ],
                },
            },
        },
        {
            id: 'fill-vnairport-index',
            paint: { 'fill-color': 'rgba(226, 226, 226, 1)' },
        },
        {
            id: 'fill-vnpark-index',
            paint: { 'fill-color': 'rgba(213, 226, 210, 1)' },
        },
        {
            id: 'line-vntunnel-tinhlo-index',
            paint: {
                'line-opacity': 0.5,
                'line-color': {
                    stops: [
                        [6, 'rgba(255, 255, 255, .84)'],
                        [10, 'rgba(255, 255, 255, .84)'],
                    ],
                },
            },
        },
        {
            id: 'line-vntunnel-quoclo-index',
            paint: {
                'line-color': 'rgba(255, 255, 255, 0.94)',
            },
        },
        {
            id: 'fill-vntunnel-tinhlo-index',
            paint: {
                'line-color': {
                    stops: [
                        [6, 'rgba(255, 255, 255, 0.05)'],
                        [10, 'rgba(255, 255, 255, 0.05)'],
                    ],
                },
            },
        },
        {
            id: 'fill-vntunnel-quoclo-index',
            paint: {
                'line-color': {
                    stops: [
                        [6, 'rgba(232, 214, 201, 0.94)'],
                        [10, 'rgba(232, 214, 201, 0.94)'],
                    ],
                },
            },
        },
        {
            id: 'line-vnferry-tinhlo-index',
            paint: {
                'line-color': 'rgba(255, 255, 255, 0.94)',
            },
        },
        {
            id: 'line-vnferry-quoclo-index',
            paint: {
                'line-color': 'rgba(255, 255, 255, 0.94)',
            },
        },
        {
            id: 'line-vnroad-hemlo-index',
            paint: {
                'line-color': {
                    stops: [
                        [0, 'rgba(0, 0, 0, 0.01)'],
                        [14, 'rgba(0, 0, 0, 0.01)'],
                        [15, 'rgba(0, 0, 0, 0.01)'],
                    ],
                },
            },
        },
        {
            id: 'line-vnroad-huyenlo-index',
            paint: {
                'line-color': {
                    stops: [
                        [0, 'rgba(0, 0, 0, 0.01)'],
                        [13, 'rgba(0, 0, 0, 0.01)'],
                        [14, 'rgba(0, 0, 0, 0.01)'],
                    ],
                },
            },
        },
        {
            id: 'line-vnroad-tinhlo-index',
            paint: {
                'line-color': {
                    stops: [
                        [0, '#fff'],
                        [11, '#fff'],
                        [13, 'rgba(0, 0, 0, 0.01)'],
                    ],
                },
                'line-width': {
                    stops: [
                        [0, 0.1],
                        [7, 0.2],
                        [10, 0.4],
                        [11, 0.8],
                        [12, 4.4],
                        [13, 5],
                        [14, 6],
                        [15, 7],
                        [16, 10],
                        [17, 15],
                        [18, 19],
                        [19, 29],
                        [20, 39],
                    ],
                },
            },
        },
        {
            id: 'line-vnroad-quoclo-index',
            paint: {
                'line-color': {
                    stops: [
                        [0, 'rgba(255, 255, 255, 0.5)'],
                        [11, 'rgba(255, 255, 255, 0.5)'],
                        [13, 'rgba(0, 0, 0, 0.01)'],
                        [15, 'rgba(0, 0, 0, 0.01)'],
                    ],
                },
            },
        },
        {
            id: 'fill-vnroad-hemlo-index',
            paint: {
                'line-color': '#fff',
                'line-width': {
                    base: 1,
                    stops: [
                        [12, 0.2],
                        [13, 0.5],
                        [14, 1],
                        [15, 2],
                        [16, 2],
                        [17, 5],
                        [18, 9],
                        [19, 11],
                        [20, 13],
                    ],
                },
            },
        },
        {
            id: 'fill-vnroad-tinhlo-index',
            paint: {
                'line-color': {
                    stops: [
                        [6, '#fff'],
                        [10, '#fff'],
                    ],
                },
            },
        },
        {
            id: 'fill-vnroad-quoclo-index',
            paint: {
                'line-color': {
                    stops: [
                        [6, '#fff'],
                        [10, '#fff'],
                    ],
                },
            },
        },
        {
            id: 'line-vnbridge-huyenlo-index',
            paint: {
                'line-color': {
                    base: 1,
                    stops: [
                        [0, 'rgba(0, 0, 0, 0.05)'],
                        [13, 'rgba(0, 0, 0, 0.05)'],
                        [14, 'rgba(0, 0, 0, 0.05)'],
                    ],
                },
            },
        },
        {
            id: 'line-vnbridge-tinhlo-index',
            paint: {
                'line-color': {
                    base: 1,
                    stops: [
                        [0, '#fff'],
                        [14, '#fff'],
                        [15, 'rgba(0, 0, 0, 0.05)'],
                    ],
                },
            },
        },
        {
            id: 'line-vnbridge-quoclo-index',
            paint: {
                'line-color': {
                    base: 1,
                    stops: [
                        [0, '#fff'],
                        [10, '#fff'],
                        [13, 'rgba(137, 85, 34, 0.1)'],
                        [16, 'rgba(176, 152, 116, 0.1)'],
                    ],
                },
            },
        },
        {
            id: 'fill-vnbridge-tinhlo-index',
            paint: {
                'line-color': {
                    stops: [
                        [6, '#fff'],
                        [10, '#fff'],
                    ],
                },
            },
        },
        {
            id: 'fill-vnbridge-quoclo-index',
            paint: {
                'line-color': '#fff',
                'line-width': {
                    stops: [
                        [6, 4],
                        [11, 4],
                        [12, 4],
                        [13, 5],
                        [14, 7],
                        [15, 8],
                        [16, 10],
                        [17, 12],
                        [18, 18],
                        [19, 28],
                        [20, 38],
                    ],
                },
            },
        },
        {
            id: 'line-vnborder-1-1-index',
            paint: {
                'line-color': 'rgba(162, 135, 135, 0.84)',
            },
        },
        {
            id: 'line-vnborder-2-index',
            paint: {
                'line-color': 'rgba(0, 0, 0, 0.05)',
            },
        },
        {
            id: 'line-vnborder-3-index',
            paint: {
                'line-color': 'rgba(0, 0, 0, 0.05)',
            },
        },
        {
            id: 'line-vnrailway-line-index',
            paint: {
                'line-color': 'rgba(0, 0, 0, 0.1)',
            },
        },
        {
            id: 'line-vnrailway-track-index',
            paint: {
                'line-color': 'rgba(0, 0, 0, 0.1)',
            },
        },
        {
            id: 'region_building3d_index',
            paint: {
                'fill-extrusion-color': 'rgba(220, 220, 220, 1)',
                'fill-extrusion-opacity': 0.1,
            },
        },
        {
            id: 'label-vnriver-index',
            paint: {
                'text-color': 'rgba(78, 129, 133, 0.84)',
                'text-halo-width': 2,
                'text-halo-color': 'rgba(255, 255, 255, 0.54)',
            },
        },
        {
            id: 'symbol-vnway-left-index',
            paint: {
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.44],
            },
        },
        {
            id: 'symbol-vnway-right-index',
            paint: {
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.44],
            },
        },
        {
            id: 'symbol-vnway-no-index',
            paint: {
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.74],
            },
        },
        {
            id: 'label-vnroad-hemlo-index',
            paint: {
                'text-halo-color': 'rgba(255, 255, 255, 0.94)',
                'text-color': 'rgba(90, 90, 90, 0.84)',
            },
        },
        {
            id: 'label-vnroad-huyenlo-index',
            layout: {
                'text-transform': 'none',
                // 'text-keep-upright': true,
            },
            paint: {
                'text-halo-color': 'rgba(255, 255, 255, .94)',
                'text-color': 'rgba(90, 90, 90, 0.84)',
                'text-halo-width': 2,
            },
        },
        {
            id: 'label-vnroad-tinhlo-index',
            layout: {
                'text-transform': 'none',
            },
            paint: {
                'text-halo-color': 'rgba(255, 255, 255, .94)',
                'text-color': 'rgba(90, 90, 90, 0.84)',
                'text-halo-width': 2,
            },
        },
        {
            id: 'label-vnroad-quoclo-index',
            layout: {
                'text-transform': 'none',
            },
            paint: {
                'text-halo-color': 'rgba(255, 255, 255, 0.94)',
                'text-halo-width': 2,
                'text-color': 'rgba(90, 90, 90, 0.84)',
            },
        },
        {
            id: 'label-vnroad-shield1-index',
            paint: {
                'text-color': '#fff',
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.72],
            },
        },
        {
            id: 'label-vnroad-shield2-index',
            paint: {
                'text-color': '#2e2e2e',
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.44],
            },
        },
        {
            id: 'label-vnpoi-hospital-index',
            layout: {
                'text-size': {
                    stops: [
                        [0, 10],
                        [14, 12],
                        [20, 16],
                    ],
                },
            },
            paint: {
                'text-color': 'rgba(150, 115, 115, 0.94)',
                'text-halo-color': 'rgba(255, 255, 255, 0.94)',
                'text-halo-width': 2,
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.74],
            },
        },
        {
            id: 'label-vnpoi-park-index',
            layout: {
                'text-size': {
                    stops: [
                        [0, 10],
                        [14, 12],
                        [20, 16],
                    ],
                },
            },
            paint: {
                'text-color': 'rgba(87, 113, 86, 0.84)',
                'text-halo-color': 'rgba(255, 255, 255, 0.94)',
                'text-halo-width': 2,
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.74],
            },
        },
        {
            id: 'label-vnpoi-index',
            layout: {
                'text-size': {
                    stops: [
                        [0, 10],
                        [14, 10],
                        [20, 14],
                    ],
                },
            },
            paint: {
                'text-color': 'rgba(111, 116, 121, 0.84)',
                'text-halo-color': 'rgba(255, 255, 255, 94)',
                'text-halo-width': 2,
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.74],
            },
        },
        {
            id: 'label-vnpoi-police-index',
            layout: {
                'text-size': {
                    stops: [
                        [0, 10],
                        [14, 12],
                        [20, 16],
                    ],
                },
            },
            paint: {
                'text-color': 'rgba(113, 99, 78, 0.84)',
                'text-halo-color': 'rgba(255, 255, 255, 94)',
                'text-halo-width': 2,
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.74],
            },
        },
        {
            id: 'label-vnadmin-789-index',
            paint: {
                'text-color': {
                    stops: [
                        [13, 'rgba(162, 135, 121, 0.94)'],
                        [22, 'rgba(43, 41, 38, 0.05)'],
                    ],
                },
                'text-halo-color': 'rgba(255, 255, 255, 0.94)',
                'text-halo-width': 2,
            },
        },
        {
            id: 'label-vnadmin-456-index',
            paint: {
                'text-color': {
                    stops: [
                        [9, 'rgba(123, 93, 74, 1)'],
                        [20, 'rgba(43, 41, 38, 0.05)'],
                    ],
                },
            },
        },
        {
            id: 'label-vncities-index',
            paint: {
                'text-color': {
                    stops: [
                        [0, '#333'],
                        [13, 'rgba(53, 53, 53, 0.25)'],
                    ],
                },
                'text-halo-color': 'rgba(255, 255, 255, 0.94)',
                'text-halo-width': 2,
            },
        },
        {
            id: 'label-vnadmin-12-index',
            maxzoom: 16,
            paint: {
                'text-color': {
                    stops: [
                        [6, 'rgba(51, 51, 51, 0.84)'],
                        [16, 'rgba(53, 53, 53, 0.1)'],
                    ],
                },
                'text-halo-color': 'rgba(255, 255, 255, 0.94)',
            },
        },
        {
            id: 'label-wcapitals-index',
            paint: {
                'text-color': {
                    stops: [
                        [6, 'rgba(76, 51, 51, 0.84)'],
                        [14, 'rgba(76, 28, 28, 0.05)'],
                    ],
                },
                'text-halo-color': 'rgba(255, 255, 255, 0.54)',
                'text-halo-width': 2,
                'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.44],
            },
        },
        {
            id: 'label-vnisland-index',
            paint: {
                'text-color': 'rgba(117, 126, 140, 1)',
                'text-halo-color': 'rgba(255, 255, 255, 0.94)',
            },
        },
    ],
};

export default override;

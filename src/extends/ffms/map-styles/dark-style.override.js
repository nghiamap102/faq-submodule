const dark14 = '#233041';
const dark16 = '#233041';
const dark18 = '#233041';

const darkStyleOverride = {
    'sources': {
        'vietbando': {
            'type': 'vector',
            'autoscale': true,
            'bounds': [-180, -85, 180, 85],
            'cacheControl': 'max-age=43200,s-maxage=604800',
            'center': [0, 0, 3],
            'name': 'Vietbando Vector Tile',
            'description': 'Vietbando Vector Tile',
            'id': 'vt_vbddefault.vectortile',
            'vietbando_logo': true,
            'attribution': '<a href="http://maps.vietbando.com/maps/" target="_blank">&copy; Vietbando</a>',
            'minzoom': 0,
            'maxzoom': 16,
            'format': 'pbf',
            'private': false,
            'scheme': 'xyz',
            'tiles': ['$RELATIVE_URL/api/map-tile/?type=vt_inter_world&z={z}&x={x}&y={y}']
        },
        'building': {
            'type': 'vector',
            'autoscale': true,
            'bounds': [-180, -85, 180, 85],
            'cacheControl': 'max-age=43200,s-maxage=604800',
            'center': [0, 0, 3],
            'name': 'Vietbando Vector Tile',
            'description': 'Vietbando Vector Tile',
            'id': 'vt_building.vectortile',
            'vietbando_logo': true,
            'attribution': '<a href="http://maps.vietbando.com/maps/" target="_blank">&copy; Vietbando</a>',
            'minzoom': 10,
            'maxzoom': 16,
            'format': 'pbf',
            'private': false,
            'scheme': 'xyz',
            'tiles': ['$RELATIVE_URL/api/map-tile/?type=vietbando_building_20181130_tm2source&z={z}&x={x}&y={y}']
        },
        'vt_background': {
            'type': 'vector',
            'autoscale': true,
            'bounds': [-180, -85, 180, 85],
            'cacheControl': 'max-age=43200,s-maxage=604800',
            'center': [0, 0, 3],
            'name': 'Vietbando Vector Tile',
            'description': 'Vietbando Vector Tile',
            'id': 'vt_background.vectortile',
            'vietbando_logo': true,
            'attribution': '<a href="http://maps.vietbando.com/maps/" target="_blank">&copy; Vietbando</a>',
            'minzoom': 0,
            'maxzoom': 12,
            'format': 'pbf',
            'private': false,
            'scheme': 'xyz',
            'tiles': ['$RELATIVE_URL/api/map-tile/?type=v2_background_tm2source&z={z}&x={x}&y={y}']
        }
    },
    'layers': [
        {
            'id': 'background',
            'paint': { 'background-color': '#29323d' }
        },
        {
            'id': 'region_water_index',
            'paint': { 'fill-color': '#1e2a36' }
        },
        {
            'id': 'region-bathymetry-index',
            'paint': { 'fill-color': '#27394b' }
        },
        {
            'id': 'region_island_index',
            'paint': { 'fill-color': '#384555' }
        },
        {
            'id': 'region-river-index',
            'paint': { 'fill-color': '#48586c' }
        },
        {
            'id': 'fill-vnairport-index',
            'paint': { 'fill-color': '#455365' }
        },
        {
            'id': 'region_vnbuilding_index',
            'paint': { 'fill-color': '#526276' }
        },
        {
            'id': 'fill-vnbuilding-school-index',
            'paint': { 'fill-color': '#e5dec9' }
        },
        {
            'id': 'fill-vnbuilding-hospital-index',
            'paint': { 'fill-color': '#ffe2e2' }
        },
        {
            'id': 'fill-vnbuilding-park-index',
            'paint': { 'fill-color': '#C8DF9F' }
        },
        {
            'id': 'fill-vnbusstation-index',
            'paint': { 'fill-color': '#3f7b72' }
        },
        {
            'id': 'fill-vnpark-index',
            'paint': { 'fill-color': '#4c593f' }
        },
        {
            'id': 'line-vntunnel-hemlo-index',
            'paint': {
                'line-color': {
                    'base': 1, 'stops': [
                        [0, '#BBB'],
                        [14, '#BBB'],
                        [15, '#999']
                    ]
                }
            }
        },
        {
            'id': 'line-vntunnel-huyenlo-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#BBB'],
                        [14, '#BBB'],
                        [15, '#999']
                    ]
                }
            }
        },
        {
            'id': 'line-vntunnel-tinhlo-index',
            'paint': { 'line-color': '#2a2a2a' }
        },
        {
            'id': 'line-vntunnel-huyenlo-index',
            'paint': {
                'line-color': {
                    'base': 1, 'stops': [
                        [0, '#F2822C'],
                        [11, '#F2822C'],
                        [12, 'hsl(26, 87%, 34%)']
                    ]
                }
            }
        },
        {
            'id': 'line-vntunnel-caotoc-index',
            'add': true
        },
        {
            'id': 'fill-vntunnel-hemlo-index',
            'paint': { 'line-color': '#fff', 'line-opacity': 0.5 }
        },
        {
            'id': 'fill-vntunnel-huyenlo-index',
            'paint': { 'line-color': '#fff', 'line-opacity': 0.5 }
        },
        {
            'id': 'fill-vntunnel-tinhlo-index',
            'paint': {
                'line-color': '#5a5a5a',
                'line-opacity': 0.5
            }
        },
        {
            'id': 'fill-vntunnel-quoclo-index',
            'paint': { 'line-color': '#F2822C', 'line-opacity': 0.5 }
        },
        {
            'id': 'fill-vntunnel-caotoc-index',
            'add': true
        },
        {
            'id': 'line-vnferry-hemlo-index',
            'paint': { 'line-color': '#FFF' }
        },
        {
            'id': 'line-vnferry-huyenlo-index',
            'paint': { 'line-color': '#FFF' }
        },
        {
            'id': 'line-vnferry-tinhlo-index',
            'paint': { 'line-color': '#E6B100' }
        },
        {
            'id': 'line-vnferry-quoclo-index',
            'paint': { 'line-color': '#F2822C' }
        },
        {
            'id': 'line-vnferry-caotoc-index',
            'paint': { 'line-color': '#943232' }
        },
        {
            'id': 'line-vnroad-hemlo-index',
            'paint': { 'line-color': '#384555' }
        },
        {
            'id': 'line-vnroad-huyenlo-index',
            'paint': { 'line-color': '#384555' }
        },
        {
            'id': 'line-vnroad-tinhlo-index',
            'paint': { 'line-color': '#2c384c' }
        },
        {
            'id': 'line-vnroad-quoclo-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#F2822C'],
                        [11, '#F2822C'],
                        [12, 'hsl(26, 87%, 34%)']
                    ]
                }
            }
        },
        {
            'id': 'line-vnroad-caotoc-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#cc3737'],
                        [11, '#cc3737'],
                        [12, '#943232']
                    ]
                }
            }
        },
        {
            'id': 'fill-vnroad-hemlo-index',
            'paint': { 'line-color': dark18 }
        },
        {
            'id': 'fill-vnroad-huyenlo-index',
            'paint': {
                'line-color': {
                    'stops': [
                        [16, dark16],
                        [18, dark18]
                    ]
                }
            }
        },
        {
            'id': 'fill-vnroad-tinhlo-index',
            'paint': {
                'line-color': {
                    'stops': [
                        [14, dark14],
                        [16, dark16],
                        [18, dark18]
                    ]
                }
            }
        },
        {
            'id': 'fill-vnroad-quoclo-index',
            'paint': { 'line-color': '#F2822C' }
        },
        {
            'id': 'fill-vnroad-caotoc-index',
            'paint': {
                'line-color': '#cc3737'
            }
        },
        {
            'id': 'line-vnbridge-hemlo-index',
            'paint': { 'line-color': '#273746' }
        },
        {
            'id': 'line-vnbridge-huyenlo-index',
            'paint': { 'line-color': '#273746' }
        },
        {
            'id': 'line-vnbridge-tinhlo-index',
            'paint': { 'line-color': '#273746' }
        },
        {
            'id': 'line-vnbridge-quoclo-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#975f35'],
                        [11, '#975f35'],
                        [12, 'hsl(26, 87%, 34%)']
                    ]
                }
            }
        },
        {
            'id': 'line-vnbridge-caotoc-index',
            'paint': {
                'line-color': {
                    'base': 1,
                    'stops': [
                        [0, '#815454'],
                        [11, '#815454'],
                        [12, '#622222']
                    ]
                }
            }
        },
        {
            'id': 'boundary_2_z0-4',
            'add': true,
            'after': 'line-vnbridge-caotoc-index',
            'type': 'line',
            'source': 'vietbando',
            'source-layer': 'region_island_index',
            'filter': ['==', 'vietnam', 105],
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'line-color': 'hsl(213, 22%, 58%)',
                'line-dasharray': [1, 1, 5, 1],
                'line-width': {
                    'base': 1,
                    'stops': [
                        [0, 1],
                        [20, 4]
                    ]
                }
            }
        },
        {
            'id': 'fill-vnbridge-hemlo-index',
            'paint': { 'line-color': dark18 }
        },
        {
            'id': 'fill-vnbridge-huyenlo-index',
            'paint': {
                'line-color': {
                    'stops': [
                        [16, dark16],
                        [18, dark18]
                    ]
                }
            }
        },
        {
            'id': 'fill-vnbridge-tinhlo-index',
            'paint': {
                'line-color': {
                    'stops': [
                        [14, dark14],
                        [16, dark16],
                        [18, dark18]
                    ]
                }
            }
        },
        {
            'id': 'fill-vnbridge-quoclo-index',
            'paint': { 'line-color': '#F2822C' }
        },
        {
            'id': 'fill-vnbridge-caotoc-index',
            'paint': { 'line-color': '#cc3737' }
        },
        {
            'id': 'line-vnborder-halo-index',
            'add': true
        },
        {
            'id': 'line-vnborder-1-1-index',
            'paint': { 'line-color': '#7c91ab' }
        },
        {
            'id': 'line-vnborder-1-0-index',
            'paint': { 'line-color': 'rgba(15, 15, 15, 1)' }
        },
        {
            'id': 'line-vnborder-2-index',
            'paint': { 'line-color': '#2c384c' }
        },
        {
            'id': 'line-vnborder-2-conflict-index',
            'paint': { 'line-color': '#7c91ab' }
        },
        {
            'id': 'line-vnborder-3-index',
            'paint': { 'line-color': '#7c91ab' }
        },
        {
            'id': 'line-vnrailway-line-index',
            'paint': { 'line-color': '#697e98' }
        },
        {
            'id': 'line-vnrailway-track-index',
            'paint': { 'line-color': '#697e98' }
        },
        {
            'id': 'region_building3d_index',
            'paint': { 'fill-extrusion-color': 'rgba(78, 88, 108, 1)' }
        },
        {
            'id': 'label_vnmarine_line_index',
            'paint': { 'text-color': '#111' }
        },
        {
            'id': 'label-vnriver-index',
            'paint': { 'text-color': '#ffffff' }
        },
        {
            'id': 'label-vnroad-hemlo-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#222'
            }
        },
        {
            'id': 'label-vnroad-huyenlo-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#222'
            }
        },
        {
            'id': 'label-vnroad-tinhlo-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#222'
            }
        },
        {
            'id': 'label-vnroad-quoclo-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#222',
                'text-halo-width': 1.2
            }
        },
        {
            'id': 'label-vnroad-caotoc-index',
            'paint': { 'text-halo-width': 1.2 }
        },
        {
            'id': 'label-vnpoi-hospital-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#222e3a',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnpoi-park-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#30722b',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnpoi-police-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#714c12',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnpoi-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#374C51',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnadmin-10-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#613000'
            }
        },
        {
            'id': 'label-vnadmin-789-index',
            'paint': {
                'text-color': '#aaaaaa',
                'text-halo-color': '#14284b'
            }
        },
        {
            'id': 'label-vnadmin-456-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#613000'
            }
        },
        {
            'id': 'label-vncities-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#800',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnadmin-12-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#333'
            }
        },
        {
            'id': 'label_wcountry_index'
        },
        {
            'id': 'label-wcapitals-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#1f2935',
                'text-halo-width': 1
            }
        },
        {
            'id': 'label-vnisland-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#005291'
            }
        },
        {
            'id': 'label-wcontient-index',
            'paint': {
                'text-color': '#ffffff',
                'text-halo-color': '#333'
            }
        }
    ]
};

export default darkStyleOverride;

const override = {
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
                'line-color': '#933',
                'line-dasharray': [1, 1, 5, 1],
                'line-width': {
                    'base': 1,
                    'stops': [
                        [0, 1],
                        [20, 4]
                    ]
                }
            }

        }
    ]
};

export default override;

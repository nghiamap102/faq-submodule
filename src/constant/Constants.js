const Constants = {
    MY_LAST_COORD: 'vbd_my_last_coordinate',
    MY_LAST_LANGUAGE: 'vbd_my_last_language',
    MY_LAST_MAP_STYLE: 'vbd_my_last_map_style',
    MY_LAST_TRAVEL_MODE: 'vbd_my_last_travel_mode',
    MY_LAST_ROUTE_CRITERIA: 'vbd_my_last_route_criteria',
    DIRECTION_LAYER_ID: 'direction_path_layer',
    DIRECTION_ARROW_BODY_LAYER_ID: 'direction_arrow_layer_body',
    DIRECTION_ARROW_HEAD_LAYER_ID: 'direction_arrow_layer_head',
    DIRECTION_DASH_PATH_LAYER_ID: 'direction_dash_path_layer',
    ARROW_BORDER_COLOR: '#44a0f6',
    PATH_PRIMARY_COLOR: 'rgba(0, 134, 255, 0.5)',
    PATH_PRIMARY_BORDER_COLOR: 'rgba(0, 102, 204, 0.5)',
    PATH_SECONDARY_COLOR: 'rgba(187, 188, 189, 0.5)',
    PATH_SECONDARY_BORDER_COLOR: 'rgba(140, 140, 140, 0.5)',
    DASH_PATH_COLOR: '#888',

    MAP_OBJECT_LINES_LAYER_ID: 'map_object_lines_layer_id',
    MAP_OBJECT_POLYGONS_LAYER_ID: 'map_object_polygons_layer_id',
    LINES_BUFFER_LAYER_ID: 'lines_buffer_layer_id',
    POINTS_BUFFER_LAYER_ID: 'points_buffer_layer_id',

    GEOFENCE_LINES_BUFFER_LAYER_ID: 'geofence_lines_buffer_layer_id',
    GEOFENCE_POINTS_BUFFER_LAYER_ID: 'geofence_points_buffer_layer_id',

    BLOCKADE_LINES_BUFFER_LAYER_ID: 'blockade_lines_buffer_layer_id',
    BLOCKADE_POINTS_BUFFER_LAYER_ID: 'blockade_points_buffer_layer_id',

    DRAWING_MAP_OBJECT_LINE_LAYER_ID: 'drawing_map_object_line_layer_id',
    DRAWING_MAP_OBJECT_POLYGON_LAYER_ID: 'drawing_map_object_polygon_layer_id',

    DRAG_MAP_OBJECT_LINE_LAYER_ID: 'drag_map_object_line_layer_id',

    MAP_OBJECT_MARKER_COLOR: '#c62026',
    MAP_OBJECT_MARKER_SYMBOL: 'default',
    MAP_OBJECT_LINE_COLOR: '#0dadff',
    MAP_OBJECT_LINE_OPACITY: 1,
    MAP_OBJECT_LINE_WIDTH: 3,
    MAP_OBJECT_POLYGON_COLOR: '#0dadff',
    MAP_OBJECT_GEOFENCE_POLYGON_COLOR: 'yellow',
    MAP_OBJECT_POLYGON_OPACITY: 0.2,

    // MAP_MEASURE_DISTANCE_ID: 'map_gl_measure_distance_id',
    // MAP_MEASURE_DISTANCE_POINT: '#0dadff',
    // MAP_MEASURE_DISTANCE_RADIUS: 8,
    // MAP_MEASURE_DISTANCE_LINE_COLOR: '#0dadff',
    // MAP_MEASURE_DISTANCE_LINE_OPACITY: 0.5,
    // MAP_MEASURE_DISTANCE_LINE_WIDTH: 4,

    // blockade style
    MAP_OBJECT_BLOCKADE_POLYGON_COLOR: '#DC143C',
    MAP_OBJECT_BLOCKADE_FLAGPOLE_COLOR: '#DC143C',
    MAP_OBJECT_BLOCKADE_POLYGON_OPACITY: 0.2,

    ADMINISTRATIVE_BOUNDARIES_LAYER_ID: 'administrative_boundaries_layer',
    ADMINISTRATIVE_BOUNDARIES_POLYGON_OPACITY: 0.3,
    ADMINISTRATIVE_BOUNDARIES_POLYGON_COLOR: '#000',
    ADMINISTRATIVE_BOUNDARIES_OUTLINE_COLOR: '#a53b53',
    ADMINISTRATIVE_BOUNDARIES_OUTLINE_WIDTH: 2,


    CIRCLE_SEARCH_NEAR_BY_LAYER_ID: 'circle_search_near_by_layer',
    LEVEL_PROVINCE: 0,
    LEVEL_PROVINCE_TITLE: 'Thành phố / Tỉnh thành',
    TYPE_PROVINCE: 'P',
    LEVEL_DISTRICT: 1,
    LEVEL_DISTRICT_TITLE: 'Quận / Huyện / Thị Xã',
    TYPE_DISTRICT: 'D',
    LEVEL_WARD: 2,
    LEVEL_WARD_TITLE: 'Phường / Xã / Thị Trấn',
    TYPE_WARD: 'W',
    LEVEL_VILLAGE: 3,
    LEVEL_VILLAGE_TITLE: 'Làng / Thôn / Ấp',
    TYPE_PLACE_LIST_FAVORITE: 1,
    NAME_PLACE_LIST_FAVORITE: 'Mục yêu thích',
    TYPE_PLACE_LIST_WANT_GO: 2,
    NAME_PLACE_LIST_WANT_GO: 'Mục muốn đi',
    TYPE_PLACE_LIST_STAR: 3,
    NAME_PLACE_LIST_STAR: 'Địa điểm có gắn dấu sao',
    MY_PLACES_SHOW_HIDE_MARKER: 'my_places_show_hide_marker',

    UNKNOWN_LOCATION: 'Địa điểm chưa xác định',

    MEASURE_LINE_LAYER_ID: 'measure_line_layer_id',
    MEASURE_DRAWING_LINES_LAYER_ID: 'measure_drawing_line_layer_id',
    MEASURE_DRAWING_LINE_OPACITY: 0.6,
    MEASURE_DRAG_LINE_LAYER_ID: 'measure_drag_line_layer_id',
    MEASURE_LINE_COLOR: '#0dadff',
    MEASURE_LINE_WIDTH: 3,

    BARRIER_ID_TEST: 'barrier_id_test',

    GET_VIRTUAL_ROUTE_ID: 'get_virtual_route_id',

    INCIDENT_PATH_PRIMARY_COLOR: '#ffa700',
    INCIDENT_PATH_PRIMARY_BORDER_COLOR: '#684300',
    INCIDENT_DIRECTION_LAYER_ID: 'incident_direction_path_layer',
    INCIDENT_DIRECTION_DASH_PATH_LAYER_ID: 'direction_dash_path_layer',

    MAP_OBJECT: {
        POINTER: 0,
        MARKER: 1,
        LINES: 2,
        POLYGON: 3,
        PATH: 4
    },
    LABEL_FONTSIZE: 12,
    COLORS: [
        [
            '#0dadff', '#a52713', '#e55100', '#f9a824', '#ffd600', '#817716', '#558b2f', '#0a7138', '#00579b'
        ],
        [
            '#673ab7', '#4d342e', '#c2175b', '#ff5252', '#f57c01', '#ffea02', '#afb32a', '#7cb242', '#0097a7'
        ]
    ],
    POPULAR_ICONS: [
        [
            'home', 'utensils-alt', 'glass-cheers', 'shopping-bag', 'clinic-medical', 'bus', 'star', 'parking', 'question-circle'
        ],
        [
            'camera', 'traffic-cone', 'do-not-enter', 'car-crash', 'traffic-light', 'broadcast-tower', 'snowplow', 'bullhorn', 'map-marker'
        ]
    ],

    INACTIVE_USER_TIMEOUT: 60,

    DEFAULT_IMAGE_ICON_SIZE: 1,
    DEFAULT_VIDEO_MARKER_ICON: 'play-circle',
    DEFAULT_IMAGE_MARKER_ICON: 'image',

    KEYS: {
        ESC: 27,
        TAB: 9,
        RETURN: 13,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        ENTER: 13
    },
    PLATE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID: 'PLATE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID',
    FACE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID: 'FACE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID',

    WHAT_HERE_POPUP_ID: 'what-here-marker-popup-id',

    CAMERA_MONITORING_LAYER_ID: 'camera-monitoring-layer-id',
    CAMERA_STATUS_COLOR: {
        BAD: '#ffc107',
        BROKEN: '#ff253a',
        GOOD: '#00a65a'
    },
    CAMERA_STATUS: {
        NO_DATA: 0,
        GOOD: 1,
        BROKEN: 2
    }
};


export { Constants };




const Constants = {
    ADMINISTRATIVE_BOUNDARIES_LAYER_ID: 'administrative_boundaries_layer',
    ADMINISTRATIVE_BOUNDARIES_POLYGON_OPACITY: 0.3,
    ADMINISTRATIVE_BOUNDARIES_POLYGON_COLOR: '#000',
    ADMINISTRATIVE_BOUNDARIES_OUTLINE_COLOR: '#a53b53',
    ADMINISTRATIVE_BOUNDARIES_OUTLINE_WIDTH: 2,

    WARD_BOUNDARIES_LAYER_ID: 'ward_boundaries_layer',
    WARD_BOUNDARIES_POLYGON_OPACITY: 0.4,
    WARD_BOUNDARIES_POLYGON_COLOR: '#000',
    WARD_BOUNDARIES_OUTLINE_COLOR: '#a53b30',
    WARD_BOUNDARIES_OUTLINE_WIDTH: 2,

    POSTAL_CODE_BOUNDARIES_LAYER_ID: 'postal_code_boundaries_layer',
    POSTAL_CODE_BOUNDARIES_POLYGON_OPACITY: 0.3,
    POSTAL_CODE_BOUNDARIES_POLYGON_COLOR: '#000',
    POSTAL_CODE_BOUNDARIES_OUTLINE_COLOR: '#00579b',
    POSTAL_CODE_BOUNDARIES_OUTLINE_WIDTH: 2,

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
    ADMINISTRATIVE_TYPE: ['P', 'D', 'W'],
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

    POSTAL_VBD_CODE: {
        P: 'VBD_StateCode',
        D: 'VBD_DistrictCode',
        W: 'VBD_TehsilCode',
    },

    languages: [
        { id: 'en, en-in', label: 'English (India)' },
        { id: 'en, en', label: 'English (United States)' },
        { id: 'vi, vi', label: 'Tiếng Việt' },
    ],

    systemTokenType: {
        Worker: 'Worker',
        Manager: 'Manager',
    }
};

export { Constants };

export const DELAY_TIME = 60; // Minutes

export const EMPLOYEE_TYPE_TECHNICIAN = 2; // Technician
export const EMPLOYEE_TYPE_DRIVER = 1; // DRIVER

// Use Filter
export const PERIOD_DEFAULT = 'Last30d';
export const PERIOD = 'period';
export const ORGANIZATION = 'organization';
export const WORKER_TYPE = 'workerType';
export const TEAM = 'team';
export const WORKER = 'worker';

export const TAB = {
    JOB: 'JOB',
    EMPLOYEE: 'EMPLOYEE',
};

export const LIST_PERIOD = [
    { id: 'Last24h', label: 'Last 24 hours', time: 24 },
    { id: 'LastWeek', label: 'Last Week', time: 24 * 7 },
    { id: 'Last30d', label: 'Last 30 Days', time: 24 * 30 },
    { id: 'Custom', label: 'Custom' },
];

export const UNIT_TITLE = {
    JOB: 'Công việc',
    DISTANCE: 'Ki-lô-mét',
    TIME: 'Giờ',
};

export const LAYER_DATA_TYPE = {
    BOOLEAN: 1,// INT2
    INT: 2,
    TEXT: 3,
    FLOAT8: 4,
    TIMESTAMP: 5,
    LONG_TEXT: 6,// CHUỖI LỚN
    UUID: 7,// BẢN ĐỒ
    WORDS: 8, // VĂN BẢN
    BYTEA: 9,// TẬP TIN
    LIST: 10,
    GeoJSON: 11, // BẢN ĐỒ VN 2000
};

export const GROUP_BY_MODE = {
    DAY: { id: 1, key: 'Day', name: 'Ngày' },
    WEEK: { id: 2, key: 'Week', name: 'Tuần' },
    MONTH: { id: 3, key: 'Month', name: 'Tháng' },
    DAY_OF_WEEK: { id: 4, key: 'DayOfWeek', name: 'Ngày trong tuần' },
    HOUR_OF_DAY: { id: 5, key: 'HourOfDay', name: 'Giờ trong ngày' },
    WORKER_TYPE: { id: 6, key: 'TypeOfWorkers', name: 'Loại nhân viên' },
    JOB_TYPE: { id: 7, key: 'TypeOfJobs', name: 'Loại công việc' },
    WORKER: { id: 8, key: 'Worker', name: 'Nhân viên' },
};

export const periodMode = [
    'LAST_30_DAY',
    'THIS_WEEK',
    'LAST_24_HOURS',
    'CUSTOM',
];
export const AnalyticMode = {
    COMPLETED_JOB: { id: 1, name: 'Completed Jobs' },
    DELAY_TIME: { id: 2, name: 'Delay Time' },
    SERVICE_TIME: { id: 3, name: 'Service Time' },
    JOB_TYPE: { id: 4, name: 'Job Type' },
    DISTANCE: { id: 5, name: 'Khoảng cách' },
    TIME: { id: 6, name: 'Thời gian' },
};

// Job status
export const JOB_STATUS = {
    NEW: { id: 1, name: 'New', color: '#3dcad4' },
    ASSIGNED: { id: 2, name: 'Assigned', color: '#bb99f7' },
    PROGRESS: { id: 3, name: 'In Progress', color: '#37a6ff' },
    DONE: { id: 4, name: 'Done', color: '#8ae355' },
    CANCEL: { id: 5, name: 'Cancel', color: '#d4e3f6' },
};

export const ON_TIME_JOB = {
    ON_TIME: { id: 1, value: 1, name: 'On time', color: '#35a8fd' },
    DELAY: { id: 2, value: 0, name: `Delay > ${DELAY_TIME} mins`, color: '#ff0066' },
};

export const SERVICE_TIME_JOB = {
    LESS_THAN_1_HOUR: { id: 1, name: 'Less than 1 hour', color: '#95df4f' },
    LESS_THAN_2_HOURS: { id: 2, name: '1 - 2 hour', color: '#fdd528' },
    MORE_THAN_2HOURS: { id: 3, name: 'More than 2 hours', color: '#fd627e' },
};

export const JOB_TYPE = {
    NEW_INSTALLATION: { id: 1, name: 'New Installation', color: '#64FFDA' },
    DEMO: { id: 2, name: 'Demo', color: '#1DE9B6' },
    REPAIR: { id: 3, name: 'Repair', color: '#FFA726' },
    WITHIN_WARRANTY_REPAIR: { id: 4, name: 'Within warranty repair', color: '#FB8C00' },
    OUT_WARRANTY_PITCHING: { id: 5, name: 'Out warranty repair', color: '#EEFF41' },
    OTHER: { id: 6, name: 'Others- Please specify', color: '#C0CA33' },
    PICK_UP: { id: 7, name: 'Pick-up', color: '#8BC34A' },
    DROP_OFF: { id: 8, name: 'Drop-off', color: '#8D6E63' },
};

export const DISTANCE = {
    EN_ROUTE: { id: 1, name: 'En Route', color: '#3dcad4' },
    IDLE: { id: 2, name: 'Idle', color: '#bb99f7' },
};

export const TIME = {
    EN_ROUTE: { id: 1, name: 'En Route', color: '#3dcad4' },
    IDLE: { id: 2, name: 'Idle', color: '#bb99f7' },
};

export const TAB_LIST = [{
    id: TAB.JOB,
    title: 'JOB',
    link: '/ffms/dashboard/job',
}, {
    id: TAB.EMPLOYEE,
    title: 'EMPLOYEES',
    link: '/ffms/dashboard/employee',
}];

export const IGNORE_FILTER_PROPERTY = ['options', 'default', 'placeholder', 'data', 'content', 'multi', 'key', 'label'];

export const FILTER_TYPE = {
    TIME_FILTER: 'time-filter',
    LIST_FILTER: 'list-filter',
    REF_FILTER: 'ref-filter',
    REF_LIST_FILTER: 'ref-list-filter',
};

export const FACET_TYPE = {
    TERM_FACET: 'term-facet',
    QUERY_FACET: 'query-facet',
};

export const MAP_VIEW_MODE = {
    ADMIN: 'ADMIN',
    DETAIL: 'DETAIL',
    HEAT: 'HEAT',
};

export const STAT_FUNCTION_TYPE = {
    SUM: 1, AVG: 2, SUMSQ: 3, MIN: 4, MAX: 5,
};

export const queryInfo = {
    'Combine': 'AND',
    'ColumnName': 'employee_type_id',// field
    'Condition': 'like',
    'ValueFilter': 'driver',
    'DataType': 10,

    'domain': {
        'graph': {
            'to': 'job_assignee_guid',
            'from': 'employee_guid',
            'traversalFilter': 'job_status_id:Done',
        },
    },
};

export const statInfo = {
    'statName': 'A',
    'statType': 'term',
    'statField': 'employee_type_id',
    'domain': {
        'graph': {
            'to': 'job_assignee_guid',
            'from': 'employee_guid',
            'traversalFilter': 'job_status_id:Done',
        },
    },
};

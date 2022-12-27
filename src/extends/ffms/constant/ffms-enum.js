module.exports = {
    MAP_OPTIONS: {
        longitude: 78.5256851848203,
        latitude: 22.4886934737012,
        zoom: 4,
    },
    SOLR_LIST_SUFFIX: '_ts_vn_raws',
    EMPLOYEE_STATUS: {
        new: '1',
        inactive: '2',
        active: '3',
        disabled: '4',
    },

    JOB_STATUS: {
        new: 1,
        assigned: 2,
        processing: 3,
        done: 4,
        cancel: 5,
    },

    IMPORT_STATUS: {
        notImported: '0',
        success: 1,
        update: 2,
        dataFailed: -256,
        importFailed: -1,
        geoCodeFailed: -2,
    },

    TENANT_STATUS: {
        new: 0,
        init: 1,
        readyToConfig: 2,
        sampleDataLoading: 3,
        userConfig: 4,
        ready: 5,
        failed: -1,
    },
    ADMINISTRATIVE_TYPE: { P: 0,D: 1,W: 2 },

    WORKER_STATUS: {
        new: '1',
        inactive: '2',
        active: '3',
        disabled: '4',
    },
};

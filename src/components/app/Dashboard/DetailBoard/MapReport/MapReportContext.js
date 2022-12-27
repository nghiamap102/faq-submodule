import React, { createContext } from 'react';

import { useMergeState } from '@vbd/vui';

import { FACET_TYPE } from 'services/DashboardService/constants';

const initState = {
    map: null,
    data: [],
    chart: {},
    geoField: 'Location',
    districtAdminData: null,
    types: [],
    field: null,
    facetType: FACET_TYPE.TERM_FACET,
    loading: false,
    zoomLevel: 12.5,
};

const MapReportContext = createContext(initState);

const MapReportProvider = ({ children }) =>
{
    const [state, setState] = useMergeState(initState);

    return <MapReportContext.Provider value={{ state, setState }}>{children}</MapReportContext.Provider>;
};

export { MapReportContext, MapReportProvider };

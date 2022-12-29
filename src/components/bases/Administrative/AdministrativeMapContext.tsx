import React, { createContext } from 'react';
import { useMergeState } from 'hooks/useMergeState';

const initState = {
    map: undefined,
    location: null,
    mapCenter: null,
    clickToPin: false,
};

const AdministrativeMapContext = createContext({});

const AdministrativeMapProvider: React.FunctionComponent = ({ children }) =>
{
    const [adminMapState, setAdminMapState] = useMergeState(initState);

    return (
        <AdministrativeMapContext.Provider
            value={{
                ...adminMapState,
                setAdminMapState,
            }}
        >
            {children}
        </AdministrativeMapContext.Provider>
    );
};

export { AdministrativeMapContext, AdministrativeMapProvider };

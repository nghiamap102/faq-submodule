import React, { createContext } from 'react';

export const DomainContext = createContext();

export const DomainProvider = (props) =>
{
    const { domain } = props;
    return (
        <DomainContext.Provider value={{ domain }}>
            {props.children}
        </DomainContext.Provider>
    );
};


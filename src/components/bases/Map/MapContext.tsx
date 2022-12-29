import { createContext, useState } from 'react';

type MapProviderProps = {
    children?: any
}

type MapStyle = {
    id: string,
    label: string,
    styleURL: string,
    image: string,
}

export const MapContext = createContext({});

export const MapProvider = (props: MapProviderProps) =>
{
    const { children } = props;
    const [styles, setStyles ] = useState<MapStyle[]>([]);

    return (
        <MapContext.Provider
            value={{
                styles,
                setStyles,
            }}
        >
            {children}
        </MapContext.Provider>
    );

};

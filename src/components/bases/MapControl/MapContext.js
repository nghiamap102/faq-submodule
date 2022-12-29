import React, { createContext, useReducer } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
const initValue = {
    map: null,
    open: false,
    drawObj: null,
    draw: new MapboxDraw({
        clickBuffer: 3,
        displayControlsDefault: false,
        controls: { point: true, line_string: true, polygon: true, trash: true },
    }),
    value: '',
    getBounds: (map) =>
    {
        return {
            north: map.getBounds().getNorth(),
            east: map.getBounds().getEast(),
            south: map.getBounds().getSouth(),
            west: map.getBounds().getWest(),
        };
    },
};
const MapContext = createContext(initValue);
const { Provider } = MapContext;

const MapStateProvider = ({ children, initState = {} }) =>
{
    const [mapState, dispatch] = useReducer((state, action) =>
    {
        switch (action.type)
        {
            case 'setMap':
                return { ...state, map: action.data };
            case 'setDrawObj':
                return { ...state, drawObj: action.data };
            case 'createDraw':
                if (state.drawObj)
                {
                    state.draw.delete([state.drawObj.id]);
                }
                return { ...state, drawObj: action.data };
            case 'setValue':
                return { ...state, value: action.data };
            case 'closeMap':
                return { ...state, open: false };
            case 'openMap':
                return { ...state, open: true };
            default:
                throw new Error();
        }
    }, { ...initValue, ...initState });

    return <Provider value={{ mapState, dispatch }}>{children}</Provider>;
};

export { MapContext, MapStateProvider };

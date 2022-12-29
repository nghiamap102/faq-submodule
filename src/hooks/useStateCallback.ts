import { useState, useRef, useCallback, useEffect } from 'react';

type SetStateCallback<S> = (state: S | ((prevState: S) => S), callback?:Callback<S>) => void
type Callback<S> = (state?: S) => void

export const useStateCallback = <S>(initialState: S | (() => S)): [S, SetStateCallback<S>] =>
{
    const [state, setState] = useState(initialState);
    const callbackRef = useRef<null | Callback<S>>(null); // init mutable ref container for callbacks

    const setStateCallback:SetStateCallback<S> = useCallback((state, callback) =>
    {
        callbackRef.current = callback ? callback : null;
        setState(state);
    }, []);

    useEffect(() =>
    {
        callbackRef.current && callbackRef.current(state);
        callbackRef.current = null;
    }, [state]);

    return [state, setStateCallback];
};

import { useReducer, Dispatch } from 'react';

type MergeStateReducer<S> = (prevState: S, newState: Partial<S>) => S;

export const useMergeState = <S extends Record<string, any>>(initialState: S): [S, Dispatch<Partial<S>>] =>
{
    const [state, setMergedState] = useReducer<MergeStateReducer<S>>(
        (state, newState) => ({ ...state, ...newState }),
        initialState,
    );

    return [state, setMergedState];
};

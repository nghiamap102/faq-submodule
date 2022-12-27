import { useReducer } from 'react';

export const useMergeState = (initialState) =>
{
    const [state, setMergedState] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        initialState,
    );

    return [state, setMergedState];
};

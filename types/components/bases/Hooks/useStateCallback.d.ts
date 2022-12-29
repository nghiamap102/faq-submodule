declare type SetStateCallback<S> = (state: S | ((prevState: S) => S), callback?: Callback<S>) => void;
declare type Callback<S> = (state?: S) => void;
export declare const useStateCallback: <S>(initialState: S | (() => S)) => [S, SetStateCallback<S>];
export {};
//# sourceMappingURL=useStateCallback.d.ts.map
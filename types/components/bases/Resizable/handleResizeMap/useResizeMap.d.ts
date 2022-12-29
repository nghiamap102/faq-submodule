declare type IOnMap = (map: any) => void;
declare type IDelay = (delay: number) => void;
declare type IRun = () => void;
declare type IResizeMap = () => {
    onMap: IOnMap;
    onDelay: IDelay;
    run: IRun;
    map: any;
};
export declare const useResizeMap: IResizeMap;
export {};
//# sourceMappingURL=useResizeMap.d.ts.map
export interface IPopOverSize {
    width?: number;
    height?: number;
}
export interface IPopOverPositionSize extends IPopOverSize {
    x?: number;
    y?: number;
}
export interface IUsePopOverOptionProps {
    className?: string;
    isResponsive?: boolean;
    header?: string;
    subHeader?: string;
    width?: number;
    maxHeight?: number;
    innerState?: any;
    setInnerState?: any;
    wrappedEl: HTMLElement | null;
}
export interface IPerfectScrollbarSize extends IPopOverSize {
    minWidth?: number;
    maxWidth?: number;
    maxHeight?: number;
}
export interface IPopOverStyle {
    minWidth?: number;
    top?: number;
    left?: number;
    right?: number;
    transform?: string;
}
export interface IPopOverTransformStyle {
    x: 0 | '-100%';
    y: 0 | '-100%';
}
export interface IPopOverPositionProps {
    className?: string;
}
interface IUsePopOverOptionReturn {
    psSize: IPerfectScrollbarSize;
}
export declare type IUsePopOverOption = (params: IUsePopOverOptionProps) => IUsePopOverOptionReturn;
export {};
//# sourceMappingURL=usePopOverOptionType.d.ts.map
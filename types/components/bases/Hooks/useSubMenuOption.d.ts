interface IUseSubMenuOptionProps {
    isResponsive?: boolean;
}
interface ISubMenuStyle {
    minWidth?: number;
    left?: number | string;
    top?: number | string;
    transform?: string;
}
declare type IHandleSubMenuInnerSize = (el: HTMLElement | null) => void;
interface IUseSubMenuOptionReturn {
    subMenuStyle: Array<ISubMenuStyle>;
    handleSubMenuInnerSize: IHandleSubMenuInnerSize;
}
declare type IUseSubMenuOption = (params: IUseSubMenuOptionProps) => IUseSubMenuOptionReturn;
export declare const useSubMenuOption: IUseSubMenuOption;
export {};
//# sourceMappingURL=useSubMenuOption.d.ts.map
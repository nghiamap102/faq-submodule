declare type ISetInput = (element: HTMLInputElement | null) => void;
declare type ISetFormat = (format: string) => void;
declare type IFormatValue = (value: string) => string;
declare type IUseFormat = (onlyNumber?: boolean) => {
    formatValue: IFormatValue;
    setInput: ISetInput;
    setFormat: ISetFormat;
};
declare const useFormat: IUseFormat;
export default useFormat;
//# sourceMappingURL=useFormat.d.ts.map
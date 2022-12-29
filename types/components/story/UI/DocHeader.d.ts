import './DocHeader.scss';
declare const COMPONENT_STATUS: readonly ["deprecated", "experimental", "released"];
export declare type DocHeaderProps = {
    name: string;
    status?: (typeof COMPONENT_STATUS)[number];
};
export declare const DocHeader: (props: DocHeaderProps) => JSX.Element;
export {};
//# sourceMappingURL=DocHeader.d.ts.map
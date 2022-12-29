import { ReactNode, Ref } from 'react';
import { Property } from 'csstype';
export declare type SectionProps = {
    className?: string;
    header: ReactNode | ReactNode[];
    actions?: SectionAction[];
    onHeaderClick?: JSX.IntrinsicElements['div']['onClick'];
    innerRef?: Ref<HTMLDivElement>;
};
export declare type SectionAction = {
    icon: string;
    title?: string;
    className?: string;
    onClick?: JSX.IntrinsicElements['button']['onClick'];
};
export declare type SectionHeaderProps = {
    className?: string;
    textAlign?: Property.TextAlign;
    actions?: SectionAction[];
    onClick?: JSX.IntrinsicElements['div']['onClick'];
};
export declare type CollapsibleSectionProps = {
    className?: string;
    header: ReactNode | ReactNode[];
    actions?: SectionAction[];
    defaultExpanded?: boolean;
    onExpand?: (isExpanded: boolean) => void;
};
//# sourceMappingURL=index.d.ts.map
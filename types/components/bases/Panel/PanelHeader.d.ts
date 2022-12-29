import React from 'react';
import './PanelHeader.scss';
export declare type PanelHeaderProps = {
    actions?: PanelHeaderAction[];
};
export declare type PanelHeaderAction = {
    title?: string;
    tooltip?: string;
    icon: string;
    innerRef?: React.Ref<HTMLButtonElement>;
} & Omit<JSX.IntrinsicElements['button'], 'ref' | 'key'>;
export declare const PanelHeader: React.FC<PanelHeaderProps>;
//# sourceMappingURL=PanelHeader.d.ts.map
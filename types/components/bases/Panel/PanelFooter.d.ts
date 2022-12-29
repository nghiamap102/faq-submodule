import React from 'react';
import { ButtonProps } from '../../../components/bases/Button/Button';
import './PanelFooter.scss';
declare type PanelFooterProps = {
    docked?: boolean;
    disabled?: boolean;
    actions?: PanelFooterAction[];
};
declare type PanelFooterAction = {
    isDirty?: boolean;
    text?: string;
} & Omit<ButtonProps, 'size' | 'text'>;
export declare const PanelFooter: React.FC<PanelFooterProps>;
export {};
//# sourceMappingURL=PanelFooter.d.ts.map
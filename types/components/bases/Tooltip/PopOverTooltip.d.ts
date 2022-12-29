import React from 'react';
import { IPopOverPositionSize, IUsePopOverOptionProps } from '../../../components/bases/Modal/model/usePopOverOptionType';
import './PopOverTooltip.scss';
export declare type IProps = Omit<IUsePopOverOptionProps, 'wrappedEl'> & {
    position: IPopOverPositionSize;
    className?: string;
    backdrop?: boolean;
    onClose?: () => void;
    onMap?: boolean;
};
export declare const PopOverTooltip: React.FC<IProps>;
//# sourceMappingURL=PopOverTooltip.d.ts.map
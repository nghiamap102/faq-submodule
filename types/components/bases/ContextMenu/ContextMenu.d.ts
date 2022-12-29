import React from 'react';
import { IPopOverPositionSize, IUsePopOverOptionProps } from '../../../components/bases/Modal/model/usePopOverOptionType';
import { Placement } from '../../../components/bases/Modal/model/overlayType';
import './ContextMenu.scss';
export interface IContactMenuAction {
    label?: string;
    sub?: string;
    className?: string;
    icon?: string;
    iconClassName?: string;
    to?: string;
    style?: React.CSSProperties;
    iconStyle?: React.CSSProperties;
    disabled?: boolean;
    onClick?: (e: MouseEvent | TouchEvent) => void;
}
interface IPreMenu {
    id?: string;
    header?: string;
    actions: IContactMenuAction[];
    disabled?: boolean;
    isTopLeft?: boolean;
    isCloseOnAction?: boolean;
    isCloseOnBlur?: boolean;
}
interface IMenu extends IPreMenu {
    position: IPopOverPositionSize;
}
export interface ContextMenuProps extends Omit<IUsePopOverOptionProps, 'wrappedEl'>, IMenu {
    backdrop?: boolean;
    placement?: Placement;
    onClose?: () => void;
}
declare const ContextMenu: React.FC<ContextMenuProps>;
export default ContextMenu;
//# sourceMappingURL=ContextMenu.d.ts.map
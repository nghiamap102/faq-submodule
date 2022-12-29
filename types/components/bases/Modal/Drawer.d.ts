import React from 'react';
import { PopupProps } from '../../../components/bases/Popup/Popup';
import './Drawer.scss';
export declare type DrawerProps = {
    position?: 'left' | 'right';
} & Pick<PopupProps, 'animationIn' | 'animationOut' | 'width' | 'scroll' | 'onClose' | 'showCloseIcon'>;
export declare const Drawer: React.FC<DrawerProps>;
//# sourceMappingURL=Drawer.d.ts.map
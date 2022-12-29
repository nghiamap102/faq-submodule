import React from 'react';

import { Popup, PopupProps } from 'components/bases/Popup/Popup';

import './Drawer.scss';

export type DrawerProps = {
    position?: 'left' | 'right';
} & Pick<PopupProps, 'animationIn' | 'animationOut' | 'width' | 'scroll' | 'onClose' | 'showCloseIcon'>

export const Drawer: React.FC<DrawerProps> = (props) =>
{
    const {
        width = '22rem',
        scroll = true,
        position = 'left',
        animationIn = 'slideInRight',
        animationOut = 'slideOutRight',
        onClose,
        children,
        showCloseIcon,
    } = props;
    return (
        <Popup
            className={`drawer ${position === 'right' ? 'drawer--right' : ''}`}
            animationIn={animationIn}
            animationOut={animationOut}
            width={width}
            padding={'0'}
            escape={false}
            scroll={scroll}
            showCloseIcon={showCloseIcon}
            isShowContentOnly
            onClose={onClose}
        >
            {children}
        </Popup>
    );
};

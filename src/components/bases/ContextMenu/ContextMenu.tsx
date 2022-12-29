import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { isMobile } from 'react-device-detect';

import { T } from 'components/bases/Translate/Translate';
import usePopOverOption from 'components/bases/Modal/hooks/usePopOverOption';
import { IPopOverPositionSize, IUsePopOverOptionProps } from 'components/bases/Modal/model/usePopOverOptionType';
import { Placement } from 'components/bases/Modal/model/overlayType';
import { AnchorOverlay } from 'components/bases/Modal/AnchorOverlay';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';

import './ContextMenu.scss';
import { ContextMenuItem } from './ContextMenuItem';

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
    isCloseOnBlur?: boolean; // TODO: currently, it does not work, need to be clarified
}

interface IMenu extends IPreMenu {
    position: IPopOverPositionSize;
}

type IUpdateMenu = (menu: IMenu, props: ContextMenuProps) => IMenu;

export interface ContextMenuProps extends Omit<IUsePopOverOptionProps, 'wrappedEl'>, IMenu {
    backdrop?: boolean;
    placement?: Placement
    onClose?: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = (props) =>
{
    const { backdrop, className, isResponsive, onClose, isCloseOnBlur, position, header, width, maxHeight } = props;

    const contextMenuRef = useRef<HTMLDivElement>(null);

    const defaultMenu: IMenu = {
        id: undefined,
        header: '',
        position: {
            x: 0,
            y: 0,
        },
        isTopLeft: true, // have two options, top-left and top-right TODO: if false not work, need investigate
        isCloseOnAction: true,
        isCloseOnBlur: false,
        disabled: false,
        actions: [],
    };

    const menuStyle = clsx({
        fullscreen: isResponsive,
    });

    const { psSize } = usePopOverOption({
        isResponsive,
        header,
        width,
        maxHeight,
        wrappedEl: contextMenuRef.current,
    });

    useEffect(() =>
    {
        const appBody = document.getElementById('appContainer');
        // Event mousedown to handle close map context menu when clicking right mouse
        appBody?.addEventListener(isMobile ? 'touchstart' : 'mousedown', handleOnClose);
        return () => appBody?.removeEventListener(isMobile ? 'touchstart' : 'mousedown', handleOnClose);
    }, []);

    const updateMenu: IUpdateMenu = (menu, props) =>
    {
        const filteredData = Object.entries(props).filter(([key]) => key in menu);
        const updatedMenu = Object.fromEntries(filteredData);
        return { ...menu, ...updatedMenu };
    };

    const handleOnClose = () =>
    {
        onClose && onClose();
    };

    const handleContainerClick = () =>
    {
        // to prevent it auto close on iOS, we just close when it's in fullscreen mode
        if (isResponsive)
        {
            handleOnClose();
        }
    };

    const handleOnBlur = () =>
    {
        console.log('onBlur'); // not work
        if (isCloseOnBlur)
        {
            handleOnClose();
        }
    };

    const menu = updateMenu(defaultMenu, props);

    return (
        <AnchorOverlay
            {...props}
            position={position}
            className={className ?? undefined}
            backdrop={backdrop}
            onBackgroundClick={handleOnClose}
        >
            <div
                tabIndex={0}
                id={menu.id ? menu.id : undefined}
                className={'action-menu ' + menuStyle}
                onBlur={handleOnBlur}
                onContextMenu={(e) => e.preventDefault()}
            >
                <div
                    className="action-menu-widget"
                    onClick={handleContainerClick}
                >
                    {menu.header && (
                        <div className="action-menu-header">
                            <div className="action-menu-entry-text">
                                <T>{menu.header}</T>
                            </div>
                            {
                                // todo: add close button for context menu which css not belong to other
                                // isResponsive &&
                                // <div className="modal-close-row">
                                //     <button className="close-button close-button-white-circle"></button>
                                // </div>
                            }
                        </div>
                    )}

                    {menu.header && <div className="action-menu-horizontal-line" />}

                    <ScrollView
                        className="action-menu-content"
                        style={psSize}
                    >
                        {menu.actions.map((action, i) => (
                            <ContextMenuItem
                                key={i}
                                index={i}
                                label={action.label}
                                className={action.className}
                                disabled={action.disabled}
                                iconStyle={action.iconStyle}
                                iconClassName={action.iconClassName}
                                icon={action.icon}
                                to={action.to}
                                style={action.style}
                                sub={action.sub}
                                onClick={action.onClick}
                                onClose={handleOnClose}
                            />
                        ))}
                    </ScrollView>
                </div>
            </div>
        </AnchorOverlay>
    );
};

export default ContextMenu;

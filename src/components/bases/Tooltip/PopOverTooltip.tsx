import React, { useRef } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'lib/react-perfect-scrollbar';
import { isMobile } from 'react-device-detect';

import { T } from 'components/bases/Translate/Translate';
import usePopOverOption from 'components/bases/Modal/hooks/usePopOverOption';
import { IPopOverPositionSize, IUsePopOverOptionProps } from 'components/bases/Modal/model/usePopOverOptionType';
import { AnchorOverlay } from 'components/bases/Modal/AnchorOverlay';

import './PopOverTooltip.scss';

export type IProps = Omit<IUsePopOverOptionProps, 'wrappedEl'> & {
    position: IPopOverPositionSize;
    className?: string;
    backdrop?: boolean;
    onClose?: () => void;
    onMap?: boolean;
}

export const PopOverTooltip: React.FC<IProps> = (props) =>
{
    const { className, header, children, isResponsive, width, maxHeight, subHeader, onMap } = props;
    const popoverTooltipRef = useRef<HTMLDivElement>(null);

    const { psSize } = usePopOverOption({
        isResponsive,
        header,
        width,
        maxHeight,
        wrappedEl: popoverTooltipRef.current,
    });

    const classes = clsx(
        'popover-tooltip',
        className,
        isMobile && onMap && 'popover-on-map',
    );

    return (
        <AnchorOverlay
            // {...props}
            position={props.position}
            className={classes}
            backdrop={props.backdrop}
            onBackgroundClick={props.onClose}
        >
            <div
                ref={popoverTooltipRef}
                className={'popover-tooltip-container'}
            >
                {header && (
                    <div className="popover-tooltip-header">
                        <T>{header}</T>
                        {subHeader && (
                            <div className="popover-tooltip-sub-header">
                                <T>{subHeader}</T>
                            </div>
                        )}
                    </div>
                )}
                <PerfectScrollbar
                    className="popover-tooltip-content"
                    style={psSize}
                >
                    {children}
                </PerfectScrollbar>
            </div>
        </AnchorOverlay>
    );
};

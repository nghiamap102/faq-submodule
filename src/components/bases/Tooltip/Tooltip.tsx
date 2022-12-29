import React, { useState, useRef, ReactNode } from 'react';

import { T } from 'components/bases/Translate/Translate';
import { AnchorOverlay } from 'components/bases/Modal/AnchorOverlay';

import './Tooltip.scss';
import { Placement } from '../Modal/model/overlayType';

type TooltipTrigger = 'hover' | 'click'
type TooltipProps = {
    trigger?: TooltipTrigger[]
    content?: string | ReactNode
    position?: Extract<Placement, 'top' | 'left' | 'right' | 'bottom'>
}

export const Tooltip: React.FC<TooltipProps> = (props) =>
{
    const { children, content, trigger = ['hover'], position = 'top' } = props;
    const [show, setShow] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);

    const handleMouseIn = () => setShow(true);
    const handleMouseOut = () => setShow(false);
    const handleClick = () => setShow(prev => !prev);

    return (
        <span
            ref={inputRef}
            onMouseOver={trigger.includes('hover') ? handleMouseIn : undefined}
            onMouseLeave={trigger.includes('hover') ? handleMouseOut : undefined}
            onClick={trigger.includes('click') ? handleClick : undefined}
        >
            {show && (
                <AnchorOverlay
                    placement={position}
                    anchorEl={inputRef}
                    onBackgroundClick={handleMouseOut}
                    onBackgroundMouseMove={handleMouseOut}
                >
                    <div className="tooltip">
                        <T>{content}</T>
                    </div>
                </AnchorOverlay>
            )}

            {children}
        </span>
    );
};

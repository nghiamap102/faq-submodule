import { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useI18n } from 'components/bases/I18n/useI18n';
import { AnchorOverlay, AnchorOverlayProps } from 'components/bases/Modal';

import './Tooltip2.scss';

export type TriggerType = 'hover' | 'click'

export type Tooltip2Props = {
    tooltip?: ReactNode,
    className?: string,
    hideArrow?: boolean,
    trigger?: TriggerType[]
    triggerEl: HTMLElement | null
    tooltipEl?: HTMLElement | null
} & Pick<AnchorOverlayProps, 'placement'>

export const Tooltip2: FC<Tooltip2Props> = props =>
{
    const { triggerEl, tooltipEl, tooltip, placement = 'bottom', className, hideArrow, trigger = ['hover'] } = props;
    const { t } = useI18n();

    const triggerType = useRef<TriggerType>();
    const [visible, setVisible] = useState(false);

    useLayoutEffect(() =>
    {
        if (!triggerEl)
        {
            return;
        }

        if (trigger.includes('hover'))
        {
            triggerEl.addEventListener('mouseenter', handleEnter);
            triggerEl.addEventListener('mouseleave', handleLeave);
        }

        return () =>
        {
            triggerEl.removeEventListener('mouseenter', handleEnter);
            triggerEl.removeEventListener('mouseleave', handleLeave);
        };
    }, [triggerEl]);

    useLayoutEffect(() =>
    {
        trigger.includes('click') && triggerEl && triggerEl.addEventListener('click', handleClick);

        return () => triggerEl?.removeEventListener('click', handleClick);
    }, [visible]);

    const handleEnter = () =>
    {
        triggerType.current = 'hover';
        setVisible(true);
    };

    const handleLeave = () =>
    {
        triggerType.current = undefined;
        setVisible(false);
    };

    const handleClick = () =>
    {
        triggerType.current = 'click';
        setVisible(!visible);
    };

    return (
        (visible && !!tooltip)
            ? (
                    <AnchorOverlay
                        className={clsx('tooltip-v2-container', !hideArrow && 'show-arrow', className)}
                        anchorEl={{ current: tooltipEl || triggerEl }}
                        placement={placement}
                        backdrop={triggerType.current === 'click'}
                        {...(triggerType.current === 'click' && { onBackgroundClick: () =>
                        {
                            triggerType.current = undefined;
                            setVisible(false);
                        } })}
                    >
                        <div className='tooltip-wrapper'>{typeof tooltip === 'string' ? t(tooltip) : tooltip}</div>
                    </AnchorOverlay>
                )
            : <></>
    );
};

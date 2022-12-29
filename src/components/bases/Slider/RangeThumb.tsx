import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';

import './RangeThumb.scss';

export type RangeThumbProps = {
    value: number
    rangeSize: string
    style?: React.CSSProperties
    disabled?: boolean
    size?: string
    color?: string
    className?: string
    custom?: React.ReactNode
    isShowIndicator?: boolean
    displayMap?: Record<number, React.ReactNode>
    isVertical?: boolean
    setShowIndicator: (showIndicator: boolean) => void
    children?: any
}

export const RangeThumb = (props: RangeThumbProps): JSX.Element =>
{
    const {
        className,
        value,
        size = '14px',
        color,
        style,
        rangeSize,
        disabled,
        custom,
        displayMap,
        isShowIndicator,
        setShowIndicator,
        isVertical,
        children,
    } = props;

    const rangeSizeNumb = parseInt(rangeSize, 10);
    const sizeNumb = (parseInt(size, 10));

    const thumbOffsetX = sizeNumb > rangeSizeNumb ? ((sizeNumb - rangeSizeNumb) / 2) + 'px' : '0px';
    const customOffsetX = sizeNumb > rangeSizeNumb ? ((sizeNumb - rangeSizeNumb) / 2) + 'px' : '0px';
    const thumbRef = useRef<HTMLDivElement>(null);
    const hasMouseOutListener = useRef(false);

    useEffect(() =>
    {
        thumbRef.current?.addEventListener('mouseover', handleMouseOver);
        thumbRef.current?.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('mousedown', handleMouseDown, true);
        document.addEventListener('mouseup', handleMouseUp, true);
        
        return () =>
        {
            thumbRef.current?.removeEventListener('mouseover', handleMouseOver);
            thumbRef.current?.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('mousedown', handleMouseDown, true);
            document.removeEventListener('mouseup', handleMouseUp, true);
        };
    }, []);

    const handleMouseOver = () => setShowIndicator(true);

    const handleMouseOut = () =>
    {
        setShowIndicator(false);
        hasMouseOutListener.current === true;
    };

    const handleMouseDown = (e: MouseEvent) =>
    {
        if ((e.target as Element)?.closest('.slider__range-thumb') === thumbRef.current)
        {
            thumbRef.current?.removeEventListener('mouseout', handleMouseOut);
            hasMouseOutListener.current === false;
        }
    };

    const handleMouseUp = () =>
    {
        if (!hasMouseOutListener.current)
        {
            setShowIndicator(false);
            thumbRef.current?.addEventListener('mouseout', handleMouseOut);
        }
    };
    

    const getDisplayValue = (position: number) =>
    {
        if (displayMap)
        {
            const nearestKey = Object.keys(displayMap).reduce((acc, val) =>
            {
                return Math.abs(parseFloat(val) - position) < Math.abs(acc - position) ? parseFloat(val) : acc;
            }, 0);

            return displayMap[nearestKey];
        }
    };


    return (
        <>
            <div
                ref={thumbRef}
                className={clsx('slider__range-thumb', className, disabled && 'disabled')}
                style={style}
            >
                {
                    custom
                        ? custom
                        : (
                                <div
                                    style={{
                                        width: size,
                                        height: size,
                                        ...color && { border: `2px solid ${disabled ? 'gray' : color}` },
                                        borderRadius: '50%',
                                        background: 'white',
                                    }}
                                />
                            )
                }
                {children}
            </div>
            <div
                className={clsx('slider__thumb-indicator', isShowIndicator && 'show')}
                style={{
                    ...style,
                    left: isVertical ? '1rem' : value + '%',
                    bottom: isVertical ? value + '%' : '',
                    transform: isVertical ? `translate(${custom ? customOffsetX : thumbOffsetX}, ${value - 2 < 0 ? Math.abs(value - 2) : value - 2}%` : `translate(-${value - 2 < 0 ? Math.abs(value - 2) : value - 2}%, ${custom ? customOffsetX : thumbOffsetX})`,
                }}
            >
                <div className="slider__indicator-text">
                    {getDisplayValue(value)}
                </div>
            </div>
        </>
    );
};


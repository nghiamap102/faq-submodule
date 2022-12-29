import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { Col2 } from 'components/bases/Layout/Column';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { useWindowSize } from 'hooks/useWindowSize';

import './CollapsibleContainer.scss';

const SPEED_PER_SECOND = 0.5;
const levels = [100, 65, 50, 0]; // percents of height
const timeout = 10; // timeout to move down

interface ICollapsibleContainer {
    className?: string;
    isCollapsible: boolean;
    defaultLevel?: number;
    onCollapse?: (level: number) => void;
    isScrollbar?: boolean;
    children?: any;
    width?: string;
    left?: string;
    top?: string;
    bottom?: string;
    isToolbar?: boolean;
}

export const CollapsibleContainer = (props: ICollapsibleContainer) =>
{
    const { className, isCollapsible = true, children, defaultLevel = 0, onCollapse, isScrollbar = true, width, left, bottom, top, isToolbar } = props;

    const [originalWidth, originalHeight] = useWindowSize();
    const [size, setSize] = useState((originalHeight * levels[defaultLevel]) / 100);
    const [pointDown, setPointDown] = useState(false);
    const [active, setActive] = useState(false);
    const [level, setLevel] = useState(-1);
    const [mobileDisplay, setMobileDisplay] = useState<boolean>(originalWidth < 576);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const prevSizeRef = useRef<number>(size);
    const holdTimeStartRef = useRef<number>(0);
    const downLevelRef = useRef(true);
    const startRef = useRef<number>(0);

    useLayoutEffect(() =>
    {
        if (originalWidth < 576 && !mobileDisplay)
        {
            setMobileDisplay(mobileDisplay);
        }
        else if (originalWidth >= 576 && mobileDisplay)
        {
            setMobileDisplay(!mobileDisplay);
        }
    }, [originalWidth]);

    useLayoutEffect(() =>
    {
        setSize(originalHeight * levels[defaultLevel] / 100);
    }, [originalHeight]);

    useLayoutEffect(() =>
    {
        if (level >= 0)
        {
            onCollapse && onCollapse(level);
        }
    }, [level]);

    useLayoutEffect(() =>
    {
        if (size !== (originalHeight * levels[defaultLevel]) / 100)
        {
            setSize((originalHeight * levels[defaultLevel]) / 100);
            setLevel(defaultLevel);
        }
    }, [defaultLevel]);

    useLayoutEffect(() =>
    {
        if (containerRef.current)
        {
            if (containerRef.current.style.height !== `${size}px`)
            {
                containerRef.current.style.height = `${size}px`;
            }

            if (size === originalHeight)
            {
                handleScroll(true);
                containerRef.current.style.borderRadius = 'unset';
                return;
            }
            else if (containerRef.current.style.borderRadius !== '')
            {
                containerRef.current.style.borderRadius = '';
            }

            handleScroll(false);
        }
    }, [size]);

    useLayoutEffect(() =>
    {
        return () =>
        {
            if (timeoutRef.current)
            {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleActive = (bool: boolean) =>
    {
        if (bool)
        {
            setTimeout(() => setActive(bool), 290);
            return;
        }

        setActive(bool);
    };

    const handleStartMove = (e: React.PointerEvent<HTMLDivElement>) =>
    {
        setPointDown(true);
        startRef.current = e.clientY;
        prevSizeRef.current = size;
        holdTimeStartRef.current = new Date().getTime();
    };

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) =>
    {
        const delta = e.clientY - startRef.current;
        if (size === originalHeight)
        {
            startRef.current = e.clientY;

            if (delta < 0)
            {
                if (prevSizeRef.current !== size)
                {
                    prevSizeRef.current = size;
                }

                return;
            }
        }

        const curSize = Math.round(prevSizeRef.current - delta);
        if (curSize > originalHeight)
        {
            if (size !== originalHeight)
            {
                setSize(originalHeight);
            }

            return;
        }

        if ((delta > 0 && !downLevelRef.current) || delta === 0)
        {
            return;
        }

        setSize(curSize);
    };

    const handleEndMove = (e: React.PointerEvent<HTMLDivElement>) =>
    {
        setPointDown(false);
        if (!downLevelRef.current)
        {
            return;
        }

        const delta = e.clientY - startRef.current;
        const holdTime = new Date().getTime() - holdTimeStartRef.current;
        const speed = Math.abs(delta / holdTime);

        if (speed > SPEED_PER_SECOND)
        {
            const curPer = delta > 0 ? levels[levels.length - 1] : levels[0];
            const level = levels.indexOf(curPer);
            setLevel(level);
            setSize((originalHeight * curPer) / 100);
            return;
        }

        const closestPer = levels.reduce((prev, cur) => (Math.abs((originalHeight * prev) / 100 - size) > Math.abs((originalHeight * cur) / 100 - size) ? cur : prev));
        const level = levels.indexOf(closestPer);
        setLevel(level);
        setSize((originalHeight * closestPer) / 100);
    };

    const onScroll = (element: HTMLElement) =>
    {
        if (element.scrollTop === 0)
        {
            if (!downLevelRef.current)
            {
                setTimeout(() => downLevelRef.current = true, timeout);
            }

            return;
        }

        if (downLevelRef.current)
        {
            downLevelRef.current = false;
        }
    };

    const handleScroll = (bool: boolean) =>
    {
        if (!scrollRef.current)
        {
            return;
        }

        if (!bool)
        {
            if (scrollRef.current.style.flex !== 'none')
            {
                scrollRef.current.style.flex = 'none';
            }
            return;
        }

        if (scrollRef.current.style.flex !== '1 1 0%')
        {
            if (timeoutRef.current)
            {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() =>
            {
                if (scrollRef.current)
                {
                    scrollRef.current.style.flex = '1';
                }
            }, 300);
        }
    };

    const content = () =>
    {
        handleActive(true);
        return (
            <>
                <Col2 className="collapsible__body">
                    {mobileDisplay
                        ? (
                                <>
                                    {isCollapsible && (
                                        <div className="mb-dragger">
                                            <div className="mb-dragger__inner" />
                                        </div>
                                    )}

                                    {isScrollbar
                                        ? (
                                                <ScrollView
                                                    containerRef={(ref) => (scrollRef.current = ref)}
                                                    options={{ suppressScrollX: true }}
                                                    className="collapsible__body--scroll"
                                                    onScrollY={onScroll}
                                                >
                                                    {active && children}
                                                </ScrollView>
                                            )
                                        : (
                                                <>{active && children}</>
                                            )}

                                </>
                            )
                        : (
                                isScrollbar ? <ScrollView>{active && children}</ScrollView> : <>{active && children}</>
                            )}
                </Col2>
            </>
        );
    };

    const renderContent = useMemo(() => content(), [children, isCollapsible, active]);

    const classes = clsx(
        'collapsible-container',
        isCollapsible && !pointDown && 'collapsible-active',
        className,
        isToolbar && 'collapsible-toolbar',
    );

    return (
        <div
            ref={containerRef}
            className={classes}
            style={{
                ...(width && { width }),
                ...(left && { left }),
                ...(bottom && { paddingBottom: bottom }),
                maxWidth: left ? `calc(100% - ${left}) ` : '100%',
                maxHeight: top ? `calc(100% - ${top}) ` : '100%',

            }}
            {...(isCollapsible
                ? {
                        onPointerDown: handleStartMove,
                        onPointerMove: handleMove,
                        onPointerUp: handleEndMove,
                    }
                : {})}

        >
            {renderContent}
        </div>
    );
};

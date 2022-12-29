import React, { ReactNode, useLayoutEffect, useRef, useState, ForwardedRef, forwardRef } from 'react';

import './ResizableSinglePanel.scss';

export type ResizableSinglePanelProps = {
    type?: 'horizontal' | 'vertical';
    children: ReactNode[];
    minSizes?: number[];
    className?: string;
    height?: string;
    width?: string;
    resizable?: boolean | { index: number, resizable: boolean }[];
    onResize?: (sizes: { width: number, height: number }[]) => void,
    onResizeEnd?: (sizes: { width: number, height: number }[]) => void,
    defaultSizes?: (string | number | null)[];
}

export const ResizableSinglePanel = forwardRef((props: ResizableSinglePanelProps, ref: ForwardedRef<HTMLDivElement>) =>
{
    const {
        type = 'horizontal',
        resizable = true,
        defaultSizes = Array(props.children.length).fill(`${100 / props.children.length}%`),
        onResize,
        onResizeEnd,
    } = props;

    const resizeRef = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const loadedRef = useRef<Boolean>(true);
    const resizeObRef = useRef<NodeJS.Timeout>();
    const deltaStart = useRef<number>(0);
    const sizes = useRef<number[]>([]);
    const draggingIndex = useRef<number | null>(null);
    const minSizes = useRef<number[]>([]);

    const [outsideResize, setOutsideResize] = useState<boolean>(true);
    const [prevSizes, setPrevSizes] = useState<number[]>([]);

    const clientSize = type === 'horizontal' ? 'clientWidth' : 'clientHeight';
    const direction = type === 'horizontal' ? 'clientX' : 'clientY';
    const classType = type === 'horizontal' ? 'resizable-h' : 'resizable-v';
    const minType = type === 'horizontal' ? 'minWidth' : 'minHeight';
    const sizeType = type === 'horizontal' ? 'width' : 'height';

    useLayoutEffect(() =>
    {
        // Check previous and current minSizes because of multi rendering
        if (resizeRef.current && JSON.stringify(minSizes.current) !== JSON.stringify(props.minSizes))
        {
            const newMinSizes: number[] = [];
            const childrenList = Array.from(resizeRef.current.children) as HTMLElement[];
            childrenList.map((child, index) =>
            {
                if (index % 2 !== 0)
                {
                    return;
                }

                const style = window.getComputedStyle(child);
                let padding = 0;
                if (sizeType === 'width')
                {
                    const left = style.paddingLeft.includes('rem') ? convertRemToPx(style.paddingLeft) : convertStringToNumber(style.paddingLeft);
                    const right = style.paddingRight.includes('rem') ? convertRemToPx(style.paddingRight) : convertStringToNumber(style.paddingRight);
                    padding = left + right;
                }
    
                if (sizeType === 'height')
                {
                    const top = style.paddingTop.includes('rem') ? convertRemToPx(style.paddingTop) : convertStringToNumber(style.paddingTop);
                    const bottom = style.paddingBottom.includes('rem') ? convertRemToPx(style.paddingBottom) : convertStringToNumber(style.paddingBottom);
                    padding = top + bottom;
                }

                const minSize = Math.max(props.minSizes?.[index / 2] || 0, padding);
                newMinSizes[index / 2] = minSize;
                child.style[minType] = `${minSize}px`;
            });

            minSizes.current = newMinSizes;
        }
    }, [props.minSizes]);

    useLayoutEffect(() =>
    {
        if (resizeRef.current)
        {
            const childrenList = Array.from(resizeRef.current.children) as HTMLElement[];
            const initSizes: number[] = [];
            childrenList.map((child, index) =>
            {
                if (index % 2 === 0)
                {
                    if (defaultSizes.length)
                    {
                        const defaultSize = defaultSizes[index / 2];
                        if (defaultSize)
                        {
                            if (typeof defaultSize === 'number')
                            {
                                child.style[sizeType] = `${defaultSize}px`;
                            }
                            else if (typeof defaultSize === 'string')
                            {
                                child.style[sizeType] = defaultSize;
                            }

                            child.style.flex = '0 auto';
                        }
                        else
                        {
                            child.style.flex = '1 auto';
                        }
                    }
                    else
                    {
                        child.style.flex = '1 auto';
                    }

                    initSizes.push(child[clientSize]);
                }
                return child;
            });

            sizes.current = initSizes;
            setPrevSizes(initSizes);
        }
    }, [resizeRef]);

    useLayoutEffect(() =>
    {
        if (!resizeRef.current)
        {
            return;
        }

        const childrenList = Array.from(resizeRef.current.children) as HTMLElement[];
        const resize = new ResizeObserver(() =>
        {
            resizeObRef.current && clearTimeout(resizeObRef.current);
            resizeObRef.current = setTimeout(() =>
            {
                const resizableIndex = childrenList.length - 1 - childrenList.slice().reverse().findIndex((child, index) =>
                    index % 2 === 0 && child[clientSize] >= prevSizes.slice().reverse()[index / 2] && child[clientSize] >= Math.round(+child.style[sizeType].replace(/[^0-9.]/g, '')),
                );

                if (childrenList[resizableIndex]?.style.flex === '1 1 auto')
                {
                    return;
                }

                childrenList.map((child, index) =>
                {
                    if (index % 2 === 0)
                    {
                        child.style.flex = index === resizableIndex ? '1 auto' : '0 auto';
                    }
                    return child;
                });

                const newPrevSizes = sizes.current.map((sizes, index) => childrenList[index * 2][clientSize]);
                (JSON.stringify(newPrevSizes) !== JSON.stringify(prevSizes)) && setPrevSizes(newPrevSizes);
            }, 10);

            if (onResize)
            {
                const newSizes: { width: number, height: number }[] = [];
                childrenList.forEach((child, index) => index % 2 === 0 && newSizes.push({ width: child.clientWidth, height: child.clientHeight }));
                onResize(newSizes);
            }
        });

        try
        {
            prevSizes.length && outsideResize && sizes.current.length && childrenList.forEach((ele, index) => index % 2 === 0 && resize.observe(ele));
        }
        catch (error)
        {
            console.log(error);
        }

        return () => resize.disconnect();
    }, [outsideResize, prevSizes]);

    const resizeChild = () =>
    {
        if (resizeRef.current && !loadedRef.current && sizes.current.length)
        {
            if (timeoutRef.current)
            {
                clearTimeout(timeoutRef.current);
            }

            const childrenList = Array.from(resizeRef.current.children) as HTMLElement[];
            timeoutRef.current = setTimeout(() =>
            {
                if (!resizeRef.current)
                {
                    return;
                }

                childrenList.map((child, index) =>
                {
                    if (index % 2 === 0)
                    {
                        child.style[sizeType] = `${sizes.current[index / 2]}px`;
                        child.style.flex = '0 auto';
                    }
                    return child;
                });
            }, 0);

            if (onResize)
            {
                const fullSizes: { width: number, height: number }[] = [];
                childrenList.map((child, index) => index % 2 === 0 && fullSizes.push({ width: child.clientWidth, height: child.clientHeight }));
                onResize(fullSizes);
            }

            return;
        }

        if (sizes.current.length)
        {
            loadedRef.current = false;
        }
    };

    const convertStringToNumber = (value: string) => +value.replace(/[^0-9.]/g, '');

    const convertRemToPx = (value: string) => convertStringToNumber(value) * parseFloat(getComputedStyle(document.documentElement).fontSize);

    const dragStartHandler = (e: React.PointerEvent<HTMLDivElement>, index: number) =>
    {
        if (!resizeRef.current || !resizable)
        {
            return;
        }

        if (typeof resizable === 'object')
        {
            const data = resizable.find(data => data.index === index);
            if (data && !data.resizable)
            {
                return;
            }
        }

        const children = Array.from(resizeRef.current.children).filter((child, index) => index % 2 === 0) as HTMLElement[];
        children.map(child => child.style.transition = 'unset');

        const newSizes = children.map(child => child[clientSize]);
        loadedRef.current = true;
        setOutsideResize(false);
        sizes.current = newSizes;
        deltaStart.current = e[direction] - newSizes[index];
        draggingIndex.current = index;
        window.addEventListener('pointerup', dragEndHandler);
        window.addEventListener('pointermove', dragHandler);
    };

    const dragHandler = (e: PointerEvent) =>
    {
        const index = draggingIndex.current;
        if (index === null)
        {
            return;
        }

        e.preventDefault();
        if (e[direction] <= 0)
        {
            return;
        }

        const newSizes = [...sizes.current];
        const delta = (e[direction] - newSizes[index]) - deltaStart.current;

        if (Math.abs((newSizes[index] - (newSizes[index] + delta))) > 1)
        {
            if (delta < 0)
            {
                let n = index;
                while (n >= 0)
                {
                    newSizes[n] += delta;
                    newSizes[index + 1] -= delta;
                    const prevPx = newSizes[n];
                    const min = minSizes.current[n] || 0;
                    if (prevPx + delta <= min)
                    {
                        newSizes[n] = min;
                        newSizes[index + 1] += prevPx - min;
                        n--;
                        continue;
                    }
                    deltaStart.current = e[direction] - newSizes[index];
                    break;
                }
            }

            if (delta > 0)
            {
                let n = index;
                while (n < newSizes.length - 1)
                {
                    newSizes[index] += delta;
                    newSizes[n + 1] -= delta;

                    const pxNextStart = newSizes[n + 1];
                    const min = minSizes.current[n + 1] || 0;

                    if (newSizes[n + 1] <= min)
                    {
                        newSizes[n + 1] = min;
                        newSizes[index] += pxNextStart - min;
                        n++;
                        continue;
                    }
                    break;
                }
            }

            sizes.current = newSizes;
            resizeChild();
        }
    };

    const dragEndHandler = () =>
    {
        draggingIndex.current = null;
        window.removeEventListener('pointerup', dragEndHandler);
        window.removeEventListener('pointermove', dragHandler);
        setOutsideResize(true);
        setPrevSizes(sizes.current);

        if (!resizeRef.current)
        {
            return;
        }

        const children = Array.from(resizeRef.current.children).filter((child, index) => index % 2 === 0) as HTMLElement[];
        children.forEach(child => child.style.transition = '');

        if (onResizeEnd)
        {
            const fullSizes: { width: number, height: number }[] = [];
            children.map(child => fullSizes.push({ width: child.clientWidth, height: child.clientHeight }));
            onResizeEnd(fullSizes);
        }
    };

    const renderChild = (reactNode: any, index: number) =>
    {
        const child = { ...reactNode };
        child.props = { ...child.props, flex: 0 };

        return (
            <React.Fragment key={'resizable-children ' + index}>
                {child}
                {index < props.children.length - 1 && props.children[index + 1] &&
                (
                    <div
                        className={'draggable'}
                        onPointerDown={(event) => dragStartHandler(event, index)}
                    >
                        <div
                            tabIndex={1}
                            className='line'
                        />
                    </div>
                )}
            </React.Fragment>
        );
    };

    return (
        <div
            ref={elm =>
            {
                !!ref && (isCallBackRef(ref) ? ref(elm) : ref.current = elm);
                resizeRef.current = elm;
            }}
            className={`${props.className} resizable-container ${classType}`}
        >
            {props.children.map((reactNode, index) => renderChild(reactNode, index))}
        </div>
    );
});

ResizableSinglePanel.displayName = 'ResizableSinglePanel';

const isCallBackRef = (ref: Exclude<ForwardedRef<HTMLDivElement>, null>): ref is (instance: HTMLDivElement | null) => void => !('current' in ref);

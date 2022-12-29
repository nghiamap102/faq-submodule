import {
    Fragment, PointerEvent, ReactNode,
    useRef, useLayoutEffect, useState,
    forwardRef, ForwardedRef,
} from 'react';

import './ResizableMultiPanel.scss';

export type ResizableMultiPanelProps = {
    children: ReactNode[],
    initialSizes?: {
        width?: number | string, // must be number or percent string
        height?: number | string // must be number or percent string
        index?: number
    }[],
    numOfItemPerLine?: number
    resizable?: boolean | ({ direction: 'x' | 'y' | 'both', index: number, resizable: boolean })[]
    onResize?: (sizes: { width: number, height: number }[]) => void,
    onResizeEnd?: (sizes: { width: number, height: number }[]) => void,
}

export const ResizableMultiPanel = forwardRef((props: ResizableMultiPanelProps, ref: ForwardedRef<HTMLDivElement>) =>
{
    const { children, initialSizes, numOfItemPerLine, resizable = true } = props;
    const { onResize, onResizeEnd } = props;

    const resizeRef = useRef<HTMLDivElement | null>(null);
    const dragX = useRef<(HTMLDivElement | null)[]>([]);
    const dragY = useRef<(HTMLDivElement | null)[]>([]);
    const start = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const draggableDirection = useRef<'x' | 'y' | 'both' | null>(null);
    const dragPosition = useRef<{ left: number, top: number }>({ left: 0, top: 0 });
    const draggingIndex = useRef<{ x?: number, y?: number }>({});
    const prevActiveIndex = useRef<{ x: number, y: number }>({ x: -1, y: -1 });
    const sizes = useRef<{ width: number, height: number }[]>([]);
    const [autoReposition, setAutoReposition] = useState<boolean>(false);

    const numOfItemPerRow = numOfItemPerLine || ((children.length === 1 || children.length === 2) ? children.length : Math.ceil(Math.sqrt(children.length)));
    const virtualGroup: number[] = Array(Math.ceil(children.length / numOfItemPerRow)).fill(1);
    
    useLayoutEffect(() =>
    {
        autoReposition && handlePosition();
    });

    useLayoutEffect(() =>
    {
        if (!resizeRef.current || dragX.current.length === 0 || dragY.current.length === 0)
        {
            return;
        }

        const width = resizeRef.current.clientWidth;
        const height = resizeRef.current.clientHeight;
        const ratioX = dragX.current.map(el =>
        {
            if (!el)
            {
                return;
            }

            return getPosition(el, 'top') / height;
        });

        const ratioY = dragY.current.map(el =>
        {
            if (!el)
            {
                return;
            }
    
            return getPosition(el, 'left') / width;
        });

        const resize = new ResizeObserver(entries =>
        {
            const rect = entries[0].contentRect;
            dragX.current.map((el, index) =>
            {
                const ratio = ratioX[index];
                if (!el || !ratio)
                {
                    return;
                }

                el.style.top = `${rect.height * ratio}px`;
            });

            dragY.current.map((el, index) =>
            {
                const ratio = ratioY[index];
                if (!el || !ratio)
                {
                    return;
                }

                el.style.left = `${rect.width * ratio}px`;
            });

            handlePosition();
        });

        autoReposition && resize.observe(resizeRef.current);

        return () => resize.disconnect();
    }, [resizeRef, autoReposition]);


    useLayoutEffect(() =>
    {
        if (!resizeRef.current)
        {
            setAutoReposition(true);
            return;
        }
        
        const clientWidth = resizeRef.current.clientWidth;
        const clientHeight = resizeRef.current.clientHeight;

        dragX.current.map((el, index) =>
        {
            if (!el)
            {
                return;
            }
            
            el.style.top = `${clientHeight / Math.ceil(children.length / numOfItemPerRow) * (index + 1)}px`;
        });

        dragY.current.map((el, index) =>
        {
            if (!el)
            {
                return;
            }

            el.style.left = `${clientWidth / numOfItemPerRow * (index + 1)}px`;
        });
        
        if (initialSizes && initialSizes.length)
        {
            initialSizes.map((size, index) =>
            {
                if (!size)
                {
                    return;
                }

                const { width, height } = size;
                index = size.index || index;

                if (typeof width === 'number')
                {
                    const yIndex = index % numOfItemPerRow;
                    const el = dragY.current[yIndex];
                    const prevEl = dragY.current[yIndex - 1];
                    const prevLeft = prevEl ? getPosition(prevEl, 'left') : 0;
                    handleInitialSize(index, el, width, prevLeft, clientWidth, 'left');
                }

                if (typeof height === 'number')
                {
                    const xIndex = Math.floor(index / numOfItemPerRow);
                    const el = dragX.current[xIndex];
                    const prevEl = dragX.current[xIndex - 1];
                    const prevTop = prevEl ? getPosition(prevEl, 'top') : 0;
                    handleInitialSize(index, el, height, prevTop, clientHeight, 'top');
                }
            });

        }

        handlePosition();
        setAutoReposition(true);
    }, [dragX, dragY]);

    const handleInitialSize = (index: number, el: HTMLDivElement | null, initialSize: number | string, prevPosition: number, clientSize: number, position: 'left' | 'top') =>
    {
        if (!el)
        {
            return;
        }
        if (typeof initialSize === 'string')
        {
            const sizeByPercent = +initialSize.replace(/[^0-9.]/g, '') / 100 * clientSize;
            el.style[position] = `${prevPosition + sizeByPercent}px`;
            return;
        }

        el.style[position] = `${prevPosition + initialSize}px`;
    };

    const handleDraggingPosition = (x: number, y: number) =>
    {
        if (dragX.current.length === 0 && dragY.current.length === 0)
        {
            return;
        }

        const xIndex = dragX.current.findIndex(el =>
        {
            if (!el)
            {
                return;
            }

            const rect = el.children[0].getBoundingClientRect();
            return y >= rect.top && y <= rect.bottom;
        });

        const yIndex = dragY.current.findIndex(el =>
        {
            if (!el)
            {
                return;
            }
                
            const rect = el.children[0].getBoundingClientRect();
            return x >= rect.left && x <= rect.right;
        });

        prevActiveIndex.current.x >= 0 &&
            prevActiveIndex.current.x !== xIndex &&
            dragX.current[prevActiveIndex.current.x]?.classList.remove('dragging', 'multi-dragging');

        prevActiveIndex.current.y >= 0 &&
            prevActiveIndex.current.y !== yIndex &&
            dragY.current[prevActiveIndex.current.y]?.classList.remove('dragging', 'multi-dragging');

        if (yIndex >= 0 && xIndex >= 0)
        {
            draggableDirection.current = 'both';
            dragX.current[xIndex]?.classList.add('dragging', 'multi-dragging');
            dragY.current[yIndex]?.classList.add('dragging', 'multi-dragging');
        }
        else if (xIndex >= 0)
        {
            draggableDirection.current = 'x';
            dragX.current[xIndex]?.classList.add('dragging');
            dragX.current[xIndex]?.classList.remove('multi-dragging');
            dragY.current[yIndex]?.classList.remove('dragging', 'multi-dragging');
        }
        else if (yIndex >= 0)
        {
            draggableDirection.current = 'y';
            dragX.current[xIndex]?.classList.remove('dragging',' multi-dragging');
            dragY.current[yIndex]?.classList.remove('multi-dragging');
            dragY.current[yIndex]?.classList.add('dragging');
        }
        else
        {
            draggableDirection.current = null;
            dragX.current.find(xEl => xEl?.classList.value?.includes('dragging'))?.classList.remove('dragging', 'multi-dragging');
            dragY.current.find(yEl => yEl?.classList.value?.includes('dragging'))?.classList.remove('dragging', 'multi-dragging');
        }

        prevActiveIndex.current = { x: xIndex, y: yIndex };
        
        return { x: xIndex, y: yIndex };
    };

    const handleStart = (event: PointerEvent<HTMLDivElement>) =>
    {
        const indexes = handleDraggingPosition(event.clientX, event.clientY);
        if (!indexes || !resizable)
        {
            return;
        }

        const xEl = dragX.current[indexes.x];
        const yEl = dragY.current[indexes.y];
        if (!xEl && !yEl)
        {
            return;
        }

        draggingIndex.current = {
            x: indexes.x,
            y: indexes.y,
        };

        start.current = {
            x: event.clientY,
            y: event.clientX,
        };

        dragPosition.current = {
            left: yEl ? getPosition(yEl, 'left') : 0,
            top: xEl ? getPosition(xEl, 'top') : 0,
        };

        setAutoReposition(false);
        window.addEventListener('pointerup', handleEnd);
        window.addEventListener('pointermove', handleMove);
    };

    const handleMove = (event: globalThis.PointerEvent) =>
    {
        const xIndex = draggingIndex.current.x;
        const yIndex = draggingIndex.current.y;
        if (typeof xIndex === 'undefined' || typeof yIndex === 'undefined' || !resizable)
        {
            return;
        }
        const hasX = typeof xIndex === 'number' && xIndex >= 0;
        const hasY = typeof yIndex === 'number' && yIndex >= 0;
        const xEl = hasX && dragX.current[xIndex];
        const yEl = hasY && dragY.current[yIndex];
        const direction = draggableDirection.current;

        if (!resizeRef.current || !direction)
        {
            return;
        }

        let isResizableX = true;
        let isResizableY = true;

        typeof resizable === 'object' && resizable.map(data =>
        {
            if ((data.direction === 'x' || data.direction === 'both') && data.index === xIndex && !data.resizable)
            {
                isResizableX = false;
            }

            if ((data.direction === 'y' || data.direction === 'both') && data.index === yIndex && !data.resizable)
            {
                isResizableY = false;
            }
        });

        if ((direction === 'x' || direction === 'both') && xEl && isResizableX)
        {
            const deltaX = event.clientY - start.current.x;
            const initTop = dragPosition.current.top;
            const prevXEl = dragX.current[xIndex - 1];
            const nextXEl = dragX.current[xIndex + 1];
            const prevTop = prevXEl ? getPosition(prevXEl, 'top') : 0;
            const nextTop = nextXEl ? getPosition(nextXEl, 'top') : resizeRef.current.clientHeight;

            let top = initTop + deltaX;
            if (top < prevTop)
            {
                top = prevTop;
            }
            else if (top > nextTop)
            {
                top = nextTop;
            }
            else if (top === prevTop || top === nextTop)
            {
                return;
            }

            xEl.style.top = `${top}px`;
        }

        if ((direction === 'y' || direction === 'both') && yEl && isResizableY)
        {
            const deltaY = event.clientX - start.current.y;
            const initLeft = dragPosition.current.left;
            const prevYEl = dragY.current[yIndex - 1];
            const nextYEl = dragY.current[yIndex + 1];
            const prevLeft = prevYEl ? +prevYEl.style.left.replace(/[^0-9.]/g, '') : 0;
            const nextLeft = nextYEl ? +nextYEl.style.left.replace(/[^0-9.]/g, '') : resizeRef.current.clientWidth;

            let left = initLeft + deltaY;
            if (left < prevLeft)
            {
                left = prevLeft;
            }
            else if (left > nextLeft)
            {
                left = nextLeft;
            }
            else if (left === prevLeft || left === nextLeft)
            {
                return;
            }

            yEl.style.left = `${left}px`;
        }

        handlePosition(onResize);
    };

    const handleEnd = (event: globalThis.PointerEvent) =>
    {
        draggingIndex.current = {};
        setAutoReposition(true);
        onResizeEnd && onResizeEnd(sizes.current);
        window.removeEventListener('pointerup', handleEnd);
        window.removeEventListener('pointermove', handleMove);
    };

    const getPosition = (el: HTMLDivElement, position: 'top' | 'left' | 'bottom' | 'right') => +el.style[position].replace(/[^0-9.]/g, '');

    const handlePosition = (callBack?: (sizes: { width: number, height: number }[]) => void) =>
    {
        if (!resizeRef.current)
        {
            return;
        }
        const childrenList = Array.from(resizeRef.current.children) as HTMLElement[];
        const clientWidth = resizeRef.current.clientWidth;
        const clientHeight = resizeRef.current.clientHeight;

        const curSizes: { width: number, height: number }[] = [];

        virtualGroup.map((v, rowIndex) =>
        {
            childrenList.slice(rowIndex * numOfItemPerRow, rowIndex * numOfItemPerRow + numOfItemPerRow).map((child, childIndex) =>
            {
                if (child.classList.value.includes('draggable'))
                {
                    return child;
                }

                if (!child.classList.value.includes('resizable-item'))
                {
                    child.classList.add('resizable-item');
                }

                const xEl = dragX.current[rowIndex];
                const yEl = dragY.current[childIndex];
                const prevXEl = dragX.current[rowIndex - 1];
                const prevYEl = dragY.current[childIndex - 1];

                const top = xEl ? getPosition(xEl, 'top') : clientHeight;
                const left = yEl ? getPosition(yEl, 'left') : clientWidth;
                const prevTop = prevXEl ? getPosition(prevXEl, 'top') : 0;
                const prevLeft = prevYEl ? getPosition(prevYEl, 'left') : 0;

                const width = left - prevLeft;
                const height = top - prevTop;

                child.style.top = `${prevTop}px`;
                child.style.left = `${prevLeft}px`;
                child.style.width = `${width}px`;
                child.style.height = `${height}px`;

                curSizes.push({ width, height });
                return child;
            });
        });

        callBack && callBack(curSizes);
        sizes.current = curSizes;
    };

    const renderChild = (reactNode: any, index: number) =>
    {
        const child = { ...reactNode };
        child.props = { ...child.props };

        return (
            <Fragment key={'resizable-children ' + index}>
                {child}
            </Fragment>
        );
    };

    return (
        <div
            ref={elm =>
            {
                !!ref && (isCallBackRef(ref) ? ref(elm) : ref.current = elm);
                resizeRef.current = elm;
            }}
            className='resizable-v2-container'
        >
            {children.map((reactNode, index) => renderChild(reactNode, index))}

            {Array(Math.ceil(children.length / numOfItemPerRow) - 1).fill(1).map((v, index) => (
                <div
                    key={'drag-x-' + index}
                    ref={el => dragX.current[index] = el}
                    className={'draggable x'}
                    onPointerDown={handleStart}
                >
                    <div
                        tabIndex={1}
                        className='line'
                        {...(autoReposition && {
                            onPointerMove: event => handleDraggingPosition(event.clientX, event.clientY),
                            onPointerOut: event => handleDraggingPosition(event.clientX, event.clientY),
                        })}
                    />
                </div>
            ))}

            {Array(numOfItemPerRow - 1).fill(1).map((v, index) => (
                <div
                    key={'drag-y-' + index}
                    ref={el => dragY.current[index] = el}
                    className={'draggable y'}
                    onPointerDown={handleStart}
                >
                    <div
                        tabIndex={1}
                        className='line'
                        {...(autoReposition && {
                            onPointerMove: event => handleDraggingPosition(event.clientX, event.clientY),
                            onPointerOut: event => handleDraggingPosition(event.clientX, event.clientY),
                        })}
                    />
                </div>
            ))}
        </div>
    );
});

const isCallBackRef = (ref: Exclude<ForwardedRef<HTMLDivElement>, null>): ref is (instance: HTMLDivElement | null) => void => !('current' in ref);

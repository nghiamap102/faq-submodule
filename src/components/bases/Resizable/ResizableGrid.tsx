import { FC, MouseEvent, ReactNode, useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { useStateCallback } from 'hooks';
import { createUniqueId } from 'utils/uniqueId';
import './ResizableGrid.scss';

export type GridTemplate = {
    rowStart?: number,
    rowSpan?: number,
    colStart?: number,
    colSpan?: number,
    index?: number
}

export type ResizableGridProps = {
    className?: string,
    lineSizes?: { rows?: number[], columns?: number[] },
    gridTemplates?: GridTemplate[],
    children: ReactNode[],
    numOfItemPerLine: number
    onResize?: (data: { rows: number[], columns: number[] }) => void,
    onResizeEnd?: (data: { rows: number[], columns: number[] }) => void,
}

const uniqueId = createUniqueId();

export const ResizableGrid: FC<ResizableGridProps> = props =>
{
    const {
        className,
        lineSizes,
        numOfItemPerLine,
        children,
        gridTemplates = [],
        onResize,
        onResizeEnd,
    } = props;

    const resizeRef = useRef<HTMLDivElement | null>(null);
    const templateRows = useRef<number[]>([]);
    const templateColumns = useRef<number[]>([]);
    const draggableDirection = useRef<'x' | 'y' | 'both' | null>(null);
    const start = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const dragPosition = useRef<{ left: number, top: number }>({ left: 0, top: 0 });
    const draggingIndex = useRef<{ x?: number, y?: number }>({});
    const prevRatio = useRef<{ x: number[], y: number[] }>({ x: [], y: [] });
    const timeout = useRef<NodeJS.Timeout>();

    const [autoReposition, setAutoReposition] = useStateCallback<boolean>(false);

    const cols = numOfItemPerLine || ((children.length === 1 || children.length === 2) ? children.length : Math.ceil(Math.sqrt(children.length)));

    useLayoutEffect(() =>
    {
        if (!lineSizes)
        {
            return;
        }

        const callBack = () =>
        {
            if (!resizeRef.current)
            {
                return;
            }
    
            let gridTemplateColumns = '';
            let gridTemplateRows = '';
            const colsAsArray = [];
            const rowsAsArray = [];

            let countCol = 0;
            Array(children.length).fill(1).map((item, index) =>
            {
                const template = gridTemplates.find(item => item.index === index) || gridTemplates[index];
                countCol += (template?.colSpan || 1) * (template?.rowSpan || 1);
            });

            const rows = Math.ceil(countCol / cols);

            if (lineSizes?.rows?.length === rows)
            {
                lineSizes.rows.map(size =>
                {
                    rowsAsArray.push(size);
                    gridTemplateRows += `${size}px `;
                });
            }
            else
            {
                const rows = Math.ceil(countCol / cols);
                const rowSize = resizeRef.current.offsetHeight / (rows || 1);
                
                let i = 1;
                while (i <= rows)
                {
                    rowsAsArray.push(rowSize);
                    gridTemplateRows += `${rowSize}px `;
                    i++;
                }
            }

            if (lineSizes?.columns?.length)
            {
                lineSizes.columns.map(size =>
                {
                    colsAsArray.push(size);
                    gridTemplateColumns += `${size}px `;
                });
            }
            else
            {
                const colSize = resizeRef.current.offsetWidth / (cols || 1);

                let i = 1;
                while (i <= cols)
                {
                    colsAsArray.push(colSize);
                    gridTemplateColumns += `${colSize}px `;
                    i++;
                }
            }

            templateColumns.current = colsAsArray;
            templateRows.current = rowsAsArray;

            onResizeEnd && onResizeEnd({
                rows: rowsAsArray,
                columns: colsAsArray,
            });
            
            resizeRef.current.style.gridTemplateColumns = gridTemplateColumns;
            resizeRef.current.style.gridTemplateRows = gridTemplateRows;

            setAutoReposition(true);
        };

        autoReposition ? setAutoReposition(false, callBack) : callBack();
    }, [children.length, JSON.stringify(lineSizes)]);

    useLayoutEffect(() =>
    {
        if (!resizeRef.current)
        {
            return;
        }

        const offsetWidth = resizeRef.current.offsetWidth;
        const offsetHeight = resizeRef.current.offsetHeight;

        const x = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.x:not(.display)`)) as HTMLDivElement[];
        const y = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.y:not(.display)`)) as HTMLDivElement[];

        const ratioX = x.map((el, index) =>
        {
            const size = (templateRows.current.slice(0, index + 1).reduce((prev, cur) => prev += cur) || lineSizes?.rows?.slice(0, index + 1).reduce((prev, cur) => prev += cur) || getPosition(el, 'top')) / offsetHeight;
            const roundedSize = Math.round(Math.floor(size * 10000) / 10) / 1000;
            return Math.abs(roundedSize - (prevRatio.current.x[index] || 0)) > 0.01 ? roundedSize : prevRatio.current.x[index];
        });

        const ratioY = y.map((el, index) =>
        {
            const size = getPosition(el, 'left') / offsetWidth;
            const roundedSize = Math.round(Math.floor(size * 10000) / 10) / 1000;
            return Math.abs(roundedSize - (prevRatio.current.y[index] || 0)) > 0.01 ? roundedSize : prevRatio.current.y[index];
        });

        prevRatio.current = { x: ratioX, y: ratioY };

        const resize = new ResizeObserver(entries =>
        {
            const rect = entries[0].contentRect;
            let isSame = x.length > 0 || y.length > 0;

            if (!lineSizes?.rows || resizeRef.current?.offsetHeight !== lineSizes.rows.reduce((prev, cur) => prev += cur, 0))
            {
                x.map((el, index) =>
                {
                    const ratio = ratioX[index];
                    if (!el || !ratio)
                    {
                        return;
                    }
    
                    const prevTop = getPosition(el, 'top');
                    const curTop = Math.round(rect.height * ratio * 1000) / 1000;
    
                    if (Math.abs(prevTop - curTop) > 0.5)
                    {
                        el.style.top = `${curTop}px`;
                        isSame = false;
                    }
                });
            }

            if (!lineSizes?.columns || resizeRef.current?.offsetWidth !== lineSizes.columns.reduce((prev, cur) => prev += cur, 0))
            {
                y.map((el, index) =>
                {
                    const ratio = ratioY[index];
                    if (!el || !ratio)
                    {
                        return;
                    }
    
                    const prevLeft = getPosition(el, 'left');
                    const curLeft = Math.round(rect.width * ratio * 1000) / 1000;
                    if (Math.abs(prevLeft - curLeft) > 0.5)
                    {
                        el.style.left = `${curLeft}px`;
                        isSame = false;
                    }
                });
            }

            if (isSame)
            {
                handleSizes();
                return;
            }

            handleSizes();

            timeout.current && clearTimeout(timeout.current);
            timeout.current = setTimeout(() => onResizeEnd && onResizeEnd({
                rows: templateRows.current,
                columns: templateColumns.current,
            }), 100);
        });

        autoReposition && resize.observe(resizeRef.current);

        return () => resize.disconnect();
    }, [autoReposition]);

    useLayoutEffect(() =>
    {
        if (!resizeRef.current)
        {
            return;
        }

        const childList = Array.from(resizeRef.current.children) as HTMLElement[];
        childList.length = children.length;

        childList.map((child, childIndex) =>
        {
            const template = gridTemplates.find(t => t.index === childIndex) || gridTemplates[childIndex];
            child.style.gridArea = template ? `${template.rowStart} / ${template.colStart} / span ${template.rowSpan} / span ${template.colSpan}` : 'unset';
        });

    }, [JSON.stringify(gridTemplates)]);

    const handleDraggingPosition = (x: number, y: number, isOut = false) =>
    {
        const xLine = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.x:not(.display)`)) as HTMLDivElement[];
        const yLine = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.y:not(.display)`)) as HTMLDivElement[];

        if (!resizeRef.current || xLine.length === 0 && yLine.length === 0)
        {
            return;
        }

        if (isOut)
        {
            const dragged = Array.from(document.querySelectorAll('.dragging')) as HTMLElement[];
            dragged.map(el => el.classList.remove('dragging', 'multi-dragging'));
            return;
        }

        const xIndex = xLine.findIndex(el =>
        {
            if (!el)
            {
                return;
            }

            const rect = el.children[0].getBoundingClientRect();
            return y >= rect.top && y <= rect.bottom;
        });

        const yIndex = yLine.findIndex(el =>
        {
            if (!el)
            {
                return;
            }
                
            const rect = el.children[0].getBoundingClientRect();
            return x >= rect.left && x <= rect.right;
        });

        const xList = Array.from(document.querySelectorAll('.draggable.x.display')) as HTMLElement[];
        const yList = Array.from(document.querySelectorAll('.draggable.y.display')) as HTMLElement[];

        const xDisplayIndexes = xList.filter(el =>
        {
            if (!el)
            {
                return;
            }

            const rect = el.children[0].getBoundingClientRect();
            return y >= rect.top && y <= rect.bottom;
        }).map(el => xList.indexOf(el));

        const yDisplayIndexes = yList.filter(el =>
        {
            if (!el)
            {
                return;
            }
                
            const rect = el.children[0].getBoundingClientRect();
            return x >= rect.left && x <= rect.right;
        }).map(el => yList.indexOf(el));

        if (yDisplayIndexes.length > 0 && xDisplayIndexes.length > 0)
        {
            draggableDirection.current = 'both';
            xIndex !== -1 && xDisplayIndexes.map(index =>
            {
                const el = xList[index];
                !el.classList?.value?.includes('dragging') && el.classList.add('dragging');
                !el.classList?.value?.includes('multi-dragging') && el.classList.add('multi-dragging');
            });
            yIndex !== -1 && yDisplayIndexes.map(index =>
            {
                const el = yList[index];
                !el.classList?.value?.includes('dragging') && el.classList.add('dragging');
                !el.classList?.value?.includes('multi-dragging') && el.classList.add('multi-dragging');
            });
        }
        else if (xDisplayIndexes.length > 0)
        {
            draggableDirection.current = 'x';
            xIndex !== -1 && xDisplayIndexes.map(index =>
            {
                const el = xList[index];
                !el.classList?.value?.includes('dragging') && el.classList.add('dragging');
            });
            yList.map(el => el.classList.remove('dragging', 'multi-dragging'));
        }
        else if (yDisplayIndexes.length > 0)
        {
            draggableDirection.current = 'y';
            xList.map(el => el.classList.remove('dragging', 'multi-dragging'));
            yIndex !== -1 && yDisplayIndexes.map(index =>
            {
                const el = yList[index];
                el.classList.remove('multi-dragging');
                !el.classList?.value?.includes('dragging') && el.classList.add('dragging');
            });
        }
        else
        {
            draggableDirection.current = null;
            xList.map(el => el.classList.remove('dragging', 'multi-dragging'));
            yList.map(el => el.classList.remove('dragging', 'multi-dragging'));
        }

        return { x: xDisplayIndexes.length > 0 ? xIndex : -1, y: yDisplayIndexes.length > 0 ? yIndex : -1 };
    };

    const handleStart = (event: MouseEvent<HTMLDivElement>) =>
    {
        const x = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.x:not(.display)`)) as HTMLDivElement[];
        const y = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.y:not(.display)`)) as HTMLDivElement[];

        const indexes = handleDraggingPosition(event.clientX, event.clientY);
        if (!indexes)
        {
            return;
        }

        const xEl = x[indexes.x];
        const yEl = y[indexes.y];
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
        const x = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.x:not(.display)`)) as HTMLDivElement[];
        const y = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.y:not(.display)`)) as HTMLDivElement[];

        const xIndex = draggingIndex.current.x;
        const yIndex = draggingIndex.current.y;
        if (typeof xIndex === 'undefined' || typeof yIndex === 'undefined')
        {
            return;
        }

        const hasX = typeof xIndex === 'number' && xIndex >= 0;
        const hasY = typeof yIndex === 'number' && yIndex >= 0;
        const xEl = hasX && x[xIndex];
        const yEl = hasY && y[yIndex];
        const direction = draggableDirection.current;

        if (!resizeRef.current || !direction)
        {
            return;
        }

        if ((direction === 'x' || direction === 'both') && xEl)
        {
            const deltaX = event.clientY - start.current.x;
            const initTop = dragPosition.current.top;
            const prevXEl = x[xIndex - 1];
            const nextXEl = x[xIndex + 1];
            const prevTop = prevXEl ? getPosition(prevXEl, 'top') : 0;
            const nextTop = nextXEl ? getPosition(nextXEl, 'top') : resizeRef.current.offsetHeight;

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

        if ((direction === 'y' || direction === 'both') && yEl)
        {
            const deltaY = event.clientX - start.current.y;
            const initLeft = dragPosition.current.left;
            const prevYEl = y[yIndex - 1];
            const nextYEl = y[yIndex + 1];
            const prevLeft = prevYEl ? +prevYEl.style.left.replace(/[^0-9.]/g, '') : 0;
            const nextLeft = nextYEl ? +nextYEl.style.left.replace(/[^0-9.]/g, '') : resizeRef.current.offsetWidth;

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

        handleSizes();
    };

    const handleEnd = (event: globalThis.PointerEvent) =>
    {
        window.removeEventListener('pointerup', handleEnd);
        window.removeEventListener('pointermove', handleMove);
        draggingIndex.current = {};
        setAutoReposition(true);
        onResizeEnd && onResizeEnd({ rows: templateRows.current, columns: templateColumns.current });
    };

    const handleSizes = () =>
    {
        if (!resizeRef.current)
        {
            return;
        }

        const x = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.x:not(.display)`)) as HTMLDivElement[];
        const y = Array.from(document.querySelectorAll(`#${uniqueId} .draggable.y:not(.display)`)) as HTMLDivElement[];

        const offsetWidth = resizeRef.current.offsetWidth;
        const offsetHeight = resizeRef.current.offsetHeight;

        resizeRef.current.style.gridTemplateRows = getGridTemplate({ list: x, offsetSize: offsetHeight, type: 'row' });
        resizeRef.current.style.gridTemplateColumns = getGridTemplate({ list: y, offsetSize: offsetWidth, type: 'column' });

        templateRows.current = resizeRef.current.style.gridTemplateRows.split(' ').map(size => +size.replace(/[^0-9.]/g, ''));
        templateColumns.current = resizeRef.current.style.gridTemplateColumns.split(' ').map(size => +size.replace(/[^0-9.]/g, ''));

        onResize && onResize({ rows: templateRows.current, columns: templateColumns.current });
    };

    const getGridTemplate = (data: { list: HTMLDivElement[], offsetSize: number, type: 'row' | 'column' }) =>
    {
        const { list, offsetSize, type } = data;
        const position = type === 'row' ? 'top' : 'left';

        let gridTemplate = '';
        list.map((el, index) =>
        {
            const prevEl = list[index - 1];
            const posi = el ? getPosition(el, position) : 0;
            const prevPosi = prevEl ? getPosition(prevEl, position) : 0;
            gridTemplate += `${posi - prevPosi}px `;
        });

        
        const lastEl = list[list.length - 1];
        const lastPosi = lastEl ? getPosition(lastEl, position) : 0;
        
        gridTemplate += `${offsetSize - lastPosi}px`;
        return gridTemplate;
    };

    const getPosition = (el: HTMLDivElement, position: 'top' | 'left' | 'bottom' | 'right') => +el.style[position].replace(/[^0-9.]/g, '');

    const draggableX = Array(templateRows.current.length > 1 ? templateRows.current.length - 1 : 0).fill(1);
    const draggableY = Array(templateColumns.current.length > 1 ? templateColumns.current.length - 1 : 0).fill(1);

    return (
        <div
            ref={resizeRef}
            id={uniqueId}
            className={clsx('resizable-grid', className)}
        >
            {children.map((node: any, index) => (
                <ResizableGridItem
                    key={node.key || `resizable-grid-item-${index}`}
                    onPointerDown={handleStart}
                    {...(autoReposition && {
                        onPointerMove: event => handleDraggingPosition(event.clientX, event.clientY),
                        onPointerOut: event => handleDraggingPosition(event.clientX, event.clientY, true),
                    })}
                >
                    {node}
                </ResizableGridItem>
            ))}

            {draggableX.map((v, index) =>
            {
                const arr = lineSizes?.rows?.slice(0, index + 1);
                const top = arr?.length ? arr.reduce((prev, cur) => prev += cur, 0) : templateRows.current.slice(0, index + 1).reduce((prev, cur) => prev += cur, 0);

                return (
                    <div
                        key={'drag-x-' + index}
                        className={'draggable x'}
                        style={{ top }}
                    >
                        <div className='line' />
                    </div>
                );
            })}

            {draggableY.map((v, index) =>
            {
                const arr = lineSizes?.columns?.slice(0, index + 1);
                const left = arr?.length ? arr.reduce((prev, cur) => prev += cur, 0) : templateColumns.current.slice(0, index + 1).reduce((prev, cur) => prev += cur, 0);

                return (
                    <div
                        key={'drag-y-' + index}
                        className={'draggable y'}
                        style={{ left }}
                    >
                        <div className='line' />
                    </div>
                );
            })}
        </div>
    );
};

type ResizableGridItemProps = {
    onPointerDown: (event: MouseEvent<HTMLDivElement>) => void,
    onPointerMove?: (event: MouseEvent<HTMLDivElement>) => void,
    onPointerOut?: (event: MouseEvent<HTMLDivElement>) => void,
}

const ResizableGridItem: FC<ResizableGridItemProps> = props =>
{
    const { children, onPointerDown, onPointerMove, onPointerOut } = props;

    return (
        <div className='resizable-grid-item'>
            {children}

            <div
                className={'draggable x display'}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerOut={onPointerOut}
            >
                <div className='line' />
            </div>
        

            <div
                className={'draggable y display'}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerOut={onPointerOut}
            >
                <div className='line' />
            </div>
        </div>
    );
};

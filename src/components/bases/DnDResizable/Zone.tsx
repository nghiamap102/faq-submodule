import clsx from 'clsx';
import { FC, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { DND_TYPE } from './DnDResizable';
import { DroppableZonesProps, LineSizesType, GridTemplateType, ZoneType } from './DroppableZones';

export type ZoneDirection = 'left' | 'top' | 'right' | 'bottom' | 'replace'

export type ZoneProps = {
    uniqueId: string,
    data: ZoneType,
    lineSizes: LineSizesType,
    template?: Omit<GridTemplateType, 'index'> & { id: string },
    index: number,
    onDrop: (item: any, zoneId: string, direction: ZoneDirection) => void,
} & Pick<DroppableZonesProps, 'itemDisplay' | 'accept'>

export const Zone: FC<ZoneProps> = props =>
{
    const { accept, template, lineSizes, data, uniqueId, index, onDrop, itemDisplay } = props;
    const dropEl = useRef<HTMLDivElement | null>(null);
    const screenEl = useRef<HTMLDivElement | null>(null);
    const direction = useRef<ZoneDirection>();

    const [{ isOver }, drop] = useDrop({
        accept: [DND_TYPE, ...(accept || [])],
        collect: monitor => ({ isOver: monitor.isOver() }),
        drop: droppedResult =>
        {
            direction.current && onDrop(droppedResult, uniqueId, direction.current);
            return { name: 'Drop Place' };
        },
        hover: (item, monitor) =>
        {
            const position = monitor.getClientOffset();
            if (!dropEl.current || !position || !screenEl.current || !template)
            {
                return;
            }

            const { x, y } = position;
            const { top, left, bottom, right, width, height } = dropEl.current.getBoundingClientRect();
            const onePartX = width / 3;
            const onePartY = height / 3;

            if (x <= left + onePartX && x >= left)
            {
                const { colStart, colSpan } = template;
                const cols = lineSizes.columns;
                const index = colStart - 1;
                const size = cols[index] / (colSpan === 1 ? 2 : 1);

                // left
                direction.current = 'left';
                screenEl.current.style.width = `${size}px`;
                screenEl.current.style.height = `${height}px`;
                screenEl.current.style.top = '0';
                screenEl.current.style.left = '0';
            }
            else if (x >= left + width - onePartX && x <= right)
            {
                const { colStart, colSpan } = template;
                const cols = lineSizes.columns.slice();
                const total = cols.slice(colStart - 1, colStart + colSpan - 1).reduce((result, next) => result += next);
                const index = colStart + colSpan - 2;
                const size = cols[index] / (colSpan === 1 ? 2 : 1);

                // right
                direction.current = 'right';
                screenEl.current.style.width = `${size}px`;
                screenEl.current.style.height = `${height}px`;
                screenEl.current.style.top = '0';
                screenEl.current.style.left = `${total - size}px`;
            }
            else if (y <= top + onePartY && y >= top)
            {
                const { rowStart, rowSpan } = template;
                const rows = lineSizes.rows;
                const index = rowStart - 1;
                const size = rows[index] / (rowSpan === 1 ? 2 : 1);

                // top
                direction.current = 'top';
                screenEl.current.style.width = `${width}px`;
                screenEl.current.style.height = `${size}px`;
                screenEl.current.style.top = '0';
                screenEl.current.style.left = '0';
            }
            else if (y >= top + height - onePartY && y <= bottom)
            {
                const { rowStart, rowSpan } = template;
                const rows = lineSizes.rows;
                const total = rows.slice(rowStart - 1, rowStart + rowSpan - 1).reduce((result, next) => result += next);
                const index = rowStart + rowSpan - 2;
                const size = rows[index] / (rowSpan === 1 ? 2 : 1);

                // bottom
                direction.current = 'bottom';
                screenEl.current.style.width = `${width}px`;
                screenEl.current.style.height = `${size}px`;
                screenEl.current.style.top = `${total - size}px`;
                screenEl.current.style.left = '0';
            }
            else
            {
                // replace
                direction.current = 'replace';
                screenEl.current.style.width = `${width}px`;
                screenEl.current.style.height = `${height}px`;
                screenEl.current.style.top = '0';
                screenEl.current.style.left = '0';
            }
        },
    });

    return (
        <div
            ref={node =>
            {
                drop(node);
                dropEl.current = node;
            }}
            id={uniqueId}
            className='zone'
        >
            {itemDisplay ? itemDisplay(data.value, index) : data.value}

            <div
                ref={screenEl}
                className={clsx('screen', isOver && 'over')}
            />
        </div>
    );
};

import { FC, ReactElement, useEffect, useRef, useState } from 'react';

import { Zone, ZoneDirection } from './Zone';

import { ResizableGrid } from 'components/bases/Resizable/ResizableGrid';
import { createUniqueId } from 'utils/uniqueId';

export type LineSizesType = { rows: number[], columns: number[] }

export type GridTemplateType = {
    rowStart: number,
    rowSpan: number,
    colStart: number,
    colSpan: number,
    index: number,
}

export type DroppableZonesProps = {
    accept?: string[],
    data?: any[],
    numOfItemPerLine?: number,
    itemDisplay?: (item: any, index: number) => ReactElement,
    onLayoutChange?: (sizes: { rows: number[], columns: number[] }, templates: GridTemplateType[], items: any[]) => void,
    onDataChange?: (data: any[]) => void,
}

export type ZoneType = {
    value: any,
    key: string,
}

export const DroppableZones: FC<DroppableZonesProps> = props =>
{
    const { accept, data, itemDisplay, onLayoutChange, onDataChange } = props;

    const [zones, setZones] = useState<ZoneType[]>(() =>
    {
        const initData = (Array.isArray(data) && data) ? data : [];
        return initData.map(item => ({ value: item, key: createUniqueId() }));
    });

    const [lineSizes, setLineSizes] = useState<LineSizesType>({ rows: [], columns: [] });

    const gridTemplate = useRef<(Omit<GridTemplateType, 'index'> & { id: string })[]>([{ rowStart: 1, rowSpan: 1, colStart: 1, colSpan: 1, id: zones[0].key }]);
    const numOfItemPerRow = useRef<number>(((zones.length === 1 || zones.length === 2) ? zones.length : Math.ceil(Math.sqrt(zones.length))));

    useEffect(() => onLayoutChange && onLayoutChange(
        lineSizes,
        gridTemplate.current.map(({ id, ...t }) =>({ ...t, index: zones.findIndex(z => z.key === id) })), zones)
    , [lineSizes, zones]);

    useEffect(() =>
    {
        onDataChange && onDataChange(zones);
    }, [zones]);

    const handleDrop = (droppedItem: any, zoneId: string, direction: ZoneDirection) =>
    {
        const zonesClone = JSON.parse(JSON.stringify(zones)) as any[];
        if (direction === 'replace')
        {
            const draggedIndex = zonesClone.findIndex(i => i.key === droppedItem.key);
            const droppedIndex = zonesClone.findIndex(i => i.key === zoneId);
            const droppedPlace = zonesClone[droppedIndex];
            
            const item = draggedIndex >= 0 ? droppedItem as ZoneType : { value: droppedItem, key: createUniqueId() };
            zonesClone.splice(droppedIndex, 1, item);
            draggedIndex >= 0 && zonesClone.splice(draggedIndex, 1, droppedPlace);
            JSON.stringify(zonesClone) !== JSON.stringify(zones) && setZones(zonesClone);
            return;
        }

        const item = { value: droppedItem , key: createUniqueId() };
        const newZones = handleTemplate(zonesClone, item, zoneId, direction);
        setZones(newZones);
    };

    const handleTemplate = (list: any[], item: any, zoneId: string, direction: ZoneDirection) =>
    {
        const dropAtIndex = list.findIndex(z => z.key === zoneId);
        const dropAtTemplateIndex = gridTemplate.current.findIndex(t => t.id === zoneId);
        if (dropAtTemplateIndex === -1 || dropAtIndex === -1)
        {
            return list;
        }

        const { rowStart, rowSpan, colStart, colSpan } = gridTemplate.current[dropAtTemplateIndex];

        if (direction === 'left')
        {
            if (colSpan === 1)
            {
                gridTemplate.current = gridTemplate.current.map(t =>
                {
                    const isPlusStart = t.colStart > colStart || (t.colStart === colStart && t.rowStart === rowStart);
                    if (isPlusStart)
                    {
                        return { ...t, colStart: t.colStart + 1 };
                    }

                    const isPlusSpan = t.colStart === colStart || (t.colStart < colStart && t.colStart + t.colSpan > colStart);
                    if (isPlusSpan)
                    {
                        return { ...t, colSpan: t.colSpan + 1 };
                    }
    
                    return t;
                });

                gridTemplate.current.push({
                    rowStart,
                    rowSpan,
                    colStart,
                    colSpan,
                    id: item.key,
                });

                const newColLineSizes: number[] = [];
                lineSizes.columns.map((size, index) =>
                {
                    if (index === colStart - 1)
                    {
                        const s = size / 2;
                        newColLineSizes.push(s, s);
                        return;
                    }

                    newColLineSizes.push(size);
                });

                setLineSizes(prev => ({ ...prev, columns: newColLineSizes }));
                numOfItemPerRow.current++;
            }

            if (colSpan > 1)
            {
                gridTemplate.current[dropAtTemplateIndex] = {
                    ...gridTemplate.current[dropAtTemplateIndex],
                    colStart: colStart + 1,
                    colSpan: colSpan - 1,
                };

                gridTemplate.current.push({
                    rowStart,
                    rowSpan,
                    colStart,
                    colSpan: 1,
                    id: item.key,
                });
            }
        }

        if (direction === 'right')
        {
            if (colSpan === 1)
            {
                gridTemplate.current = gridTemplate.current.map(t =>
                {
                    const isPlusStart = t.colStart > colStart;
                    if (isPlusStart)
                    {
                        return { ...t, colStart: t.colStart + 1 };
                    }
                    const isPlusSpan = (t.colStart === colStart && t.rowStart !== rowStart) || (t.colStart < colStart && t.colStart + t.colSpan > colStart);
                    if (isPlusSpan)
                    {
                        return { ...t, colSpan: t.colSpan + 1 };
                    }

                    return t;
                });

                gridTemplate.current.push({
                    rowStart,
                    rowSpan,
                    colStart: colStart + 1,
                    colSpan,
                    id: item.key,
                });

                const newColLineSizes: number[] = [];

                lineSizes.columns.map((size, index) =>
                {
                    if (index === colStart - 1)
                    {
                        const s = size / 2;
                        newColLineSizes.push(s, s);
                        return;
                    }

                    newColLineSizes.push(size);
                });

                setLineSizes(prev => ({ ...prev, columns: newColLineSizes }));
                numOfItemPerRow.current++;
            }

            if (colSpan > 1)
            {
                gridTemplate.current[dropAtTemplateIndex] = {
                    ...gridTemplate.current[dropAtTemplateIndex],
                    colSpan: colSpan - 1,
                };

                gridTemplate.current.push({
                    rowStart,
                    rowSpan,
                    colStart: colStart + colSpan - 1,
                    colSpan: 1,
                    id: item.key,
                });
            }
        }

        if (direction === 'top')
        {
            if (rowSpan === 1)
            {
                gridTemplate.current = gridTemplate.current.map(t =>
                {
                    const isPlusStart = t.rowStart > rowStart || (t.rowStart === rowStart && t.colStart === colStart);
                    if (isPlusStart)
                    {
                        return { ...t, rowStart: t.rowStart + 1 };
                    }
                    const isPlusSpan = t.rowStart === rowStart || (t.rowStart < rowStart && t.rowStart + t.rowSpan > rowStart);
                    if (isPlusSpan)
                    {
                        return { ...t, rowSpan: t.rowSpan + 1 };
                    }
        
                    return t;
                });

                gridTemplate.current.push({
                    rowStart,
                    rowSpan,
                    colStart,
                    colSpan,
                    id: item.key,
                });

                const newRowLineSizes: number[] = [];

                lineSizes.rows.map((size, index) =>
                {
                    if (index === rowStart - 1)
                    {
                        const s = size / 2;
                        newRowLineSizes.push(s, s);
                        return;
                    }

                    newRowLineSizes.push(size);
                });

                setLineSizes(prev => ({ ...prev, rows: newRowLineSizes }));
            }

            if (rowSpan > 1)
            {
                gridTemplate.current[dropAtTemplateIndex] = {
                    ...gridTemplate.current[dropAtTemplateIndex],
                    rowStart: rowStart + 1,
                    rowSpan: rowSpan - 1,
                };

                gridTemplate.current.push({
                    rowStart,
                    rowSpan: 1,
                    colStart,
                    colSpan,
                    id: item.key,
                });
            }
        }

        if (direction === 'bottom')
        {
            if (rowSpan === 1)
            {
                gridTemplate.current = gridTemplate.current.map(t =>
                {
                    const isPlusStart = t.rowStart > rowStart;
                    if (isPlusStart)
                    {
                        return { ...t, rowStart: t.rowStart + 1 };
                    }

                    const isPlusSpan = (t.rowStart === rowStart && t.colStart !== colStart) || (t.rowStart < rowStart && t.rowStart + t.rowSpan > rowStart);
                    if (isPlusSpan)
                    {
                        return { ...t, rowSpan: t.rowSpan + 1 };
                    }
        
                    return t;
                });

                gridTemplate.current.push({
                    rowStart: rowStart + 1,
                    rowSpan,
                    colStart,
                    colSpan,
                    id: item.key,
                });

                const newRowLineSizes: number[] = [];

                lineSizes.rows.map((size, index) =>
                {
                    if (index === rowStart - 1)
                    {
                        const s = size / 2;
                        newRowLineSizes.push(s, s);
                        return;
                    }

                    newRowLineSizes.push(size);
                });

                setLineSizes(prev => ({ ...prev, rows: newRowLineSizes }));
            }

            if (rowSpan > 1)
            {
                gridTemplate.current[dropAtTemplateIndex] = {
                    ...gridTemplate.current[dropAtTemplateIndex],
                    rowSpan: rowSpan - 1,
                };

                gridTemplate.current.push({
                    rowStart: rowStart + rowSpan - 1,
                    rowSpan: 1,
                    colStart,
                    colSpan,
                    id: item.key,
                });
            }
        }

        list.push(item);
        return list;
    };

    return (
        <ResizableGrid
            lineSizes={lineSizes}
            numOfItemPerLine={numOfItemPerRow.current}
            gridTemplates={gridTemplate.current.map(({ id, ...t }) => ({ ...t, index: zones.findIndex(z => z.key === id) }))}
            onResizeEnd={sizes => setLineSizes(sizes)}
        >
            {zones.map((item, index) => (
                <Zone
                    key={item.key}
                    index={index}
                    accept={accept}
                    lineSizes={lineSizes}
                    template={gridTemplate.current.find(t => t.id === item.key)}
                    data={item}
                    uniqueId={item.key}
                    itemDisplay={itemDisplay}
                    onDrop={handleDrop}
                />
            ))}
        </ResizableGrid>
    );
};

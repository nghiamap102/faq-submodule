import { FC, useLayoutEffect, useMemo, useRef, MouseEvent } from 'react';
import moment from 'moment';

import { Container } from 'components/bases/Container';
import { Row, Column } from 'components/bases/Layout';

import { createUniqueId } from 'utils/uniqueId';

import './DrawSelection.scss';

const x = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00',
    '24:00',
];
const y = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export type DrawSelectionDataType = ({
    from: string;
    to: string;
})[]

export type DrawSelectionProps = {
    defaultSchedule?: { [key: string]: DrawSelectionDataType }
    numOfItemPerPart?: number
    onSelectEnd?: (details: { [key: string]: DrawSelectionDataType }) => void,
}

export const DrawSelection: FC<DrawSelectionProps> = props =>
{
    const { defaultSchedule, numOfItemPerPart = 1, onSelectEnd } = props;

    const virtualX = x.slice();
    virtualX.length = x.length - 1;

    const height = 2;
    const numOfRow = y.length;

    const uniqueId = useMemo(() => createUniqueId(), []);
    const getDurationAsMinutes = (from: string, to: string) => moment.duration(moment(from, 'HH:mm').diff(moment(to, 'HH:mm'))).asMinutes();

    const isSelecting = useRef<boolean>();
    const startPoint = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    const durationPerPart = getDurationAsMinutes(x[1], x[0]) / numOfItemPerPart;
    
    useLayoutEffect(() =>
    {
        if (!defaultSchedule)
        {
            return;
        }

        const cells = Array.from(document.querySelectorAll(`.cell-item-${uniqueId}`)) as HTMLElement[];

        for (const key in defaultSchedule)
        {
            if (!y.includes(key as typeof y[number]))
            {
                return;
            }

            defaultSchedule[key].map(data =>
            {
                const from = data.from;
                const duration = getDurationAsMinutes(data.to, from);
                const nearest = x.reduce((prev, cur) =>
                {
                    const prevTime = getDurationAsMinutes(from, prev);
                    const curTime = getDurationAsMinutes(from, cur);
                    
                    if (prevTime > 0 && curTime > 0)
                    {
                        return prevTime > curTime ? cur : prev;
                    }

                    return ((prevTime < 0 && curTime > 0) || curTime === 0) ? cur : prev;
                });

                const startAt = getDurationAsMinutes(from, nearest) / durationPerPart;
                const indexOfBigCell = x.indexOf(nearest);
                const indexOfLine = y.indexOf(key as typeof y[number]);

                cells[indexOfBigCell];

                Array(duration / durationPerPart).fill('').map((d, index) =>
                {
                    index += startAt;
                    const bonus = Math.floor(index / numOfItemPerPart);
                    index -= numOfItemPerPart * bonus;
                    index += numOfItemPerPart * indexOfLine;
                    cells[index + (indexOfBigCell + bonus) * numOfItemPerPart * numOfRow].classList.add('selected');
                });
            });
            
        }
    }, []);


    const handleSelect = (curX: number, curY: number) =>
    {
        const startX = Math.min(startPoint.current.x, curX);
        const startY = Math.min(startPoint.current.y, curY);
        const x = Math.max(startPoint.current.x, curX);
        const y = Math.max(startPoint.current.y, curY);

        const cells = Array.from(document.querySelectorAll(`.cell-item-${uniqueId}`)) as HTMLElement[];
        cells.map(cell =>
        {
            const rect = cell.getBoundingClientRect();
            const { top, bottom, left, right } = rect;
            const isPick = right >= startX && bottom >= startY && left <= x && top <= y;
            const selected = !!cell.classList?.value?.includes('selected');
            const unsave = !!cell.classList?.value?.includes('unsave');

            if (!isPick)
            {
                if (unsave)
                {
                    cell.classList.remove('unsave');
                    isSelecting.current ? cell.classList.remove('selected') : cell.classList.add('selected');
                }

                return;
            }

            if (isSelecting.current === undefined)
            {
                isSelecting.current = !selected;
            }

            if (isSelecting.current)
            {
                !selected && cell.classList.add('selected');
                !selected && !unsave && cell.classList.add('unsave');
                return;
            }

            selected && cell.classList.remove('selected');
            selected && !unsave && cell.classList.add('unsave');
        });
    };

    const handleStart = (event: MouseEvent<HTMLDivElement>) =>
    {
        startPoint.current = {
            x: event.clientX,
            y: event.clientY,
        },
        
        handleSelect(event.clientX, event.clientY);
        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleEnd);
    };

    const handleMove = (event: globalThis.PointerEvent) =>
    {
        event.preventDefault();
        handleSelect(event.clientX, event.clientY);
    };
    
    const handleEnd = (event: globalThis.PointerEvent) =>
    {
        event.preventDefault();

        isSelecting.current = undefined;
        const cells = Array.from(document.querySelectorAll(`.cell-item-${uniqueId}`)) as HTMLElement[];
        cells.map(cell => cell.classList?.value?.includes('unsave') && cell.classList.remove('unsave') && cell.classList.add('saved'));
        const data = cells.filter(cell => cell.classList?.value?.includes('selected')).map(cell =>
        {
            const index = cells.indexOf(cell);
            const numOfItemPerBigCell = numOfRow * numOfItemPerPart;
            const xIndex = Math.floor(index / numOfItemPerBigCell);
            const indexInBigCell = index >= numOfItemPerBigCell ? index - numOfItemPerBigCell * xIndex : index;

            return {
                x: x[xIndex],
                y: y[Math.floor(indexInBigCell / numOfItemPerPart)],
                index: indexInBigCell % numOfItemPerPart,
            };
        });

        data.sort((a, b) => y.indexOf(a.y) - y.indexOf(b.y));
        onSelectEnd && onSelectEnd(reformatData(data));

        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleEnd);
    };

    const addDuration = (hour: string, minutes: number) => moment(hour, 'HH:mm').add(moment.duration(minutes, 'minutes')).format('HH:mm');

    const setSchedule = (start: { x: string, index: number }, end: { x: string, index: number }, data: DrawSelectionDataType = []) => (
        [...data, {
            from: addDuration(start.x, start.index * durationPerPart),
            to: addDuration(end.x, end.index * durationPerPart + durationPerPart),
        }]
    );

    const reformatData = (data: { x: string, y: string, index: number }[]) =>
    {
        const formatedData: { [key: string]: DrawSelectionDataType } = {};
        let box: { x: string, index: number }[] = [];
        let day = '';
        data.map((detail, detailIndex) =>
        {
            if (day !== detail.y)
            {
                if (day)
                {
                    const start = box[0];
                    const end = box[box.length - 1];
                    formatedData[day] = setSchedule(start, end, formatedData[day]);
                }
                day = detail.y;
                box = [];
            }

            const prevDetail = box[box.length - 1];
            if (!prevDetail || (prevDetail.x === detail.x && prevDetail.index + 1 === detail.index) || x.indexOf(prevDetail.x) + 1 === x.indexOf(detail.x))
            {
                box.push({ x: detail.x, index: detail.index });
                if (detailIndex === data.length - 1)
                {
                    const start = box[0];
                    const end = box[box.length - 1];
                    formatedData[day] = setSchedule(start, end, formatedData[day]);
                }

                return;
            }

            const start = box[0];
            const end = box[box.length - 1];
            formatedData[day] = setSchedule(start, end, formatedData[day]);
            box = [];
            box.push({ x: detail.x, index: detail.index });
        });

        return formatedData;
    };

    const renderYItem = (data: string) => (
        <Row
            key={data}
            height={`${height}rem`}
            mainAxisAlignment='end'
            crossAxisAlignment='center'
        >
            {data}
        </Row>
    );

    const renderXItem = (data: string) => (
        <Row
            key={data}
            width={`calc(100% / ${virtualX.length})`}
            className='x-item'
            crossAxisAlignment='center'
        >
            {data}
        </Row>
    );

    return (
        <Row
            className='draw-selection-container'
            height={`${height * y.length + height}rem`}
        >
            <Container
                className='y-list'
                width='100px'
                height='100%'
            >
                <Container height={`${height}rem`} />

                {y.map(data => renderYItem(data))}
            </Container>

            <Column clipped={false}>
                <Row
                    className='x-list'
                    height={`${height}rem`}
                    clipped={false}
                >
                    {virtualX.map(data => renderXItem(data))}

                    {renderXItem(x[x.length - 1])}
                </Row>


                <div
                    className='draw-selection'
                    onPointerDown={handleStart}
                >
                    {virtualX.map((data, i) => (
                        <Column
                            key={data}
                            className='big-cell'
                        >
                            {y.map((row, rowIndex) => (
                                <Row
                                    key={row}
                                    className='row'
                                    borderBottom={rowIndex < y.length - 1}
                                >
                                    {Array(numOfItemPerPart).fill('').map((cell, cellIndex) => (
                                        <Row
                                            key={cellIndex}
                                            className={`cell cell-item-${uniqueId}`}
                                            borderRight={cellIndex !== numOfItemPerPart - 1}
                                        />
                                    ))}
                                </Row>
                            ))}
                        </Column>
                    ))}
                </div>
            </Column>
        </Row>
    );
};

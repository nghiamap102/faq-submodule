import './ColumnSelector.scss';

import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ReactSwitch from 'react-switch';
import update from 'immutability-helper';

import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { Row2 } from 'components/bases/Layout/Row';
import { FAIcon } from '@vbd/vicon';
import { Button } from 'components/bases/Button/Button';
import { T } from 'components/bases/Translate/Translate';

const ColumnSelector = ({ columns, setColumns, onClick, className, hideAllColumns, showAllColumns, defaultColumns }) =>
{
    const [items, setItems] = useState(columns || []);

    useEffect(() =>
    {
        setItems(columns);
    }, [columns]);

    const [, drop] = useDrop({ accept: 'column' });

    const cards = items?.map((card, index) => (
        <Card
            key={card.id || index}
            id={`${card.id}`}
            moveCard={moveCard}
            findCard={findCard}
        >
            <Row2
                className={'row'}
                gap={1}
                sx={{ p: 1 }}
            >
                <ReactSwitch
                    checked={!card.hidden}
                    width={28}
                    height={14}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    onChange={() => onClick(card.id)}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                />
                <span className={'text'}>
                    <T>{card.displayAsText || card.display}</T>
                </span>
                <FAIcon
                    icon={'grip-vertical'}
                    type={'solid'}
                    size={'0.75rem'}
                />
            </Row2>
        </Card>
    ));

    return (
        <div
            ref={drop}
            className={'cs-container ' + className}
            onDrop={() => setColumns(items)}
        >
            <ScrollView
                scrollX={false}
                className={'cs-cards'}
            >
                {cards}
            </ScrollView>

            <div className={'cs-buttons'}>
                <Button
                    text={'Ẩn tất cả'}
                    onClick={hideAllColumns}
                />
                <Button
                    text={'Hiện tất cả'}
                    onClick={showAllColumns}
                />
                <Button
                    text={'Mặc định'}
                    onClick={defaultColumns}
                />
            </div>
        </div>
    );

    function moveCard(id, atIndex)
    {
        const { card, index } = findCard(id);
        setItems(update(items, { $splice: [[index, 1], [atIndex, 0, card]] }));
    }

    function findCard(id)
    {
        for (let index = 0; index < items.length; index++)
        {
            if (items[index].id === id)
            {
                return { card: items[index], index };
            }
        }
    }
};

const Card = ({ key, id, moveCard, findCard, children }) =>
{
    const originalIndex = findCard(id).index;

    const [{ isDragging }, drag] = useDrag(
        {
            item: { type: 'column', id, originalIndex },
            collect: (monitor) => ({ isDragging: monitor.isDragging() }),
            end: (dropResult, monitor) =>
            {
                if (!monitor.didDrop())
                {
                    const { id: droppedId, originalIndex } = monitor.getItem();
                    moveCard(droppedId, originalIndex);
                }
            },
        },
    );

    const [, drop] = useDrop(
        {
            accept: 'column',
            canDrop: () => false,
            hover({ id: draggedId })
            {
                if (draggedId !== id)
                {
                    const { index: overIndex } = findCard(id);
                    moveCard(draggedId, overIndex);
                }
            },
        },
    );

    return (
        <div
            key={key}
            ref={(node) => drag(drop(node))}
            style={{ opacity: isDragging ? 0 : 1 }}
        >
            {children}
        </div>
    );
};

export { ColumnSelector };

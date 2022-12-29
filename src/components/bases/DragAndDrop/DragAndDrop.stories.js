import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default {
    title: 'Utilities/DragAndDrop',
    component: DragAndDrop,
    parameters: {},
    argTypes: {}
};

export function Default()
{
    return <DragAndDrop items={ITEMS}/>;
}

function DragAndDrop({ items })
{
    return (
        <DndProvider backend={HTML5Backend}>
            <Container items={items}/>
        </DndProvider>
    );
}

const ItemTypes = {
    COLUMN: 'column'
};

function Card({ id, displayAsText, moveCard, findCard })
{
    const style = {
        border: '1px dashed gray',
        padding: '0.5rem 1rem',
        marginBottom: '.5rem',
        backgroundColor: 'white',
        cursor: 'move'
    };
    const originalIndex = findCard(id).index;
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.COLUMN, id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) =>
        {
            const { id: droppedId, originalIndex } = monitor.getItem();
            const didDrop = monitor.didDrop();
            if (!didDrop)
            {
                moveCard(droppedId, originalIndex);
            }
        }
    });
    const [, drop] = useDrop({
        accept: ItemTypes.COLUMN,
        canDrop: () => false,
        hover({ id: draggedId })
        {
            if (draggedId !== id)
            {
                const { index: overIndex } = findCard(id);
                moveCard(draggedId, overIndex);
            }
        }
    });
    const opacity = isDragging ? 0 : 1;
    return (
        <div
            ref={(node) => drag(drop(node))}
            style={{ ...style, opacity }}
        >
            {displayAsText}
        </div>
    );
}

function Container({ items })
{
    const style = {
        width: 200
    };
    const [cards, setCards] = useState(items);
    const moveCard = (id, atIndex) =>
    {
        const { card, index } = findCard(id);
        setCards(update(cards, {
            $splice: [
                [index, 1],
                [atIndex, 0, card]
            ]
        }));
    };
    const findCard = (id) =>
    {
        const card = cards.filter((c) => `${c.id}` === id)[0];
        return {
            card,
            index: cards.indexOf(card)
        };
    };
    const [, drop] = useDrop({ accept: ItemTypes.COLUMN });
    return (<>
        <div
            ref={drop}
            style={style}
        >
            {cards.map((card) => (
                <Card
                    key={card.id}
                    id={`${card.id}`}
                    displayAsText={card.displayAsText}
                    moveCard={moveCard}
                    findCard={findCard}
                />))}
        </div>
    </>);
}

const ITEMS = [
    {
        id: 1,
        displayAsText: 'Write a cool JS library'
    },
    {
        id: 2,
        displayAsText: 'Make it generic enough'
    },
    {
        id: 3,
        displayAsText: 'Write README'
    },
    {
        id: 4,
        displayAsText: 'Create some examples'
    },
    {
        id: 5,
        displayAsText: 'Spam in Twitter and IRC to promote it'
    },
    {
        id: 6,
        displayAsText: '???'
    },
    {
        id: 7,
        displayAsText: 'PROFIT'
    }
];

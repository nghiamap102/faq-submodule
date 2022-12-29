import { FC, ReactElement } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableItem, DraggableItemProps } from './DraggableItem';
import { DroppableZones, DroppableZonesProps } from './DroppableZones';

import './DnDResizable.scss';

export const DND_TYPE = 'DND_RESIZABLE';

export type DnDResizableProps = {
    children: (data: {
        DraggableItem: FC<DraggableItemProps>,
        DroppableZones: FC<DroppableZonesProps>,
    }) => ReactElement
}

export const DnDResizable: FC<DnDResizableProps> = props =>
{
    const { children } = props;
    
    return (
        <DndProvider backend={HTML5Backend}>
            {children({
                DraggableItem,
                DroppableZones,
            })}
        </DndProvider>
    );
};

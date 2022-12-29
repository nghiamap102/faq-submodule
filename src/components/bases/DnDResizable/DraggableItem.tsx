import { FC } from 'react';
import { useDrag } from 'react-dnd';

import { DND_TYPE } from './DnDResizable';

export type DraggableItemProps = {
    data?: any
}

export const DraggableItem: FC<DraggableItemProps> = props =>
{
    const { data, children } = props;

    const [{ opacity }, drag] = useDrag({
        item: { type: DND_TYPE, data },
        collect: monitor => ({ opacity: monitor.isDragging() ? 0 : 1 }),
    });

    return (
        <div
            ref={drag}
            className='draggable-item'
            style={{ opacity }}
        >
            {children}
        </div>
    );
};

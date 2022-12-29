import { FC, ReactElement } from 'react';
import { DraggableItemProps } from './DraggableItem';
import { DroppableZonesProps } from './DroppableZones';
import './DnDResizable.scss';
export declare const DND_TYPE = "DND_RESIZABLE";
export declare type DnDResizableProps = {
    children: (data: {
        DraggableItem: FC<DraggableItemProps>;
        DroppableZones: FC<DroppableZonesProps>;
    }) => ReactElement;
};
export declare const DnDResizable: FC<DnDResizableProps>;
//# sourceMappingURL=DnDResizable.d.ts.map
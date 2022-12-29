import { FC } from 'react';
import { DroppableZonesProps, LineSizesType, GridTemplateType, ZoneType } from './DroppableZones';
export declare type ZoneDirection = 'left' | 'top' | 'right' | 'bottom' | 'replace';
export declare type ZoneProps = {
    uniqueId: string;
    data: ZoneType;
    lineSizes: LineSizesType;
    template?: Omit<GridTemplateType, 'index'> & {
        id: string;
    };
    index: number;
    onDrop: (item: any, zoneId: string, direction: ZoneDirection) => void;
} & Pick<DroppableZonesProps, 'itemDisplay' | 'accept'>;
export declare const Zone: FC<ZoneProps>;
//# sourceMappingURL=Zone.d.ts.map
import { FC } from 'react';
import './DrawSelection.scss';
export declare type DrawSelectionDataType = ({
    from: string;
    to: string;
})[];
export declare type DrawSelectionProps = {
    defaultSchedule?: {
        [key: string]: DrawSelectionDataType;
    };
    numOfItemPerPart?: number;
    onSelectEnd?: (details: {
        [key: string]: DrawSelectionDataType;
    }) => void;
};
export declare const DrawSelection: FC<DrawSelectionProps>;
//# sourceMappingURL=DrawSelection.d.ts.map
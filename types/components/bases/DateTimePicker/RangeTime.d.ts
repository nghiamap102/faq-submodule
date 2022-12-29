import { Moment } from 'moment';
import './RangeTime.scss';
export declare type RangeTimeProps = {
    inDate?: Moment;
    timeStart?: Moment;
    timeEnd?: Moment;
    onAfterChange?: (moments: Moment[]) => void;
    onChange?: (value: [number, number]) => void;
    timeFormat?: string;
    stepWithType?: number;
    type?: RangeTimeType;
    disabled?: boolean;
};
export declare type RangeTimeType = 'Hours' | 'Minutes' | 'Seconds';
export declare const RangeTime: (props: RangeTimeProps) => JSX.Element;
//# sourceMappingURL=RangeTime.d.ts.map
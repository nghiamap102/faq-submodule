import { Moment } from 'moment';
import './Time.scss';
export declare type TimeProps = {
    className?: string;
    moment: Moment;
    onChange?: (moment: Moment) => void;
    minTime?: Moment;
    maxTime?: Moment;
    hourStep?: number;
    minStep?: number;
};
export declare const Time: (props: TimeProps) => JSX.Element;
//# sourceMappingURL=Time.d.ts.map
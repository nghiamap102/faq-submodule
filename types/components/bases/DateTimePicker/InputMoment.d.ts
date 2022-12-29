import { Moment } from 'moment';
import { TimeProps } from './Time';
import { CalendarProps } from './Calendar';
import './InputMoment.scss';
export declare type InputMomentProps = {
    onTab: (tab: number) => void;
    className?: string;
    moment: Moment | null;
    rangeTime?: [number, number];
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    showTimeRange?: boolean;
    onChange?: (value?: Moment, rangeTime?: [number, number]) => void;
    tab?: number | string;
    disabled?: boolean;
} & Pick<TimeProps, 'minTime' | 'maxTime' | 'minStep' | 'hourStep'> & Pick<CalendarProps, 'minDate' | 'maxDate'>;
export declare const InputMoment: (props: InputMomentProps) => JSX.Element;
//# sourceMappingURL=InputMoment.d.ts.map
import { Moment, MomentInput } from 'moment';
import { MonthPickerProps } from './MonthPicker';
import './Calendar.scss';
export declare type CalendarProps = {
    className?: string;
    value: Moment | null;
    onChange?: (value: Moment) => void;
    onMonthYearChange?: (value: Moment) => void;
    highlightDates?: MomentInput[];
    disabled?: boolean;
} & Pick<MonthPickerProps, 'minDate' | 'maxDate'>;
export declare const Calendar: (props: CalendarProps) => JSX.Element;
//# sourceMappingURL=Calendar.d.ts.map
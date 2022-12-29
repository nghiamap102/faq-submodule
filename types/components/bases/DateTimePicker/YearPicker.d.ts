import { Moment } from 'moment';
import { MonthPickerProps } from './MonthPicker';
import './Calendar.scss';
export declare type YearPickerProps = {
    className?: string;
    value?: Moment;
    onChange?: (value: Moment) => void;
} & Pick<MonthPickerProps, 'minDate' | 'maxDate'>;
export declare const YearPicker: (props: YearPickerProps) => JSX.Element;
//# sourceMappingURL=YearPicker.d.ts.map
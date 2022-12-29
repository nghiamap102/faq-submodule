import { RangeSliderProps } from '../../../components/bases/Slider/Slider';
import './RangeDateTime.scss';
export declare type RangeDateTimeProps = {
    rangeTime?: [number, number];
} & Pick<RangeSliderProps, 'onAfterChange'>;
export declare const RangeDateTime: (props: RangeDateTimeProps) => JSX.Element;
//# sourceMappingURL=RangeDateTime.d.ts.map
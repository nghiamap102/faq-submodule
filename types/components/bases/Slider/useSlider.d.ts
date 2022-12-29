import React, { Ref } from 'react';
import { SliderProps } from './Slider';
import { SliderLabelsProps } from './MarksLabels';
export declare type UseSliderProps = Pick<SliderProps, 'disabled' | 'disableSwap' | 'marks' | 'max' | 'min' | 'onChange' | 'onAfterChange' | 'orientation' | 'step' | 'value' | 'reverse'> & {
    ref: React.Ref<any>;
};
declare type UseSliderReturn<E extends HTMLElement> = {
    axis: string;
    axisProps: Record<string, any>;
    getContainerProps: (otherHandlers?: Record<string, React.EventHandler<any>>) => {
        ref: Ref<E>;
    };
    getHiddenInputProps: (otherHandlers?: Record<string, React.EventHandler<any>>) => any;
    getThumbProps: (otherHandlers?: Record<string, React.EventHandler<any>>) => any;
    values: [number, number] | [number];
    active: number;
    focusVisible: number;
    range: boolean;
    trackOffset: number;
    trackLeap: number;
    marks: SliderLabelsProps['marks'];
};
export declare const useSlider: <E extends HTMLElement = HTMLElement>(props: UseSliderProps) => UseSliderReturn<E>;
export declare const valueToPercent: (value: number, min: number, max: number) => number;
export {};
//# sourceMappingURL=useSlider.d.ts.map
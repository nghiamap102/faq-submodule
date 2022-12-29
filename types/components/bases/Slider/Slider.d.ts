import React, { CSSProperties } from 'react';
import { SliderLabelsProps } from './MarksLabels';
import './Slider.scss';
export declare type SliderProps = RangeSliderProps | SingleSliderProps;
export declare type RangeSliderProps = {
    range: true;
    /**
     * Slider value
     */
    value?: [number] | [number, number];
    /**
     * Callback function that is fired when the slider's value changed.
     *
     * You can pull out the new value by accessing `event.target.value` (any).
     * **Warning**: This is a generic event not a change event.
     */
    onChange?: (value: [number, number]) => void;
    /**
     * Callback function that is fired when the `mouseup` is triggered.
     *
     */
    onAfterChange?: (value: [number, number]) => void;
} & BaseSliderProps;
export declare type SingleSliderProps = {
    range?: false;
    /**
     * Slider value
     */
    value?: number;
    /**
     * Callback function that is fired when the slider's value changed.
     *
     * You can pull out the new value by accessing `event.target.value` (any).
     * **Warning**: This is a generic event not a change event.
     */
    onChange?: (value: number) => void;
    /**
     * Callback function that is fired when the `mouseup` is triggered.
     */
    onAfterChange?: (value: number) => void;
} & BaseSliderProps;
declare type BaseSliderProps = {
    /**
     * Add elements to the left and the right of slider
     */
    wrapper?: {
        left: React.ReactNode;
        right: React.ReactNode;
    };
    /**
     * Custom marks by providing positions and labels.
     */
    marks?: SliderLabelsProps['marks'] | boolean;
    /**
     * If `true`, the component is reversed.
     * @default
     * false
     */
    reverse?: boolean;
    /**
     * If `true`, the component is disabled.
     * @default
     * false
     */
    disabled?: boolean;
    /**
     * Custom style of the slider rail
     */
    railStyle?: CSSProperties;
    /**
     * Custom width and height of thumbs
     * @default
     * 14px
     */
    thumbSize?: string;
    /**
     * Custom color of thumbs
     * @default
     * var(--primary-color)
     */
    thumbColor?: string;
    /**
     * Custom height of the slider range
     * @default
     * 5px
     */
    rangeSize?: string;
    /**
     * Custom color of the slider range
     * @default
     * var(--primary-color)
     */
    rangeColor?: string;
    /**
     * Change style of marks to `dot`, `square`, `line`
     * @default
     * dot
     */
    typeMark?: 'dot' | 'square' | 'line';
    /**
     * The granularity with which the slider can step through values. (A "discrete" slider.)
     * The `min` prop serves as the origin for the valid values.
     * We recommend (max - min) to be evenly divisible by the step.
     *
     * When step is `null`, the thumb can only be slid onto marks provided with the `marks` prop.
     * @default
     * 1
     */
    step?: number | null;
    /**
     * The maximum allowed value of the slider.
     * Should not be equal to min.
     * @default
     * 30
     */
    max?: number;
    /**
     * The minimum allowed value of the slider.
     * Should not be equal to max.
     * @default
     * 0
     */
    min?: number;
    /**
     * Custom thumb
     */
    thumbCustom?: Record<'start' | 'end', string> | React.ReactNode;
    /**
     * If `true`, with `displayMap` prop, the indicator will be displayed on the slider and moved according to the thumbs when dragging it.
     * @default
     * false
     */
    showIndicator?: boolean;
    /**
     * The indicator will be displayed when setting `showIndicator` to be true.
     */
    displayMap?: Record<number, React.ReactNode>;
    /**
     * If `true`, the active thumb doesn't swap when moving pointer over a thumb while dragging another thumb.
     * @default
     * false
     */
    disableSwap?: boolean;
    /**
     * The component orientation
     * @default
     * horizontal
     */
    orientation?: 'vertical' | 'horizontal';
};
export declare type SliderElement = {
    setValueSlider?: React.Dispatch<React.SetStateAction<[number, number]>>;
};
export declare const Slider: React.ForwardRefExoticComponent<SliderProps & React.RefAttributes<SliderElement>>;
export {};
//# sourceMappingURL=Slider.d.ts.map
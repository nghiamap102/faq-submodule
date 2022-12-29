import React, { CSSProperties, forwardRef, useRef, useState } from 'react';
import clsx from 'clsx';

import { Input } from 'components/bases/Input';
import { TB1 } from 'components/bases/Text/Text';

import { Track } from './Track';
import { RangeThumb } from './RangeThumb';
import { SliderMarks, SliderLabelsProps, SliderLabels } from './MarksLabels';
import { Rail } from './Rail';
import { useSlider, valueToPercent } from './useSlider';

import './Slider.scss';

export type SliderProps = RangeSliderProps | SingleSliderProps

export type RangeSliderProps = {
    range: true
    /**
     * Slider value
     */
    value?: [number] | [number, number]
    /**
     * Callback function that is fired when the slider's value changed.
     *
     * You can pull out the new value by accessing `event.target.value` (any).
     * **Warning**: This is a generic event not a change event.
     */
    onChange?: (value: [number, number]) => void
    /**
     * Callback function that is fired when the `mouseup` is triggered.
     *
     */
    onAfterChange?: (value: [number, number]) => void
} & BaseSliderProps

export type SingleSliderProps = {
    range?: false
    /**
     * Slider value
     */
    value?: number
    /**
     * Callback function that is fired when the slider's value changed.
     *
     * You can pull out the new value by accessing `event.target.value` (any).
     * **Warning**: This is a generic event not a change event.
     */
    onChange?: (value: number) => void
    /**
     * Callback function that is fired when the `mouseup` is triggered.
     */
    onAfterChange?: (value: number) => void
} & BaseSliderProps

type BaseSliderProps = {
    /**
     * Add elements to the left and the right of slider
     */
    wrapper?: {
        left: React.ReactNode
        right: React.ReactNode
    }
    /**
     * Custom marks by providing positions and labels.
     */
    marks?: SliderLabelsProps['marks'] | boolean
    /**
     * If `true`, the component is reversed.
     * @default
     * false
     */
    reverse?: boolean
    /**
     * If `true`, the component is disabled.
     * @default
     * false
     */
    disabled?: boolean
    /**
     * Custom style of the slider rail
     */
    railStyle?: CSSProperties
    /**
     * Custom width and height of thumbs
     * @default
     * 14px
     */
    thumbSize?: string
    /**
     * Custom color of thumbs
     * @default
     * var(--v-primary-color)
     */
    thumbColor?: string
    /**
     * Custom height of the slider range
     * @default
     * 5px
     */
    rangeSize?: string
    /**
     * Custom color of the slider range
     * @default
     * var(--v-primary-color)
     */
    rangeColor?: string
    /**
     * Change style of marks to `dot`, `square`, `line`
     * @default
     * dot
     */
    typeMark?: 'dot' | 'square' | 'line'
    /**
     * The granularity with which the slider can step through values. (A "discrete" slider.)
     * The `min` prop serves as the origin for the valid values.
     * We recommend (max - min) to be evenly divisible by the step.
     *
     * When step is `null`, the thumb can only be slid onto marks provided with the `marks` prop.
     * @default
     * 1
     */
    step?: number | null
    /**
     * The maximum allowed value of the slider.
     * Should not be equal to min.
     * @default
     * 30
     */
    max?: number
    /**
     * The minimum allowed value of the slider.
     * Should not be equal to max.
     * @default
     * 0
     */
    min?: number
    /**
     * Custom thumb
     */
    thumbCustom?: Record<'start' | 'end', string> | React.ReactNode
    /**
     * If `true`, with `displayMap` prop, the indicator will be displayed on the slider and moved according to the thumbs when dragging it.
     * @default
     * false
     */
    showIndicator?: boolean
    /**
     * The indicator will be displayed when setting `showIndicator` to be true.
     */
    displayMap?: Record<number, React.ReactNode>
    /**
     * If `true`, the active thumb doesn't swap when moving pointer over a thumb while dragging another thumb.
     * @default
     * false
     */
    disableSwap?: boolean
    /**
     * The component orientation
     * @default
     * horizontal
     */
    orientation?: 'vertical' | 'horizontal'
}

export type SliderElement = { setValueSlider?: React.Dispatch<React.SetStateAction<[number, number]>> }

export const Slider = forwardRef<SliderElement, SliderProps>((props, ref) =>
{
    const {
        min = 0,
        max = 30,
        rangeSize = '5px',
        railStyle,
        typeMark = 'dot',
        orientation = 'horizontal',
        rangeColor = 'var(--v-primary-color)',
        wrapper,
        thumbSize = '14px',
        thumbCustom,
        thumbColor = 'var(--v-primary-color)',
        marks: marksProps,
        reverse,
        disabled,
        showIndicator,
        displayMap,
    } = props;

    const [isShowIndicator, setIsShowIndicator] = useState(false);

    const _setTrackDimensions = useRef<HTMLDivElement>(null);


    const {
        axisProps,
        getContainerProps,
        getHiddenInputProps,
        getThumbProps,
        active,
        axis,
        focusVisible,
        values,
        trackOffset,
        trackLeap,
        marks,
    } = useSlider<HTMLDivElement>({ ...props, ref });

    const hiddenInputProps = getHiddenInputProps();
    const containerProps = getContainerProps();
    const trackStyle = {
        ...axisProps[axis].offset(trackOffset),
        ...axisProps[axis].leap(trackLeap),
    };

    const renderWrapper = (data: React.ReactNode , type: 'left' | 'right') =>
    {
        if (typeof data === 'string' || typeof data === 'number')
        {
            return <TB1 className={`wrapper-${type}`}>{data}</TB1>;
        }

        return data;
    };

    const thumbSizeNumb = parseInt(thumbSize, 10) + 4;
    const isVertical = orientation === 'vertical';
    const containerClasses = clsx(
        'range-slider__container',
        reverse && 'range-slider__container--reverse',
        isVertical && 'range-slider__container--vertical',
        disabled && 'disabled',
    );
       

    return (
        <div
            className={'range-slider__labels-container'}
            style={isVertical ? { height: '100%', display: 'flex' } : undefined}
        >
            <div
                className={containerClasses}
                style={{
                    padding: !isVertical ? `calc((${thumbSize} / 2) + 0.5rem) 0` : 0,
                }}
                {...containerProps}
            >

                {reverse ? wrapper?.right && renderWrapper(wrapper.right, 'left') : wrapper?.left && renderWrapper(wrapper.left, 'right')}

                <div className="range-slider__content">
                    <div style={{
                        width: !isVertical ? '100%' : rangeSize,
                        height: !isVertical ? rangeSize : '100%',
                    }}
                    >
                        <Rail style={railStyle} />
                        <Track
                            trackRef={_setTrackDimensions}
                            style={{ ...trackStyle }}
                            rangeColor={rangeColor}
                            disabled={disabled}
                        />

                        {marks && (
                            <SliderMarks
                                positions={Object.keys(marks).map(mark => parseFloat(mark))}
                                size={rangeSize}
                                type={typeMark}
                                color={rangeColor}
                                disabled={disabled}
                                isMarkStep={marksProps && typeof marksProps === 'boolean'}
                                isVertical={isVertical}
                                reverse={isVertical ? false : reverse}
                            />
                        )}
                    </div>
                    {values?.map((value: number, index: number) =>
                    {
                        const percent = valueToPercent(value, min, max);
                        const style = axisProps[axis].offset(percent);

                        return (
                            <React.Fragment key={index}>
                                <RangeThumb
                                    value={valueToPercent(value, min, max)}
                                    data-index={index}
                                    {...getThumbProps()}
                                    className={clsx({
                                        ['slider__thumb--active']: active === index,
                                        ['slider__thumb--focus-visible']: focusVisible === index,
                                    })}
                                    style={style}
                                    custom={isThumbCustomizedStartToEnd(thumbCustom) ? index === 0 ? thumbCustom.start : thumbCustom.end : thumbCustom}
                                    rangeSize={rangeSize}
                                    disabled={disabled}
                                    size={thumbSize}
                                    color={thumbColor}
                                    isShowIndicator={isShowIndicator}
                                    displayMap={displayMap}
                                    isVertical={isVertical}
                                    setShowIndicator={(isShowIndicator) => showIndicator && !!displayMap && setIsShowIndicator(isShowIndicator)}
                                >
                                    <Input
                                        {...hiddenInputProps}
                                        data-index={index}
                                        value={values[index]}
                                        className={`slider__thumb-input thumb-real-size-${thumbSizeNumb}`}
                                    />
                                </RangeThumb>
                            </React.Fragment>
                        );
                    })}
                </div>

                {reverse ? wrapper?.left && renderWrapper(wrapper.left, 'right') : wrapper?.right && renderWrapper(wrapper.right, 'right')}
            </div>

            {marksProps && (
                <SliderLabels
                    marks={marks}
                    isVertical={isVertical}
                    reverse={isVertical ? false : reverse}
                />
            )}
        </div>
    );
});

const isThumbCustomizedStartToEnd = (thumbCustom: SliderProps['thumbCustom']): thumbCustom is Record<'start' | 'end', string> =>
{
    return typeof thumbCustom === 'object' && !!thumbCustom && 'start' in thumbCustom && 'end' in thumbCustom;
};

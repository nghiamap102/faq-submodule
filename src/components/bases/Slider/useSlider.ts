/* eslint-disable react-hooks/exhaustive-deps */
import React, { Ref, useCallback, useEffect, useState } from 'react';

import { useForkRef } from 'hooks/useForkRef';
import { useIsFocusVisible } from 'hooks/useIsFocusVisible';
import { SliderProps } from './Slider';
import { SliderLabelsProps } from './MarksLabels';

export type UseSliderProps = Pick<SliderProps,
  | 'disabled'
  | 'disableSwap'
  | 'marks'
  | 'max'
  | 'min'
  | 'onChange'
  | 'onAfterChange'
  | 'orientation'
  | 'step'
  | 'value'
  | 'reverse'> & {
  ref: React.Ref<any>;
}

type UseSliderReturn<E extends HTMLElement> = {
    axis: string
    axisProps: Record<string, any>
    getContainerProps: (otherHandlers?: Record<string, React.EventHandler<any>>) => {ref: Ref<E>}
    getHiddenInputProps: (otherHandlers?: Record<string, React.EventHandler<any>>) => any
    getThumbProps: (otherHandlers?: Record<string, React.EventHandler<any>>) => any
    values: [number, number] | [number]
    active: number
    focusVisible: number
    range: boolean
    trackOffset: number
    trackLeap: number
    marks: SliderLabelsProps['marks']
}

export const useSlider = <E extends HTMLElement = HTMLElement>(props: UseSliderProps): UseSliderReturn<E> =>
{
    const {
        ref,
        disableSwap = false,
        disabled = false,
        marks: marksProp = false,
        max = 100,
        min = 0,
        onChange,
        onAfterChange,
        orientation = 'horizontal',
        step = 1,
        value: valueProp,
        reverse,
    } = props;

    const touchId = React.useRef<number>();
    // We can't use the :active browser pseudo-classes.
    // - The active state isn't triggered when clicking on the rail.
    // - The active state isn't transferred when inversing a range slider.
    const [active, setActive] = React.useState(-1);
    const moveCount = React.useRef(0);

    const range = Array.isArray(valueProp);
    const [valueDerived, setValueState] = useState<[number, number] | [number]>(range ? valueProp as [number, number] | [number] : [valueProp as number]);

    let values: [number, number] | [number] = range ? valueDerived.sort(asc) : valueDerived;
    values = values.map((value) => clamp(value, min, max)) as [number, number] | [number];
    let marks: SliderLabelsProps['marks'] = {};

    if (marksProp && typeof marksProp === 'boolean' && step !== null)
    {
        [...Array(Math.floor((max - min) / step) + 1)].map((_, index) =>
        {
            const position = min + step * index;
            marks[position] = '';
        });
    }
    else
    {
        marks = marksProp as SliderLabelsProps['marks'] || {};
    }

    const marksValues: [number] | [number, number] = Object.keys(marks).map(value => parseFloat(value)) as [number] | [number, number];

    const valuesRef = React.useRef<[number, number] | [number]>(values);

    useEffect(() =>
    {
        setValueState(range ? valueProp as [number, number] | [number] : [valueProp as number]);
        valuesRef.current = values;
    }, [valueProp]);

    const handleChange = onChange && ((event: Event | React.SyntheticEvent, value: number | [number] | [number, number], thumbIndex: number) =>
    {
        // Redefine target to allow name and value to be read.
        // This allows seamless integration with the most popular form libraries.
        // Clone the event to not override `target` of the original event.
        const nativeEvent = (event as React.SyntheticEvent).nativeEvent || event;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);

        Object.defineProperty(clonedEvent, 'target', {
            writable: true,
            value: { value },
        });

        onChange(value as number & [number, number]);
    });

    const handleAfterChange = onAfterChange && ((event: Event | React.SyntheticEvent, value: number | [number] | [number, number], thumbIndex: number) =>
    {
        // Redefine target to allow name and value to be read.
        // This allows seamless integration with the most popular form libraries.
        // Clone the event to not override `target` of the original event.
        const nativeEvent = (event as React.SyntheticEvent).nativeEvent || event;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);

        Object.defineProperty(clonedEvent, 'target', {
            writable: true,
            value: { value },
        });

        onAfterChange && onAfterChange(value as number & [number, number]);
    });

    const {
        isFocusVisibleRef,
        onBlur: handleBlurVisible,
        onFocus: handleFocusVisible,
        ref: focusVisibleRef,
    } = useIsFocusVisible<E>();

    const [focusVisible, setFocusVisible] = React.useState(-1);

    const sliderRef = React.useRef<E>(null);
    const handleFocusRef = useForkRef<E>(focusVisibleRef, sliderRef);
    const handleRef = useForkRef<E>(ref, handleFocusRef);

    const createHandleHiddenInputFocus = (otherHandlers: Record<string, React.EventHandler<any>>) => (event: React.FocusEvent) =>
    {
        const index = Number(event.target?.getAttribute('data-index'));

        handleFocusVisible(event);
        if (isFocusVisibleRef.current === true)
        {
            setFocusVisible(index);
        }
        otherHandlers?.onFocus?.(event);
    };
    const createHandleHiddenInputBlur = (otherHandlers: Record<string, React.EventHandler<any>>) => (event: React.FocusEvent) =>
    {
        handleBlurVisible(event);
        if (isFocusVisibleRef.current === false)
        {
            setFocusVisible(-1);
        }
        otherHandlers?.onBlur?.(event);
    };

    useEffect(() =>
    {
        if (disabled && (sliderRef.current as E).contains(document.activeElement))
        {
            // This is necessary because Firefox and Safari will keep focus

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.activeElement?.blur();
        }
    }, [disabled]);

    if (disabled && active !== -1)
    {
        setActive(-1);
    }
    if (disabled && focusVisible !== -1)
    {
        setFocusVisible(-1);
    }

    const previousIndex = React.useRef<number>();
    let axis = orientation;
    if (reverse && orientation === 'horizontal')
    {
        axis += '-reverse';
    }

    const getFingerNewValue = ({
        finger,
        move = false,
        values: values2,
    }: {
        finger: { x: number; y: number };
        move?: boolean;
        values: [number, number] | [number];
    }) =>
    {
        const { current: slider } = sliderRef;
        const { width, height, bottom, left } = (slider as E).getBoundingClientRect();
        let percent, newValue: SliderProps['value'];

        if (axis.indexOf('vertical') === 0)
        {
            percent = (bottom - finger.y) / height;
        }
        else
        {
            percent = (finger.x - left) / width;
        }

        if (axis.indexOf('-reverse') !== -1)
        {
            percent = 1 - percent;
        }

        newValue = percentToValue(percent, min, max);
        if (step)
        {
            newValue = roundValueToStep(newValue, step, min);
        }
        else
        {
            const closestIndex = findClosest(marksValues, newValue);
            newValue = marksValues[closestIndex as number];
        }

        newValue = clamp(newValue, min, max);
        let activeIndex = 0;

        if (range)
        {
            if (!move)
            {
                activeIndex = findClosest(values2, newValue) as number;
            }
            else
            {
                activeIndex = previousIndex.current as number;
            }

            // Bound the new value to the thumb's neighbours.
            if (disableSwap)
            {
                newValue = clamp(
                    newValue,
                    values2[activeIndex - 1] || -Infinity,
                    values2[activeIndex + 1] || Infinity,
                );
            }

            const previousValue = newValue;
            newValue = setValueIndex({
                values: values2,
                newValue,
                index: activeIndex,
            });

            // Potentially swap the index if needed.
            if (!(disableSwap && move))
            {
                activeIndex = newValue.indexOf(previousValue);
                previousIndex.current = activeIndex;
            }
        }

        return { newValue, activeIndex };
    };

    const handleTouchMove = useCallback((nativeEvent: TouchEvent | MouseEvent) =>
    {
        const finger = trackFinger(nativeEvent, touchId);

        if (!finger)
        {
            return;
        }

        moveCount.current += 1;

        // Cancel move in case some other element consumed a mouseup event and it was not fired.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (nativeEvent.type === 'mousemove' && nativeEvent.buttons === 0)
        {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            handleTouchEnd(nativeEvent);
            return;
        }

        const { newValue, activeIndex } = getFingerNewValue({
            finger,
            move: true,
            values: valuesRef.current,
        });

        focusThumb({ sliderRef, activeIndex, setActive });
        setValueState(range ? newValue as [number, number] : [newValue as number]);
        valuesRef.current = range ? newValue as [number, number] : [newValue as number];

        handleChange && handleChange(nativeEvent, newValue, activeIndex);
    }, []);

    const handleTouchEnd = useCallback((nativeEvent: TouchEvent | MouseEvent) =>
    {
        const finger = trackFinger(nativeEvent, touchId);

        if (!finger)
        {
            return;
        }

        setActive(-1);

        touchId.current = undefined;

        const { newValue, activeIndex } = getFingerNewValue({
            finger,
            move: true,
            values: valuesRef.current,
        });

        handleChange && handleChange(nativeEvent, newValue, activeIndex);

        handleAfterChange && handleAfterChange(nativeEvent, newValue, activeIndex);

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        stopListening();
    }, []);

    const handleTouchStart = useCallback((nativeEvent: TouchEvent) =>
    {
        // If touch-action: none; is not supported we need to prevent the scroll manually.
        if (!doesSupportTouchActionNone())
        {
            nativeEvent.preventDefault();
        }

        const touch = nativeEvent.changedTouches[0];
        if (touch !== null)
        {
            // A number that uniquely identifies the current finger in the touch session.
            touchId.current = touch.identifier;
        }
        const finger = trackFinger(nativeEvent, touchId);
        if (finger !== false)
        {
            const { newValue, activeIndex } = getFingerNewValue({ finger, values: valuesRef.current });
            focusThumb({ sliderRef, activeIndex, setActive });

            setValueState(range ? newValue as [number, number] : [newValue as number]);
            valuesRef.current = range ? newValue as [number, number] : [newValue as number];
        }

        moveCount.current = 0;
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, []);

    const stopListening = React.useCallback(() =>
    {
        document.removeEventListener('mousemove', handleTouchMove);
        document.removeEventListener('mouseup', handleTouchEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }, [handleTouchEnd, handleTouchMove]);

    useEffect(() =>
    {
        const { current: slider } = sliderRef;

        !disabled && slider?.addEventListener('touchstart', handleTouchStart, {
            passive: doesSupportTouchActionNone(),
        });

        return () =>
        {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            slider?.removeEventListener('touchstart', handleTouchStart, {
                passive: doesSupportTouchActionNone(),
            });

            stopListening();
        };
    }, [stopListening, handleTouchStart]);

    useEffect(() =>
    {
        if (disabled)
        {
            stopListening();
        }
    }, [disabled, stopListening]);

    const getContainerProps = (otherHandlers?: Record<string, React.EventHandler<any>>) =>
    {
        const ownEventHandlers = !disabled && {
            onMouseDown: createHandleMouseDown(otherHandlers || {}),
        };

        const mergedEventHandlers: Record<string, React.EventHandler<any>> = {
            ...otherHandlers,
            ...ownEventHandlers,
        };
        return {
            ref: handleRef as React.Ref<E>,
            ...mergedEventHandlers,
        };
    };

    const createHandleMouseDown = (otherHandlers: Record<string, React.EventHandler<any>>) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    {
        otherHandlers.onMouseDown?.(event);
        if (event.defaultPrevented)
        {
            return;
        }

        // Only handle left clicks
        if (event.button !== 0)
        {
            return;
        }

        // Avoid text selection
        event.preventDefault();
        const finger = trackFinger(event, touchId);
        if (finger !== false)
        {
            const { newValue, activeIndex } = getFingerNewValue({ finger, values: valuesRef.current });
            focusThumb({ sliderRef, activeIndex, setActive });

            setValueState(range ? newValue as [number, number] : [newValue as number]);
            valuesRef.current = range ? newValue as [number, number] : [newValue as number];
        }

        moveCount.current = 0;
        document.addEventListener('mousemove', handleTouchMove);
        document.addEventListener('mouseup', handleTouchEnd);
    };

    const trackOffset = valueToPercent(range ? valueDerived[0] : min, min, max);
    const trackLeap = valueToPercent(valueDerived[valueDerived.length - 1], min, max) - trackOffset;

    const createHandleMouseOver = (otherHandlers: Record<string, React.EventHandler<any>>) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    {
        otherHandlers.onMouseOver?.(event);
    };

    const createHandleMouseLeave = (otherHandlers: Record<string, React.EventHandler<any>>) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    {
        otherHandlers.onMouseLeave?.(event);
    };

    const getThumbProps = (otherHandlers?: Record<string, React.EventHandler<any>>) =>
    {
        const ownEventHandlers = {
            onMouseOver: createHandleMouseOver(otherHandlers || {}),
            onMouseLeave: createHandleMouseLeave(otherHandlers || {}),
        };

        const mergedEventHandlers: Record<string, React.EventHandler<any>> = {
            ...otherHandlers,
            ...ownEventHandlers,
        };
        return {
            ...mergedEventHandlers,
        };
    };

    const getHiddenInputProps = (otherHandlers?: Record<string, React.EventHandler<any>>) =>
    {
        const ownEventHandlers = {
            onFocus: createHandleHiddenInputFocus(otherHandlers || {}),
            onBlur: createHandleHiddenInputBlur(otherHandlers || {}),
        };

        const mergedEventHandlers: Record<string, React.EventHandler<any>> = {
            ...otherHandlers,
            ...ownEventHandlers,
        };

        return {
            type: 'range',
            min: props.min,
            max: props.max,
            step: props.step as number,
            disabled,
            ...mergedEventHandlers,
        };
    };

    return {
        axis,
        axisProps,
        getContainerProps,
        getHiddenInputProps,
        getThumbProps,
        values: valueDerived,
        active,
        focusVisible,
        range,
        trackOffset,
        trackLeap,
        marks,
    };
};

const asc = (a: number, b: number) => a - b;

const clamp = (value: number, min: number, max: number) =>
{
    if (value === null) { return min;}
    return Math.min(Math.max(min, value), max);
};

const findClosest = (values: number[], currentValue: number) =>
{
    const { index: closestIndex } = values.reduce<{ distance: number; index: number } | null>((acc, value: number, index: number) =>
    {
        const distance = Math.abs(currentValue - value);

        if (acc === null || distance < acc.distance || distance === acc.distance)
        {
            return {
                distance,
                index,
            };
        }

        return acc;
    }, null) ?? {};
    return closestIndex;
};

const trackFinger = (event: TouchEvent | MouseEvent | React.MouseEvent, touchId: React.RefObject<any>) =>
{
    // The event is TouchEvent
    if (touchId.current !== undefined && (event as TouchEvent).changedTouches)
    {
        const touchEvent = event as TouchEvent;
        for (let i = 0; i < touchEvent.changedTouches.length; i += 1)
        {
            const touch = touchEvent.changedTouches[i];
            if (touch.identifier === touchId.current)
            {
                return {
                    x: touch.clientX,
                    y: touch.clientY,
                };
            }
        }

        return false;
    }

    // The event is MouseEvent
    return {
        x: (event as MouseEvent).clientX,
        y: (event as MouseEvent).clientY,
    };
};

export const valueToPercent = (value: number, min: number, max: number): number => ((value - min) * 100) / (max - min);

const percentToValue = (percent: number, min: number, max: number): number => (max - min) * percent + min;

const getDecimalPrecision = (num: number) =>
{
    // This handles the case when num is very small (0.00000001), js will turn this into 1e-8.
    // When num is bigger than 1 or less than -1 it won't get converted to this notation so it's fine.
    if (Math.abs(num) < 1)
    {
        const parts = num.toExponential().split('e-');
        const matissaDecimalPart = parts[0].split('.')[1];
        return (matissaDecimalPart ? matissaDecimalPart.length : 0) + parseInt(parts[1], 10);
    }

    const decimalPart = num.toString().split('.')[1];
    return decimalPart ? decimalPart.length : 0;
};

const roundValueToStep = (value: number, step: number, min: number) =>
{
    const nearest = Math.round((value - min) / step) * step + min;
    return Number(nearest.toFixed(getDecimalPrecision(step)));
};

const setValueIndex = ({
    values,
    newValue,
    index,
}: {
    values: [number, number] | [number];
    newValue: number;
    index: number;
}) =>
{
    const output = values.slice();
    output[index] = newValue;
    return output.sort(asc) as [number, number] | [number];
};

const focusThumb = ({
    sliderRef,
    activeIndex,
    setActive,
}: {
    sliderRef: React.RefObject<any>;
    activeIndex: number;
    setActive?: (num: number) => void;
}) =>
{
    const doc = sliderRef.current || document;
    if (!sliderRef.current?.contains(doc.activeElement) || Number(doc.activeElement?.getAttribute('data-index')) !== activeIndex)
    {
        sliderRef.current?.querySelector(`[type="range"][data-index="${activeIndex}"]`).focus();
    }

    setActive && setActive(activeIndex);
};

const axisProps: Record<string, any> = {
    'horizontal': {
        offset: (percent: number) => ({ left: `${percent}%` }),
        leap: (percent: number) => ({ width: `${percent}%` }),
    },
    'horizontal-reverse': {
        offset: (percent: number) => ({ right: `${percent}%` }),
        leap: (percent: number) => ({ width: `${percent}%` }),
    },
    'vertical': {
        offset: (percent: number) => ({ top: 'unset', bottom: `${percent}%` }),
        leap: (percent: number) => ({ height: `${percent}%` }),
    },
};

let cachedSupportsTouchActionNone: any;
const doesSupportTouchActionNone = () =>
{
    if (cachedSupportsTouchActionNone === undefined)
    {
        if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function')
        {
            cachedSupportsTouchActionNone = CSS.supports('touch-action', 'none');
        }
        else
        {
            cachedSupportsTouchActionNone = true;
        }
    }
    return cachedSupportsTouchActionNone;
};


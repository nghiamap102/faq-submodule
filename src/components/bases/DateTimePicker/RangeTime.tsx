import React, { useState, useEffect, useRef, ReactNode } from 'react';
import moment, { Moment } from 'moment';
import { CommonHelper } from 'helper/common.helper';

import { Slider, SliderElement } from 'components/bases/Slider/Slider';

import './RangeTime.scss';

const MAX_DATE_SECOND = 86400;
const TIME_SPACE = { Seconds: 1, Minutes: 60, Hours: 3600 };

export type RangeTimeProps = {
    inDate?: Moment // string or moment
    timeStart?: Moment // string or moment
    timeEnd?: Moment // string or moment
    onAfterChange?: (moments: Moment[]) => void
    onChange?: (value: [number, number]) => void
    timeFormat?: string
    stepWithType?: number
    type?: RangeTimeType
    disabled?: boolean
}

export type RangeTimeType = 'Hours' | 'Minutes' | 'Seconds'
type TypeConvert = `as${RangeTimeType}`

// Slider Time 24h on date with type Hours, Minutes, Seconds
export const RangeTime = (props: RangeTimeProps): JSX.Element =>
{
    const { inDate, onChange, onAfterChange, disabled } = props;
    const { type = 'Minutes', timeStart = moment().startOf('date'), timeEnd = moment().endOf('date'), timeFormat = 'hh:mm A', stepWithType = 1 } = props;

    const displayMap = useRef<Record<number, ReactNode>>({});
    const sliderRef = useRef<SliderElement>(null);

    const [value, setValue] = useState<[number, number]>();
    const timeSpace = TIME_SPACE[type];
    const MAX = Math.round(MAX_DATE_SECOND / timeSpace);

    const formatRangeTime = (time: Moment) => moment(time, 'HH:mm:ss').format('HH:mm:ss');

    useEffect(()=>
    {
        let start = convertTimeToNumber(formatRangeTime(timeStart), type);
        let end = convertTimeToNumber(formatRangeTime(timeEnd), type);

        if (start === MAX - 1)
        {
            start = MAX;
        }
        if (end === MAX - 1)
        {
            end = MAX;
        }

        if (sliderRef.current)
        {
            sliderRef.current.setValueSlider?.([start, end]);
        }

        setValue([ start, end ]);
    }, [timeStart, timeEnd, MAX, type]);

    useEffect(()=>
    {
        displayMap.current = getDisplayMap();
    }, [type]);


    const convertTimeToNumber = (time: string, type: RangeTimeType) =>
    {
        // type : Hours , Minutes, Seconds
        const typeConvert: TypeConvert = `as${type}`;

        // moment.duration(time).asHours() .asMinutes() .asSeconds()
        return Math.round(moment.duration(time)[typeConvert]());
    };

    const convertNumberToTime = (timeNumb: number) =>
    {
        const timeSpace = TIME_SPACE[type];

        // moment toDay with 0:00:00
        const toDayNumb = moment(moment(inDate).format('LL')).format('X');

        return moment.unix(parseInt(toDayNumb) + (timeNumb * timeSpace));
    };

    const displayTime = (timeNumber: number, typeFormat?: string): string =>
    {
        timeNumber = timeNumber === MAX ? timeNumber - 1 : timeNumber;
        const timeSpace = TIME_SPACE[type];

        // should return time
        return moment.utc(timeNumber * 1000 * timeSpace).format(typeFormat || 'LTS');
    };

    const getDisplayMap = (): Record<number, ReactNode> =>
    {
        const map: Record<number, ReactNode> = {};
        for (let i = 0; i <= 23; i++)
        {
            map[Math.round(i * 4.2)] = moment.utc(i * 3600 * 1000).format('hhA');
        }
        return map;
    };

    const handleChangeValue = (value: [number, number]) =>
    {
        const [start, end ] = value;
        const valueShow = CommonHelper.clone(value);
        if (start === MAX)
        {
            valueShow[0]--;
        }
        if (end === MAX)
        {
            valueShow[1]--;
        }

        setValue(value);

        onChange && onChange(valueShow);
    };

    const handleAfterChange = (value: [number, number]) =>
    {
        let [start, end] = CommonHelper.clone(value) as [number, number];
        if (start === MAX)
        {
            start--;
        }
        if (end === MAX)
        {
            end--;
        }

        const timeStart = convertNumberToTime(start);
        const timeEnd = convertNumberToTime(end);

        onAfterChange && onAfterChange(start < end ? [timeStart, timeEnd] : [timeEnd, timeStart]);
    };

    return (()=>
    {
        if (!value)
        {
            return <></>;
        }

        const [start, end] = value;

        const styleMark = {
            color: disabled ? 'var(--text-dark)' : 'var(--text-light)' ,
            fontSize: '0.75rem',
        };

        return (
            <div className={'range-time-container'}>
                <Slider
                    ref={sliderRef}
                    disabled={disabled}
                    min={0}
                    max={MAX}
                    step={stepWithType}
                    thumbSize={'12px'}
                    rangeSize={'3px'}
                    railStyle={{
                        backgroundColor: 'var(--contrast-highlight)',
                        opacity: 'unset',
                        borderRadius: '4px',
                    }}
                    value={value}
                    displayMap={displayMap.current}
                    marks={{
                        0: {
                            label: displayTime(0, timeFormat),
                            style: styleMark,
                        },
                        100: {
                            label: displayTime(MAX - 1, timeFormat),
                            style: styleMark,
                        },
                    }}
                    range
                    showIndicator
                    onChange={handleChangeValue}
                    onAfterChange={handleAfterChange}
                />
                <div
                    className={'range-time-display'}
                    style={{ ...disabled && { color: 'var(--text-dark)' } }}
                >
                    {
                        (start <= end)
                            ? (
                            `${displayTime(start, timeFormat)} - ${displayTime(end, timeFormat)}`
                                )
                            : (
                            `${displayTime(end, timeFormat)} - ${displayTime(start,timeFormat)}`
                                )
                    }
                </div>
            </div>
        );
    })();
};

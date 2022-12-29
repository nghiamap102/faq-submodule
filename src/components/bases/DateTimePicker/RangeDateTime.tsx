import { ReactNode } from 'react';
import { RangeSliderProps, Slider } from 'components/bases/Slider/Slider';

import './RangeDateTime.scss';

export type RangeDateTimeProps = {
    rangeTime?: [number, number]
} & Pick<RangeSliderProps, 'onAfterChange'>

export const RangeDateTime = (props: RangeDateTimeProps): JSX.Element =>
{
    const { rangeTime = [ 0, 24 ], onAfterChange } = props;

    const startTime: number = (rangeTime && rangeTime.length === 2) ? rangeTime[0] : 0;
    const endTime: number = (rangeTime && rangeTime.length === 2) ? rangeTime[1] : 24;

    const dateDisplay = (time: number) => (time >= 24) ? 'Tomorrow' : (time < 0 ? 'Yesterday' : 'Today');
    const timeDisplay = (time: number) =>
    {
        const adjustedTime = (time > 24) ? time - 24 : (time < 0 ? time + 24 : time);
        if (adjustedTime === 24 || adjustedTime === 0)
        {
            return '12 am';
        }
        if (adjustedTime === 12)
        {
            return '12 pm';
        }
        return (adjustedTime < 12) ? adjustedTime + ' am' : (adjustedTime - 12) + ' pm';
    };

    const displayMap: Record<number, ReactNode> = {};
    for (let i = 0; i <= 40; i++)
    {
        displayMap[i * 2.5] = `${timeDisplay(i - 8)}`;
    }

    return (
        <div className={'range-date-time-container'}>
            <Slider
                max={32}
                min={-8}
                value={rangeTime}
                thumbSize={'12px'}
                rangeSize={'3px'}
                step={1}
                typeMark={'line'}
                displayMap={displayMap}
                range
                showIndicator
                onAfterChange={onAfterChange}
            />
            <div className={'range-date-time-display'}>
                <div>
                    {dateDisplay(startTime)} {timeDisplay(startTime)}
                </div>
                <div>-</div>
                <div>
                    {dateDisplay(endTime)} {timeDisplay(endTime)}
                </div>
            </div>
        </div>
    );
};

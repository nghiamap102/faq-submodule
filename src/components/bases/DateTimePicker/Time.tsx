import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Moment } from 'moment';

import { T } from 'components/bases/Translate/Translate';

import './Time.scss';
import { Slider } from 'components/bases/Slider/Slider';

export type TimeProps = {
    className?: string
    moment: Moment
    onChange?: (moment: Moment) => void
    minTime?: Moment
    maxTime?: Moment
    hourStep?: number
    minStep?: number
}

export const Time = (props: TimeProps): JSX.Element =>
{
    const { moment, onChange, minStep, hourStep, minTime, maxTime, className } = props;

    const [displayMoment, setDisplayMoment] = useState(moment?.clone());
    const displayMomentRef = useRef(moment?.clone());

    useEffect(() =>
    {
        setDisplayMoment(moment.clone());
        displayMomentRef.current = moment.clone();
    }, [moment]);

    const changeHours = (hour: number) =>
    {
        const m = displayMomentRef.current.clone();
        m.hours(hour);
        setDisplayMoment(m);
        displayMomentRef.current = m;
    };

    const changeMinutes = (minute: number) =>
    {
        const m = displayMomentRef.current.clone();
        m.minutes(minute);
        setDisplayMoment(m);
        displayMomentRef.current = m;
    };

    const onDragEnd = () =>
    {
        onChange && onChange(displayMomentRef.current);
    };

    const m = displayMoment;

    const minHour = minTime?.hour() || 0;
    let minMin = 0;
    if (minTime && m.hour() === minHour)
    {
        minMin = minTime.minute();
        if (minMin > m.get('minute'))
        {
            changeMinutes(minMin);
        }
    }

    const maxHour = maxTime?.hour() || 23;
    let maxMin = 59;
    if (maxTime && m.hour() === maxHour)
    {
        maxMin = maxTime.minute();
        if (maxMin < m.get('minute'))
        {
            changeMinutes(maxMin);
        }
    }

    return (
        <div className={clsx('m-time', className)}>
            <div className="showtime">
                <span className="time">{m.format('HH')}</span>
                <span className="separater">:</span>
                <span className="time">{m.format('mm')}</span>
            </div>

            <div className="sliders">
                <div className="time-text"><T>Giờ</T>:</div>
                <Slider
                    min={minHour}
                    max={maxHour}
                    step={hourStep}
                    value={m.hour()}
                    onChange={(x) => changeHours(x)}
                    onAfterChange={onDragEnd}
                />
                <div className="time-text"><T>Phút</T>:</div>
                <Slider
                    min={minMin}
                    max={maxMin}
                    step={minStep}
                    value={m.minute()}
                    onChange={(value) => changeMinutes(value)}
                    onAfterChange={onDragEnd}
                />
            </div>
        </div>
    );
};

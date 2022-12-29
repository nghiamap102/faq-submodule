import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import moment, { Moment } from 'moment';

import { T } from 'components/bases/Translate/Translate';

import { RangeDateTime } from './RangeDateTime';
import { Time, TimeProps } from './Time';
import { Calendar, CalendarProps } from './Calendar';
import { Row2 } from 'components/bases/Layout/Row';
import { Button } from 'components/bases/Button';

import './InputMoment.scss';

export type InputMomentProps = {
    onTab: (tab: number) => void
    className?: string
    moment: Moment | null
    rangeTime?: [number, number]
    showTimeSelect?: boolean
    showTimeSelectOnly?: boolean
    showTimeRange?: boolean
    onChange?: (value?: Moment, rangeTime?: [number, number]) => void
    tab?: number | string
    disabled?: boolean
} & Pick<TimeProps, 'minTime' | 'maxTime' | 'minStep' | 'hourStep'>
  & Pick<CalendarProps, 'minDate' | 'maxDate'>

export const InputMoment = (props: InputMomentProps): JSX.Element =>
{
    const { rangeTime = [0, 24], minStep = 1, hourStep = 1 } = props;

    const { className, moment: m, onTab, onChange, showTimeSelect, showTimeSelectOnly, showTimeRange, disabled, minDate, maxDate, minTime, maxTime, tab } = props;

    const [ rangeTimeLocal, setRangeTimeLocal ] = useState(rangeTime);

    useEffect(() =>
    {
        document.addEventListener('wheel', preventScroll, { capture: true, passive: false });

        return () =>
        {
            document.removeEventListener('wheel', preventScroll, { capture: true });
            onTab(0);
        };
    }, [onTab]);

    const preventScroll = (event: WheelEvent) =>
    {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleClickTab = (e: React.MouseEvent<HTMLButtonElement>, tab: number) =>
    {
        e.preventDefault();
        onTab(tab);
    };

    const handleCalendarChange = (value: Moment) =>
    {
        if (showTimeRange)
        {
            onChange && onChange(value, rangeTime);
        }
        else
        {
            onChange && onChange(value);
        }
    };

    const handleRangeTimeChange = (rangeTime: [number, number]) =>
    {
        if (Array.isArray(rangeTime))
        {
            onChange && m && onChange(m, rangeTime);
            setRangeTimeLocal(rangeTime);
        }
    };

    const handleChooseToday = () =>
    {
        const today = moment();
        onChange && onChange(today);
    };

    const handleClearValue = () =>
    {
        onChange && onChange(null as any);
    };


    const cls = cx('m-input-moment', className);

    return (
        <div className={cls}>
            {
                showTimeSelect && !showTimeSelectOnly && (
                    <div className="options">
                        <button
                            type="button"
                            className={cx('ion-calendar im-btn', { 'active': tab === 0 || tab === 'month' || tab === 'year' })}
                            disabled={disabled}
                            onClick={(e) => handleClickTab(e, 0)}
                        >
                            <T>Ngày</T>
                        </button>
                        <button
                            type="button"
                            className={cx('ion-clock im-btn', { 'active': tab === 1 })}
                            disabled={disabled}
                            onClick={(e) => handleClickTab(e, 1)}
                        >
                            <T>Giờ</T>
                        </button>
                    </div>
                )}
            <div className="tabs">
                {
                    (!showTimeSelectOnly && tab === 0) && (
                        <Calendar
                            className={'tab'}
                            value={m}
                            disabled={disabled}
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={handleCalendarChange}
                        />
                    )}

                {(showTimeSelectOnly || (showTimeSelect && tab === 1)) && (
                    <Time
                        className={'tab'}
                        moment={m || moment(new Date())}
                        minStep={minStep}
                        hourStep={hourStep}
                        minTime={minTime}
                        maxTime={maxTime}
                        onChange={onChange}
                    />
                )}

                { showTimeRange && (
                    <RangeDateTime
                        rangeTime={rangeTimeLocal}
                        onAfterChange={handleRangeTimeChange}
                    />
                )}
            </div>

            {!showTimeRange && !showTimeSelectOnly && tab === 0 && (
                <div className='footer'>
                    <Row2
                        justify='center'
                        gap={2}
                    >
                        <Button
                            color='primary'
                            text='Hôm nay'
                            onClick={handleChooseToday}
                        />
                        <Button
                            color='primary'
                            variant='outline'
                            text='Xoá'
                            onClick={handleClearValue}
                        />
                    </Row2>
                </div>
            )}

        </div>
    );
};

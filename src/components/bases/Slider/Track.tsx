import React from 'react';
import clsx from 'clsx';

import './Track.scss';

export type TrackProps = {
    trackRef: React.Ref<HTMLDivElement>
    className?: string
    style?: React.CSSProperties
    disabled?: boolean
    orientation?: 'vertical' | 'horizontal',
    rangeColor?: string
}

export const Track = (props: TrackProps): JSX.Element =>
{
    const { className, trackRef, style, disabled, orientation = 'horizontal', rangeColor } = props;

    return (
        <div
            ref={trackRef}
            className={clsx(orientation === 'vertical' ? 'track-vertical' : 'track', disabled && 'disabled', className)}
            style={{ ...style, backgroundColor: rangeColor }}
        />
    );
};

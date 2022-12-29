import React from 'react';
import './Track.scss';
export declare type TrackProps = {
    trackRef: React.Ref<HTMLDivElement>;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    orientation?: 'vertical' | 'horizontal';
    rangeColor?: string;
};
export declare const Track: (props: TrackProps) => JSX.Element;
//# sourceMappingURL=Track.d.ts.map
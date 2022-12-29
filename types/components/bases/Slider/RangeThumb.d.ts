import React from 'react';
import './RangeThumb.scss';
export declare type RangeThumbProps = {
    value: number;
    rangeSize: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    size?: string;
    color?: string;
    className?: string;
    custom?: React.ReactNode;
    showIndicator?: boolean;
    displayMap?: Record<number, React.ReactNode>;
    isVertical?: boolean;
    children?: any;
};
export declare const RangeThumb: (props: RangeThumbProps) => JSX.Element;
//# sourceMappingURL=RangeThumb.d.ts.map
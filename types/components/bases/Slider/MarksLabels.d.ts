import React from 'react';
import './MarksLabels.scss';
export declare type SliderMarksProps = {
    positions: number[];
    size?: string;
    onClick?: (position: number) => void;
    type?: 'dot' | 'square' | 'line';
    isMarkStep?: boolean;
    color?: string;
    disabled?: boolean;
    isVertical?: boolean;
    reverse?: boolean;
};
export declare const SliderMarks: (props: SliderMarksProps) => JSX.Element;
declare type SliderMark = {
    label?: string;
    style?: React.CSSProperties;
} | string;
export declare type SliderLabelsProps = {
    marks: Record<number, SliderMark>;
    isVertical?: boolean;
    reverse?: boolean;
};
export declare const SliderLabels: ({ marks, isVertical, reverse }: SliderLabelsProps) => JSX.Element;
export {};
//# sourceMappingURL=MarksLabels.d.ts.map
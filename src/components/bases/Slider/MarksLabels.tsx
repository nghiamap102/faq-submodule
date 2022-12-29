import React from 'react';

import { TB1 } from 'components/bases/Text/Text';

import './MarksLabels.scss';

export type SliderMarksProps = {
    positions: number[]
    size?: string
    onClick?: (position: number) => void
    type?: 'dot' | 'square' | 'line'
    isMarkStep?: boolean
    color?: string
    disabled?: boolean
    isVertical?: boolean
    reverse?: boolean
}

export const SliderMarks = (props: SliderMarksProps): JSX.Element =>
{
    const { positions = [], size, onClick, type = 'dot', isMarkStep, color, disabled, isVertical, reverse } = props;

    return (
        <div className={'slider-mark-container'}>
            <div className={'slider-marks-dot'}>
                { positions.map(position => (
                    <Mark
                        key={'mark-' + position}
                        position={position}
                        size={isMarkStep && type !== 'line' ? `calc(${size} - 3px)` : size}
                        type={type}
                        color={color}
                        disabled={disabled}
                        isMarkStep={isMarkStep}
                        isVertical={isVertical}
                        reverse={reverse}
                        onClick={onClick}
                    />
                ))}
            </div>
        </div>
    );
};

type MarkProps = {
    position: number
} & Omit<SliderMarksProps, 'positions'>

const Mark = ({ position, size, onClick, type = 'dot', isMarkStep, color, disabled, isVertical, reverse }: MarkProps) =>
{
    return (
        <div
            className={'slider-mark'}
            style={{
                left: reverse ? '' : isVertical ? '50%' : position + '%',
                right: reverse ? position + '%' : '',
                bottom: isVertical ? position + '%' : '',
                ...(type !== 'line' && { width: size }),
                height: type === 'line' && size ? isVertical ? '0' : `${(parseInt(size, 10) * 1.5)}px` : size,
                width: type === 'line' && size ? isVertical ? `${(parseInt(size, 10) * 1.5)}px` : '0' : size,
                transform: reverse ? 'translateX(50%)' : isVertical ? 'translate(-50%, 50%)' : 'translateX(-50%)',
                ...(type === 'dot' && { borderRadius: '50%' }),
                ...(type === 'line' && { border: '1px solid #f0f0f0' }),
                ...(isMarkStep && { border: '1px solid #f0f0f0', background: disabled ? 'gray' : color, maxWidth: '5px', maxHeight: '5px' }),
            }}
            {...onClick && { onClick: () => onClick(position) }}
        />
    );
};

type SliderMark = {
    label?: string
    style?: React.CSSProperties
} | string

export type SliderLabelsProps = {
    marks: Record<number, SliderMark>
    isVertical?: boolean
    reverse?: boolean
}
export const SliderLabels = ({ marks = {}, isVertical, reverse }: SliderLabelsProps): JSX.Element =>
{
    return (
        <div className={'slider-mark-label-container'}>
            { Object.entries(marks).map(([key, val]) => (
                <Label
                    key={'dots' + key}
                    position={parseFloat(key)}
                    label={typeof val !== 'string' ? val.label : val}
                    style={typeof val !== 'string' ? val.style : {}}
                    isVertical={isVertical}
                    reverse={reverse}
                />
            ))}
        </div>
    );
};

type LabelProps = {
    position: number
    label?: string
    style?: React.CSSProperties
    isVertical?: boolean
    reverse?: boolean
}

const Label = ({ position, label, style = {}, isVertical, reverse }: LabelProps) =>
{
    return (
        <TB1
            className={'slider-label'}
            style={{
                position: 'absolute',
                left: reverse ? '' : isVertical ? '1rem' : position + '%',
                right: reverse ? position + '%' : '',
                bottom: isVertical ? position + '%' : '',
                transform: reverse ? 'translateX(50%)' : isVertical ? 'translateY(50%)' : 'translateX(-50%)',
                ...style,
            }}
        >
            {label}
        </TB1>
    );
};

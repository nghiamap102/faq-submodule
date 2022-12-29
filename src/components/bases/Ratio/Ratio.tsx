import React, { CSSProperties } from 'react';
import './Ratio.scss';

export type RatioProps = {
    className?: string;
    width: number;
    height: number;
}

interface IRatioVariable extends CSSProperties {
    '--height-ratio': string;
}

export const Ratio: React.FC<RatioProps> = (props) =>
{
    const { width, height, className, children } = props;

    const ratioVariable: IRatioVariable = {
        '--height-ratio': `calc(${height} / ${width} * 100%)`,
    };

    return (
        <div
            className={`ratio ${className || ''}`}
            style={ratioVariable}
        >
            {children}
        </div>
    );
};

import { Container } from "@vbd/vui";
import React, { CSSProperties, ReactChild, ReactNode } from "react";

type PieProgressProps = {
    children?: ReactChild | ReactNode;
    percentage: number;
    color: string;
    colorNull?: string;
    strokeWidth?: string;
    r?: number;
    style?: CSSProperties;
};
const PieProgress: React.FC<PieProgressProps> = ({
    children,
    percentage,
    color,
    colorNull,
    strokeWidth,
    r,
    style,
}) => {
    const cleanPercentage = (percentage: any) => {
        const tooLow = !Number.isFinite(+percentage) || percentage <= 0;
        const tooHigh = percentage > 100;
        return tooLow ? 0 : tooHigh ? 100 : +percentage;
    };
    const pct = cleanPercentage(percentage);
    const Circle = (props) => {
        const { pct, color, r, strokeWidth, style } = props;
        const circ = 2 * Math.PI * r;
        const strokePct = ((100 - pct) * circ) / 100;
        return (
            <circle
                style={style}
                r={r}
                cx={170}
                cy={28}
                fill="transparent"
                stroke={strokePct !== circ ? color : ""}
                strokeWidth={strokeWidth}
                strokeDasharray={circ}
                strokeDashoffset={pct ? strokePct : 0}
            />
        );
    };
    return (
        <Container style={{ position: 'relative' }}>
            <svg
                width={56}
                height={56}
            >
                <g transform={`rotate(-90 ${"100 100"})`}>
                    <Circle
                        color={colorNull}
                        r={r}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        color={color}
                        pct={pct}
                        r={r}
                        strokeWidth={strokeWidth}
                        style={style}
                    />
                </g>
            </svg>
            <Container
                className="circle absolute flex justify-center items-center "
                style={{ top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', backgroundColor: color, color: 'white' }}
            >
                {children}
            </Container>
        </Container>
    );
};
export default PieProgress
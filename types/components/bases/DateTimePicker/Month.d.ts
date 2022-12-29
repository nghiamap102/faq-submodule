import { ReactNode } from 'react';
import './Calendar.scss';
export declare type MonthProps = {
    selected?: boolean;
    valid?: boolean;
    label?: ReactNode;
    onClick?: () => void;
};
export declare const Month: (props: MonthProps) => JSX.Element;
//# sourceMappingURL=Month.d.ts.map
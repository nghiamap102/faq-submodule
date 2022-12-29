import React, { ReactNode } from 'react';
import ScrollBar, { ScrollBarProps } from '../../../lib/react-perfect-scrollbar';
import './ScrollView.scss';
export interface ScrollViewProps extends ScrollBarProps {
    scrollX?: boolean;
    scrollY?: boolean;
    children?: ReactNode;
    containerRef?: (ref: HTMLElement) => void;
}
export declare const ScrollView: React.ForwardRefExoticComponent<ScrollViewProps & React.RefAttributes<ScrollBar>>;
//# sourceMappingURL=ScrollView.d.ts.map
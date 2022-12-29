import React, { forwardRef, ReactNode } from 'react';
import ScrollBar, { ScrollBarProps } from 'lib/react-perfect-scrollbar';

import './ScrollView.scss';

export interface ScrollViewProps extends ScrollBarProps
{
    scrollX?: boolean;
    scrollY?: boolean;
    children?: ReactNode,
    containerRef?: (ref: HTMLElement) => void
}

export const ScrollView = forwardRef<ScrollBar, ScrollViewProps>((props, ref?) =>
{
    const { scrollX = true, scrollY = true, children, ...ScrollViewProps } = props;

    return (
        <ScrollBar
            {...ScrollViewProps}
            ref={ref}
            options={{
                suppressScrollX: !scrollX,
                suppressScrollY: !scrollY,
            }}
            containerRef={(ref: any) =>
            {
                if (ref)
                {
                    // fix scroll exceed content
                    ref._getBoundingClientRect = ref.getBoundingClientRect;
                    ref.getBoundingClientRect = () =>
                    {
                        const original = ref._getBoundingClientRect();
                        return { ...original, height: Math.round(original.height), width: Math.round(original.width) };
                    };

                    // set external ref
                    props.containerRef && props.containerRef(ref);
                }
            }}
        >
            {children}
        </ScrollBar>
    );
});

ScrollView.displayName = 'ScrollView';

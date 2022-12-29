import { forwardRef, ForwardedRef } from 'react';
import { ResizableSinglePanel, ResizableSinglePanelProps } from './ResizableSinglePanel';
import { ResizableMultiPanel, ResizableMultiPanelProps } from './ResizableMultiPanel';

export type ResizableProps =
    | ({ mode?: 'single' } & ResizableSinglePanelProps)
    | ({ mode: 'multi' } & ResizableMultiPanelProps)

export const Resizable = forwardRef((props: ResizableProps, ref: ForwardedRef<HTMLDivElement>) =>
{
    const { mode = 'single', ...resizeProps } = props;

    return mode === 'multi'
        ? (
                <ResizableMultiPanel
                    ref={ref}
                    {...(resizeProps as ResizableMultiPanelProps)}
                />
            )
        : (
                <ResizableSinglePanel
                    ref={ref}
                    {...(resizeProps as ResizableSinglePanelProps)}
                />
            );
});

Resizable.displayName = 'Resizable';

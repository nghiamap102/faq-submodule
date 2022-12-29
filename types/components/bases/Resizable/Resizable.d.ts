/// <reference types="react" />
import { ResizableSinglePanelProps } from './ResizableSinglePanel';
import { ResizableMultiPanelProps } from './ResizableMultiPanel';
export declare type ResizableProps = ({
    mode?: 'single';
} & ResizableSinglePanelProps) | ({
    mode: 'multi';
} & ResizableMultiPanelProps);
export declare const Resizable: import("react").ForwardRefExoticComponent<ResizableProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Resizable.d.ts.map
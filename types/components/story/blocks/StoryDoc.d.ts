/// <reference types="react" />
import { StoryTabsProps, DocHeaderProps } from '../../../components/story/UI';
export declare type StoryDocProps = {
    componentName?: string;
    component?: React.ComponentType<any>;
} & DocHeaderProps & Omit<StoryTabsProps, 'properties'>;
export declare const StoryDoc: (props: StoryDocProps) => JSX.Element;
//# sourceMappingURL=StoryDoc.d.ts.map
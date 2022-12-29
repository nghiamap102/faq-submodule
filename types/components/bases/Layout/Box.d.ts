/** @jsxImportSource @emotion/react */
import React, { ElementType, ReactNode } from 'react';
import { PropsOf } from '../../../types/helpers';
import { Sx } from './hooks/useSx';
import { ScrollViewProps } from '../ScrollView/ScrollView';
declare type BoxScrollProps = {
    /**
     * Add the scrollbar to overflow content. Can be used props of `ScrollView`.
     */
    scroll?: true | ScrollViewProps;
    /**
     * Add the CSS class name for the container (the wrapper of scroll view).
     */
    outsideClassName?: string;
    /**
     * Add the CSS class name for the scroll view.
     */
    insideClassName?: string;
};
declare type BoxCommonProps<E> = Partial<Record<keyof BoxScrollProps, never>> & {
    /**
     * The tag/component to render
     * @default
     * div
     */
    component?: E;
    /**
     * Define custom style and responsive.
     */
    sx?: Sx;
    /**
     * ReactNode to render as this component's content
     */
    children: ReactNode;
    className?: string;
};
declare type BoxTotalProps<E> = Omit<BoxCommonProps<E>, keyof BoxScrollProps> & BoxScrollProps;
declare type BoxOwnProps<E extends ElementType = ElementType> = BoxCommonProps<E> | BoxTotalProps<E>;
export declare type BoxProps<E extends ElementType> = BoxOwnProps<E> & Omit<PropsOf<E>, keyof BoxOwnProps<E> | 'style'>;
/**
 *  Merge props of type P and BoxProps with the props of tag/component E
 * @example
 * type ComponentProps<E extends ElementType> = PolymorphicComponentProps<E, ComponentOwnProps>;
 *
 * function Component<E extends React.ElementType>(props: ComponentProps<E>): JSX.Element
 * {
 *     return <Box {...props} />;
 * }
 */
export declare type PolymorphicComponentProps<E extends ElementType, P> = P & BoxProps<E>;
/**
 * Box is a component that has the attributes as an HTML Element with CSS properties based on the VUI system (`sx` prop).
 * @param component The tag/component to render. Default is `div`.
 * @param sx The VUI styled system to serve as the CSS properties, responsive and custom.
 */
export declare const Box: <E extends React.ElementType<any> = "div">(props: BoxProps<E>) => JSX.Element;
export {};
//# sourceMappingURL=Box.d.ts.map
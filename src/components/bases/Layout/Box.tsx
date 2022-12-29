/** @jsxImportSource @emotion/react */
import React, { ElementType, ReactNode, forwardRef, Ref } from 'react';
import clsx from 'clsx';
import { css } from '@emotion/react';
import { T } from 'components/bases/Translate/Translate';
import { PropsOf } from 'types/helpers';
import { useSx, Sx } from './hooks/useSx';
import { ScrollView, ScrollViewProps } from '../ScrollView/ScrollView';

type BoxScrollProps = {
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
}

type BoxCommonProps<E> = Partial<Record<keyof BoxScrollProps, never>> & {
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
}

type BoxTotalProps<E> = Omit<BoxCommonProps<E>, keyof BoxScrollProps> & BoxScrollProps;

type BoxOwnProps<E extends ElementType = ElementType> = BoxCommonProps<E> | BoxTotalProps<E>;

/**
 *  The default value of the prop `component`
 *  @default
 *  div
 */
const defaultElement = 'div';

export type BoxProps<E extends ElementType> = BoxOwnProps<E> & Omit<PropsOf<E>, keyof BoxOwnProps<E> | 'style'>;

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
export type PolymorphicComponentProps<E extends ElementType, P> = P & BoxProps<E>;

/**
 * Box is a component that has the attributes as an HTML Element with CSS properties based on the VUI system (`sx` prop).
 * @param component The tag/component to render. Default is `div`.
 * @param sx The VUI styled system to serve as the CSS properties, responsive and custom.
 */
// eslint-disable-next-line react/display-name
export const Box = forwardRef((props: BoxOwnProps, ref: Ref<Element>) =>
{
    const { component, sx, scroll, outsideClassName, insideClassName, className, children, ...rest } = props;
    const Element = component || defaultElement;
    const { sxClass, sxOutsideBoxClass, sxInsideBoxClass, jssOutsideBoxStyled, jssInsideBoxStyled, jssStyled } = useSx(sx);
    const fullClass = clsx(className, outsideClassName, insideClassName, sxClass);
    const outsideClass = clsx(className, outsideClassName, sxOutsideBoxClass);
    const insideClass = clsx(insideClassName, sxInsideBoxClass);
    const responsiveOutside = jssOutsideBoxStyled ? css({ ...jssOutsideBoxStyled }) : null;
    const responsiveInside = jssInsideBoxStyled ? css({ ...jssInsideBoxStyled }) : null;
    const responsive = jssStyled ? css({ ...jssStyled }) : null;
    const scrollProps = typeof scroll === 'object' ? { ...scroll } : null;
    const kids = typeof children === 'string' ? <T>{children}</T> : children;

    return (
        <Element
            ref={ref}
            className={!scroll ? fullClass : outsideClass}
            css={!scroll ? responsive : responsiveOutside}
            {...rest}
        >
            {!scroll
                ? kids
                : (
                        <ScrollView
                            className={insideClass}
                            css={responsiveInside}
                            {...scrollProps}
                        >
                            {kids}
                        </ScrollView>
                    )}
        </Element>
    );
}) as <E extends ElementType = typeof defaultElement>(props: BoxProps<E>) => JSX.Element;

import React, { CSSProperties, MutableRefObject, ElementType, ReactElement, forwardRef, Ref } from 'react';
import clsx from 'clsx';
import { OverflowContent } from 'components/bases/Layout/OverflowContent';
import { PolymorphicComponentProps } from './Box';
import { Flex, FlexOwnProps, DivideUnit, DivideSystem } from './Flex';
import './Row.scss';

export type RowProps = {
    className?: string;
    mainAxisAlignment?: 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly';
    crossAxisAlignment?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
    mainAxisSize?: 'min' | 'max';
    crossAxisSize?: 'min' | 'max';
    itemMargin?: 'none' | 'sm' | 'md' | 'lg';
    width?: number | string;
    height?: number | string;
    flex?: number;
    scroll?: boolean;
    wrap?: boolean;
    reverse?: boolean;
    clipped?: boolean;
    innerRef?: MutableRefObject<null | HTMLDivElement>;
    border?: boolean,
    borderLeft?: boolean,
    borderRight?: boolean,
    borderBottom?: boolean,
    borderTop?: boolean,
    style?: CSSProperties,
    onClick?: () => void,
}

export const Row = (props: RowProps & { children?: any }): React.ReactElement =>
{
    const {
        className = '',
        mainAxisAlignment = 'start',
        crossAxisAlignment = 'stretch',
        mainAxisSize,
        crossAxisSize,
        itemMargin = 'none',
        width,
        height,
        flex = 1,
        scroll,
        wrap,
        innerRef,
        clipped = true,
        reverse,
        border = false,
        borderLeft = false,
        borderRight = false,
        borderBottom = false,
        borderTop = false,
        style,
        onClick,
    } = props;

    const rowClass = clsx(
        'layout-row',
        {
            'flex-row-reverse': reverse,
            'flex-wrap': wrap,
            'overflow-hidden': !height && clipped,
            [`justify-${mainAxisAlignment}`]: mainAxisAlignment !== 'start',
            [`items-${crossAxisAlignment}`]: crossAxisAlignment !== 'stretch',
            [`main-${mainAxisSize}`]: mainAxisSize,
            [`cross-${crossAxisSize}`]: crossAxisSize,
            [`item-margin-${itemMargin}`]: itemMargin !== 'none',
            ['border']: border,
            ['border-left']: borderLeft,
            ['border-right']: borderRight,
            ['border-bottom']: borderBottom,
            ['border-top']: borderTop,
        },
        className,
    );

    return (
        <div
            ref={innerRef}
            className={rowClass}
            style={{
                ...style,
                width,
                height,
                maxHeight: height,
                flexGrow: height || width ? 0 : flex > 0 ? flex : undefined,
                flexShrink: height || width ? 0 : flex > 0 ? 1 : undefined,
                flexBasis: height || width ? 'auto' : flex > 0 ? '0%' : undefined,
            }}
            onClick={onClick}
        >
            {scroll ? <OverflowContent>{props.children}</OverflowContent> : props.children}
        </div>
    );
};

// =============================================================================
// Row version 2
// =============================================================================

type RowDivide = true | DivideUnit | {
    width?: DivideUnit;
    reverse?: true;
};

// Migrate
// remove clipped
// mainAxisSize to sx {width: 'min' | 'max}
// crossAxisSize to sx {height: 'min' | 'max}
// itemMargin: 'none' | 'sm' | 'md' | 'lg' to gap of Flex
// flex: number to grow of Flex
// wrap: boolean to wrap of Flex
// mainAxisAlignment to justify of Flex
// crossAxisAlignment to items of Flex
// width?: number | string to width of Flex;
// height?: number | string to height of Flex;
// innerRef to ref
export type Row2OwnProps = Omit<FlexOwnProps, 'divide' | 'direction'> & {
    divide?: RowDivide;
    reverse?: boolean;
}

export type Row2Props<C extends ElementType> = PolymorphicComponentProps<C, Row2OwnProps>;

const PreRow2 = <C extends ElementType>(props: Row2Props<C>): ReactElement =>
{
    const { children, divide, reverse, panel = true, ...rest } = props;

    const divideConvert = (divide?: RowDivide): undefined | DivideSystem =>
    {
        if (divide === true)
        {
            return 'x';
        }
        else if (typeof divide === 'number')
        {
            return { x: divide };
        }
        else if (typeof divide === 'object')
        {
            return { x: divide };
        }
        else
        {
            return divide;
        }
    };

    return (
        <Flex
            divide={divideConvert(divide)}
            direction={reverse ? 'row-reverse' : undefined}
            panel={panel}
            {...rest}
        >
            {children}
        </Flex>
    );
};

/**
 * Row is a component-based on Flex with its props as the panel environment and the direction of items is x-axis.
 *
 * Prop `panel` - Default `true`.
 *
 * - The element will stretch to fill the flexbox wrapping if does not set the size.
 *
 * - The content is clipped `overflow: hidden` to make sure the elements have specific size are not pushed by elements with `flex-grow` greater than `0`.
 *
 * The `direction` prop of Flex is prevented to be set. So want to reverse the direction of items, you can use the `reverse` prop.
 */
// eslint-disable-next-line react/display-name
export const Row2 = forwardRef((props: Row2OwnProps, ref: Ref<Element>) =>
{
    const { children, ...rest } = props;

    return (
        <PreRow2
            ref={ref}
            {...rest}
        >
            {children}
        </PreRow2>
    );
}) as <E extends ElementType = 'div'>(props: Row2Props<E>) => JSX.Element;

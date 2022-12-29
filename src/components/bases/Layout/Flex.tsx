import React, { ElementType, ReactNode, forwardRef, Ref } from 'react';
import clsx from 'clsx';
import { Box, PolymorphicComponentProps } from './Box';
import { WidthSystem, HeightSystem } from './types';

import './Flex.scss';

type SpacingUnit = 0 | 0.5 | 1 | 2 | 3 | 4 | 8 | 12;
type SpacingSystem = {
  x?: SpacingUnit;
  y?: SpacingUnit;
}

type OrderSystem = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'first' | 'last'

type FlexGrowSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type DivideUnit = 0 | 2 | 4 | 8;

type DivideVal = DivideUnit | {
  width?: DivideUnit;
  reverse?: true;
};

type DivideX = {
  x?: DivideVal;
  y?: never;
};

type DivideY = {
  x?: never;
  y?: DivideVal;
};

export type DivideSystem = 'x' | 'y' | DivideX | DivideY;

type FlexItemEnvProps = {
    /**
     * Initialize the flex item environment.
     */
    item: true;
    /**
     * Control the order in which they appear in the flex container.
     * @require
     * Need `item` prop to initialize the flex item environment.
     */
    order?: OrderSystem;
    /**
     * Define the ability for a flex item to grow.
     *
     * If grow = 0, the size of element equal the inner content.
     * @require
     * Need `item` prop to initialize the flex item environment.
     */
    grow?: FlexGrowSize;
    /**
     * Define the ability for a flex item to shrink.
     * @require
     * Need `item` prop to initialize the flex item environment.
     */
    shrink?: 0 | 1;
    /**
     * Define the self item are laid out along the cross axis.
     *
     * It will be overridden for the flex parent `align-items`.
     * @require
     * Need `item` prop to initialize the flex item environment.
     */
    self?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
}

// The properties must be a set of similar properties for the item of the flex.
// 'never' to prevent using the properties if 'item' is not 'true'.
type FlexCommonProps = Partial<Record<keyof FlexItemEnvProps, never>> & {
    className?: string;
    children: ReactNode;

    // Props of Flex container
    /**
     * Define the direction flex items are placed in the flex container.
     */
    direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
    /**
     * Allow the items to wrap.
     */
    wrap?: true | 'reverse';
    /**
     * Defines the alignment along the main axis.
     */
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    /**
     * Defines the behavior for how flex items are laid out along the cross axis on the current line.
     */
    items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    /**
     * Distribute space between and around content items along a cross-axis.
     *
     * Works only on multi-line containers and has no effect on single line containers.
     */
    content?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    /**
     * Space between flex items (gap).
     */
    gap?: SpacingUnit | SpacingSystem;
    /**
     * Define the width of Flex container.
     */
    width?: WidthSystem;
    /**
     * Define the height of Flex container.
     */
    height?: HeightSystem;

    // Options
    /**
     * Control the border width between flex items.
     *
     * The default of border's color is `var(--border-color)`.
     */
    divide?: DivideSystem;
    /**
     * On/Off the 'panel' environment.
     * @value true to `stretch` the flex container to the full width of the parent.
     * And `clip` the overflowing content.
     * @default
     * false
     */
    panel?: boolean;
}

type FlexTotalProps = Omit<FlexCommonProps, keyof FlexItemEnvProps> & FlexItemEnvProps

export type FlexOwnProps = FlexCommonProps | FlexTotalProps;

export type FlexProps<C extends ElementType = ElementType> = PolymorphicComponentProps<C, FlexOwnProps>;

// If `directionProp` is equal to `undefined` meaning Flexbox has the default direction is `row`.
const flexIs = (directionProp: FlexProps['direction'], direction: 'row' | 'col') =>
    directionProp ? directionProp.indexOf(direction) !== -1 : (direction === 'row' ? true : false);

const validateFlexItem = (itemProps: FlexItemEnvProps[keyof FlexItemEnvProps][]) =>
{
    if (itemProps[0] === true)
    {
        return;
    }

    const existProps = itemProps.filter((prop) => typeof prop !== 'undefined' || prop === 0 || prop);

    if (existProps.length)
    {
        throw new Error(
            'Prop `item` is missing for the component `Flex`.',
        );

    }
};

const validateDivide = (divide?: DivideSystem) =>
{
    if (typeof divide === 'string' || typeof divide === 'number')
    {
        return;
    }

    if (typeof divide === 'object')
    {
        const { x, y } = divide;

        if ((x || x === 0) && !y || !x && (y || y === 0))
        {
            return;
        }
        else
        {
            throw new Error(
                'Prop `divide` can only have `x` or `y`.',
            );
        }
    }
};

const PreFlex = <C extends ElementType>(props: FlexProps<C>): JSX.Element =>
{
    const {
        children,

        // Container Environment
        direction, wrap, justify, items, content, gap, width, height, divide,

        // Item Environment
        item, order, grow, shrink, self,

        panel = false, scroll, sx,
        ...rest
    } = props;

    validateDivide(divide);
    validateFlexItem([item, order, grow, shrink, self]);

    const orderSwitcher = (order: OrderSystem | undefined) =>
    {
        return order === 'first'
            ? -9999
            : order === 'last'
                ? 9999
                : order;
    };

    const getGapClass = (gap: FlexProps['gap']) =>
    {
        if (typeof gap === 'undefined')
        {
            return;
        }
        if (typeof gap === 'object')
        {
            const classObj: { [key: string]: boolean | SpacingUnit | undefined } = {};
            const dimensions = Object.keys(gap) as Array<keyof SpacingSystem>;
            for (let i = 0; i < dimensions.length; i++)
            {
                classObj[`gap-${dimensions[i]}-${gap[dimensions[i]]}`] = gap[dimensions[i]] === 0 || gap[dimensions[i]];
            }
            return classObj;
        }
        return {
            [`gap-${gap}`]: gap === 0 || gap,
        };
    };

    const getDivideClass = (divide: FlexProps['divide']) =>
    {
        if (typeof divide === 'object' && (typeof divide.x === 'number' || typeof divide.y === 'number'))
        {
            return {
                [`divide-x-${divide.x}`]: typeof divide.x === 'number',
                [`divide-y-${divide.y}`]: typeof divide.y === 'number',
            };
        }

        else if (typeof divide === 'object' && typeof divide?.x === 'object')
        {
            return {
                [`divide-x-${divide?.x?.width}`]: typeof divide.x.width === 'number',
                'divide-x-reverse': divide.x.reverse,
            };
        }

        else if (typeof divide === 'object' && typeof divide?.y === 'object')
        {
            return {
                [`divide-y-${divide?.y?.width}`]: typeof divide.y.width === 'number',
                'divide-y-reverse': divide.y.reverse,
            };
        }

        return {
            [`divide-${divide}`]: typeof divide === 'string',
        };
    };

    const commonClass = {
        'w-full': wrap && typeof width === 'undefined',
        'h-full': wrap && typeof height === 'undefined',
        [`w-${width}`]: (typeof sx?.width === 'undefined') && (width === 0 || width),
        [`h-${height}`]: (typeof sx?.height === 'undefined') && (height === 0 || height),
        // Ensure the layout of the panel environment, which has specific sized items, keeps them that size without being pushed away by items with `flex-grow` > 0.
        'overflow-hidden': panel && (flexIs(direction, 'row') && typeof height === 'undefined' || flexIs(direction, 'col') && typeof width === 'undefined' && !wrap),
    };

    const containerClass = {
        [`flex-${direction}`]: direction,
        [`justify-${justify}`]: justify,
        [`items-${items}`]: items,
        [`content-${content}`]: content,
        [`flex-${wrap === true ? 'wrap' : 'wrap-reverse'}`]: wrap,
        ...getGapClass(gap),
        ...getDivideClass(divide),
    };

    const itemClass = item
        ? {
                [`order-${orderSwitcher(order)}`]: order === 0 || order,
                [`flex-grow-${grow}`]: grow === 0 || grow,
                [`flex-shrink-${shrink}`]: shrink === 0 || shrink,
                [`self-${self}`]: self,
                ...commonClass,

            }
        : { ...commonClass };

    const flexPanel = clsx(
        'flex',
        // The VUI layout panel concept is the application panels
        // `flex: 1` to stretch the flex container to the full width of the parent.
        // 2nd condition to ensure the exact sizing has been set.
        { 'flex-grow flex-shrink flex-basis-0': panel && !(width === 0 || width || height === 0 || height) },
    );

    const outsideClass = scroll
        ? clsx(flexPanel, itemClass)
        : clsx(flexPanel, { ...containerClass, ...itemClass });

    const insideClass = scroll
        ? clsx(
            'flex flex-scroll-inner',
            {
                // Ensure the Perfect Scrollbar stretch full size of the container if direction is column.
                'w-full': direction === 'col' || direction === 'col-reverse',
            },
            containerClass,
        )
        : '';

    return (
        <Box
            outsideClassName={outsideClass}
            insideClassName={insideClass}
            scroll={scroll}
            sx={sx}
            {...rest}
        >
            {children}
        </Box>
    );
};

/**
 * Flex is a component-based on Flexbox with the custom prop `panel` to set the layout to panel environment.
 *
 * If panel is set to `true`, the component will be a panel environment, which has the following layout:
 *
 * - The component will stretch to fill the flexbox wrapping if does not set the size.
 *
 * - Set the CSS property `overflow` is hidden to make sure the elements have specific size (width, height) are not pushed by elements with `flex-grow` greater than 0.
 */
// eslint-disable-next-line react/display-name
export const Flex = forwardRef((props: FlexOwnProps, ref: Ref<Element>) =>
{
    const { children, ...rest } = props;

    return (
        <PreFlex
            ref={ref}
            {...rest}
        >
            {children}
        </PreFlex>
    );
},
) as <E extends ElementType = 'div'>(props: FlexProps<E>) => JSX.Element;

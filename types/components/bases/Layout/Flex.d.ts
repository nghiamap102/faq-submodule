import React, { ElementType, ReactNode } from 'react';
import { PolymorphicComponentProps } from './Box';
import { WidthSystem, HeightSystem } from './types';
import './Flex.scss';
declare type SpacingUnit = 0 | 0.5 | 1 | 2 | 3 | 4 | 8 | 12;
declare type SpacingSystem = {
    x?: SpacingUnit;
    y?: SpacingUnit;
};
declare type OrderSystem = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'first' | 'last';
declare type FlexGrowSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export declare type DivideUnit = 0 | 2 | 4 | 8;
declare type DivideVal = DivideUnit | {
    width?: DivideUnit;
    reverse?: true;
};
declare type DivideX = {
    x?: DivideVal;
    y?: never;
};
declare type DivideY = {
    x?: never;
    y?: DivideVal;
};
export declare type DivideSystem = 'x' | 'y' | DivideX | DivideY;
declare type FlexItemEnvProps = {
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
};
declare type FlexCommonProps = Partial<Record<keyof FlexItemEnvProps, never>> & {
    className?: string;
    children: ReactNode;
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
};
declare type FlexTotalProps = Omit<FlexCommonProps, keyof FlexItemEnvProps> & FlexItemEnvProps;
export declare type FlexOwnProps = FlexCommonProps | FlexTotalProps;
export declare type FlexProps<C extends ElementType = ElementType> = PolymorphicComponentProps<C, FlexOwnProps>;
/**
 * Flex is a component-based on Flexbox with the custom prop `panel` to set the layout to panel environment.
 *
 * If panel is set to `true`, the component will be a panel environment, which has the following layout:
 *
 * - The component will stretch to fill the flexbox wrapping if does not set the size.
 *
 * - Set the CSS property `overflow` is hidden to make sure the elements have specific size (width, height) are not pushed by elements with `flex-grow` greater than 0.
 */
export declare const Flex: <E extends React.ElementType<any> = "div">(props: FlexProps<E>) => JSX.Element;
export {};
//# sourceMappingURL=Flex.d.ts.map
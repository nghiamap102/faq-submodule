import React, { CSSProperties, MutableRefObject, ElementType, ReactElement } from 'react';
import { PolymorphicComponentProps } from './Box';
import { FlexOwnProps, DivideUnit } from './Flex';
import './Row.scss';
export declare type RowProps = {
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
    border?: boolean;
    borderLeft?: boolean;
    borderRight?: boolean;
    borderBottom?: boolean;
    borderTop?: boolean;
    style?: CSSProperties;
    onClick?: () => void;
};
export declare const Row: (props: RowProps & {
    children?: any;
}) => React.ReactElement;
declare type RowDivide = true | DivideUnit | {
    width?: DivideUnit;
    reverse?: true;
};
export declare type Row2OwnProps = Omit<FlexOwnProps, 'divide' | 'direction'> & {
    divide?: RowDivide;
    reverse?: boolean;
};
export declare type Row2Props<C extends ElementType> = PolymorphicComponentProps<C, Row2OwnProps>;
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
export declare const Row2: <E extends React.ElementType<any> = "div">(props: Row2Props<E>) => JSX.Element;
export {};
//# sourceMappingURL=Row.d.ts.map
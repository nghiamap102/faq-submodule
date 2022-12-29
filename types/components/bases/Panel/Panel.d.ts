import React from 'react';
import { BoxProps } from '../../../components/bases/Layout/Box';
import { FlexProps } from '../../../components/bases/Layout/Flex';
import { ContainerProps } from '../../../components/bases/Container/Container';
import { ColumnProps, Col2Props } from '../../../components/bases/Layout/Column';
import './Panel.scss';
export declare type BorderPanelProps = FlexPanelProps;
export declare const BorderPanel: React.FC<BorderPanelProps>;
export declare type PanelProps = JSX.IntrinsicElements['div'];
export declare const Panel: React.FC<PanelProps>;
export declare type FlexPanelProps = ColumnProps;
export declare const FlexPanel: React.FC<FlexPanelProps>;
export declare type PanelBodyProps = {
    scroll?: boolean;
} & JSX.IntrinsicElements['div'];
export declare const PanelBody: React.FC<PanelBodyProps>;
declare type ContainerPanelProps = ContainerProps;
export declare const ContainerPanel: React.FC<ContainerPanelProps>;
export declare const BorderPanel2: <C extends React.ElementType<any> = "div">(props: Col2Props<C>) => JSX.Element;
export declare const Panel2: <C extends React.ElementType<any> = "div">(props: BoxProps<C>) => JSX.Element;
export declare const FlexPanel2: <C extends React.ElementType<any> = "div">(props: Col2Props<C>) => JSX.Element;
export declare const PanelBody2: <C extends React.ElementType<any> = "div">(props: Col2Props<C>) => JSX.Element;
export declare const ContainerPanel2: <C extends React.ElementType<any> = "div">(props: FlexProps<C>) => JSX.Element;
export {};
//# sourceMappingURL=Panel.d.ts.map
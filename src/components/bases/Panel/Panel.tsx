import React, { ElementType } from 'react';
import clsx from 'clsx';

import { Box, BoxProps } from 'components/bases/Layout/Box';
import { Flex, FlexProps } from 'components/bases/Layout/Flex';
import { Container, ContainerProps } from 'components/bases/Container/Container';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { Column, ColumnProps, Col2, Col2Props } from 'components/bases/Layout/Column';

import './Panel.scss';

export type BorderPanelProps = FlexPanelProps
export const BorderPanel: React.FC<BorderPanelProps> = (props) =>
{
    const { className, children, ...restProps } = props;
    return (
        <FlexPanel
            {...restProps}
            className={clsx('border-panel', className)}
        >
            {children}
        </FlexPanel>
    );
};

export type PanelProps = JSX.IntrinsicElements['div']
export const Panel: React.FC<PanelProps> = ({ className, children, ...restProps }) =>
{
    return (
        <div
            {...restProps}
            className={clsx('panel', className)}
        >
            {children}
        </div>
    );
};

export type FlexPanelProps = ColumnProps
export const FlexPanel: React.FC<FlexPanelProps> = (props) =>
{
    const { flex, width, className = '', children, ...restProps } = props;

    return (
        <Column
            {...restProps}
            width={width}
            className={clsx('flex-panel', className)}
            flex={width ? 0 : flex}
        >
            {children}
        </Column>
    );
};

export type PanelBodyProps = {
    scroll?: boolean,
} & JSX.IntrinsicElements['div']

export const PanelBody: React.FC<PanelBodyProps> = (props) =>
{
    const { className, scroll, children, ...restProps } = props;
    return (
        <div
            {...restProps}
            className={clsx('panel-body', className)}
        >
            {scroll
                ? (
                        <ScrollView scrollX={false}>
                            {children}
                        </ScrollView>
                    )
                : children
            }
        </div>
    );
};

type ContainerPanelProps = ContainerProps
export const ContainerPanel: React.FC<ContainerPanelProps> = ({ children, className, ...restProps }) =>
{
    return (
        <Container
            {...restProps}
            className={clsx('flex', 'full-height', className)}
        >
            {children}
        </Container>
    );
};

// ===================================================================================================
// New Component based on Col2, Flex, Box

export const BorderPanel2 = <C extends ElementType = 'div'>(props: Col2Props<C>): JSX.Element =>
{
    const { className, children, ...rest } = props;
    return (
        <FlexPanel2
            className={clsx('border-panel', className)}
            {...rest}
        >
            {children}
        </FlexPanel2>
    );
};

export const Panel2 = <C extends ElementType = 'div'>(props: BoxProps<C>): JSX.Element =>
{
    const { className, children, ...rest } = props;
    return (
        <Box
            className={clsx('panel', className)}
            {...rest}
        >
            {children}
        </Box>
    );
};

export const FlexPanel2 = <C extends ElementType = 'div'>(props: Col2Props<C>): JSX.Element =>
{
    const { className, children, ...rest } = props;

    return (
        <Col2
            className={clsx('flex-panel', className)}
            {...rest}
        >
            {children}
        </Col2>
    );
};

export const PanelBody2 = <C extends ElementType = 'div'>(props: Col2Props<C>): JSX.Element =>
{
    const { children, scroll = { scrollX: false }, ...rest } = props;
    return (
        <Col2
            scroll={scroll}
            {...rest}
        >
            { children }
        </Col2>
    );
};

export const ContainerPanel2 = <C extends ElementType = 'div'>(props: FlexProps<C>): JSX.Element =>
{
    const { className, children, ...rest } = props;
    return (
        <Flex
            className={clsx('h-screen overflow-hidden', className)}
            {...rest}
        >
            {children}
        </Flex>
    );
};

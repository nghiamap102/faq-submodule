import React, { ElementType } from 'react';
import clsx from 'clsx';
import { Property } from 'csstype';

import { Col2Props } from 'components/bases/Layout/Column';
import { BorderPanel, BorderPanel2 } from 'components/bases/Panel/Panel';

export type SideBarProps = {
    className?: string
    width?: Property.Width
    flex?: number
}

export const SideBar: React.FC<SideBarProps> = (props) =>
{
    const { width = '200px', flex = 0, className, children } = props;
    return (
        <BorderPanel
            className={clsx('side-bar', className)}
            width={width}
            flex={flex}
        >
            {children}
        </BorderPanel>
    );
};

export const SideBar2 = <C extends ElementType = 'div'>(props: Col2Props<C>): JSX.Element =>
{
    const { width = 52, className, children, ...rest } = props;
    return (
        <BorderPanel2
            className={clsx('side-bar', className)}
            width={width}
            {...rest}
        >
            {children}
        </BorderPanel2>
    );
};

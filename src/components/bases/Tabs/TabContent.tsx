import React, { FC } from 'react';
import clsx from 'clsx';

import { TabsProps } from './Tabs';

import './Tabs.scss';

type TabContentProps = {
    active?: boolean
} & Pick<TabsProps, 'renderOnActive'>

export const TabContent: FC<TabContentProps> = (props) =>
{
    const { active = true, renderOnActive, children } = props;

    if ((active && renderOnActive) || !renderOnActive)
    {
        return <div className={clsx('tab-item-content', active && 'active')}>{children}</div>;
    }
    else
    {
        return null;
    }
};

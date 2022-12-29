import React, { ReactElement, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';

import { T } from 'components/bases/Translate/Translate';

import './Tabs.scss';

export interface TabProps
{
    id?: string,
    onClick?: (id: string) => void,
    title: ReactElement | ReactElement[] | string,
    flex?: boolean,
    active?: boolean,
    renderOnActive?: boolean,
    route?: string,
    children?: ReactNode,
}

export const Tab = (props: TabProps): ReactElement =>
{
    const { flex, active, id, title, onClick, route } = props;

    if (route)
    {
        return <RouteTab {...props} />;
    }

    return (
        <div
            className={clsx('tab-item-header', active && 'active')}
            {...(!flex && { style: { flex: 'none' } })}
            {...(onClick && {
                onClick: () => onClick(id || ''),
            })}
        >
            <span>
                {typeof title === 'string' ? <T>{title}</T> : title}
            </span>
        </div>
    );
};

const RouteTab = (props: TabProps): ReactElement =>
{
    const history = useHistory();
    const { flex, active, title, onClick, route } = props;

    return (
        <div
            className={clsx('tab-item-header', active && 'active')}
            {...(!flex && { style: { flex: 'none' } })}
            {...(onClick && {
                onClick: () =>
                {
                    onClick(route || '');
                    route && history.push('/' + route);
                },
            })}
        >
            <span>
                <T>{title}</T>
            </span>
        </div>
    );
};

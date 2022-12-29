import React, { FC, ReactElement, ReactNode, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';

import { ScrollView } from '../ScrollView/ScrollView';
import { Tab, TabProps } from './Tab';
import { TabContent } from './TabContent';

import './Tabs.scss';

export type TabsProps = {
    flexHeader?: boolean,
    renderOnActive?: boolean,
    onSelect?: (id?: string, route?: string) => void,
    selected: string,
    className?: string,
    children: any[] | any,
}

export const Tabs = (props: TabsProps): ReactElement =>
{
    const {
        children,
        onSelect,
        selected,
        className = '',
        flexHeader = true,
        renderOnActive = false,
    } = props;

    const tabs: React.ReactElement<TabProps & {children: ReactNode}>[] = [];

    const hasRoute = Array.isArray(children)
        ? children.some((child: any) => child.props.route)
        : children?.props.route;
    Array.isArray(children) ? children.forEach((child: any) => child?.type && tabs.push(child)) : children?.type && tabs.push(children);

    if (hasRoute)
    {
        return (
            <RouterTabs {...props} />
        );
    }

    return (
        <div className={['tab-control', className].join(' ')}>
            <div className={'tab-header-wrap'}>
                <ScrollView>
                    <div className={clsx('tab-header', flexHeader && 'flex-header')}>
                        {tabs.map((child, index) => (
                            <Tab
                                key={child.props.route || child.props.id || index}
                                {...child.props}
                                flex={flexHeader}
                                active={(child.props.route || child.props.id) === selected}
                                onClick={id => onSelect && onSelect(id)}
                            />
                        ))}
                    </div>
                </ScrollView>
            </div>

            <div className={'tab-content'}>
                {tabs.map(child => child.props.id && (
                    <TabContent
                        key={child.props.id}
                        renderOnActive={renderOnActive}
                        {...child.props}
                        active={child.props.id === selected}
                    >
                        {child.props.children}
                    </TabContent>
                ))}
            </div>
        </div>
    );
};

const RouterTabs: FC<TabsProps> = props =>
{
    const {
        children,
        onSelect,
        selected,
        className = '',
        flexHeader = true,
        renderOnActive = false,
    } = props;

    const location = useLocation();
    const { url } = useRouteMatch();

    const tabs: React.ReactElement<TabProps & {children: ReactNode}>[] = [];
    Array.isArray(children) ? children.forEach((child: any) => child?.type && tabs.push(child)) : children?.type && tabs.push(children);

    useLayoutEffect(() =>
    {
        const selectedTab = tabs.find(tab => tab.props.route === location.pathname.split(url + '/')[1]) || tabs.find(tab => tab.props.route === selected);
        selectedTab && onSelect && onSelect(selectedTab.props.route || selectedTab.props.id);
    }, []);

    const redirect = tabs.find(tab => tab.props.route === selected)?.props.route;

    return (
        <Router basename={url}>
            <div className={['tab-control', className].join(' ')}>
                <div className={'tab-header-wrap'}>
                    <div className={'tab-header'}>
                        {tabs.map((child, index) => (
                            <Tab
                                key={child.props.route || child.props.id || index}
                                {...child.props}
                                flex={flexHeader}
                                active={(child.props.route || child.props.id) === selected}
                                onClick={id => onSelect && onSelect(id)}
                            />
                        ))}
                    </div>
                </div>

                <div className={'tab-content'}>
                    <Switch>
                        {tabs.map(child => child.props.route &&
                            (
                                <Route
                                    key={child.props.route}
                                    path={'/' + child.props.route}
                                >
                                    <TabContent
                                        renderOnActive={renderOnActive}
                                        {...child.props}
                                        active={child.props.route === selected}
                                    >
                                        {child.props.children}
                                    </TabContent>
                                </Route>
                            ))}

                        {redirect && <Redirect to={'/' + redirect} />}
                    </Switch>
                </div>
            </div>
        </Router>
    );
};

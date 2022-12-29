import { ReactNode, useState, createElement, useMemo, useRef, useEffect, ReactElement } from 'react';
import clsx from 'clsx';

import './StoryTabs.scss';

export type StoryTabsProps = {
    properties: ReactElement
    description: React.FunctionComponent | React.ClassicComponentClass| string
}

const TABS = ['description', 'properties'] as const;
type TABS = (typeof TABS)[number];

export const StoryTabs = (props: StoryTabsProps): JSX.Element =>
{
    const { description, properties } = props;
    const currentTabRef = useRef<HTMLDivElement>(null);

    const [currentTab, setCurrentTab] = useState<TABS>('description');
    const [sliderPosition, setSliderPosition] = useState({ width: 0, left: 0 });

    useEffect(() =>
    {
        if (currentTabRef.current)
        {
            const { offsetLeft, offsetWidth } = currentTabRef.current;
            setSliderPosition({ width: offsetWidth, left: offsetLeft });
        }
    }, [currentTab]);

    const renderTabs = () => ({
        description: createElement(description),
        ...(properties && { properties }),
    });
    const tabs: Partial<Record<TABS, ReactNode>> = useMemo(renderTabs, [description, properties]);

    const handleChangeTab = (tab: TABS) => setCurrentTab(tab);

    return (
        <div className="story-tabs__tab-wrapper">
            <div className="story-tabs__tab-header">
                {Object.keys(tabs).map((tab , index) => (
                    <div
                        key={index}
                        className={clsx('story-tabs__tab-item', currentTab === tab && 'story-tabs__tab-item--current')}
                        onClick={() => handleChangeTab(tab as TABS)}
                        {...(currentTab === tab && { ref: currentTabRef })}
                    >
                        {tab}
                    </div>
                ))}
                <div
                    className="story-tabs__tab-slider"
                    style={sliderPosition}
                />
            </div>

            <div className="story-tabs__tab-content">
                {tabs[currentTab]}
            </div>
        </div>
    );
};

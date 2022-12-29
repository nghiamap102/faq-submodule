import { action } from '@storybook/addon-actions';

import { FeatureBar, FeatureBarTop, FeatureBarBottom } from 'components/bases/FeatureBar/FeatureBar';
import { FeatureItem } from 'components/bases/FeatureBar/FeatureItem';
import { FeatureText } from 'components/bases/FeatureBar/FeatureText';
import { FAIcon } from '@vbd/vicon';

export default {
    title: 'Navigation/FeatureBar',
    component: FeatureBar,
    subcomponents: { FeatureBarBottom, FeatureBarTop, FeatureItem },
};

const featureItems = [
    {
        id: 'event',
        icon: 'bell',
        active: false,
        badgeCount: 10,
    },
    {
        id: 'incident',
        icon: 'exclamation-triangle',
        active: true,
        badgeCount: 69,
    },
    {
        id: 'case',
        icon: 'briefcase',
        active: false,
        badgeCount: 690,
    },
    {
        id: 'layer',
        icon: 'layer-group',
        active: false,
        badgeCount: 96,
    },
    {
        id: 'direction',
        icon: 'directions',
        active: true,
        badgeCount: 960,
    },
];

const renderItems = (items, callback) =>
{
    const jsxItems = [];
    items.map((item) =>
    {
        jsxItems.push(
            <FeatureItem
                id={item.id}
                icon={item.icon}
                active={item.active}
                badgeCount={item.badgeCount}
                onClick={() => callback(item.id)}
            />,
        );
    });
    return jsxItems;
};

export const Default = (args) =>
{
    const handleClick = (id) =>
    {
        (action('onClick'))(id);
    };

    return (
        <FeatureBar {...args}>
            <FeatureBarTop>
                {renderItems(featureItems, handleClick)}
            </FeatureBarTop>
        </FeatureBar>
    );
};

// eslint-disable-next-line react/no-multi-comp
export const WithStyle = (args) =>
{
    return (
        <FeatureBar>
            <FeatureBarTop>
                <FeatureItem
                    id="event"
                    icon="bell"
                    active={false}
                    badgeCount={50}
                />
                <FeatureItem
                    id="incident"
                    icon="exclamation-triangle"
                    active
                />
                <FeatureItem
                    id="case"
                    icon="briefcase"
                    active
                />
                <FeatureItem
                    id="layer"
                    icon="layer-group"
                    active
                />
                <FeatureItem
                    id="search"
                    icon="search"
                />
                <FeatureItem
                    id="direction"
                    icon="directions"
                    active
                />

                {/* <SipFeatureItem/> */}

                <FeatureItem
                    id="face-alert"
                    icon="user-friends"
                />

                <FeatureItem
                    id="lpr"
                    icon={'credit-card-front'}
                />
            </FeatureBarTop>

            <FeatureBarBottom>

                <FeatureItem
                    id="chat"
                    icon="comment-alt-lines"
                />

                <FeatureText
                    id="language"
                    text={'FeatureText content'}
                />

                <FeatureItem
                    id="theme"
                    content={(
                        <FAIcon
                            type='solid'
                            icon='circle'
                            size='1.5rem'
                            color={'var(--primary-color)'}
                        />
                    )}
                />
            </FeatureBarBottom>
        </FeatureBar>
    );
};

import { FC, useState, MouseEvent } from 'react';
import { Meta } from '@storybook/react';
import { FAIcon } from '@vbd/vicon';

import { Col2 } from 'components/bases/Layout/Column';
import { Resizable } from 'components/bases/Resizable/Resizable';
import { Tab, Tabs } from 'components/bases/Tabs';
import { Row2 } from 'components/bases/Layout/Row';
import { FeatureBar } from 'components/bases/FeatureBar/FeatureBar';
import { FeatureItem } from 'components/bases/FeatureBar/FeatureItem';
import { CollapsibleSection } from 'components/bases/Section/CollapsibleSection';
import { Tree } from 'components/bases/Tree/Tree';
import { useModal } from 'components/bases/Modal';
import { EmptyButton } from 'components/bases/Button';

export default {
    title: 'Examples/VSCode',
    parameters: {},
    decorators: [(Story) => <div style={{ margin: '-1rem', height: '100vh' }}><Story /></div>],
} as Meta;

const cols = [
    {
        id: '0',
        tabs: [
            {
                id: 'frontend/packages/@vbd/vui/VSCode.stories.js',
                title: 'VSCode.stories.js',
            },

            {
                id: 'frontend/packages/@vbd/vui/Postman.stories.js',
                title: 'Postman.stories.js',
            },
        ],
    },
    {
        id: '1',
        tabs: [
            {
                id: 'frontend/packages/@vbd/vui/VSCode.stories.js',
                title: 'VSCode.stories.js',
            },

            {
                id: 'frontend/packages/@vbd/vui/Postman.stories.js',
                title: 'Postman.stories.js',
            },
        ],
    },
    {
        id: '2',
        tabs: [
            {
                id: 'frontend/packages/@vbd/vui/VSCode.stories.js',
                title: 'VSCode.stories.js',
            },

            {
                id: 'frontend/packages/@vbd/vui/Postman.stories.js',
                title: 'Postman.stories.js',
            },
        ],
    },
];

type ColProps = {
    tabs: typeof cols[0]['tabs'],
    onGetTreePath?: (path: string) => void
}

const Col: FC<ColProps> = props =>
{
    const {
        tabs,
        onGetTreePath,
    } = props;

    // const { menu } = useModal();

    const [ tabSelected, setTabSelected ] = useState('frontend/packages/@vbd/vui/VSCode.stories.js');

    // const menuList = [
    //     { label: 'Show Opened Editors' },
    //     { label: 'Close All' },
    //     { label: 'Close Save' },
    //     { label: 'Keep Editors Open' },
    // ];

    // const handleMenuClick = (event: MouseEvent) =>
    // {
    //     const settingProps = {
    //         id: 'vscode-tab-menu',
    //         actions: menuList,
    //         isCloseOnBlur: true,
    //         width: 30,
    //         position: {
    //             x: event.clientX,
    //             y: event.clientY,
    //         },
    //     };

    //     menu(settingProps);
    // };

    return (
        <Tabs
            flexHeader={false}
            selected={tabSelected}
            // customSelected={(
            //     <div
            //         style={{
            //             position: 'absolute',
            //             top: 0,
            //             left: 0,
            //             height: 'calc(100% + 1px)',
            //             width: '100%',
            //             backgroundColor: 'var(--background-color)',
            //             borderTop: '3px solid rgba(var(--prim-rgb), .7)',
            //             borderLeft: '1px solid var(--border)',
            //             borderRight: '1px solid var(--border)',
            //         }}
            //     />
            // )}
            onSelect={id =>
            {
                if (!id)
                {
                    return;
                }

                const arrId = id.split('/');
                onGetTreePath?.(arrId[arrId.length - 1]);
                setTabSelected(id);
            }}
        >
            {tabs.map(tab => (
                <Tab
                    key={'tab' + tab.id}
                    id={tab.id}
                    title={(
                        <Row2
                            panel={false}
                            gap={2}
                            justify="center"
                            sx={{ pl: 2, pr: 2 }}
                        >
                            <Col2 panel={false}>
                                <FAIcon
                                    icon="user"
                                    size="1rem"
                                />
                            </Col2>

                            <Col2>
                                {tab.title}
                            </Col2>

                            <FAIcon
                                icon='times'
                                size={'1rem'}
                            />
                        </Row2>
                    )}
                >
                    <Col2>
                        <Row2 panel={false}>PATH</Row2>
                        <Row2>CODE</Row2>
                    </Col2>
                </Tab>
            ))}

            {/* <Row2
                height="full"
                justify="center"
                sx={{ p: 2 }}
            >
                <FAIcon
                    icon="ellipsis-h"
                    onClick={handleMenuClick}
                />
            </Row2> */}
        </Tabs>
    );
};

const SideBar: FC = () =>
{
    const asideMenu = [
        {
            name: 'Explorer',
            icon: 'copy',
        },

        {
            name: 'Search',
            icon: 'search',
        },

        {
            name: 'Source Control',
            icon: 'code-branch',
        },

        {
            name: 'Run and Debug',
            icon: 'play',
        },

        {
            name: 'Extensions',
            icon: 'border-all',
        },
    ];

    return (
        <Col2
            panel={false}
            width="auto"
            sx={{ borderRight: 'px' }}
        >
            <Row2>
                <FeatureBar>
                    {asideMenu.map((item, i) => (
                        <FeatureItem
                            key={'asideMenu' + i}
                            icon={item.icon}
                            active={i === 0}
                        />
                    ))}
                </FeatureBar>
            </Row2>

            <Row2 panel={false}>
                <FeatureBar>
                    <FeatureItem
                        icon='user-circle'
                    />
                    <FeatureItem
                        icon='cog'
                    />
                </FeatureBar>
            </Row2>
        </Col2>
    );
};

const SideList: FC = () =>
{
    const { menu } = useModal();

    const data = [
        {
            label: 'backend',
            value: 'backend',
            data: [],
        },
        {
            label: 'frontend',
            value: 'frontend',
            data: [
                {
                    label: 'packages/@vbd/vui',
                    value: 'packages/@vbd/vui',
                    data: [
                        {
                            label: 'src',
                            value: 'src',
                            data: [
                                {
                                    label: 'components/bases',
                                    value: 'components/bases',
                                    data: [
                                        {
                                            label: 'Layout',
                                            value: 'Layout',
                                            data: [
                                                {
                                                    label: 'VScode.stories.js',
                                                    value: 'VScode.stories.js',
                                                    data: [],
                                                },

                                                {
                                                    label: 'Postman.stories.js',
                                                    value: 'Postman.stories.js',
                                                    data: [],
                                                },
                                            ],
                                        },
                                    ],
                                },

                                {
                                    label: 'constants',
                                    value: 'constants',
                                    data: [],
                                },

                                {
                                    label: 'data',
                                    value: 'data',
                                    data: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    const options = [
        {
            label: 'Open Editors',
            icon: 'check',
        },

        {
            label: 'Folders',
            icon: 'check',
            disabled: true,
        },

        {
            label: 'Outline',
            icon: 'check',
        },

        {
            label: 'Timeline',
            icon: 'check',
        },

        {
            label: 'NPM Scripts',
            icon: 'check',
        },
    ];

    const explorer = [
        {
            header: 'OPEN EDITORS',
        },

        {
            header: 'VDMS-WEBAPP',
        },

        {
            header: 'OUTLINE',
        },

        {
            header: 'TIMELINE',
        },
    ];

    const handleOptionsClick = (event: MouseEvent<HTMLButtonElement>) =>
    {
        const buttonEl = event.target as HTMLButtonElement;
        const { bottom, left } = buttonEl.getBoundingClientRect();

        const settingProps = {
            id: 'vscode-options',
            actions: options,
            isCloseOnBlur: true,
            position: {
                x: left,
                y: bottom,
            },
        };

        menu(settingProps);
    };

    return (
        <Col2>
            <Row2
                height={12}
                items='center'
                sx={{ p: 4 }}
            >
                <Row2>
                    EXPLORER
                </Row2>

                <EmptyButton
                    icon='ellipsis-h'
                    onlyIcon
                    onClick={handleOptionsClick}
                />

            </Row2>

            <Col2>
                {explorer.map((item, i) => item.header === 'VDMS-WEBAPP'
                    ? (
                            <CollapsibleSection
                                key={i}
                                header={item.header}
                                defaultExpanded
                            >
                                <Tree
                                    data={data}
                                    defaultExpandedKeys={['frontend', 'packages/@vbd/vui', 'src', 'components/bases', 'Layout']}
                                />
                            </CollapsibleSection>
                        )
                    : (
                            <CollapsibleSection
                                key={i}
                                header={item.header}
                                defaultExpanded={false}
                            >
                                <Col2
                                    justify="center"
                                    items="center"
                                >
                                    <Row2 sx={{ p: 4 }}>
                                        <img
                                            width="120px"
                                            height="120px"
                                            src="https://skills-assets.pstmn.io/onboarding/astronaut.svg"
                                        />
                                    </Row2>
                                    <Row2 sx={{ p: 2 }}>
                                        <p>Hit Send to get a response</p>
                                    </Row2>
                                </Col2>
                            </CollapsibleSection>
                        ),
                )
                }
            </Col2>
        </Col2>
    );
};

const Template: FC = () =>
{
    const minPx: number[] = Array(cols.length).fill(200);
    const [resizable, setResizable] = useState(true);

    return (
        <Row2 height="full">
            <Resizable
                defaultSizes={[288]}
                minSizes={[288, 200 * cols.length]}
            >
                <Row2
                    panel={false}
                    width={72}
                >
                    <SideBar />
                    <SideList />
                </Row2>

                <Resizable
                    type="vertical"
                    defaultSizes={[null, 400]}
                    minSizes={[0, 40]}
                    resizable={resizable}
                >
                    <Resizable minSizes={minPx}>
                        {cols.map(props => (
                            <Col
                                key={props.id}
                                tabs={props.tabs}
                            />
                        ))}
                    </Resizable>

                    <CollapsibleSection
                        header="Check"
                        onExpand={isExpanded => setResizable(isExpanded)}
                    >
                        <Col2
                            justify="center"
                            items='center'
                        >
                            <Row2 sx={{ p: 4 }}>
                                <img
                                    width="120px"
                                    height="120px"
                                    src="https://skills-assets.pstmn.io/onboarding/astronaut.svg"
                                />
                            </Row2>
                            <Row2 sx={{ p: 2 }}>
                                <p>Hit Send to get a response</p>
                            </Row2>
                        </Col2>
                    </CollapsibleSection>
                </Resizable>
            </Resizable>
        </Row2>
    );
};

export const Default = Template.bind({});

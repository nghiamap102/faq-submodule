import React, { useEffect, useRef, useState } from 'react';

import { Box } from 'components/bases/Layout/Box';
import { Flex } from 'components/bases/Layout/Flex';
import { Col2 } from 'components/bases/Layout/Column';
import { Row2 } from 'components/bases/Layout/Row';
import { SearchField } from 'components/bases/FormControls/SearchField';
import { FAIcon, SVG } from '@vbd/vicon';
import { Button, EmptyButton } from 'components/bases/Button';
import { ListItem } from 'components/bases/List/List';
import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { Input } from 'components/bases/Input';
import { FormControlLabel, FormGroup } from 'components/bases/Form';
import { Table, TableRow, TableRowCell } from 'components/bases/Table';
import { FeatureItem } from 'components/bases/FeatureBar/FeatureItem';
import { FeatureBar } from 'components/bases/FeatureBar/FeatureBar';
import { Nav } from 'components/bases/Nav/Nav';
import { Resizable } from 'components/bases/Resizable/Resizable';
import { useModal } from 'components/bases/Modal/hooks/useModal';
import '../Postman.scss';

export default {
    title: 'Examples/Postman',
    parameters: {},
    args: {
        style: { backgroundColor: 'aqua' },
    },
    decorators: [(Story) => <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', background: '--bg-color', margin: '-1rem' }}><Story /></div>],
};

const asideMenu = [
    {
        name: 'Collections',
        icon: 'folder-open',
    },

    {
        name: 'APIs',
        icon: 'sitemap',
    },

    {
        name: 'Environments',
        icon: 'cloud',
    },

    {
        name: 'Mock Servers',
        icon: 'server',
    },

    {
        name: 'Monitors',
        icon: 'tv',
    },

    {
        name: 'History',
        icon: 'undo',
    },
];

const list = [
    {
        id: 0,
        method: 'GET',
        title: 'Untitled Request',
        content: 'Untitled Request',
    },

    {
        id: 1,
        method: 'GET',
        title: 'Untitled Request',
        content: 'Untitled Request',
    },

];

const methods = [
    {
        id: 'get',
        label: 'GET',
    },

    {
        id: 'post',
        label: 'POST',
    },

    {
        id: 'put',
        label: 'PUT',
    },

    {
        id: 'delete',
        label: 'DELETE',
    },
];

const requesterOptions = [
    {
        id: 0,
        name: 'Params',
    },

    {
        id: 1,
        name: 'Auth',
    },

    {
        id: 2,
        name: 'Headers',
    },

    {
        id: 2,
        name: 'Body',
    },

    {
        id: 4,
        name: 'Pre-req',
    },

    {
        id: 5,
        name: 'Tests',
    },

    {
        id: 6,
        name: 'Settings',
    },
];

const tableHeaders = [
    {
        label: '',
        width: '10%',
        col: 1,
    },

    {
        label: 'KEY',
        width: '30%',
        col: 1,
    },

    {
        label: 'VALUE',
        width: '30%',
        col: 1,
    },

    {
        label: 'DESCRIPTION',
        width: '30%',
        col: 1,
    },
];

const detailMenu = [
    {
        label: 'Release Notes',
    },

    {
        label: 'Documentation',
    },

    {
        label: 'Scratch Pad',
    },

    {
        label: 'Support',
    },

    {
        label: 'Security',
    },

    {
        label: 'Privacy Policy',
    },

    {
        label: 'Terms',
    },

    {
        label: '@getpostman',
    },
];

const Template = (args) =>
{
    const [showWorkspaces, setShowWorkspaces] = useState(false);
    const [asideMenuSelected, setAsideMenuSelected] = useState(0);
    const [requesterList, setRequesterList] = useState(list);
    const [requesterSelected, setRequesterSelected] = useState(0);
    const [requesterName, setRequesterName] = useState(() =>
    {
        const result = requesterList.find(requester => requester.id === requesterSelected);
        if (result)
        {
            return result.content;
        }
    });
    const [methodSelected, setMethodSelected] = useState('get');
    const [showSideBar, setShowSideBar] = useState(true);
    const { menu } = useModal();

    const headerMenu = [
        {
            label: 'Home',
        },

        {
            label: 'Workspaces',
            icon: showWorkspaces ? 'chevron-up' : 'chevron-down',
            iconPosition: 'end',
            onClick: () =>
            {
                setShowWorkspaces(showWorkspaces => !showWorkspaces);
            },
        },

        {
            label: 'Reports',
        },

        {
            label: 'Explore',
        },
    ];

    useEffect(() =>
    {
        const result = requesterList.find(requester => requester.id === requesterSelected);

        if (!result)
        {
            setRequesterSelected(null);
            setRequesterName(null);
        }
    }, [requesterList]);

    const onAsideItemClick = (i) =>
    {
        setAsideMenuSelected(i);
    };

    const onRequesterClick = (id) =>
    {
        setRequesterSelected(id);
        const result = requesterList.find(requester => requester.id === id);
        if (result)
        {
            setRequesterName(result.content);
        }
    };

    const handleRequesterRemove = (id) =>
    {
        const index = requesterList.findIndex(requester => requester.id === id);
        requesterList.splice(index, 1);
        setRequesterList([...requesterList]);
    };

    const handleRequesterCreate = () =>
    {
        const newRequester = {
            id: requesterList.length,
            method: 'GET',
            title: 'Untitled Request',
            content: 'Untitled Request',
        };

        setRequesterList([...requesterList, newRequester]);
    };

    const handleMethodChange = (value) =>
    {
        setMethodSelected(value);
    };

    const handleSideBar = () =>
    {
        setShowSideBar(!showSideBar);
    };


    const handleDetailsClick = (event) =>
    {
        const settingProps = {
            id: 'postman-setting-menu',
            actions: detailMenu,
            isCloseOnBlur: true,
            width: '200px',
            position: {
                x: event.clientX,
                y: event.clientY,
            },
            onClose: () =>
            {
                detailMenu.shift();
            },
        };

        menu(settingProps);

    };

    //  COMPONENTS
    const Header = () =>
    {
        return (
            <Row2
                gap={4}
                sx={{
                    p: 4,
                    borderBottom: 'px',
                }}
                panel={false}
            >
                <Col2
                    justify="center"
                    panel={false}
                >
                    <Row2
                        items="center"
                        panel={false}
                    >
                        <Nav actions={headerMenu} />
                    </Row2>
                </Col2>

                <Col2
                    items="center"
                    justify="center"
                >
                    <SearchField placeholder="Search Postman" />
                </Col2>

                <Col2 panel={false}>
                    <Row2 items="center">
                        <FeatureItem icon="cloud" />
                        <Button
                            icon="user-plus"
                            text="Invite"
                        />
                        <FeatureItem icon="broadcast-tower" />
                        <FeatureItem
                            icon="cog"
                            onClick={(node, event) =>
                            {
                                detailMenu.unshift({
                                    label: 'Setting',
                                });

                                handleDetailsClick(event);
                            }}
                        />
                        <FeatureItem icon="bell" />
                        <SVG name="logo-vbd" />
                    </Row2>
                </Col2>
            </Row2>
        );
    };

    const SideBar = () =>
    {
        return (
            <>
                <Row2
                    height={10}
                    sx={{
                        borderBottom: 'px',
                    }}
                    panel={false}
                >
                    <Col2>
                        <Row2
                            items="center"
                            gap={4}
                            sx={{ p: 4 }}
                        >
                            <Col2 panel={false}>
                                <FAIcon
                                    icon="user"
                                    type="light"
                                    size="1rem"
                                />
                            </Col2>
                            <Col2 items="start">
                                My Workspace
                            </Col2>
                        </Row2>
                    </Col2>

                    <Col2 panel={false}>
                        <Row2
                            items="center"
                            gap={1}
                            sx={{ p: 1 }}
                        >
                            <Col2>
                                <Button
                                    padding=".3rem"
                                    text="New"
                                />
                            </Col2>
                            <Col2>
                                <Button
                                    padding=".3rem"
                                    text="Import"
                                />
                            </Col2>
                        </Row2>
                    </Col2>
                </Row2>

                <Row2>
                    <Col2
                        width={showSideBar ? 24 : 'auto'}
                        sx={{ borderRight: 'px' }}
                        scroll
                        // style={{ backgroundColor: 'var(--sidebar-bg)' }}
                    >
                        {showSideBar
                            ? (
                                    <Box>
                                        {asideMenu.map((item, i) => (
                                            <ListItem
                                                key={i}
                                                label={item.name}
                                                iconClass={item.icon}
                                                active={asideMenuSelected === i}
                                                direction="column"
                                                height="60px"
                                                onClick={() =>
                                                {
                                                    onAsideItemClick(i);
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )
                            : ''}

                        {!showSideBar
                            ? (
                                    <FeatureBar>
                                        {asideMenu.map((item, i) => (
                                            <FeatureItem
                                                key={i}
                                                icon={item.icon}
                                                textPosition="center"
                                                flexDirection="column"
                                                active={asideMenuSelected === i}
                                                onClick={() =>
                                                {
                                                    onAsideItemClick(i);
                                                }}
                                            />
                                        ))}
                                    </FeatureBar>
                                )
                            : ''}
                    </Col2>

                    <Col2>
                        <Row2
                            gap={2}
                            sx={{ p: 2 }}
                            panel={false}
                        >
                            <Col2
                                justify="center"
                                panel={false}
                            >
                                <Button
                                    icon="plus"
                                    tooltip="Create new Collection"
                                    padding=".6rem 1rem"
                                    onlyIcon
                                />
                            </Col2>

                            <Col2 justify="center">
                                <SearchField fullWidth />
                            </Col2>

                            <Col2
                                justify="center"
                                panel={false}
                            >
                                <Button
                                    icon="ellipsis-h"
                                    tooltip="View more actions"
                                    padding=".6rem 1rem"
                                    onlyIcon
                                />
                            </Col2>
                        </Row2>

                        <Row2>
                            <Col2
                                justify="center"
                                sx={{ textAlign: 'center' }}
                            >
                                <Row2
                                    items="end"
                                    justify="center"
                                    gap={4}
                                    sx={{ p: 4 }}
                                >
                                    <h1>You don’t have any collections</h1>
                                </Row2>
                                <Row2 justify="center">
                                    <p>Collections let you group related requests, making them easier to access and run.</p>
                                </Row2>
                            </Col2>
                        </Row2>
                    </Col2>
                </Row2>
            </>
        );
    };

    const Content = () =>
    {
        const RequesterList = () =>
        {
            return (
                <Row2
                    height={10}
                    sx={{
                        borderBottom: 'px',
                    }}
                    panel={false}
                >
                    <Col2 panel={false}>
                        <Row2>
                            {requesterList.map(item => (
                                <ListItem
                                    key={item.id}
                                    icon={<div style={{ color: '#0cbb52' }}>{item.method.toUpperCase()}</div>}
                                    label={item.title}
                                    menuIconClass="times"
                                    active={requesterSelected === item.id}
                                    trailing={(
                                        <EmptyButton
                                            size="sm"
                                            icon="ellipsis-v"
                                            onlyIcon
                                            onClick={(e) => handleRequesterRemove(item.id)}
                                        />
                                    )}
                                    onClick={() => onRequesterClick(item.id)}
                                />
                            ))}
                        </Row2>
                    </Col2>

                    <Col2 panel={false}>
                        <Row2 items="center">
                            <Col2>
                                <FeatureItem
                                    icon="plus"
                                    onClick={handleRequesterCreate}
                                />
                            </Col2>
                            <Col2>
                                <FeatureItem icon="ellipsis-h" />
                            </Col2>
                        </Row2>
                    </Col2>
                </Row2>
            );
        };

        const RequestContent = () =>
        {
            return (
                <Row2 panel={false}>
                    <Col2>
                        <Row2>
                            <FormGroup>
                                <Row2
                                    gap={1}
                                    sx={{ p: 1 }}
                                >
                                    <Col2
                                        justify="center"
                                        panel={false}
                                    >
                                        <AdvanceSelect
                                            options={methods}
                                            value={methodSelected}
                                            width="100px"
                                            onChange={handleMethodChange}
                                        />
                                    </Col2>
                                    <Col2>
                                        <FormControlLabel>
                                            <Input placeholder="Enter request URL" />
                                        </FormControlLabel>
                                    </Col2>
                                    <Col2 panel={false}>
                                        <Row2>
                                            <Button text="Send" />
                                            <Button
                                                icon="chevron-down"
                                                onlyIcon
                                            />
                                        </Row2>
                                    </Col2>
                                </Row2>
                            </FormGroup>
                        </Row2>
                        <Row2 sx={{ borderBottom: 'px' }}>
                            {requesterOptions.map(option => (
                                <ListItem
                                    key={option.id}
                                    label={option.name}
                                    active={option.id === 0}
                                />
                            ))}
                        </Row2>
                    </Col2>
                </Row2>
            );
        };

        const RequestTable = () =>
        {
            return (
                <Row2>
                    <Col2>
                        <RequestContent />

                        <Row2>
                            <Col2>
                                <Row2
                                    gap={4}
                                    sx={{ p: 4 }}
                                ><h3>Query Params</h3>
                                </Row2>
                                <Table headers={tableHeaders}>
                                    <TableRow>
                                        <TableRowCell />
                                        <TableRowCell>
                                            <Input placeholder="Key" />
                                        </TableRowCell>
                                        <TableRowCell>
                                            <Input placeholder="Value" />
                                        </TableRowCell>
                                        <TableRowCell>
                                            <Input placeholder="Description" />
                                        </TableRowCell>
                                    </TableRow>
                                </Table>
                            </Col2>
                        </Row2>
                    </Col2>
                </Row2>
            );
        };

        return (
            <>
                <RequesterList />

                <Row2
                    gap={2}
                    sx={{ p: 2, borderBottom: 'px' }}
                    panel={false}
                >
                    <Col2
                        gap={2}
                        sx={{ p: 2 }}
                    >
                        <h1>{requesterName}</h1>
                    </Col2>
                    <Col2 panel={false}>
                        <Row2
                            gap={1}
                            sx={{ p: 1 }}
                        >
                            <Button
                                icon="save"
                                text="Save"
                            />
                            <Button
                                icon="chevron-down"
                                onlyIcon
                            />
                        </Row2>
                    </Col2>
                </Row2>

                <RequestTable />
            </>
        );
    };

    const Footer = () =>
    {
        return (
            <Row2
                panel={false}
                sx={{ borderRight: 'px', borderLeft: 'px', borderBottom: 'px' }}
            >
                <Row2 panel={false}>
                    <ListItem
                        flexDirection="column"
                        iconClass="bars"
                        tooltip="Show/Hide Sidebar"
                        tooltipPosition="right"
                        onClick={handleSideBar}
                    />

                    <ListItem
                        label="Find and Replace"
                        iconClass="search"
                        tooltipPosition="right"
                    />

                    <ListItem
                        label="Console"
                        iconClass="window-maximize"
                    />
                </Row2>
                <Row2 />
                <Row2 panel={false}>
                    <ListItem
                        label="Bootcamp"
                        iconClass="user-graduate"
                    />

                    <ListItem
                        label="Runner"
                        iconClass="play-circle"
                    />

                    <ListItem
                        label="Trash"
                        iconClass="trash-alt"
                    />

                    <ListItem
                        flexDirection="column"
                        iconClass="question-circle"
                        onClick={handleDetailsClick}
                    />
                </Row2>
            </Row2>
        );
    };

    return (
        <>
            <Header />

            <Row2 sx={{ borderBottom: 'px', borderRight: 'px' }}>

                <Resizable>
                    <Col2 width="1/3">
                        <SideBar />
                    </Col2>

                    <Col2 sx={{ borderRight: 'px' }}>
                        <Content />
                    </Col2>
                </Resizable>
            </Row2>

            <Footer />
        </>
    );
};

export const Default = Template.bind({});

export const Center = Template.bind({});
Center.args = {
    mainAxisAlignment: 'center',
    crossAxisAlignment: 'center',
};

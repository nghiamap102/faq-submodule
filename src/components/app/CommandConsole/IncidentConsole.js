import './IncidentConsole.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Moment from 'react-moment';

import {
    Container,
    FAIcons,
    FAIcon,
    Select, SelectOption,
    Image,
} from '@vbd/vui';

import IncidentPanel from '../IncidentPanel/IncidentPanel';
import IncidentDetailPanel from '../IncidentPanel/IncidentDetailPanel';
import AddIncidentPanel from '../IncidentPanel/AddIncident';

const dummyData = {
    currentZoom: 100,
    zoomLevels: [{
        value: 25,
        name: '25%',
    }, {
        value: 50,
        name: '50%',
    }, {
        value: 100,
        name: '100%',
    }, {
        value: 200,
        name: '200%',
    }, {
        value: 300,
        name: '300%',
    }, {
        value: 500,
        name: '500%',
    }],
    currentCommand: 'command1',
    commands: [{
        id: 'command1',
        name: 'command 1',
    }, {
        id: 'command2',
        name: 'command 2',
    }, {
        id: 'command3',
        name: 'command 3',
    }, {
        id: 'command4',
        name: 'command 4',
    }],

    footer: {
        icon: '/icon.png',
        version: 'CCS R200.1',
        database: 'database',
        machine: 'MC1',
        user: 'Administrator(MSG)',
    },
};

class IncidentConsole extends Component
{
    state = {
        currentZoom: dummyData.currentZoom,
        zoomLevels: dummyData.zoomLevels,
        currentCommand: dummyData.currentCommand,
        commands: dummyData.commands,
        footer: {
            branch: dummyData.footer.icon,
            version: dummyData.footer.version,
            database: dummyData.footer.database,
            machine: dummyData.footer.machine,
            user: dummyData.footer.user,
        },
    };

    handleMenuClick = (event) =>
    {
    };

    handleZoom = (event) =>
    {
        // todo
        this.setState({
            currentZoom: event.target.value,
        });
    };

    handleCommand = (event) =>
    {
        // todo
        this.setState({
            currentCommand: event.target.value,
        });
    };

    handleFooterToolClicked = (event) =>
    {
    };

    render()
    {
        return (
            <Container className="ic">
                <IncidentConsoleMenu
                    currentZoom={this.state.currentZoom}
                    zoomLevels={this.state.zoomLevels}
                    zoomChanged={this.handleZoom}
                    command={this.state.currentCommand}
                    commands={this.state.commands}
                    commandChanged={this.handleCommand}
                    onItemClick={this.handleMenuClick}
                />
                <IncidentConsoleBody />
                <IncidentConsoleFooter
                    command={this.state.currentCommand}
                    branch={this.state.footer.branch}
                    appVersion={this.state.footer.version}
                    database={this.state.footer.database}
                    machine={this.state.footer.machine}
                    user={this.state.footer.user}
                    onToolClicked={this.handleFooterToolClicked}
                />
                <AddIncidentPanel />
            </Container>
        );
    }
}

IncidentConsole = inject('appStore')(observer(IncidentConsole));
export default IncidentConsole;

export class IncidentConsoleMenu extends Component
{
    render()
    {
        return (
            <Container className="ic-menu">
                <FAIcons
                    className="ic-menu-items"
                    color="#F4F4F4"
                >
                    <FAIcon
                        type="light"
                        icon="server"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="angle-left"
                        size="30px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        className="margin-top-7"
                        icon="caret-down"
                        size="16px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="angle-right"
                        size="30px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        className="margin-top-7"
                        icon="caret-down"
                        size="16px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        className="margin-top-3"
                        type="light"
                        icon="undo"
                        size="20px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                </FAIcons>
                <FAIcons
                    className="ic-menu-items"
                    color="#F4F4F4"
                >
                    <FAIcon
                        type="light"
                        icon="home-lg-alt"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="sitemap"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="exclamation-triangle"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="lightbulb-on"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="exclamation-circle"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="calendar-alt"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="ballot-check"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="draw-circle"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                </FAIcons>
                <FAIcons
                    className="ic-menu-items"
                    color="#F4F4F4"
                >
                    <FAIcon
                        type="light"
                        icon="check-circle"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="search-plus"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="search"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="window-restore"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="upload"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                    <FAIcon
                        type="light"
                        icon="exclamation-circle"
                        size="24px"
                        color="#F4F4F4"
                        onClick={this.props.onItemClick}
                    />
                </FAIcons>
                <FAIcons
                    className="ic-menu-items"
                    color="#F4F4F4"
                >
                    <Select
                        value={this.props.currentZoom}
                        className="ic-menu-zoom"
                        onChange={this.props.zoomChanged}
                    >
                        {
                            Array.isArray(this.props.zoomLevels) && this.props.zoomLevels.map((z) => (
                                <SelectOption
                                    key={z.value}
                                    text={z.name}
                                    value={z.value}
                                />
                            ),
                            )
                        }
                    </Select>
                </FAIcons>
                <FAIcons
                    className="ic-menu-items ic-menu-command"
                    color="#F4F4F4"
                >
                    <Container className="ic-menu-command-label margin-top-3">Command</Container>
                    <Select
                        value={this.props.command}
                        className="ic-menu-command-list"
                        onChange={this.props.commandChanged}
                    >
                        {
                            Array.isArray(this.props.commands) && this.props.commands.map((c) => (
                                <SelectOption
                                    key={c.id}
                                    text={c.name}
                                    value={c.id}
                                />
                            ),
                            )
                        }
                    </Select>
                </FAIcons>
            </Container>
        );
    }
}

class IncidentConsoleBody extends Component
{
    state = {
        isDetailExpand: true,
        width: 0,
        isResizing: false,
    };
    currentX = 0;
    icBody = React.createRef();
    incidentStore = this.props.appStore.incidentStore;

    handleDetailExpand = (event) =>
    {
        this.incidentStore.setStateDetail(!this.incidentStore.isShowDetail);
    };

    componentDidMount()
    {
        // global window event
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
        this.setState({
            width: this.icBody.current.dimensions.width / 2,
        });
    }

    componentWillUnmount()
    {
        // global window event
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
    }

    handleResize = (event) =>
    {
        if (this.props.detailData !== undefined)
        {
            this.setState({
                isResizing: true,
            });

            this.currentX = event.screenX;
        }
    };

    onMouseUp = () =>
    {
        this.setState({
            isResizing: false,
        });

        this.currentX = null;
    };

    onMouseMove = (event) =>
    {
        if (this.state.isResizing)
        {
            const newWidth = this.state.width - (event.screenX - this.currentX);
            this.currentX = event.screenX;

            this.setState({
                width: newWidth,
            });
        }
    };

    render()
    {
        const show = this.incidentStore.isShowDetail && this.incidentStore.incident !== undefined;
        const bodyICDStyle = {};
        if (!show)
        {
            bodyICDStyle.flexBasis = '0px';
        }
        else
        {
            bodyICDStyle.flexBasis = `${this.state.width}px`;
        }
        return (
            <Container
                ref={this.icBody}
                className={`ic-body ${this.state.isResizing ? 'no-select' : ''}`}
            >
                <IncidentPanel
                    className="ic-body-icp"
                    type="console"
                />
                <Container
                    className="ic-body-icd"
                    style={bodyICDStyle}
                >
                    <Container
                        className="ic-body-icd-expand"
                        onClick={this.handleDetailExpand}
                    >
                        <FAIcon
                            icon={`chevron-double-${show ? 'right' : 'left'}`}
                            size="18px"
                            color="#C5C5C5"
                        />
                    </Container>
                    <Container
                        className="ic-body-icd-resize"
                        onMouseDown={this.handleResize}
                    />
                    <IncidentDetailPanel
                        type="console"
                        isDisplay={show}
                    />
                </Container>
            </Container>
        );
    }
}

IncidentConsoleBody = inject('appStore')(observer(IncidentConsoleBody));

export class IncidentConsoleFooter extends Component
{
    state = {
        currentDateTime: new Date(),
    };
    countTimeJob;

    componentDidMount()
    {
        this.countTimeJob = setInterval(() =>
        {
            this.setState({
                currentDateTime: new Date(),
            });
        }, 1000);
    }

    componentWillUnmount()
    {
        clearInterval(this.countTimeJob);
    }

    render()
    {
        return (
            <Container className="ic-footer">
                <Container className="ic-footer-command">
                    {this.props.command}
                </Container>
                <Container className="ic-footer-tools">
                    <FAIcons className="ic-tool-items">
                        <Image
                            className="ic-footer-icon"
                            width="100px"
                            height="30px"
                            src={this.props.branch}
                        />
                    </FAIcons>
                    <FAIcons className="ic-tool-items">
                        <Container className="ic-footer-normal-item">{this.props.appVersion}</Container>
                        <Container className="ic-footer-normal-item">
                            <Moment format={'L'}>
                                {this.state.currentDateTime}
                            </Moment>
                        </Container>
                        <Container className="ic-footer-normal-item">
                            <Moment format={'LTS'}>
                                {this.state.currentDateTime}
                            </Moment>
                        </Container>
                    </FAIcons>
                    <FAIcons className="ic-tool-items ic-tool-items-main">
                        <Container className="center-div">
                            <Container
                                className="ic-footer-normal-item"
                                onClick={this.props.onToolClicked}
                            >
                                <FAIcon
                                    icon="exclamation-circle"
                                    color="#B7B7B7"
                                />
                                INCIDENT
                            </Container>
                            <Container
                                className="ic-footer-normal-item"
                                onClick={this.props.onToolClicked}
                            >
                                <FAIcon
                                    icon="exclamation-triangle"
                                    color="#B7B7B7"
                                />
                                ALARM
                            </Container>
                            <Container
                                className="ic-footer-normal-item"
                                onClick={this.props.onToolClicked}
                            >
                                <FAIcon
                                    icon="wave-square"
                                    color="#B7B7B7"
                                />
                                SYSTEM
                            </Container>
                            <Container
                                className="ic-footer-normal-item"
                                onClick={this.props.onToolClicked}
                            >
                                <FAIcon
                                    icon="download"
                                    color="#B7B7B7"
                                />
                                DOWNLOAD
                            </Container>
                        </Container>
                    </FAIcons>
                    <FAIcons className="ic-tool-items">
                        <Container className="ic-footer-normal-item">
                            <FAIcon
                                icon="tasks-alt"
                                color="#B7B7B7"
                            />
                            {this.props.database}
                        </Container>
                        <Container className="ic-footer-normal-item">
                            <FAIcon
                                icon="tv"
                                color="#B7B7B7"
                            />
                            {this.props.machine}
                        </Container>
                        <Container className="ic-footer-normal-item">
                            <FAIcon
                                icon="user"
                                color="#B7B7B7"
                            />
                            {this.props.user}
                        </Container>
                    </FAIcons>
                </Container>
            </Container>
        );
    }
}

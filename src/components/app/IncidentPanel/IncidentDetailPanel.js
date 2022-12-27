import './IncidentDetailPanel.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
    PanelHeader, PanelBody,
    Tabs, Tab,
    WebSocketService,
} from '@vbd/vui';

import { IncidentService } from 'services/incident.service';
import { CommonHelper } from 'helper/common.helper';
import { Constants } from 'constant/Constants';
import Enum from 'constant/app-enum';

import { IncidentDetailWorkflowPanel } from './IncidentDetailWorkflowPanel';
import { IncidentDetailActivityPanel } from './IncidentDetailActivityPanel';

import { SketchMap } from './SketchMap';

class IncidentDetailPanel extends Component
{
    state = { tabSelected: 'wf' };
    incidentStore = this.props.appStore.incidentStore;
    sketchMapStore = this.props.appStore.sketchMapStore;

    incidentSvc = new IncidentService(this.props.appStore);

    componentDidMount()
    {
        if (this.incidentStore.incident?.headerInfo?.wfCode !== undefined && this.incidentStore.incident?.headerInfo?.wfProcessId !== undefined)
        {
            WebSocketService.subscribeChanel('wfIncident', this.handleWFProcess);
        }
    }

    componentWillUnmount()
    {
        if (this.incidentStore.incident?.headerInfo?.wfCode !== undefined && this.incidentStore.incident?.headerInfo?.wfProcessId !== undefined)
        {
            WebSocketService.leaveChanel('wfIncident', this.handleWFProcess);
        }
    }

    handleEventPostClicked = async (event) =>
    {
        const detail = CommonHelper.clone(this.incidentStore.getDetail());
        const rs = await this.incidentSvc.addPost(event.id, event.content);
        if (rs.result === Enum.APIStatus.Success)
        {
            const item = detail.items.find((i) => i.id === event.id);
            if (item !== undefined)
            {
                if (item.posts === undefined)
                {
                    item.posts = [rs.data];
                }
                else
                {
                    item.posts.push(rs.data);
                }
                this.incidentStore.setDetail(detail);
            }
        }
        else
        {
            return true;
        }
    };

    handleDoneChecked = async (event, processedCallback) =>
    {
        try
        {
            const rs = await this.incidentSvc.doneEvent(event.id);
            if (rs?.result === Enum.APIStatus.Success)
            {
                const detail = CommonHelper.clone(this.incidentStore.getDetail());
                for (let i = 0; i < detail.items.length; i++)
                {
                    if (detail.items[i].id === event.id)
                    {
                        const posts = detail.items[i].posts;
                        detail.items[i] = rs.data.event;
                        detail.items[i].posts = posts;
                        detail.items[i].disabled = false;
                    }
                    else
                    {
                        if (rs.data.commands.length)
                        {
                            const commands = rs.data.commands;
                            commands.forEach((item) =>
                            {
                                if (item.name === detail.items[i].name)
                                {
                                    detail.items[i].cmd = item.command;
                                    detail.items[i].disabled = item.disabled;
                                }
                            });
                        }
                    }
                }
                detail.headerInfo.finishedEventCount++;
                this.incidentStore.setDetail(detail);
                this.incidentStore.update(detail.headerInfo);
            }
        }
        finally
        {
            if (processedCallback)
            {
                processedCallback();
            }
        }
    };

    onStartEvent = async (event) =>
    {
        if (!event.isProcessing && !event.isDone)
        {
            this.incidentSvc.startEvent(event.id).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    const detail = CommonHelper.clone(this.incidentStore.getDetail());
                    for (let i = 0; i < detail.items.length; i++)
                    {
                        if (detail.items[i].id === event.id)
                        {
                            const posts = detail.items[i].posts;
                            detail.items[i] = rs.data.event;
                            detail.items[i].posts = posts;
                            detail.items[i].timer = event.timer;
                            detail.items[i].disabled = false;
                        }
                        else
                        {
                            if (rs.data.commands.length)
                            {
                                const commands = rs.data.commands;

                                commands.forEach((item) =>
                                {
                                    if (detail.items[i].name === item.name)
                                    {
                                        detail.items[i].cmd = item.command;
                                    }

                                    if (item.isFork === true && item.name === detail.items[i].name)
                                    {
                                        detail.items[i].disabled = false;
                                    }
                                    else if (item.isFork === false && item.name === detail.items[i].name && !detail.items[i].isDone)
                                    {
                                        detail.items[i].disabled = true;
                                    }
                                });
                            }
                        }
                    }

                    this.incidentStore.setDetail(detail);

                    // start cmd
                    const curItem = detail.items.filter((item) =>
                    {
                        if (item.id === event.id)
                        {
                            return item;
                        }
                        return false;
                    });
                    if (this.incidentStore.incident?.headerInfo?.wfCode !== undefined && this.incidentStore.incident?.headerInfo?.wfProcessId !== undefined)
                    {
                        this.incidentSvc.findEventCommand(this.incidentStore.incident.headerInfo.wfCode, this.incidentStore.incident.headerInfo.wfProcessId, event.id)
                            .then((rs2) =>
                            {
                                if (rs2.result === Enum.APIStatus.Success)
                                {
                                    if (rs2.data !== null && rs2.data.func !== undefined && rs2.data.func.length > 0)
                                    {
                                        if (typeof this[rs2.data.func] === 'function')
                                        {
                                            this[rs2.data.func](curItem[0]);
                                        }
                                        else
                                        {
                                            this.handleCommonFunc(rs2.data.func);
                                        }
                                    }
                                    else
                                    {
                                        if (curItem[0].cmd !== undefined && typeof this[curItem[0].cmd] === 'function')
                                        {
                                            this[curItem[0].cmd](curItem[0]);
                                        }
                                        else
                                        {
                                            this.handleCommonFunc(curItem[0].cmd);
                                        }
                                    }
                                }
                            });
                    }
                }
            });
        }
    };

    handleCloseDetail = () =>
    {
        this.incidentStore.setDetail(undefined);

        this.incidentStore.closeNearestMarker();
        this.incidentStore.closeNearestDirection();

        if (this.incidentStore.incident?.headerInfo?.wfCode !== undefined && this.incidentStore.incident?.headerInfo?.wfProcessId !== undefined)
        {
            WebSocketService.leaveChanel('wfIncident', this.handleWFProcess);
        }
    };

    onSketchControlChange = (control) =>
    {

    };

    handleTabSelect = (tabSelected) =>
    {
        this.setState({ tabSelected: tabSelected });
    };

    handleWFProcess = (message) =>
    {
        if (typeof message === 'object')
        {
            if (message.event.commandProcessing === 2)
            {
                // stop timer
                const event = message.event;
                event.stop = true;
                const detail = CommonHelper.clone(this.incidentStore.getDetail());

                for (let i = 0; i < detail.items.length; i++)
                {
                    if (event.id === detail.items[i].id)
                    {
                        const posts = detail.items[i].posts;
                        detail.items[i] = event;
                        detail.items[i].posts = posts;
                    }
                }
            }
        }
    };

    handleCommonFunc = (funcName) =>
    {
    };

    goToBlockade = (item) =>
    {
        this.handleTabSelect('tools');
        const coords = [this.incidentStore.incident.headerInfo.location.longitude, this.incidentStore.incident.headerInfo.location.latitude];

        const id = CommonHelper.uuid();
        const color = Constants.MAP_OBJECT_MARKER_COLOR;

        const geometry = {
            coordinates: coords,
            type: 'Point',
        };
        const feature = {
            id,
            type: 'Feature',
            properties: { color },
            geometry,
        };

        const control = {
            id,
            type: 'Point',
            title: item.name,
            uncommitted: true,
            showControl: {
                type: 'Point',
                coords: coords,
                des: `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`,
                color,
            },
            mapControl: {
                features: [feature],
            },
            components: {
                blockade: {
                    id,
                    type: 1,
                    radius: (item.params !== undefined && item.params.blockade !== undefined ? item.params.blockade : 50),
                    geometry,
                    euclid: (item.params !== undefined && item.params.euclid !== undefined ? item.params.euclid : 1),
                    criteria: 1,
                    isEnabled: true,
                },
            },
        };

        this.sketchMapStore.controls.controlDrawTool.add(feature);
        this.sketchMapStore.addControl(control);
        this.sketchMapStore.setSelectedControl(id);
    };

    render()
    {
        return (
            this.props.isDisplay &&
            (
                <>
                    <PanelHeader
                        actions={[
                            // { icon: 'print' },
                            { icon: 'times', onClick: this.handleCloseDetail },
                        ]}
                    >
                        ICS-{this.incidentStore.incident?.headerInfo?.incidentId}
                    </PanelHeader>

                    <PanelBody>
                        <Tabs
                            selected={this.state.tabSelected}
                            onSelect={(tabSelected) => this.handleTabSelect(tabSelected)}
                        >
                            <Tab
                                id="wf"
                                title="Quy trình"
                                active
                            >
                                <IncidentDetailWorkflowPanel
                                    type={this.props.type}
                                    data={this.incidentStore.incident}
                                    tabSelected={this.state.tabSelected}
                                    onPost={this.handleEventPostClicked}
                                    onDoneChecked={this.handleDoneChecked}
                                    onStartEvent={this.onStartEvent}
                                    // handleWFProcess={this.handleWFProcess}
                                />
                            </Tab>

                            <Tab
                                id="tools"
                                title="Công cụ"
                            >
                                <SketchMap
                                    disabled={this.incidentStore.incident.headerInfo.readOnly}
                                    onSketchControlChange={this.onSketchControlChange}
                                />
                            </Tab>

                            <Tab
                                id="act"
                                title="Sự kiện"
                            >
                                <IncidentDetailActivityPanel
                                    activities={this.incidentStore.incident.headerInfo.activities}
                                />
                            </Tab>
                        </Tabs>
                    </PanelBody>
                </>
            )
        );
    }
}

IncidentDetailPanel.propTypes = {
    className: PropTypes.string,
    isDisplay: PropTypes.bool,
    type: PropTypes.oneOf(['station', 'console']),
};

IncidentDetailPanel.defaultProps = {
    className: '',
    title: 'Facility Evacuation',
    isDisplay: true,
    type: 'station',
};

IncidentDetailPanel = inject('appStore')(observer(IncidentDetailPanel));
export default IncidentDetailPanel;

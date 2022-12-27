import './IncidentDetailWorkflowPanel.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    PanelFooter, FlexPanel, PanelBody,
    withModal, ScrollView,
} from '@vbd/vui';

import IncidentDetailWorkflowInformation from 'components/app/IncidentPanel/IncidentDetailWorkflowInformation';
import { IncidentDetailWorkflowItem } from 'components/app/IncidentPanel/IncidentDetailWorkflowItem';

import { IncidentService } from 'services/incident.service';

import Enum from 'constant/app-enum';

class IncidentDetailWorkflowPanel extends Component
{
    incidentStore = this.props.appStore.incidentStore;

    incidentSvc = new IncidentService();

    state = {
        finishedEventCount: this.props.data.headerInfo.finishedEventCount,
    };

    handleStateChange = (finishedEventCount) =>
    {
        if (this.state.finishedEventCount !== finishedEventCount)
        {
            this.setState({
                finishedEventCount: finishedEventCount,
            });
        }
    };

    handleCancel = () =>
    {
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn hủy sự cố này?',
            onOk: () =>
            {
                this.incidentSvc.cancel(this.incidentStore.getDetail().headerInfo.incidentId).then((rs) =>
                {
                    if (rs.result === Enum.APIStatus.Success)
                    {
                        this.incidentStore.remove(this.incidentStore.getDetail().headerInfo);
                        this.incidentStore.setDetail(undefined);

                        this.props.toast({ type: 'success', message: 'Hủy sự cố thành công' });
                    }
                    else
                    {
                        this.props.toast({ type: 'error', message: 'Hủy sự cố thất bại. ' + rs.errorMessage });
                    }
                });
            },
        });
    };

    handleComplete = () =>
    {
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn hoàn thành sự cố này?',
            onOk: () =>
            {
                this.incidentSvc.complete(this.incidentStore.getDetail().headerInfo.incidentId).then((rs) =>
                {
                    if (rs.result === Enum.APIStatus.Success)
                    {
                        this.incidentStore.remove(this.incidentStore.getDetail().headerInfo);
                        this.incidentStore.setDetail(undefined);

                        this.props.toast({ type: 'success', message: 'Hoàn thành sự cố thành công' });
                    }
                    else
                    {
                        this.props.toast({ type: 'error', message: 'Hoàn thành sự cố thất bại. ' + rs.errorMessage });
                    }
                });
            },
        });
    };

    render()
    {
        return (
            <FlexPanel flex={1}>
                <PanelBody className="id-items">
                    <ScrollView>
                        <IncidentDetailWorkflowInformation
                            information={this.props.data.headerInfo}
                            level={this.props.data.level}
                            type={this.props.type}
                        />
                        {
                            Array.isArray(this.props.data.items) && this.props.data.items.map((item, index) => (
                                <IncidentDetailWorkflowItem
                                    key={index}
                                    {...item}
                                    itemNumber={index + 1}
                                    itemId={item.id}
                                    incidentId={this.props.data.headerInfo.id}
                                    wfCode={this.props.data.headerInfo.wfCode}
                                    wfProcessId={this.props.data.headerInfo.wfProcessId}
                                    posts={item.posts}
                                    onPost={this.props.onPost}
                                    onDoneChecked={this.props.onDoneChecked}
                                    onStartEvent={this.props.onStartEvent}
                                    // handleWFProcess={this.props.handleWFProcess}
                                >
                                    {item.tools}
                                </IncidentDetailWorkflowItem>
                            ),
                            )
                        }
                    </ScrollView>
                </PanelBody>

                <PanelFooter
                    actions={[
                        {
                            text: 'Hủy', onClick: this.handleCancel,
                        },
                        {
                            text: 'Hoàn thành',
                            onClick: this.handleComplete,
                        },
                    ]}
                />
            </FlexPanel>
        );
    }
}

IncidentDetailWorkflowPanel.propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    type: PropTypes.oneOf(['station', 'console']),
};

IncidentDetailWorkflowPanel.defaultProps = {
    className: '',
    data: {},
    type: 'station',
};

IncidentDetailWorkflowPanel = withModal(inject('appStore')(observer(IncidentDetailWorkflowPanel)));
export { IncidentDetailWorkflowPanel };

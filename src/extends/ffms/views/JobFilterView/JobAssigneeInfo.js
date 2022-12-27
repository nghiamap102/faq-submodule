import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';

import {
    Container, PopOver, Button,
} from '@vbd/vui';

import { EmployeeDetail } from 'extends/ffms/views/EmployeeInfoPopup/EmployeeDetail';

export class JobAssigneeInfo extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    empStore = this.fieldForceStore.empStore;
    state = {
        activeEmployeePopup: null,
        selectedEmployee: [],
    };
    assigneeRef = React.createRef();

    handleGetEmployeeClick = async (node) =>
    {
        if (node.job_assignee_guid)
        {
            const results = await this.empStore.empSvc.search({ employee_username: node.job_assignee_guid, take: 1 });
            if (results && results.data && results.data.length)
            {
                this.setState({
                    activeEmployeePopup: node.job_guid,
                    selectedEmployee: results.data[0],
                });
            }
        }
    }

    handleEmployeePopUpClose = () =>
    {
        this.setState({
            activeEmployeePopup: null,
            selectedEmployee: null,
        });
    };

    render()
    {
        const { node, label } = this.props;
        return (
            <Container>
                <Button
                    className={`job-assignee ${node.job_assignee_guid ? 'assigned' : 'unassigned'}`}
                    icon={'user'}
                    color={'light'}
                    text={label}
                    innerRef={this.assigneeRef}
                    onClick={() => this.handleGetEmployeeClick(node)}
                />

                {/* check when both activeEmployeePopup and  node.job_guid is nyll */}
                {
                    (this.state.activeEmployeePopup && this.state.activeEmployeePopup === node.job_guid) &&
                    <PopOver
                        anchorEl={this.assigneeRef}
                        onBackgroundClick={this.handleEmployeePopUpClose}
                        className={'assignee-info-popup'}
                    >
                        <EmployeeDetail data={this.state.selectedEmployee} />
                    </PopOver>
                }
            </Container>
        );
    }
}

JobAssigneeInfo = inject('appStore', 'fieldForceStore')(observer(JobAssigneeInfo));

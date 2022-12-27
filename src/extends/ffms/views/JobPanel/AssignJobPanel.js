import './AssignJobPanel.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, SearchBox, Section, SectionHeader,
    withI18n, Row, Column, withModal,
} from '@vbd/vui';

import { AssignEmployeeList } from 'extends/ffms/views/JobPanel/AssignEmployeeList';
import { CommonHelper } from 'helper/common.helper';

export class AssignJobPanel extends Component
{
    jobStore = this.props.fieldForceStore.jobStore;
    comSvc = this.props.fieldForceStore.comSvc;

    state = {
        employees: [],
        searchKey: '',
        formErrors: '',
    };

    componentDidMount = () =>
    {
        if (Array.isArray(this.props.jobSelectedOptions))
        {
            this.setState({ employees: this.props.employeeOptions });
        }
    }

    assignEmployee = (assignee_guid) =>
    {
        if (!assignee_guid)
        {
            this.props.toast({ type: 'error', message: `${this.props.t('Tác vụ không thể thực hiện')}. ${this.props.t('Chi tiết')}: ${this.props.t('Không có thông tin nhân viên')}.` });
            return;
        }

        this.props.confirm({
            message: 'Bạn có thực sự muốn phân công người này không?',
            onOk: async () =>
            {
                const { jobSelectedOptions } = this.props;
                const assigningJobs = jobSelectedOptions.map((job) => ({ job_guid: job.job_guid, Title: job.Title, job_assignee_guid: assignee_guid, job_status_id: 2 }));

                const promises = assigningJobs.map((job) => this.jobStore.edit(job.job_guid, job));

                let success = true;
                try
                {
                    const results = await Promise.allSettled(promises);
                    results.forEach((result, index) =>
                    {
                        let error = '';
        
                        const errorMessage = result?.value?.errorMessage;
                        
                        if (!errorMessage)
                        {
                            return;
                        }
                        const details = result?.value?.details;
                        let errorDetails = '';
                        
                        if (details)
                        {
                            for (const [key, error] of Object.entries(details))
                            {
                                errorDetails += `    + ${key}: ${error} \n`;
                            }
                        }
                        success = false;
                        error += `- ${assigningJobs[index].Title}: ${this.props.t(errorMessage)}\n ${errorDetails} \n`;
                        this.props.toast({ type: 'error', timeout: 9999999, message: error });
                        return;
                    });
                }
                catch (error)
                {
                    this.props.toast({ type: 'error', message: `${this.props.t('Tác vụ không thể thực hiện')} ${error}.` });
                }
                if (success)
                {
                    this.props.toast({ type: 'success', message: 'Đã hoàn tất phân công nhân viên cho các công việc được chọn' });
                }
                // else
                // {
                //     this.props.toast({ type: 'error', timeout: 9999999, message: error });
                // }
                this.props.onClose && this.props.onClose();
            },
        });
    };

    searchEmployees = async (searchKey) =>
    {
        this.setState({ searchKey });

        this.jobStore.assignJob.searchKey = searchKey;

        const jobTypes = await this.comSvc.getLayerListOptions('JOB', 'job_type_id');

        const jobTypeDict = CommonHelper.toDictionary(jobTypes, 'indexed', 'id');

        const employeeOptions = await this.jobStore.getAssignableEmployeeOptionsDebounced(this.props.jobSelectedOptions.map((j) => jobTypeDict[j.job_type_id]));

        this.setState({
            employees: employeeOptions || [],
        });
    };

    render()
    {
        const employees = this.state.employees;
        return (
            <>
                <Row className={'assign-panel'}>
                    <Column>
                        <Section className={'assign-section-top'}>
                            <SectionHeader>Danh sách nhân viên phù hợp</SectionHeader>
                            <Row itemMargin={'md'}>
                                <SearchBox
                                    flex="1"
                                    placeholder={'Nhập từ khóa để tìm kiếm'}
                                    value={this.state.searchKey}
                                    onChange={this.searchEmployees}
                                />
                            </Row>
                        </Section>
                        <Container
                            className={'assign-section-bottom'}
                        >
                            <AssignEmployeeList
                                employees={employees}
                                teamOptions={this.props.teamOptions}
                                typeOptions={this.props.employeeTypeOptions}
                                assignEmployee={this.assignEmployee}
                            />
                        </Container>
                    </Column>
                </Row>
            </>
        );
    }
}
AssignJobPanel = withModal(withI18n(inject('appStore', 'fieldForceStore')(observer(AssignJobPanel))));
export default AssignJobPanel;

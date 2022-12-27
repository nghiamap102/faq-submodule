import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import moment from 'moment';

import {
    AdvanceSelect, FormGroup, Section,
    Calendar, PanelBody, Sub2,
} from '@vbd/vui';

import * as Routers from 'extends/ffms/routes';
export class HistoryTreeView extends Component
{
    historyStore = this.props.fieldForceStore.historyStore;
    markerPopupStore = this.props.appStore.markerPopupStore;
    overlayPopupStore = this.props.fieldForceStore.overlayPopupStore;

    languageStore = this.props.appStore.languageStore;

    employeeRef = React.createRef();
    state = {
        employeeRequired: false,
    };

    async componentDidMount()
    {
        this.historyStore.appStore = this.props.appStore;

        await this.historyStore.getEmpData();

        const driver = this.historyStore.selectedEmp?.employee_username;
        driver && await this.historyStore.getGPSLogByDay(this.currentCalendarDate || this.historyStore.currentFilter?.from || moment(), driver);
    }
    handleSelect = async (node) =>
    {
        this.historyStore.setFilter({ employee: this.historyStore.empMap[node] });
        this.handleTextChange('');

        if (node)
        {
            this.historyStore.getGPSLogByDay(this.currentCalendarDate || this.historyStore.currentFilter?.from || moment(), this.historyStore.selectedEmp?.employee_username);

            const currentPanStatus = {
                isPanned: !this.historyStore.isPanned,
                panEntry: node,
            };
            this.historyStore.panStatus = currentPanStatus;
            this.setState({ employeeRequired: false });

            this.historyStore.changeSliderTime();
            await this.applyFilter(false);
        }
        else
        {
            this.setState({
                employeeRequired: true,
            });
            this.historyStore.setHighlightDays([]);
            await this.applyFilter(true);
        }
    };

    handleChangeDate = async (event) =>
    {
        this.historyStore.setFilter({
            from: moment(event).startOf('date'),
            to: moment(event).endOf('date'),
            start_time: moment(event).startOf('date'),
            end_time: moment(event).endOf('date'),
        });
        await this.applyFilter();

        // console.log(this.historyStore.currentFilter['from'], this.historyStore.currentFilter['to']);

        const searchParams = new URLSearchParams(this.props.history.location.search);
        searchParams.set('from', moment(this.historyStore.currentFilter['from']).valueOf());
        searchParams.set('to', moment(this.historyStore.currentFilter['to']).valueOf());
        // console.log(searchParams.get('from'), searchParams.get('to'));
        this.props.history.push(`${Routers.HISTORY}?${searchParams.toString()}`);

        this.historyStore.changeSliderTime();
    };

    handleMonthChange = async (date) =>
    {
        this.currentCalendarDate = date;
        // call summary service
        const driver = this.historyStore.selectedEmp?.employee_username;
        driver && await this.historyStore.getGPSLogByDay(date, driver);
    };

    applyFilter = async (resetEmployee = null) =>
    {
        if (resetEmployee)
        {
            this.historyStore.selectedEntry = {
                routes: [],
                rawData: [],
                arrow: {
                    coords: [],
                    angle: [],
                    des: [],
                },
            };
            this.historyStore.selectedEmp = {};
            this.isData = 0;
            this.props.history.push(`${Routers.HISTORY}?from=${moment(this.historyStore.currentFilter.from).format('x')}&to=${moment(this.historyStore.currentFilter.to).format('x')}`);
        }
        else
        {
            let usernameParam = '';
            if (this.historyStore.selectedEmp && this.historyStore.selectedEmp.employee_username)
            {
                usernameParam = `username=${this.historyStore.selectedEmp.employee_username}`;
                this.props.history.push(`${Routers.HISTORY}?${usernameParam}&from=${moment(this.historyStore.currentFilter.from).format('x')}&to=${moment(this.historyStore.currentFilter.to).format('x')}`);

                if (this.props.onFilterChange)
                {
                    await this.props.onFilterChange();
                }
            }
            else
            {
                this.props.history.push(`${Routers.HISTORY}?from=${moment(this.historyStore.currentFilter.from).format('x')}&to=${moment(this.historyStore.currentFilter.to).format('x')}`);
            }
        }
    };

    handleTextChange = async (searchKey) =>
    {
        await this.historyStore.getEmpDataDebounced({ searchKey: `${searchKey}` });
    };

    render()
    {
        let employeeOptions = [...this.historyStore.entryMap];
        if (this.historyStore.selectedEmp && this.historyStore.selectedEmp.employee_username)
        {
            const option = {
                id: this.historyStore.selectedEmp.employee_guid,
                label: `${this.historyStore.selectedEmp.employee_full_name || ''} (${this.historyStore.selectedEmp.employee_username || ''})`,
                ...this.historyStore.selectedEmp,
            };

            if (!employeeOptions || employeeOptions.length === 0)
            {
                employeeOptions = [option];
            }
            else if (Array.isArray(employeeOptions) && employeeOptions.filter((x) => x.id === this.historyStore.selectedEmp?.employee_guid).length === 0)
            {
                employeeOptions.push(option);
            }
        }
        return (
            <>
                <Section>
                    <FormGroup>
                        <AdvanceSelect
                            value={this.historyStore.selectedEmp?.employee_guid}
                            options={employeeOptions}
                            placeholder={'Chọn một nhân viên'}
                            hasSearch
                            clearable
                            searchMode={'remote'}
                            onRemoteFetch={this.handleTextChange}
                            onChange={(e) => this.handleSelect(e)}
                            ref={this.employeeRef}
                        />
                        {
                            this.state.employeeRequired &&
                            <Sub2 color={'danger'}>(*) Vui lòng chọn một nhân viên</Sub2>
                        }
                    </FormGroup>
                </Section>
                <PanelBody className={'job-filter-panel'}>
                    <Section header={'Thời gian'}>
                        <FormGroup>
                            <Calendar
                                value={this.historyStore.currentFilter.from}
                                onChange={this.handleChangeDate}
                                onMonthYearChange={this.handleMonthChange}
                                highlightDates={this.historyStore.highlightDays}
                            />
                        </FormGroup>
                    </Section>
                </PanelBody>
            </>
        );
    }
}


HistoryTreeView = inject('appStore', 'fieldForceStore')(observer(HistoryTreeView));

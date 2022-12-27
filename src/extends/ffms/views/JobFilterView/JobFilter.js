import './JobFilter.scss';
import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import {
    FlexPanel, PanelHeader, PanelBody,
    PanelHeaderWithSwitcher, FormGroup, Section,
    withI18n, T, Row, DescriptionItem,
    Calendar, RangeTime, CheckBox,
} from '@vbd/vui';
import Menu, { MenuItem } from 'extends/ffms/bases/Menu/Menu';

import { RouterParamsHelper } from 'helper/router.helper';
import { CommonHelper } from 'helper/common.helper';
import FilterItem from 'extends/ffms/views/JobFilterView/FilterItem';
import { FFMSCommonHelper } from 'extends/ffms/helper/common-helper';

class JobFilter extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    jobFilterStore = this.props.fieldForceStore.jobFilterStore;
    languageStore = this.props.appStore.languageStore;
    comSvc = this.jobFilterStore.comSvc;

    menuRef = createRef();

    state = {
        jobTypeOptions: [],
        jobStatus: [],
        status: [],
    };

    team = [
        {
            id: 1,
            text: 'team A',
        },
        {
            id: 2,
            text: 'team B',
        },
    ];
    // type: icon and text
    workerType = [
        {
            id: 1,
            icon: 'user',
            text: 'Senior Technician',
        },
        {
            id: 2,
            icon: 'biking',
            text: 'Driver',
        },
    ];


    advanceOptions = [
        {
            typeData: 'jobstatus', // type name  to get field (id, name,..) in data
            keyFilter: 'jobStatuses', // name in currentFilter, param
            title: 'Trạng thái',
            icon: 'map-marker',
            type: 'icon',
            size: '1rem',
            iconOnly: true,
            dataAll: this.jobFilterStore.jobStatuses,
            total: this.jobFilterStore.jobStatuses?.length,
        },
        {
            typeData: 'jobtype',
            keyFilter: 'jobTypes',
            title: 'Loại công việc',
            type: 'tag',
            dataAll: this.jobFilterStore.jobTypes,
            total: this.jobFilterStore.jobTypes?.length,
        },
        {
            typeData: 'employeetype',
            keyFilter: 'employeeTypes',
            title: 'Loại nhân viên',
            type: 'icon',
            size: '1.2rem',
            iconOnly: true,
            dataAll: this.jobFilterStore.employeeTypes,
            total: this.jobFilterStore.employeeTypes?.length,
        },
        {
            typeData: 'team',
            keyFilter: 'teams',
            title: 'Đội',
            type: 'tag',
            dataAll: this.jobFilterStore.teams,
            total: this.jobFilterStore.teams?.length,
        },
    ]

    async componentDidMount()
    {
        this.jobFilterStore.appStore = this.props.appStore;
        this.comSvc.getLayerListOptions('JOB', 'job_status_id').then((result) =>
        {
            this.setState({
                status: result.map((status) => status.jobstatus_id) ?? [],
            });
        });
    }

    setParams = (object) =>
    {
        RouterParamsHelper.setParams(this.jobFilterStore.urlParams, this.props, object);
    }


    getFiltersSelected = (data, keyFilter,typeData) =>
    {
        const { currentFilter } = this.jobFilterStore;
        const { getJobStatusColor } = this.fieldForceStore;
        const id = typeData + '_id';
        const name = typeData + '_name';
        const icon = typeData + '_icon';

        return data?.filter(s => currentFilter[keyFilter]?.includes(s[id]))
            .map((s) =>({
                id: s[id],
                text: s[name] || s.Title || '',
                icon: s[icon] || null,
                ...keyFilter === 'jobStatuses' && { color: getJobStatusColor(s[id]) } }));
    }

    changeSelectedItem = (checked, value, keyFilter) =>
    {
        const { currentFilter } = this.jobFilterStore;
        let selectingItems = currentFilter[keyFilter];

        if (selectingItems.includes(-1))
        {
            selectingItems = selectingItems.filter(item => item !== -1);
        }

        if (!checked)
        {
            // update list selected
            selectingItems = selectingItems.filter(item => item !== value);
        }
        else if (selectingItems.indexOf(value) === -1)
        {
            selectingItems.push(value);
        }

        this.setParams({ [keyFilter]: selectingItems?.length === 0 ? -1 : selectingItems });
    };

    changeAllSelected = (checked ,dataAll,keyFilter, id) =>
    {
        const allItems = dataAll.map(s=>s[id]).filter(Boolean);

        this.setParams({ [keyFilter]: !checked ? -1 : allItems });
    }

    handleResetFilter = () =>
    {
        let currentFilter = CommonHelper.clone(this.jobFilterStore.currentFilter);

        // reset all advance options.
        this.advanceOptions.forEach(({ keyFilter = '', dataAll = [], typeData = '' }) =>
        {
            const id = typeData + '_id';
            currentFilter = { ...currentFilter, [keyFilter]: dataAll.map(x => (x[id])) };
        });

        this.jobFilterStore.set('currentFilter', currentFilter);
        this.setParams({
            searchKey: '',
            from: '',
            to: '',
            jobStatuses: '',
            jobTypes: '',
            employeeTypes: '',
            teams: '',
        });
    };

    handleAfterSliderChange=(value) =>
    {
        const [fromMoment,toMoment] = value;

        this.setParams({
            from: fromMoment.format('x'),
            to: toMoment.format('x'),
        });
    }


    renderGroupItem = (typeData, keyFilter, dataAll) =>
    {
        const id = typeData + '_id';
        const name = typeData + '_name';
        const icon = typeData + '_icon';
        const { currentFilter , jobSwitcher, fieldCounter } = this.jobFilterStore;
        const { getJobStatusColor } = this.fieldForceStore;

        if (dataAll?.length > 0)
        {
            return dataAll.map((s) =>
            {
                const isSelected = currentFilter[keyFilter]?.includes(s[id]);
                const count = fieldCounter && fieldCounter.hasOwnProperty(id) && s['indexed'] && fieldCounter[id][s['indexed'].toLowerCase()] && fieldCounter[id][s['indexed'].toLowerCase()];

                const label = FFMSCommonHelper.pluralizeMe(this.props.fieldForceStore.appStore?.contexts?.tenant, this.props.t('Công việc').toLowerCase(), count);
                const counter = parseInt(count) > 0 ? (isSelected ? ` (${fieldCounter && fieldCounter[id] && s['indexed'] && fieldCounter[id][s['indexed'].toLowerCase()] || '0'} ${label})` : '') : '';
                const hasIcon = s[icon] || keyFilter === 'jobStatuses';
                return (
                    <MenuItem
                        key={s[id]}
                        onClick={(event) => this.changeSelectedItem(!isSelected, s[id], keyFilter)}
                    >
                        <Row itemMargin={'sm'}>
                            <CheckBox
                                checkBoxSize={'sm'}
                                checked={isSelected}
                                disabled={!jobSwitcher.advanceFilter}
                                onChange={(event) => this.changeSelectedItem(event, s[id], keyFilter)}
                            />
                            <DescriptionItem
                                icon={hasIcon ? (s[icon] || 'map-marker') : undefined}
                                iconClassName={'jf-icon'}
                                iconType={'solid'}
                                iconSize={'1rem'}
                                iconColor={keyFilter === 'jobStatuses' ? getJobStatusColor(s[id]) : 'inherit'}
                                label={(s[name] || s.Title || '') + counter}
                            />
                        </Row>
                    </MenuItem>
                );
            });
        }

    }

    render()
    {
        const { currentFilter , jobSwitcher } = this.jobFilterStore;
        return (
            <FlexPanel flex={1}>
                <PanelHeader
                    actions={[
                        { icon: 'trash-alt', onClick: this.handleResetFilter },
                    ]}
                >
                    Lựa chọn bộ lọc
                </PanelHeader>
                <PanelBody
                    className={'job-filter-panel'}
                    scroll
                >
                    <Section>
                        <PanelHeaderWithSwitcher
                            value={jobSwitcher.dateTime ? 1 : 0}
                            onChanged={val => this.setParams({ timeOn: val })}
                        >
                            Thời gian tạo công việc
                        </PanelHeaderWithSwitcher>
                        {
                            jobSwitcher.dateTime && (
                                <FormGroup>
                                    <Calendar
                                        disabled={!jobSwitcher.dateTime}
                                        value={currentFilter.from}
                                        onChange={(value) =>this.setParams({
                                            from: moment(value).startOf('date').format('x'),
                                            to: moment(value).endOf('date').format('x'),
                                        })}
                                    />

                                    <RangeTime
                                        disabled={!jobSwitcher.dateTime}
                                        timeFormat={'hh:mm A'}
                                        inDate={currentFilter.from}
                                        timeStart={currentFilter.from}
                                        timeEnd={currentFilter.to}
                                        stepWithType={15}
                                        onAfterChange={this.handleAfterSliderChange}
                                    />
                                </FormGroup>
                            )}
                    </Section>

                    <Section>
                        <PanelHeaderWithSwitcher
                            value={jobSwitcher.advanceFilter ? 1 : 0}
                            onChanged={val => this.setParams({ advanceOn: val })}
                        >
                            Lựa chọn nâng cao
                        </PanelHeaderWithSwitcher>

                        {
                            jobSwitcher.advanceFilter && (
                                <Menu
                                    itemClassName={'menu-job-filter-item'}
                                >
                                    {
                                        this.advanceOptions.map(({ typeData, keyFilter, dataAll, ...filterItemProps }) =>
                                        {
                                            const id = typeData + '_id';
                                            filterItemProps.data = this.getFiltersSelected(dataAll,keyFilter,typeData) || [];

                                            return (
                                                <MenuItem
                                                    key={id}
                                                    id={id}
                                                    type={'sub-item'}
                                                    control={(
                                                        <FilterItem
                                                            className={`fi-${keyFilter}`}
                                                            iconType={keyFilter === 'jobStatuses' ? 'solid' : 'duotone'}
                                                            {...filterItemProps}
                                                        />
                                                    )}
                                                    onClick={this.handleSubMenuClick}
                                                >
                                                    <MenuItem
                                                        type={'group-item'}
                                                        control={(
                                                            <CheckBox
                                                                checkBoxSize={'sm'}
                                                                label={<T params={[filterItemProps?.data.length]}>Tất cả (%0% đã chọn)</T>}
                                                                checked = {filterItemProps.data?.length > 0}
                                                                indeterminate={currentFilter[keyFilter]?.length !== dataAll?.length}
                                                                onChange={(event)=>this.changeAllSelected(event, dataAll,keyFilter, id)}
                                                            />
                                                        )}
                                                    >
                                                        {this.renderGroupItem(typeData, keyFilter, dataAll)}
                                                    </MenuItem>
                                                </MenuItem>
                                            );
                                        })
                                    }
                                </Menu>
                            )}
                    </Section>
                </PanelBody>
            </FlexPanel>

        );
    }
}

JobFilter = inject('appStore', 'fieldForceStore')(observer(JobFilter));
JobFilter = withI18n(withRouter(JobFilter));
export { JobFilter };

import 'extends/ffms/views/TreeListItem/TreeListItem.scss';
import './WorkerTreeView.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import moment from 'moment';
import Moment from 'react-moment';
import _pick from 'lodash/pick';
import _findIndex from 'lodash/findIndex';

import { RouterParamsHelper } from 'helper/router.helper';

import { T, FAIcon, Container, Row, ScrollView } from '@vbd/vui';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

import * as Routers from 'extends/ffms/routes';
import { CommonHelper } from 'helper/common.helper';
import { WorkerListItem } from './WorkerListItem/WorkerListItem';

class WorkerTreeView extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    empStore = this.props.fieldForceStore.empStore;
    workerStore = this.props.fieldForceStore.workerStore;
    historyStore = this.props.fieldForceStore.historyStore;
    mapStore = this.props.appStore.mapStore;

    state = {
        typeOptions: [],
        isClickShowDetail: false,
        selectActiveWorker: null,
    }

    async componentDidMount()
    {
        this.fieldForceStore.loadDataReferences(['employee-types', 'device-statuses']).then((dataRefs) =>
        {
            const typeOptions = this.fieldForceStore.getDataReferenceOptions('employee-types', 'employeetype_id', 'employeetype_name').map((type) =>
            {
                return {
                    id: type.employeetype_id,
                    label: type.employeetype_name,
                    icon: type.employeetype_icon,
                };
            }) ?? [];

            this.setState({
                typeOptions,
            });

            this.workerStore.setStatuses(dataRefs['device-statuses']);
        });
    }

    handleTrackerSelect = (worker) =>
    {
        if (this.mapStore.map !== undefined)
        {
            // go to location
            this.mapStore.map.flyTo({
                center: [worker.lng, worker.lat],
                zoom: 25,
                padding: { top: 20, bottom: 20, left: 550, right: 80 },
            });
        }

        console.log('fly to ', worker.trackerId);
        this.setState({
            selectActiveWorker: worker.trackerId,
        });
    };

    changeActiveTracker = (worker, trackerId) =>
    {
        let newWorker = worker;
        const tracker = worker.trackerIds.filter(t => t.trackerId === trackerId)[0];
        if (tracker)
        {
            newWorker = {
                ...tracker,
                trackerIds: worker.trackerIds,
                ..._pick(worker, ['driver', 'employee_organization_id', 'employee_team_id', 'employee_type_id']),
            };
        }

        const workerIndex = _findIndex(this.workerStore.displayWorkers, w => w.driver === worker.driver);

        this.workerStore.displayWorkers.splice(workerIndex, 1, newWorker);

        this.handleTrackerSelect(newWorker);
    }

    pinTracker = (worker) =>
    {
        this.workerStore.togglePinnedTracker(worker);
    }

    handleViewHistoryDriverClick = (driverName) =>
    {
        RouterParamsHelper.setParamsWithPathName(Routers.HISTORY, this.historyStore.urlParams, this.props, {
            username: driverName,
            from: moment().startOf('date').format('x'),
            to: moment().endOf('date').format('x'),
        });
    }

    renderWorkerDetail = (worker) =>
    {
        let newType = [];

        if (worker?.employee_type_id)
        {
            newType = this.state.typeOptions.find((type) => worker.employee_type_id === type.id);
        }

        const status = this.workerStore.getTrackingStatus(worker[this.workerStore.trackingSvc.TRACKING_FIELD]);
        const color = status.status_color;
        const iconType = CommonHelper.toDictionary(this.state.typeOptions, 'id', 'icon');
        const icon = iconType[worker.employee_type_id];

        const isSelected = this.state.selectActiveWorker === worker.trackerId;

        return (
            <Container
                className={`${isSelected ? 'active' : ''} ${color ? 'tli-with-color tracking-tree-item' : ''}`}
                style={{ borderLeftColor: `${color}` }}
                key={worker.driver}
            >
                <Container
                    className={'tree-item-action'}
                >
                    <PopperTooltip
                        placement="top"
                        trigger={['hover']}
                        tooltip={worker.pinned ? 'Bỏ theo dõi' : 'Chọn theo dõi'}
                    >
                        <FAIcon
                            color={worker.pinned ? 'var(--primary)' : ''}
                            icon={'thumbtack'}
                            size={'1rem'}
                            type={'light'}
                            onClick={() => this.pinTracker(worker)}
                        />
                    </PopperTooltip>
                    <PopperTooltip
                        placement="top"
                        trigger={['hover']}
                        tooltip={'Xem lịch sử theo dõi'}
                    >
                        <FAIcon
                            icon={'route'}
                            size={'1rem'}
                            type={this.state.isClickShowDetail ? 'solid' : 'light'}
                            onClick={() => this.handleViewHistoryDriverClick(worker?.driver)}
                        />
                    </PopperTooltip>
                </Container>

                <Container
                    className={'tree-item-content'}
                    onClick={() => this.handleTrackerSelect(worker)}
                >
                    <Row
                        className={'tree-line header'}
                        itemMargin={'md'}
                        mainAxisSize={'max'}
                    >
                        { icon ? (
                            <FAIcon
                                color={color || ''}
                                icon={icon}
                                size={'1rem'}
                            />
                        ) : null}
                        <span>{ worker?.driver || 'Chưa xác định'}</span>
                    </Row>

                    <WorkerListItem
                        data={worker.trackerIds || []}
                        onSelect={(tracker) => this.changeActiveTracker(worker, tracker.trackerId)}
                    />

                    {
                        worker?.date && <span className={'tree-date'}><Moment format="L LTS">{worker.date}</Moment></span>
                    }
                </Container>
            </Container>
        );
    };

    render()
    {
        const { data } = this.props;
        if (!data || data.length === 0)
        {
            return null;
        }
        return (
            <div
                className={'tli-container'}
            >
                <ScrollView>
                    {
                        data.map((worker) => this.renderWorkerDetail(worker))
                    }
                </ScrollView>
            </div>
        );
    }
}

WorkerTreeView.propTypes = {
    data: PropTypes.array,
};

WorkerTreeView = inject('appStore', 'fieldForceStore')(
    observer(withRouter(WorkerTreeView)),
);
export { WorkerTreeView };


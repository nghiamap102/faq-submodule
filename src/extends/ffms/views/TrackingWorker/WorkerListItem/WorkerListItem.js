import './WorkerListItem.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { Container, Row, withI18n, FAIcon } from '@vbd/vui';

import ControlToggle from 'extends/ffms/bases/Control/ControlToggle';
import { WorkerDevice } from './WorkerDevice';

class WorkerListItem extends Component
{
    workerStore = this.props.fieldForceStore.workerStore;

    state = {
        toggle: false,
        currentTitleTracker: this.props.data[0],
    };

    handleTrackerClick = (tracker) =>
    {
        this.setState({
            // toggle: !this.state.toggle,
            currentTitleTracker: tracker,
        });

        this.props.onSelect && this.props.onSelect(tracker);
    };

    handleToggle = () =>
    {
        this.setState({
            toggle: !this.state.toggle,
        });
    }

    render()
    {
        const { data } = this.props;
        if (data.length > 1)
        {
            return (
                <ControlToggle
                    className="wli-toggle-panel"
                    visible
                    control={
                        <Row
                            className={'control'}
                        >
                            <FAIcon
                                className={'control-icon'}
                                icon={this.state.toggle ? 'chevron-down' : 'chevron-right'}
                                size={'0.75rem'}
                                type={'regular'}
                            />
                            <WorkerDevice
                                data={this.state.currentTitleTracker}
                                onClick={this.handleToggle}
                            />
                        </Row>
                    }
                    onClick={this.handleToggle}
                >
                    {
                        this.state.toggle ?
                            data.map((tracker) =>
                                <WorkerDevice
                                    className="device"
                                    key={tracker.trackerId}
                                    data={tracker}
                                    selected={tracker.trackerId === this.state.currentTitleTracker.trackerId}

                                    onClick={this.handleTrackerClick}
                                />,
                            ) : null
                    }
                </ControlToggle>);
        }
        else
        {
            return (
                <WorkerDevice
                    data={data[0]}
                    onClick={this.handleTrackerClick}
                />
            );
        }
    }
}

WorkerListItem.propTypes = {
    data: PropTypes.array,
    onSelect: PropTypes.func,
};

WorkerListItem = inject('fieldForceStore')(
    observer(withI18n(withRouter(WorkerListItem))),
);
export { WorkerListItem };

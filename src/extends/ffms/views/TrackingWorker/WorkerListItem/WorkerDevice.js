import './WorkerDevice.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { Container, Row, withI18n } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

class WorkerDevice extends Component
{
    workerStore = this.props.fieldForceStore.workerStore;

    state = {
        toggle: false,
    }

    render()
    {
        const { data, selected, className, onClick } = this.props;

        return (
            <Container
                className={cx('tree-line-item', { 'selected': selected }, className)}
                onClick={(e) =>
                {
                    e.stopPropagation();
                    onClick && onClick(data);
                }}
            >
                <Row
                    itemMargin={'sm'}
                >
                    <FAIcon
                        className="tree-line-icon"
                        icon={data.isActive ? 'mobile' : 'wifi-slash'}
                        size="0.75rem"
                    />
                                        
                    <span
                        className={`tracker-item ellipsis ${data.isActive ? 'active-tracker' : 'inactive-tracker'}`}
                    
                    >
                        { data.trackerId }
                    </span>
                </Row>
            </Container>
        );
    }
}

WorkerDevice.propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    selected: PropTypes.bool,

    onClick: PropTypes.func,
};

WorkerDevice = inject('fieldForceStore')(
    observer(withI18n(withRouter(WorkerDevice))),
);
export { WorkerDevice };

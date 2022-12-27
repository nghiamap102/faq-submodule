import './LayerSwitcher.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
    ScrollView,
    PanelHeader,
} from '@vbd/vui';

import { CameraSwitcherBoard } from './CameraSwitcherBoard';
import { TrackingSwitcherBoard } from './TrackingSwitcherBoard';
// import { TrackingTCDBSwitcherBoard } from './TrackingTCDBSwitcherBoard';
import { RasterSwitcherBoard } from './RasterSwitcherBoard';

export class LayerSwitcher extends Component
{
    closePanel = () =>
    {
        const path = this.props.match.path.split('/');
        path.pop();
        this.props.history.push(path.join('/'));
    };

    render()
    {
        return (
            <ScrollView options={{ suppressScrollX: true }}>
                <PanelHeader actions={[{ icon: 'times', onClick: this.closePanel }]}>
                    Tài nguyên và tính năng
                </PanelHeader>
                <CameraSwitcherBoard />
                <TrackingSwitcherBoard />
                {/* <TrackingTCDBSwitcherBoard/> */}
                <RasterSwitcherBoard />
            </ScrollView>
        );
    }
}

LayerSwitcher.propTypes = {
    // className: PropTypes.string,
};

LayerSwitcher.defaultProps = {
    // className: '',
};

LayerSwitcher = inject('appStore')(observer(LayerSwitcher));
LayerSwitcher = withRouter(LayerSwitcher);

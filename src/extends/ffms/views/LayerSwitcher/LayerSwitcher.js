import './LayerSwitcher.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { PanelHeader, ScrollView } from '@vbd/vui';
import { RasterSwitcherBoard } from 'components/app/LayerSwitcher/RasterSwitcherBoard';
import { LayerSwitcherItem } from 'extends/ffms/views/LayerSwitcher/LayerSwitcherItem';

export class LayerSwitcher extends Component
{
    handleClose = () =>
    {
        this.props.history.push('/' + this.props.history.location.pathname.split('/')[1]);
    };

    render()
    {
        return (
            <ScrollView options={{ suppressScrollX: true }}>
                <PanelHeader
                    actions={[
                        { icon: 'times', onClick: this.handleClose },
                    ]}
                >
                    Lớp dữ liệu trên bản đồ
                </PanelHeader>
                {/* <TrackingDutySwitcherBoard itemComponent={LayerSwitcherItem}/> */}
                <RasterSwitcherBoard
                    preloadData
                    toggleOn={this.props.fieldForceStore.toggleDataOn}
                    itemComponent={LayerSwitcherItem}
                    onChange={(item, checked, header) =>
                    {
                        if (header)
                        {
                            this.props.fieldForceStore.toggleDataOn[item.Id] = checked;
                        }
                    }}
                />
            </ScrollView>
        );
    }
}

LayerSwitcher.propTypes = {
    className: PropTypes.string,
};

LayerSwitcher.defaultProps = {
    className: '',
};

LayerSwitcher = inject('appStore', 'fieldForceStore')(observer(LayerSwitcher));
LayerSwitcher = withRouter(LayerSwitcher);


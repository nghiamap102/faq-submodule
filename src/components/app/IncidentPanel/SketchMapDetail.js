import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ScrollView } from '@vbd/vui';

import {
    FormGroup, FormControlLabel,
    Input,
    PanelHeader, FlexPanel,
    PanelHeaderWithSwitcher,
} from '@vbd/vui';

import { AdvanceSearchContainer } from 'components/app/AdvanceSearch/AdvanceSearchContainer';
import { GeofenceDetailPanel } from 'components/app/GeofencePanel/GeofenceDetailPanel';

import { BlockadePanel } from '../BlockadePanel/BlockadePanel';
import SketchMapPopupStyle from './SketchMapPopupStyle';

class SketchMapDetail extends Component
{
    sketchMapStore = this.props.appStore.sketchMapStore;

    componentDidMount()
    {
        const selectedControl = this.sketchMapStore.getSelectedControl();

        if (selectedControl)
        {
            selectedControl.components = selectedControl.components || {};
            selectedControl.components.advanceSearch = selectedControl.components.advanceSearch || {};
            selectedControl.components.geofence = selectedControl.components.geofence || {};
            selectedControl.components.blockade = selectedControl.components.blockade || {};
        }
    }

    handleClose = () =>
    {
        this.sketchMapStore.setSelectedControl();
    };

    handleTitleChange = (control, value) =>
    {
        control.title = value;
        this.sketchMapStore.setStylingControl(control, true);
    };

    handleSwitcherChange = (typeComponent, value) =>
    {
        if (typeComponent === 'geofence' || typeComponent === 'advanceSearch' || typeComponent === 'blockade')
        {
            const selectedControl = this.sketchMapStore.getSelectedControl();
            selectedControl.components[typeComponent].isEnabled = value;

            this.sketchMapStore.setStylingControl(selectedControl, true);
        }
    };

    render()
    {
        const selectedControl = this.sketchMapStore.getSelectedControl();

        const enableAdvanceSearch = selectedControl.type !== 'Label' && selectedControl.components.advanceSearch.isEnabled;
        const enableGeofence = selectedControl.type !== 'Label' && selectedControl.components.geofence.isEnabled;
        const enableBlockade = selectedControl.type === 'Point' && selectedControl.components.blockade.isEnabled;

        const readOnly = selectedControl.readOnly || this.sketchMapStore.isLock(selectedControl.id) || this.props.disabled;

        return (
            <FlexPanel
                style={{ height: '100vh' }}
                flex={1}
            >
                <PanelHeader actions={[{ icon: 'times', onClick: this.handleClose }]}>
                    Chi tiết
                </PanelHeader>

                <ScrollView options={{ suppressScrollX: true }}>
                    <FormGroup>
                        <FormControlLabel
                            label={'Tiêu đề'}
                            control={(
                                <Input
                                    disabled={readOnly}
                                    placeholder={'Nhập tiêu đề'}
                                    value={selectedControl.title}
                                    onChange={(value) =>
                                    {
                                        this.handleTitleChange(selectedControl, value);
                                    }}
                                />
                            )}
                        />

                        <SketchMapPopupStyle disabled={readOnly} />
                    </FormGroup>

                    {
                        selectedControl.type === 'Point' && (
                            <>
                                <PanelHeaderWithSwitcher
                                    value={enableBlockade ? 1 : 0}
                                    disabled={readOnly}
                                    onChanged={(value) => this.handleSwitcherChange('blockade', value)}

                                >
                                    Phong tỏa
                                </PanelHeaderWithSwitcher>
                                {
                                    enableBlockade &&
                                    <BlockadePanel readOnly={readOnly} />
                                }
                            </>
                        )
                    }

                    {
                        selectedControl.type !== 'Label' &&
                        (
                            <>
                                <PanelHeaderWithSwitcher
                                    value={enableGeofence ? 1 : 0}
                                    disabled={readOnly}
                                    onChanged={(value) => this.handleSwitcherChange('geofence', value)}
                                >
                                    Rào chắn ảo
                                </PanelHeaderWithSwitcher>
                                {
                                    enableGeofence &&
                                    <GeofenceDetailPanel readOnly={readOnly} />

                                }

                                <PanelHeaderWithSwitcher
                                    value={enableAdvanceSearch ? 1 : 0}
                                    disabled={readOnly}
                                    onChanged={(value) => this.handleSwitcherChange('advanceSearch', value)}
                                >
                                    Tìm kiếm nâng cao
                                </PanelHeaderWithSwitcher>
                                {
                                    enableAdvanceSearch &&
                                    <AdvanceSearchContainer readOnly={readOnly} />
                                }
                            </>
                        )
                    }
                </ScrollView>
            </FlexPanel>
        );
    }
}

SketchMapDetail = inject('appStore')(observer(SketchMapDetail));
export { SketchMapDetail };

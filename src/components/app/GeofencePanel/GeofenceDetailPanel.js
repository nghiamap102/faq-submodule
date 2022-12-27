import './Geofence.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Container, Row,
    TB1,
    CheckBox,
    Panel, PanelBody, PanelHeader,
    FormControlLabel, FormGroup, RichText, Input, InputGroup, InputAppend,
} from '@vbd/vui';

import { Constants } from 'constant/Constants';

class GeofenceDetailPanel extends Component
{
    geofenceStore = this.props.appStore.geofenceStore;

    onDescriptionChange = (value) =>
    {
        this.geofenceStore.updateGeofence('description', value);
    };

    onRadiusChange = (value) =>
    {
        this.geofenceStore.updateGeofence('radius', value);
    };

    onCkbInChange = (value) =>
    {
        this.geofenceStore.updateGeofence('states', {
            ...this.geofenceStore.selectedGeofence.states,
            in: value,
        });
    };

    onCkbOutChange = (value) =>
    {
        this.geofenceStore.updateGeofence('states', {
            ...this.geofenceStore.selectedGeofence.states,
            out: value,
        });
    };

    onStatusChange = (value) =>
    {
        this.geofenceStore.updateGeofence('states', value);
    };

    onMessageTemplateChange = (value) =>
    {
        this.geofenceStore.updateGeofence('messageTemplate', value);
    };

    onListJoiningCheckChange = (item) =>
    {
        item.checkingType === 0
            ? item.checkingType = 1
            : item.checkingType = 0;
    };

    onListMovingCheckChange = (item) =>
    {
        item.checkingType === 0
            ? item.checkingType = 1
            : item.checkingType = 0;
    };

    onIsDirectionChange = (value) =>
    {
        this.geofenceStore.updateGeofence('isDirection', value);
    };

    render()
    {
        const selectedGeofence = this.geofenceStore.selectedGeofence;
        const { readOnly } = this.props;

        if (!selectedGeofence)
        {
            return <></>;
        }

        return (
            <>
                <Container>
                    <FormGroup>
                        <FormControlLabel
                            label={'Mô tả'}
                            control={(
                                <Input
                                    disabled={readOnly}
                                    placeholder={'Nhập mô tả'}
                                    value={selectedGeofence.description}
                                    onChange={this.onDescriptionChange}
                                />
                            )}
                        />

                        {
                            selectedGeofence.type !== Constants.MAP_OBJECT.POLYGON && (
                                <FormControlLabel
                                    label={'Bán kính'}
                                    control={(
                                        <InputGroup>
                                            <Input
                                                disabled={readOnly}
                                                type="number"
                                                step={50}
                                                placeholder={'Nhập bán kính'}
                                                value={String(selectedGeofence.radius)}
                                                onChange={this.onRadiusChange}
                                            />
                                            <InputAppend>m</InputAppend>
                                        </InputGroup>
                                    )}
                                />
                            )}

                        <FormControlLabel
                            label={'Kích hoạt'}
                            control={(
                                <Row>
                                    <CheckBox
                                        label="Vào"
                                        checked={selectedGeofence.states.in}
                                        disabled={readOnly}
                                        onChange={this.onCkbInChange}
                                    />
                                    <CheckBox
                                        label="Ra"
                                        checked={selectedGeofence.states.out}
                                        disabled={readOnly}
                                        onChange={this.onCkbOutChange}
                                    />
                                </Row>
                            )}
                        />

                        <FormControlLabel
                            label={'Tin nhắn mẫu'}
                            control={(
                                <RichText
                                    disabled={readOnly}
                                    placeholder={'Nhập tin nhắn mẫu'}
                                    value={selectedGeofence.messageTemplate}
                                    color="rgba(255, 255, 255, 0.6)"
                                    rows={4}
                                    onChange={this.onMessageTemplateChange}
                                />
                            )}
                        />
                    </FormGroup>
                </Container>

                <Panel>
                    <PanelHeader>Danh sách theo dõi</PanelHeader>
                    <PanelBody>
                        <Container className="geofence-detail-list-follow">
                            {
                                selectedGeofence.listJoining.length > 0 && (
                                    <Container className="list-follow-joined">
                                        <TB1>Các lực lượng đang tham gia</TB1>
                                        {
                                            selectedGeofence.listJoining && selectedGeofence.listJoining.map((item) => (
                                                <CheckBox
                                                    key={item.Id}
                                                    disabled={readOnly}
                                                    label={item.title}
                                                    checked={item.checkingType === 1}
                                                    className="list-follow-item"
                                                    onChange={() => this.onListJoiningCheckChange(item)}
                                                />
                                            ),
                                            )
                                        }
                                    </Container>
                                )}
                            <Container className="list-follow-moving">
                                <TB1>Các lực lượng đang di chuyển</TB1>
                                {
                                    selectedGeofence.listJoining && selectedGeofence.listMoving.map((item) => (
                                        <CheckBox
                                            key={item.id}
                                            disabled={readOnly}
                                            label={item.title}
                                            checked={item.checkingType === 1}
                                            className="list-follow-item"
                                            onChange={() => this.onListMovingCheckChange(item)}
                                        />
                                    ),
                                    )
                                }
                            </Container>
                        </Container>
                    </PanelBody>
                </Panel>
            </>
        );
    }
}

GeofenceDetailPanel.propTypes = {
    readOnly: PropTypes.bool,
};

GeofenceDetailPanel.defaultProps = {
    readOnly: false,
};

GeofenceDetailPanel = inject('appStore')(observer(GeofenceDetailPanel));
export { GeofenceDetailPanel };

import './IncidentPanel.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Marker as MapMarker } from 'react-mapbox-gl';

import {
    Container,
    FormGroup, FormControlLabel,
    Input,
    Button, EmptyButton,
    withModal,
    Map,
    AdvanceSelect,
    FAIcon,
    Popup, PopupFooter,
} from '@vbd/vui';

import MapLocationAdvance from 'components/app/Location/MapLocationAdvance';

import { CommonHelper } from 'helper/common.helper';

import { IncidentService } from 'services/incident.service';
import { PersonService } from 'services/person.service';
import { IncidentTypeService } from 'services/incidentType.service';

import Enum from 'constant/app-enum';

const levelColor = [
    {
        level: 0,
        color: 'yellow',
        name: 'Ít nghiêm trọng',
    },
    {
        level: 1,
        color: 'cyan',
        name: 'Nghiêm trọng',
    },
    {
        level: 2,
        color: 'red',
        name: 'Đặc biệt nghiêm trọng',
    },
];

class AddIncidentPanel extends Component
{
    incidentStore = this.props.appStore.incidentStore;
    eventStore = this.props.appStore.eventStore;

    incidentSvc = new IncidentService(this.props.appStore);

    incidentTypeSvc = new IncidentTypeService();
    personSvc = new PersonService();

    state = {
        persons: [],
        incidentTypes: [],
    };

    constructor(props)
    {
        super(props);

        this.incidentSvc.gets().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.incidentStore.replace(rs.data);
            }
        });

        this.incidentTypeSvc.gets().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.setState({
                    incidentTypes: rs.data,
                });
            }
        });

        this.personSvc.gets().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.setState({
                    persons: rs.data,
                });
            }
        });
    }

    validate = (incident) =>
    {
        let isValid = true;

        if (incident.typeId == null)
        {
            this.props.toast({ type: 'error', message: 'Bạn chưa chọn loại sự cố' });
            isValid = false;
        }
        else if (incident.priority == null)
        {
            this.props.toast({ type: 'error', message: 'Bạn chưa chọn mức độ' });
            isValid = false;
        }
        else if (!incident.description)
        {
            this.props.toast({ type: 'error', message: 'Bạn chưa nhập mô tả' });
            isValid = false;
        }

        return isValid;
    };

    handleAddIncidentClicked = async () =>
    {
        const incident = CommonHelper.clone(this.incidentStore.addIncident);
        delete incident.changeLocationData;

        const isValid = this.validate(incident);
        if (isValid)
        {
            const rs = await this.incidentSvc.addWithNewLocation(incident);
            if (rs?.result === Enum.APIStatus.Success)
            {
                this.handleCloseAddClicked(); // for close

                this.props.toast({ type: 'info', message: 'Thêm thành công' });

                this.eventStore.closeAttachToIncident();
                this.eventStore.setStateDetail(false);
                this.eventStore.setDetail(undefined);

                this.incidentSvc.gets().then((iRs) =>
                {
                    if (iRs.result === Enum.APIStatus.Success)
                    {
                        this.incidentStore.replace(iRs.data);
                    }
                });
            }
            else
            {
                rs?.errorMessage && this.props.toast({ type: 'error', message: rs.errorMessage });
            }
        }
    };

    handleCloseAddClicked = () =>
    {
        this.incidentStore.addClose();
    };


    onTypeIdChange = (value) =>
    {
        this.incidentStore.addChangeData('typeId', value);
    };

    onPriorityChange = (value) =>
    {
        this.incidentStore.addChangeData('priority', value);
    };

    onDescriptionChange = (value) =>
    {
        this.incidentStore.addChangeData('description', value);
    };

    handleLocationChange = (location) =>
    {
        const newLocation = { ...location, address1: location.address };
        delete newLocation.address;

        this.incidentStore.addChangeData('location', newLocation);
    };

    render()
    {
        const { incidentTypes } = this.state;
        const typeOption = incidentTypes && incidentTypes.map((type) => ({ id: type.id, label: type.name }));

        let levelOption = levelColor && levelColor.map((level) => ({ id: level.level, label: level.name }));
        if (this.incidentStore.addIncident !== undefined && this.incidentStore.addIncident.typeId !== undefined)
        {
            let selectedType = incidentTypes.filter((type) =>
            {
                if (type.id === this.incidentStore.addIncident.typeId)
                {
                    return type;
                }
                return false;
            });

            selectedType = selectedType[0];

            const levels = selectedType.actionPlan !== undefined ? selectedType.actionPlan : levelColor;

            levelOption = levels.map((level) => ({ id: level.level, label: level.name }));
        }

        return (
            <Container className={`add-incident ${this.props.className}`}>
                {
                    this.incidentStore.addIncident !== undefined &&
                    (
                        <Popup
                            title="Tạo sự cố mới"
                            width="600px"
                            padding={'0'}
                            onClose={this.handleCloseAddClicked}
                        >
                            <FormGroup>
                                <FormControlLabel
                                    label={'Loại sự cố'}
                                    direction={'column'}
                                    control={(
                                        <AdvanceSelect
                                            value={this.incidentStore.addIncident.typeId}
                                            options={typeOption}
                                            placeholder={'Chọn loại sự cố'}
                                            onChange={this.onTypeIdChange}
                                        />
                                    )}
                                />

                                <FormControlLabel
                                    label={'Mức độ'}
                                    direction={'column'}
                                    control={(
                                        <AdvanceSelect
                                            value={this.incidentStore.addIncident.priority}
                                            options={levelOption}
                                            placeholder={'Chọn mức độ'}
                                            onChange={this.onPriorityChange}
                                        />
                                    )}
                                />

                                <FormControlLabel
                                    label={'Mô tả'}
                                    direction={'column'}
                                    control={(
                                        <Input
                                            value={this.incidentStore.addIncident.description}
                                            placeholder="Vui lòng điền thông tin mô tả về sự cố ở đây..."
                                            onChange={this.onDescriptionChange}
                                        />
                                    )}
                                />

                                {
                                    this.incidentStore.addIncident && (
                                        <MapLocationAdvance
                                            location={{
                                                ...this.incidentStore.addIncident.location,
                                                address: this.incidentStore.addIncident.location.address1,
                                            }}
                                            onLocationChange={this.handleLocationChange}
                                        />
                                    )}
                            </FormGroup>

                            <PopupFooter>
                                <EmptyButton
                                    text="Hủy"
                                    onClick={this.handleCloseAddClicked}
                                />
                                <Button
                                    color="primary"
                                    text="Tạo"
                                    onClick={this.handleAddIncidentClicked}
                                />
                            </PopupFooter>
                        </Popup>
                    )
                }
            </Container>
        );
    }
}

AddIncidentPanel = withModal(inject('appStore')(observer(AddIncidentPanel)));
export default AddIncidentPanel;

class AddIncidentMap extends Component
{
    mapStore = this.props.appStore.mapStore;
    incidentStore = this.props.appStore.incidentStore;

    render()
    {
        return (
            <Map
                style={this.mapStore.defaultStyle}
                center={{
                    lng: this.incidentStore.addIncident.location.longitude,
                    lat: this.incidentStore.addIncident.location.latitude,
                }}
                zoomLevel={[12.5]}
                height="300px"
                dragPan={false}
                dragRotate={false}
                scrollZoom={false}
                boxZoom={false}
                interactive={false}
                isNotControl
                onClick={this.props.onClick}
            >
                <MapMarker
                    coordinates={[this.incidentStore.addIncident.location.longitude, this.incidentStore.addIncident.location.latitude]}
                    anchor="bottom"
                >
                    <FAIcon
                        icon="map-marker-alt"
                        color="red"
                        type="solid"
                        size="18pt"
                    />
                </MapMarker>
            </Map>
        );
    }
}

AddIncidentMap = inject('appStore')(observer(AddIncidentMap));

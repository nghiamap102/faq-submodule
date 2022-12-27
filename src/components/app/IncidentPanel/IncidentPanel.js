import './IncidentPanel.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Moment from 'react-moment';

import {
    Container,
    TB1, TB2,
    ListItem,
    PanelHeader,
    FAIcon,
    ProgressBar, ScrollView,
} from '@vbd/vui';

import { IncidentService } from 'services/incident.service';
import { LocationService } from 'services/location.service';
import { PersonService } from 'services/person.service';
import { IncidentTypeService } from 'services/incidentType.service';
import TrackingService from 'services/tracking.service';
import { DirectionService } from 'services/direction.service';

import { AppConstant } from 'constant/app-constant';

const Enum = require('constant/app-enum');

class IncidentPanel extends Component
{
    incidentStore = this.props.appStore.incidentStore;

    incidentSvc = new IncidentService();
    locationSvc = new LocationService();
    incidentTypeSvc = new IncidentTypeService();
    trackingSvc = new TrackingService();
    personSvc = new PersonService();
    directionSvc = new DirectionService();

    state = {
        persons: [],
        incidentTypes: [],
        locations: [],
        isCreate: false,
        createData: {},
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

        this.locationSvc.gets().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.setState({
                    locations: rs.data,
                });
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

    componentWillUnmount()
    {
        this.incidentStore.closeNearestMarker();
        this.incidentStore.closeNearestDirection();
    }

    handleAddClicked = async () =>
    {
        let rs = undefined;
        let longitude = undefined;
        let latitude = undefined;

        if (this.props.type === 'console')
        {
            longitude = AppConstant.defaultAddIncidentGeo.lng;
            latitude = AppConstant.defaultAddIncidentGeo.lat;
            rs = await this.locationSvc.getLocationDataByGeo(AppConstant.defaultAddIncidentGeo.lng, AppConstant.defaultAddIncidentGeo.lat);
        }
        else // station
        {
            longitude = window.map.transform.center.lng;
            latitude = window.map.transform.center.lat;
            rs = await this.locationSvc.getLocationDataByGeo(window.map.transform.center.lng, window.map.transform.center.lat);
        }

        if (rs.result === Enum.APIStatus.Success && rs.data)
        {
            this.incidentStore.addShow({
                location: {
                    longitude: longitude,
                    latitude: latitude,
                    address1: `${rs.data.street}, ${rs.data.ward}`,
                    city: rs.data.province,
                    country: rs.data.country,
                },
            });
        }
        else
        {
            this.incidentStore.addShow({
                location: {
                    longitude: longitude,
                    latitude: latitude,
                },
            });
        }
    };

    handleIncidentChoosing = async (event) =>
    {
        if (window.map !== undefined)
        {
            // go to location
            window.map.flyTo({
                center: [event.data.location.longitude, event.data.location.latitude],
                zoom: 15,
            });
        }

        // start workflow when clicking in an incident
        if (event.data.wfCode !== undefined)
        {
            const data = { ...event.data };
            this.incidentSvc.start(data).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    if (rs.data.wfProcessId !== event.data.wfProcessId)
                    {
                        data.wfProcessId = rs.data.wfProcessId;
                    }
                }
                this.incidentSvc.getEvents(event.data.id).then((rs) =>
                {
                    if (rs.result === Enum.APIStatus.Success)
                    {
                        this.incidentStore.setDetail({
                            headerInfo: data,
                            items: rs.data,
                            longitude: event.data.location.longitude,
                            latitude: event.data.location.latitude,
                        });
                    }
                });
            });
        }
        else
        {
            this.incidentSvc.getEvents(event.data.id).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.incidentStore.setDetail({
                        headerInfo: event.data,
                        items: rs.data,
                        longitude: event.data.location.longitude,
                        latitude: event.data.location.latitude,
                    });
                }
            });
        }
        // end

        const markers = [];

        const getNearest = [];
        getNearest.push(this.trackingSvc.getDeviceNearestMapSearch([event.data.location.longitude, event.data.location.latitude]));
        // getNearest.push(this.trackingSvc.getDeviceNearestTracking([event.data.location.longitude, event.data.location.latitude]));

        Promise.all(getNearest).then((rs) =>
        {
            const mapSearchMarkers = rs[0];
            // let trackingMarkers = rs[1];

            if (Array.isArray(mapSearchMarkers.data))
            {
                for (const d of mapSearchMarkers.data)
                {
                    const coordinates = JSON.parse(d.Location).coordinates;
                    markers.push({
                        id: d.Id,
                        layer: 'incident-nearest-marker',
                        icon: d.Layer === 'ICS_POLICESTATIONS' ? 'male' : d.Layer === 'ICS_FIRESTATIONS' ? 'fire-extinguisher' : 'tint',
                        color: '#4FFF06',
                        size: 48,
                        draw: 'symbol',
                        lng: coordinates[0],
                        lat: coordinates[1],
                        text: d.Title + ' - ' + Math.round(d.NearestDistance / 100) / 10 + ' km',
                        onClick: this.handleClickNearestMarker,
                    });
                }
            }

            // if (Array.isArray(trackingMarkers.data))
            // {
            //     for (let d of trackingMarkers.data)
            //     {
            //         let icon = '';
            //         switch (d.TransType)
            //         {
            //             case 1:
            //                 icon = 'car';
            //                 break;
            //             case 2:
            //                 icon = 'car-garage';
            //                 break;
            //             case 4:
            //                 icon = 'mobile';
            //                 break;
            //             case 8:
            //                 icon = 'motorcycle';
            //                 break;
            //             case 16:
            //                 icon = 'camera';
            //                 break;
            //             default:
            //         }
            //
            //         markers.push({
            //             id: d.TrackerID,
            //             layer: 'incident-nearest-marker',
            //             icon: icon,
            //             color: '#4FFF06',
            //             size: 48,
            //             draw: 'symbol',
            //             lng: d.Longitude,
            //             lat: d.Latitude,
            //             text: d.Title + ' - ' + Math.round(d.NearestDistance / 100) / 10 + ' km',
            //             onClick: this.handleClickNearestMarker
            //         });
            //     }
            // }

            this.incidentStore.showNearestMarker(markers);
        });
    };

    handleClickNearestMarker = async (event) =>
    {
        if (this.incidentStore.incident)
        {
            const points = [
                {
                    'Longitude': this.incidentStore.incident.longitude,
                    'Latitude': this.incidentStore.incident.latitude,
                },
                {
                    'Longitude': event.lng,
                    'Latitude': event.lat,
                },
            ];
            const routes = await this.directionSvc.getRouteAvoidBarrier(points, 3, 0); // Car and fastest
            if (routes)
            {
                const formatRoutes = {
                    route_1: routes[0],
                    route_2: routes[1] ? routes[1] : null,
                    route_3: routes[2] ? routes[2] : null,
                };

                let primaryRouteInfo = {};
                if (formatRoutes.route_1.Via_Distances && formatRoutes.route_1.Via_Durations)
                {
                    primaryRouteInfo = {
                        distance: formatRoutes.route_1.Via_Distances[formatRoutes.route_1.Via_Distances.length - 1],
                        duration: formatRoutes.route_1.Via_Durations[formatRoutes.route_1.Via_Durations.length - 1],
                    };
                }

                this.incidentStore.showNearestDirection(formatRoutes, primaryRouteInfo);
            }
        }
    };

    render()
    {
        if (!this.incidentStore.incidents)
        {
            return null;
        }

        return (
            <Container className={`incident-panel ${this.props.className}`}>

                <PanelHeader actions={[{ icon: 'plus', title: 'Create New', onClick: this.handleAddClicked }]}>
                    Sự cố
                </PanelHeader>

                <ScrollView scrollX={false}>
                    {
                        this.props.type === 'station' &&
                        (
                            this.incidentStore.incidents.map((incident) => (
                                <StationIncidentItem
                                    key={incident.id}
                                    {...incident}
                                    activateIncident={this.incidentStore.incident}
                                    onClick={this.handleIncidentChoosing}
                                />
                            ),
                            )
                        )
                    }

                    {
                        this.props.type === 'console' &&

                        (
                            <Container className={'incident-console-list'}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th />
                                            <th>Date and Time</th>
                                            <th>ID</th>
                                            <th>Location</th>
                                            <th>Type</th>
                                            <th>Owner</th>
                                            <th>Progress</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.incidentStore.incidents.map((incident) => (
                                                <ConsoleIncidentItem
                                                    key={incident.id}
                                                    {...incident}
                                                    activateIncident={this.incidentStore.incident}
                                                    onClick={this.handleIncidentChoosing}
                                                />
                                            ),
                                            )
                                        }
                                    </tbody>
                                </table>
                            </Container>
                        )
                    }
                </ScrollView>
            </Container>
        );
    }
}

IncidentPanel = inject('appStore')(observer(IncidentPanel));
export default IncidentPanel;

const levelColor = [
    {
        id: 0,
        color: 'yellow',
    },
    {
        id: 1,
        color: 'cyan',
    },
    {
        id: 2,
        color: 'red',
    },
];

class StationIncidentItem extends Component
{
    handleIncidentChoosing = (event) =>
    {
        this.props.onClick({ id: this.props.id, data: this.props });
    };

    renderSub = () =>
    {
        return (
            <>
                <TB2>
                    {this.props.location?.address1} {this.props.location?.city} {this.props.location?.country}
                </TB2>
                <TB2><Moment format={'L LTS'}>{this.props.createdDate}</Moment></TB2>
                <ProgressBar
                    total={this.props.eventCount}
                    value={this.props.finishedEventCount}
                />
            </>
        );
    };

    render()
    {
        let color = '';
        if (this.props.priorityColor !== undefined)
        {
            color = this.props.priorityColor;
        }
        else
        {
            color = levelColor[this.props.priority]?.color;
        }

        return (
            <ListItem
                icon={(
                    <FAIcon
                        className={'icon'}
                        icon={'exclamation-circle'}
                        type={'solid'}
                        size={'1.5rem'}
                        color={color}
                    />
                )}
                label={(
                    <>
                        <TB1>{this.props.description}</TB1>
                        <TB1>ID {this.props.incidentId}</TB1>
                    </>
                )}
                sub={this.renderSub()}
                active={this.props.id === this.props.activateIncident?.headerInfo.id}
                onClick={this.handleIncidentChoosing}
            />
        );
    }
}

class ConsoleIncidentItem extends Component
{
    handleIncidentChoosing = (event) =>
    {
        this.props.onClick({ id: this.props.id, data: this.props });
    };

    render()
    {
        let color = '';
        if (this.props.priorityColor !== undefined)
        {
            color = this.props.priorityColor;
        }
        else
        {
            color = levelColor[this.props.priority]?.color;
        }

        return (
            <tr
                className={`${this.props.id === this.props.activateIncident?.headerInfo.id ? 'active' : ''}`}
                onClick={this.handleIncidentChoosing}
            >
                <td>
                    <FAIcon
                        className={'icon'}
                        icon={'exclamation-circle'}
                        type={'solid'}
                        size={'18px'}
                        color={color}
                    />
                </td>
                <td><Moment format={'L LTS'}>{this.props.createdDate}</Moment></td>
                <td>{this.props.incidentId}</td>
                <td>{this.props.location?.address1} {this.props.location?.city} {this.props.location?.country}</td>
                <td>{this.props.type?.name}</td>
                <td>{this.props.person?.firstName} {this.props.person?.lastName}</td>
                <td>
                    <ProgressBar
                        total={this.props.eventCount}
                        value={this.props.finishedEventCount}
                    />
                </td>
                <td>{this.props.description}</td>
            </tr>
        );
    }
}

IncidentPanel.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['station', 'console']),
    data: PropTypes.array,
    onAddClicked: PropTypes.func,
    onChoosingIncident: PropTypes.func,
};

IncidentPanel.defaultProps = {
    className: '',
    type: 'station',
    data: [],
    onAddClicked: () =>
    {

    },
    onChoosingIncident: () =>
    {

    },
};

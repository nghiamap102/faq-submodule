import './IncidentDetailWorkflowInformation.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { inject, observer } from 'mobx-react';

import {
    Container, TB1,
    FAIcon,
    FormField,
    TreeSelectPopup,
    AdvanceSelectControl,
} from '@vbd/vui';

import { UserService } from 'services/user.service';
import { IncidentService } from 'services/incident.service';

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

class IncidentDetailWorkflowInformation extends Component
{
    UserService = new UserService();
    incidentSv = new IncidentService(this.props.appStore);

    incidentStore = this.props.appStore.incidentStore;

    state = {
        creator: null,
        showForceSelector: false,
        forceTree: null,
    };

    componentDidMount()
    {
        const { information } = this.props;

        if (information.createdBy)
        {
            this.UserService.get(information.createdBy).then((creator) =>
            {
                if (creator)
                {
                    this.setState({ creator });
                }
            });
        }

        this.incidentStore.getForceTree().then((forceTree) =>
        {
            this.setState({ forceTree });
        });
    }

    getForceSelectionText(forces)
    {
        if (!forces)
        {
            return null;
        }

        let text = forces.map((f) => f.name).join(', ');

        if (text.length > 26)
        {
            text = text.substr(0, 24) + '...';
        }

        return text;
    }

    handleForceSelect = () =>
    {
        this.setState({ showForceSelector: !this.state.showForceSelector });
    };

    handleForceChange = async (forcesData) =>
    {
        const incident = this.incidentStore.incident;

        const forces = forcesData.map((data) =>
        {
            return {
                id: data.id,
                parentId: data.parentId,
                caId: data.caId,
                name: data.label,
                level: data.level,
                uniqueId: data.uniqueId,
            };
        });

        incident.headerInfo.forces = forces;

        this.incidentSv.updateForces({ id: incident.headerInfo.id, forces });
    };

    render()
    {
        const { creator, showForceSelector, forceTree } = this.state;
        const { forces, readOnly } = this.incidentStore.incident.headerInfo;

        const forceOptions = forces?.map((f) => ({ id: f.id, label: f.name }));
        const forceValues = forces?.map((f) => f.id);

        let color = '';
        if (this.props.information.priorityColor !== undefined)
        {
            color = this.props.information.priorityColor;
        }
        else
        {
            color = levelColor[this.props.information.priority].color;
        }

        return (
            <Container className={`id-info id-info-${this.props.type} ${this.props.className}`}>
                <Container className="id-info-sector border-right">
                    <FormField
                        label={(
                            <FAIcon
                                icon={'exclamation-circle'}
                                type={'solid'}
                                size={'18px'}
                                color={color}
                            />
                        )}
                    >
                        <TB1 color="white">{this.props.information.type?.name}</TB1>
                    </FormField>

                    <FormField
                        className="id-info-content"
                        label={(
                            <FAIcon
                                icon={'align-left'}
                                type={'regular'}
                                size={'18px'}
                            />
                        )}
                    >
                        {this.props.information.description}
                    </FormField>
                </Container>

                <Container className="id-info-sector">
                    <FormField
                        label={(
                            <FAIcon
                                icon="clock"
                                type={'regular'}
                                size={'18px'}
                            />
                        )}
                    >
                        <Moment format={'L LTS'}>{this.props.information.createdDate}</Moment>
                    </FormField>

                    <FormField
                        className="id-info-location"
                        label={(
                            <FAIcon
                                icon="map-marker-alt"
                                type={'regular'}
                                size={'18px'}
                            />
                        )}
                    >
                        <TB1>{this.props.information.location?.address1} {this.props.information.location?.city} {this.props.information.location?.country}</TB1>
                        {/* <FAIcon */}
                        {/*    icon='chevron-right' */}
                        {/*    size='16px' */}
                        {/*    onClick={this.props.onLocationClicked} */}
                        {/* /> */}
                    </FormField>

                    <FormField
                        className="id-info-people"
                        label={(
                            <FAIcon
                                icon="user"
                                type={'regular'}
                                size={'18px'}
                            />
                        )}
                    >
                        <Container className="id-info-people-content">
                            <Container className="id-info-people-name">
                                {creator ? creator.displayName : null}
                            </Container>
                            {/* <Button */}
                            {/*    className='id-info-people-tool' */}
                            {/*    icon='times' */}
                            {/*    iconSize='16px' */}
                            {/*    iconLocation='left' */}
                            {/*    text='' */}
                            {/*    noBorder */}
                            {/*    onlyIcon */}
                            {/*    onClick={this.props.onPeopleCloseClicked} */}
                            {/* /> */}
                            {/* <Button */}
                            {/*    className='id-info-people-tool tool-last' */}
                            {/*    icon='user-friends' */}
                            {/*    iconSize='16px' */}
                            {/*    iconLocation='left' */}
                            {/*    text='' */}
                            {/*    noBorder */}
                            {/*    onlyIcon */}
                            {/*    onClick={this.props.onPeopleChangeClicked} */}
                            {/* /> */}
                        </Container>
                    </FormField>

                    <FormField
                        className="id-info-people"
                        label={(
                            <FAIcon
                                icon="users"
                                type={'regular'}
                                size={'18px'}
                            />
                        )}
                    >
                        <AdvanceSelectControl
                            disabled={readOnly}
                            options={forceOptions}
                            value={forceValues}
                            placeholder={'Chọn lực lượng'}
                            multi
                            onControlClick={this.handleForceSelect}
                        />
                    </FormField>

                    {forceTree && forceTree.length > 0 && showForceSelector && (
                        <TreeSelectPopup
                            className={'tree-select-popup'}
                            isShow={showForceSelector}
                            title={'Chọn lực lượng tham gia'}
                            data={forceTree}
                            nodeSelected={forces}
                            onSave={this.handleForceChange}
                            onClose={this.handleForceSelect}
                        />
                    )}

                </Container>
            </Container>
        );
    }
}

IncidentDetailWorkflowInformation.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['station', 'console']),
    level: PropTypes.number,
    information: PropTypes.object,
    onPeopleCloseClicked: PropTypes.func,
    onPeopleChangeClicked: PropTypes.func,
    onLocationClicked: PropTypes.func,
};

IncidentDetailWorkflowInformation.defaultProps = {
    className: '',
    type: 'station',
    level: 1,
    information: {},
    onPeopleCloseClicked: () =>
    {

    },
    onPeopleChangeClicked: () =>
    {

    },
    onLocationClicked: () =>
    {

    },
};

IncidentDetailWorkflowInformation = inject('appStore')(observer(IncidentDetailWorkflowInformation));
export default IncidentDetailWorkflowInformation;

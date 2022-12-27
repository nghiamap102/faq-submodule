import './MapContextGroup.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { Button, withModal } from '@vbd/vui';

import { IncidentService } from 'services/incident.service';
import TrackingService from 'services/tracking.service';

class InviteButton extends Component
{
    incidentSv = new IncidentService();
    trackingSv = new TrackingService();

    markerStore = this.props.appStore.markerStore;
    incidentStore = this.props.appStore.incidentStore;
    featureBarStore = this.props.appStore.featureBarStore;

    handleInvite = () =>
    {
        const { userData } = this.props;
        const listActive = this.markerStore.listActive.filter((marker) => marker.type === 'tracking');

        if (this.incidentStore.incident)
        {
            const incidentId = this.incidentStore.incident.headerInfo.incidentId;

            if (userData)
            {
                this.inviteUsers(incidentId, [userData.Username]);
            }
            else
            {
                const trackerIds = listActive.map((marker) => marker.id);

                this.trackingSv.getDevicesByTrackerIds(trackerIds).then((rs) =>
                {
                    const userNames = rs.data.map((d) => d.Metadata && d.Metadata.Username).filter((d) => d);

                    this.inviteUsers(incidentId, userNames);
                });
            }
        }
        else
        {
            this.props.alert({
                message: 'Vui lòng chọn sự cố để trước khi mời tham gia',
                onOk: () =>
                {
                    const path = this.props.match.path.split('/');
                    const newPath = ['', path[1], 'incident'].join('/');
                    this.props.history.push(newPath);
                },
            });
        }
    };

    inviteUsers = (incidentId, userNames) =>
    {
        if (userNames && userNames.length)
        {
            this.incidentSv.inviteMembers({
                users: userNames,
                incidentId: incidentId,
            });
            this.props.alert({ message: `Đã gửi lời mới đến ${userNames.join(', ')}` });
        }
        else
        {
            this.props.alert({ message: 'Không có người dùng nào trong danh sách bạn chọn' });
        }
    };

    render()
    {
        const { userData } = this.props;
        const listActive = this.markerStore.listActive.filter((marker) => marker.type === 'tracking');

        return (listActive.length || userData != null) && (
            <Button
                className={'mcg-button'}
                text={userData ? 'Mời' : `Mời tham gia (${listActive.length})`}
                color={'primary'}
                icon={'plus'}
                onClick={this.handleInvite}
            />
        );
    }
}

InviteButton = inject('appStore')(observer(InviteButton));
InviteButton = withModal(withRouter(InviteButton));
export { InviteButton };

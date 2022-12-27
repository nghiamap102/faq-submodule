import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Helmet } from 'react-helmet';

import {
    ContainerPanel,
    WebSocketService,
    withModal,
} from '@vbd/vui';

import AddIncidentPanel from 'components/app/IncidentPanel/AddIncident';
import { FileManager } from 'components/app/MapManager/FileManager';
import { InitDataManager } from 'components/app/MapManager/InitDataManager';
import StreetViewPopup from 'components/app/Map/StreetView/StreetViewPopup';
import SideFeature from 'components/app/CommandStation/SideFeature';

import Enum from 'constant/app-enum';

import { IncidentService } from 'services/incident.service';

let CommandStation = (props) =>
{
    const { loadProfile } = props.appStore;
    const incidentSvc = new IncidentService();

    useEffect(() =>
    {
        loadProfile();

        WebSocketService.init({
            url: window.location.origin.replace(/http|https/, 'ws') + '/ws',
            debug: false,
            reconnect: true,
        });

        WebSocketService.subscribeChanel('incident', handleWsMessage);
        WebSocketService.subscribeChanel('geofence', handleGeofenceNotify);
    }, []);

    const handleWsMessage = (message) =>
    {
    };

    const handleGeofenceNotify = (message) =>
    {
        try
        {
            incidentSvc.getSketchMapControl(message.geofenceId).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success && rs.data)
                {
                    const sketchmap = rs.data;

                    for (const control of sketchmap.data)
                    {
                        if (control.components && control.components.geofence && control.components.geofence.id === message.geofenceId)
                        {
                            const geofence = control.components.geofence;
                            const toastMessage = geofence.messageTemplate
                                .replace('{trackerId}', message.trackerId)
                                .replace('{state}', message.state === 1 ? 'vào' : 'ra khỏi')
                                .replace('{descrption}', geofence.description);

                            this.props.toast({ type: 'info', message: toastMessage });

                            const mmMessage = geofence.messageTemplate
                                .replace('{trackerId}', `\`${message.trackerId}\``)
                                .replace('{state}', message.state === 1 ? '`vào`' : '`ra khỏi`')
                                .replace('{descrption}', `\`${geofence.description}\``);

                            incidentSvc.sendMessageToChannel({
                                channelId: geofence.matterMostChannelId,
                                message: mmMessage,
                            });
                        }
                    }
                }
            });
        }
        catch (error)
        {
            console.error('GET GEOFENCE ERROR: ', error);
        }
    };

    return (
        <ContainerPanel>
            <Helmet>
                <title>C4I2</title>
                <meta
                    name="application-name"
                    content="C4I2"
                />
                <meta
                    name="apple-mobile-web-app-title"
                    content="C4I2"
                />
            </Helmet>

            <SideFeature />

            {/* <SipProvider */}
            {/*    host={'sbcwrtchcm.ccall.vn'} */}
            {/*    port={8080} */}
            {/*    pathname={'/ws'} */}
            {/*    user={'102'} */}
            {/*    password={'W^dFuRdsAj'} */}
            {/*    domain={'vietbdhcm026.ccall.vn'} */}
            {/*    debug={false} */}
            {/* /> */}

            <InitDataManager />
            <AddIncidentPanel />
            <FileManager />
            <StreetViewPopup />
        </ContainerPanel>
    );
};

CommandStation = withModal(inject('appStore')(observer(CommandStation)));
export default CommandStation;

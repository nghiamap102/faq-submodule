import React, { useEffect, useState } from 'react';
import { Provider } from 'mobx-react';

import {
    Row,
    Expanded,
} from '@vbd/vui';

import DeviceSignalMonitoringList from 'components/app/DeviceSignalMonitoring/DeviceSignalMonitoringList';
import DeviceSignalMonitoringMap from 'components/app/DeviceSignalMonitoring/DeviceSignalMonitoringMap';
import { DeviceSignalMonitoringStore } from 'components/app/DeviceSignalMonitoring/DeviceSignalMonitoringStore';

import { MonitoringService } from 'services/monitoringService';

const DeviceSignalMonitoring = (props) =>
{
    const sv = new MonitoringService();
    const [data, setData] = useState([]);
    const [store, setStore] = useState(new DeviceSignalMonitoringStore());

    useEffect(() =>
    {
        sv.getZabbixSignalStatus().then((rs) =>
        {
            if (rs)
            {
                const dt = [];
                for (let i = 0; i < rs.length; i++)
                {
                    try
                    {
                        const des = JSON.parse(rs[i].description);
                        dt.push({
                            ...rs[i],
                            x: des.location.latitude,
                            y: des.location.longitude,
                            signal: rs[i].error ? 2 : 1,
                        });
                    }
                    catch (e)
                    {
                        console.error(e.message);
                    }
                }
                setData(dt);
                store.setData(dt);
            }
        });
    }, []);

    return (
        <Provider deviceSignalStore={store}>
            <Row>
                <Expanded>
                    <DeviceSignalMonitoringList data={data} />
                </Expanded>
                <Expanded>
                    <DeviceSignalMonitoringMap data={data} />
                </Expanded>
            </Row>
        </Provider>
    );
};

export default DeviceSignalMonitoring;

import './CameraMonitoring.scss';

import React, { useEffect, useState } from 'react';
import { inject, observer, Provider } from 'mobx-react';

import {
    Row,
    BorderPanel, PanelBody,
    Expanded,
} from '@vbd/vui';

import CameraMonitoringList from 'components/app/CameraMonitoring/CameraMonitoringList';
import { CameraMonitoringMap } from 'components/app/CameraMonitoring/CameraMonitoringMap';

import { CameraMonitoringStore } from 'components/app/CameraMonitoring/CameraMonitoringStore';

import { MonitoringService } from 'services/monitoringService';
import LayerService from 'services/layer.service';

import { Constants } from 'constant/Constants';

let CameraMonitoring = (props) =>
{
    const [data, setData] = useState({ total: 0, cameras: [] });
    const [store, setStore] = useState(new CameraMonitoringStore());

    const [pagingData, setPagingData] = useState({
        page: 1,
        pageSize: 20,
    });

    const sv = new MonitoringService();
    const layerSv = new LayerService();

    useEffect(() =>
    {
        getData(pagingData);
    }, []);

    const getData = async (pagingData) =>
    {
        const qualityRs = await sv.getDetectionsCount({
            // skip: (pagingData.page - 1) * pagingData.pageSize,
            // limit: pagingData.pageSize
            skip: 0,
            limit: 1000,
        });

        const cameras = await layerSv.getLayers({
            path: '/root/vdms/tangthu/data/cameralpr',
            layers: ['CAMERALPR'],
            // start: (pagingData.page - 1) * pagingData.pageSize,
            // count: pagingData.pageSize
        });

        if (qualityRs && qualityRs.data && qualityRs.data.data)
        {
            let dt = qualityRs.data.data;

            for (let i = 0; i < dt.length; i++)
            {
                dt[i].x = dt[i].X;
                dt[i].y = dt[i].Y;

                if (dt[i].Ago)
                {
                    if (dt[i].Ago / 86400000 >= 1)
                    {
                        dt[i].AgoStatus = Constants.CAMERA_STATUS.BROKEN;
                    }
                    else
                    {
                        dt[i].AgoStatus = Constants.CAMERA_STATUS.GOOD;
                    }
                }
                else
                {
                    dt[i].AgoStatus = Constants.CAMERA_STATUS.NO_DATA;
                }

                if (cameras && cameras.data)
                {
                    const match = cameras.data.find(c => c.TEN_CAMERA === dt[i].Learn_SystemName);
                    if (match)
                    {
                        dt[i] = { ...dt[i], ...match };
                        cameras.data.splice(cameras.data.indexOf(match), 1);
                    }
                }
            }

            if (cameras && cameras.data && cameras.data.length)
            {
                dt = dt.concat(cameras.data);
                const signals = await getSignals(cameras.data);
                for (let k = 0; k < dt.length; k++)
                {
                    if (!dt[k].x)
                    {
                        dt[k].x = dt[k].Y;
                    }
                    if (!dt[k].y)
                    {
                        dt[k].y = dt[k].X;
                    }
                    if (!dt[k].CameraName)
                    {
                        dt[k].CameraName = dt[k].TEN_CAMERA;
                    }
                    if (signals && signals.length)
                    {
                        const signal = signals.find(s => s.name === dt[k].CameraName);
                        if (signal)
                        {
                            dt[k].signal = signal.status ? Constants.CAMERA_STATUS.GOOD : Constants.CAMERA_STATUS.BROKEN;
                        }
                    }
                }
            }
            store.initData(dt);
        }
    };

    const getSignals = async (data) =>
    {
        if (data.length)
        {
            const camNames = data.map(d => d.TEN_CAMERA);
            const signals = await sv.getSignalStatus(camNames);
            return signals.data;
        }
        return null;
    };

    const getQualityStatus = (dt) =>
    {
        const getStatus = (val, type) =>
        {
            let status = 'good';
            let des = 'Tốt';

            if (type === 'count24H')
            {
                if (val <= 0)
                {
                    status = 'broke';
                    des = 'Hỏng';
                }
                else if (val > 0 && val < 100)
                {
                    status = 'bad';
                    des = 'Kém';
                }
            }
            else if (type === 'count7D')
            {
                if (val <= 0)
                {
                    status = 'broke';
                    des = 'Hỏng';
                }
                else if (val > 0 && val < 700)
                {
                    status = 'bad';
                    des = 'Kém';
                }
            }
            else if (type === 'count30D')
            {
                if (val <= 0)
                {
                    status = 'broke';
                    des = 'Hỏng';
                }
                else if (val > 0 && val < 3000)
                {
                    status = 'bad';
                    des = 'Kém';
                }
            }

            return {
                status, des, val,
            };
        };

        const count24h = getStatus(dt.count24H, 'count24H');
        const count7d = getStatus(dt.count7D, 'count7D');
        const count30d = getStatus(dt.count30D, 'count30D');

        return {
            count24h,
            count7d,
            count30d,
        };
    };

    return (
        <Provider store={store}>
            <BorderPanel flex={1}>
                <PanelBody style={{ height: '100%' }}>
                    <Row>
                        <Expanded>
                            <CameraMonitoringList />
                        </Expanded>
                        <Expanded>
                            <CameraMonitoringMap />
                        </Expanded>
                    </Row>
                </PanelBody>
            </BorderPanel>
        </Provider>
    );
};

CameraMonitoring = inject('appStore')(observer(CameraMonitoring));
export default CameraMonitoring;

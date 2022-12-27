import React, {useState, useEffect, useRef} from 'react';

import {AppConstant} from 'constant/app-constant';

import {
    Row, Container,
    Loading,
    useModal,
} from '@vbd/vui';

import {LayerHelper} from 'services/utilities/layerHelper';
import LayerService from 'services/layer.service';

import {NodeHistoryGrid} from './NodeHistoryGrid';
import {NodeHistoryDetail} from './NodeHistoryDetail';

export type NodeHistoryProps = {
    layerName: string,
    nodeId: string
}

export interface HistoryNode
{
    Id?: string;
    HistoryId?: string;
    Layer?: string;
    LayerData: any;
    Modified?: any;
    Modifier?: any;
    PreValue?: any;
}

export const NodeHistory: React.FC<NodeHistoryProps> = (props) =>
{
    const {
        layerName,
        nodeId,
    } = props;

    const {toast} = useModal();

    const [histories, setHistories] = useState<HistoryNode[]>([]);
    const [curVerId, setCurVerId] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedHistory, setSelectedHistory] = useState<any>();

    const layerService = useRef<LayerService>(new LayerService(AppConstant.c4i2.url)).current;

    useEffect(() =>
    {
        reload();
    }, []);

    const reload = async () =>
    {
        setLoading(true);

        const data = await getHistoryData();
        setHistories(data);

        setLoading(false);
    };

    const getHistoryData = async () =>
    {
        const rs = await layerService.getNodeHistory(layerName, nodeId);
        const nodeDataRs = await layerService.getNodeLayer(layerName, nodeId);

        if (rs?.status?.success && rs.data.length)
        {
            if (nodeDataRs?.data)
            {
                rs.data.push({
                    Id: nodeDataRs.data.Id,
                    HistoryId: null,
                    Layer: nodeDataRs.data.Layer,
                    Modified: nodeDataRs.data.ModifiedDate,
                    Modifier: nodeDataRs.data.ModifiedUserId,
                    LayerData: nodeDataRs.data,
                });
            }

            for (let i = 0; i < rs.data.length; i++)
            {
                rs.data[i].LayerData = await LayerHelper.formatNodeData(layerName, rs.data[i].LayerData);
            }

            rs.data.reduce((pre: any, cur: any, index: number, arr: Array<any>) =>
            {
                rs.data[index].preValue = {};

                Object.keys(cur.LayerData).forEach((key: string) =>
                {
                    if (pre.LayerData[key] && cur.LayerData[key] && typeof cur.LayerData[key] === 'object')
                    {
                        if (pre.LayerData[key].Value !== cur.LayerData[key].Value)
                        {
                            rs.data[index].preValue[key] = pre.LayerData[key].Value;
                        }
                    }
                    else
                    {
                        if (key in pre.LayerData && pre.LayerData[key] !== cur.LayerData[key])
                        {
                            rs.data[index].preValue[key] = pre.LayerData[key];
                        }
                    }
                });

                return cur;
            });

            return rs.data.map((d: any) =>
            {
                return {
                    Id: d.Id,
                    HistoryId: d.HistoryId,
                    Layer: d.Layer,
                    LayerData: d.LayerData,
                    Modified: d.Modified,
                    Modifier: d.Modifier,
                    PreValue: d.preValue,
                };
            });
        }

        return null;
    };

    const handleRestore = async (row: HistoryNode) =>
    {
        setLoading(true);

        layerService.restoreHistory(layerName, nodeId, row.HistoryId).then(rs =>
        {
            if (rs.status.success)
            {
                reload();
            }
            else
            {
                setLoading(false);
                toast({type: 'error', message: rs.status.message});
            }
        });
    };

    const handleSelectHistory = (row: HistoryNode) =>
    {
        setHistories(
            histories.map((h: any) =>
            {
                return {
                    ...h,
                    active: row.HistoryId === h.HistoryId,
                };
            }),
        );

        setSelectedHistory(row);
    };

    return (
        <Row
            mainAxisAlignment='center'
            crossAxisSize={'max'}
        >
            {!loading && histories?.length > 0 && (
                <Row>
                    <Container width='30rem'>
                        <NodeHistoryGrid
                            data={histories}
                            onRestore={handleRestore}
                            onRowSelectionChange={handleSelectHistory}
                        />
                    </Container>
                    <NodeHistoryDetail
                        data={selectedHistory}
                        labelWidth={'20rem'}
                    />
                </Row>
            )}

            {loading && <Loading />}
        </Row>
    );
};

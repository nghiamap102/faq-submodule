import { decorate, observable, action } from 'mobx';

import { CaseService } from 'services/case.service';
import { LayerHelper } from 'services/utilities/layerHelper';
import LayerService from 'services/layer.service';

export class CaseHandlingStore
{
    constructor(appStore)
    {
        this.appStore = appStore;
        this.mapStore = appStore.mapStore;
        this.getAllSelection().then(rs =>
        {
            this.allSelection = rs;
        });
    }

    caseService = new CaseService();
    layerService = new LayerService();
    handlingCase = null;
    caseActivities = [];
    allSelection = null;
    tabSelected = 'wf';
    wfData = {};

    setHandlingCase = (caseData) =>
    {
        this.handlingCase = caseData;
    };
    setCaseActivities = (activities) =>
    {
        this.caseActivities = activities;
    };
    setTabSelected = (tab) =>
    {
        this.tabSelected = tab;
    };
    setWfData = (data) =>
    {
        this.wfData = data;
    };

    reload = async (id) =>
    {
        let caseData = await this.caseService.get(id);

        if (caseData && caseData.wfCode)
        {
            caseData = await this.parseCaseData(caseData);

            if (!caseData.wfInstanceId)
            {
                const rs = await this.caseService.initWf(caseData.wfCode);
                if (rs.data)
                {
                    caseData.wfInstanceId = rs.data;
                    this.caseService.update(id, { wfInstanceId: rs.data });
                }
            }

            this.setHandlingCase(caseData);
            const wfInstanceEvent = await this.caseService.getWfInstanceEvent(caseData.wfInstanceId);
            const location = JSON.parse(caseData.Location);

            if (this.mapStore.map !== undefined)
            {
                this.mapStore.map.flyTo({
                    center: [location.coordinates[0], location.coordinates[1]],
                    zoom: 15,
                });
            }

            this.setWfData({
                headerInfo: {
                    ...caseData,
                    wf: {
                        name: caseData.wfCode_WF_SCHEMA_SchemaName,
                        code: caseData.wfCode,
                    },
                    forces: caseData.forces?.split(','),
                    forceOptions: (await this.caseService.getUsers()).data?.map((user) =>
                    {
                        return {
                            id: user,
                            label: user,
                        };
                    }),
                },
                items: wfInstanceEvent.data,
                longitude: location.coordinates[0],
                latitude: location.coordinates[1],
            });

            const activities = await this.caseService.getActivities(caseData.Id);
            this.setCaseActivities(activities);
        }
    };

    parseCaseData = async (d) =>
    {
        Object.keys(d).forEach(key =>
        {
            if (key === 'activities' && typeof d[key] === 'string')
            {
                try
                {
                    d[key] === JSON.parse(d[key]);
                }
                catch (e)
                {

                }
            }
            else if (d[key] === '0001-01-01T00:00:00')
            {
                d[key] = null;
            }
            else if (typeof d[key] === 'string' && d[key].startsWith('[') && d[key].endsWith(']'))
            {
                const val = JSON.parse(d[key]);
                d[key] = val.length === 1 ? val[0] : val.join(', ');
            }

        });
        return d;
    };

    formatCaseData = async (d) =>
    {
        const allSelection = this.allSelection || await this.getAllSelection();

        Object.keys(d).forEach(key =>
        {
            if (allSelection)
            {
                if (allSelection[key])
                {
                    const match = allSelection[key].find(record => d[key] === record.id);
                    if (match)
                    {
                        d[key] = match.label;
                    }
                }
            }
        });
        return d;
    };

    getCaseProps = async () =>
    {
        const layerPropsRs = await this.layerService.getLayerProps('CHITIETVUVIEC');
        if (layerPropsRs?.status?.success && layerPropsRs?.data?.Properties.length)
        {
            const caseProps = {};
            layerPropsRs.data.Properties.forEach((prop) =>
            {
                caseProps[prop.ColumnName] = prop;
            });
            return caseProps;
        }
        return null;
    };

    getAllSelection = async () =>
    {
        return await LayerHelper.getOptions('CHITIETVUVIEC');
    };

    onWfDoneStep = async (event) =>
    {
        const rs = await this.caseService.onWfDoneStep(event.id);

        if (rs?.data)
        {
            this.setWfData({
                ...this.wfData,
                items: this.wfData.items.map(item =>
                {
                    if (item.Id === event.id)
                    {
                        item.isDone = true;
                    }
                    return item;
                }),
            });
        }
    };
    onPostMessage = async (event) =>
    {
        const rs = await this.caseService.postMessage(this.wfData.headerInfo.Id, event.id, event.content);

        if (rs?.data)
        {
            await this.reload(this.wfData.headerInfo.Id);
        }
    };

    onWfForceChange = (values, value, isRemove) =>
    {
        if (values)
        {
            this.caseService.update(this.wfData.headerInfo.Id, { forces: Array.isArray(values) ? values.join(',') : values });
            this.caseService.setPermission(this.handlingCase.Id, value, isRemove, this.handlingCase.Path);
        }
    };

    handleComplete = () =>
    {
        this.caseService.update(this.wfData.headerInfo.Id, {
            TRANGTHAI: 'DAXULY',
        }).then((rs) =>
        {
            if (rs.data)
            {
                this.appStore.contexts.modal.toast({ location: 'top-right', message: 'Cập nhật thành công', type: 'success' });
                this.setWfData({
                    ...this.wfData,
                    headerInfo: {
                        ...this.wfData.headerInfo,
                        TRANGTHAI: 'Đã xử lý',
                    },
                });
            }
        });
    };
}

decorate(CaseHandlingStore, {
    handlingCase: observable,
    caseActivities: observable,
    wfData: observable,
    tabSelected: observable,
    setHandlingCase: action,
    setCaseActivities: action,
    setTabSelected: action,
    setWfData: action,
    onWfDoneStep: action,
    onPostMessage: action,
    reload: action,
});

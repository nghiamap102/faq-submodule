import { action, decorate, observable } from 'mobx';

import LayerService from 'services/layer.service';

export class IncidentStore
{
    layerService = new LayerService();

    appStore = null;
    incidents = [];
    incident = undefined;
    isShowDetail = false;

    addIncident = undefined;

    incidentDirection = undefined;
    incidentNearestMarkers = undefined;

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    replace(incidents)
    {
        this.incidents = incidents;
    }

    get(id)
    {
        return this.incidents.find((i) => i.id === id);
    }

    update(incident)
    {
        let isExisted = false;
        for (let i = 0; i < this.incidents.length; i++)
        {
            if (this.incidents[i].incidentId === incident.incidentId)
            {
                this.incidents[i] = incident;
                isExisted = true;
                break;
            }
        }
        if (!isExisted)
        {
            this.incidents.push(incident);
        }
    }

    remove(incident)
    {
        const incidents = [];
        for (let i = 0; i < this.incidents.length; i++)
        {
            if (this.incidents[i].incidentId !== incident.incidentId)
            {
                incidents.push(this.incidents[i]);
            }
        }
        this.incidents = incidents;
    }

    getDetail()
    {
        return this.incident;
    }

    setDetail(incident)
    {
        // if we separate this into two functions then auto run depend on this will run twice
        this.incident = incident;
        this.isShowDetail = !!incident;
    }

    addShow(incident = undefined)
    {
        if (incident)
        {
            incident.location.country = incident.location.country || 'Việt Nam';
            this.addIncident = incident;
        }
        else
        {
            this.addIncident = {};
        }
    }

    addClose()
    {
        this.addIncident = undefined;
    }

    addChangeData(key, value)
    {
        if (this.addIncident !== undefined)
        {
            this.addIncident[key] = value;
        }
    }

    showNearestMarker(markers)
    {
        this.incidentNearestMarkers = markers;
    }

    closeNearestMarker()
    {
        this.incidentNearestMarkers = undefined;
    }

    showNearestDirection(routes, primaryRouteInfo = {})
    {
        this.incidentDirection = {
            routes: routes,
            arrow: {
                coords: [],
                angle: [],
                des: [],
            },
            dashPath: {
                coordsStart: [],
                coordsEnd: [],
            },
            primaryRouteInfo: primaryRouteInfo,
        };
    }

    closeNearestDirection()
    {
        this.incidentDirection = undefined;
    }

    async getForceTree()
    {
        const res = await this.layerService.getLayers({
            path: '/root/vdms/tangthu/data/ccis/donvicongan',
            layers: ['DM_DONVICONGAN'],
            isInTree: true,
        });

        if (res && res.data?.length > 0)
        {
            const forceTree = res.data.map((item) =>
            {
                return {
                    id: item.Id,
                    label: item.Title,
                    parentId: item.PARENTID,
                    caId: item.CAID,
                    level: item.LEVEL,
                    uniqueId: item.UNIQUEID,
                };
            });

            // build a node dictionary by caId for easy access
            const dictNode = {};
            for (const node of forceTree)
            {
                dictNode[node.caId] = node;
            }

            // build tree
            for (const node of forceTree)
            {
                // search for parent
                const parent = dictNode[node.parentId];

                if (parent)
                {
                    parent.child = parent.child || [];
                    parent.child.push(node);

                    node.hasParent = true;
                }
            }

            // return roots
            return forceTree.filter((node) => !node.hasParent);
        }
    }
}

decorate(IncidentStore, {
    appStore: observable,
    incidents: observable,
    incident: observable,
    addIncident: observable,
    isShowDetail: observable,
    incidentNearestMarkers: observable,
    incidentDirection: observable,
    replace: action,
    remove: action,
    changeDetail: action,
    setDetail: action,
    addShow: action,
    addClose: action,
    addChangeData: action,
    showNearestMarker: action,
    closeNearestMarker: action,
    showNearestDirection: action,
    closeNearestDirection: action,
});

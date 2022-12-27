import { action, decorate, observable } from 'mobx';

import { SpatialSearchStore } from 'components/app/SpatialSearch/SpatialSearchStore';
import { FaceAlertService } from 'services/face-alert.service';

import { CommonHelper } from 'helper/common.helper';
import Enum from 'constant/app-enum';
import moment from 'moment';

export class GeneralDetectionStore
{
    appStore = null;
    viewDetail = false;

    tabSelected = 'object-detection';

    spatialSearch = false;
    searchState = {
        eventType: 'All',
        cameraId: [],
        systemName: '',
        accuracy: [0.5, 1],
        searchData: [],
        showData: [
            {
                id: 0,
                isActivate: false,
                data: undefined,
            },
            {
                id: 1,
                isActivate: false,
                data: {
                    from: moment().add(-1, 'months').toDate(),
                    to: moment().endOf('date').toDate(),
                },
            },
            {
                id: 2,
                isActivate: true,
                data: 24,
            },
        ],
        geoData: null,
        status: 0,
        faces: undefined,
    };

    viewMode = 'SPLIT'; // LIST, MAP, SPLIT

    currentPage = 1;
    pageSize = 25;
    totalItem = 0;

    data = undefined;
    detailData = undefined;
    detailMatchData = undefined;
    selectedId = undefined;

    cameras = {};
    systems = [];
    faceInfos = {};

    metaData = [];
    choosingDetail = undefined;

    faceSvc = new FaceAlertService();

    constructor(appStore)
    {
        this.appStore = appStore;

        this.spatialSearchStore = new SpatialSearchStore();
    }

    setTab(tab)
    {
        this.tabSelected = tab;
    }

    setViewDetail = (show) =>
    {
        this.viewDetail = show;
    };

    setCameras(key, cameras)
    {
        this.cameras[key] = cameras;
    }

    setSystems(systems)
    {
        this.systems = systems;
    }

    setPaging(total, current, size = this.pageSize)
    {
        this.totalItem = total;
        this.currentPage = current;
        this.pageSize = size;
    }

    setSearchState(key, value)
    {
        this.searchState[key] = value;
    }

    getFullSearchState(geoData)
    {
        const searchState = CommonHelper.clone(this.searchState);
        searchState.skip = (this.currentPage - 1) * this.pageSize;
        searchState.limit = this.pageSize;
        if (geoData)
        {
            searchState.geoData = geoData;
        }
        if (searchState.searchData)
        {
            searchState.searchData = searchState.searchData.map((d) =>
            {
                d.fields = d.fields.map((f) =>
                {
                    f.imageData = undefined;
                    f.imagePath = undefined;
                    return f;
                });
                return d;
            });
        }
        return searchState;
    }

    setData(data)
    {
        this.data = data;
    }

    setDataProperty(incrementId, key, value)
    {

        this.data = this.data.map((d) =>
        {
            if (d.incrementId === incrementId)
            {
                d[key] = value;
            }
            return d;
        });
    }

    setSelectedAllChange(value)
    {
        this.data = this.data.map((d) =>
        {
            d.isSelected = value;
            return d;
        });
    }

    getDetailIndex(detail)
    {
        return this.data.findIndex(d => d.guid === detail?.guid);
    }

    setDetail(detail = undefined, matchData = undefined)
    {
        this.detailData = detail;
        this.detailMatchData = matchData;

        if (detail)
        {
            this.getFaceInfo(detail);
            this.setSelected(detail.guid);
        }
    }

    getFaceInfo(detail = undefined)
    {
        const faceIds = detail.info.filter((i) => i.eventType === 'Face').map((i) => i.metricsValue[0]);
        if (faceIds.length > 0)
        {
            this.faceSvc.galleryGetByFaceIds(faceIds).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.addNewFaceInfos(rs.data);
                }
            });
        }
    }

    setSelected(selectedId = undefined)
    {
        this.selectedId = selectedId;
    }

    setViewMode = (viewMode) =>
    {
        this.viewMode = viewMode;
    };

    resetSearch = () =>
    {
        this.setData(null);
        this.setPaging(0, 1);
        this.setSelected();
    };

    setSpatialSearch = (isSpatialSearch) =>
    {
        this.spatialSearch = isSpatialSearch;
    };

    addNewFaceInfos = (faces) =>
    {
        if (Array.isArray(faces))
        {
            faces.forEach((f) =>
            {
                this.faceInfos[f.faceId] = f;
            });
        }
    };

    setSearchData = (data) =>
    {
        if (this.searchState.searchData.find((d) => d.id === data.id) === undefined)
        {
            this.searchState.searchData.push(data);
        }
        else
        {
            this.searchState.searchData.forEach((d) =>
            {
                if (d.id === data.id)
                {
                    d.fields = data.fields;
                }
            });
        }
    };

    deleteSearchData = (id) =>
    {
        this.searchState.searchData = this.searchState.searchData.filter((d) => d.id !== id);
    };

    setMetaData = (data) =>
    {
        this.metaData = data;
    };

    setChoosingDetail = (id) =>
    {
        this.choosingDetail = id;
    };

    static getBoxes = (data, matchData, searchData) =>
    {
        const colors = {
            'LPR': 'cyan',
            'Face': 'lime',
            'Object': 'green',
            'Default': '#95c3a3',
        };

        const borders = {
            'LPR': '2px',
            'Face': '2px',
            'Object': '2px',
            'Default': '1px',
        };

        const boxes = [];

        if (Array.isArray(data.info))
        {
            const filteredData = data.info.filter((i) => !['CrowdEx', 'ObjectEx'].includes(i.eventType));

            if (!matchData)
            {
                for (const info of filteredData)
                {
                    const color = matchData?.info.find(i => i.eventId === info.eventId) ? 'red' : '';

                    boxes.push({
                        id: info.eventId,
                        left: info.left,
                        top: info.top,
                        width: info.width,
                        height: info.height,
                        label: `${info.metricsValue[0]}: ${(info.confidence * 100).toFixed(0)}%`,
                        color: (color || colors[info.eventType] || colors['Default']),
                        border: (color || borders[info.eventType] || borders['Default']),
                    });
                }
            }
            else if (searchData && searchData.length)
            {
                const types = searchData.reduce((acc, curr) =>
                {
                    const values = curr.fields.map(i => i.value).filter(i => i);

                    if (!acc[curr.type])
                    {
                        acc[curr.type] = new Set(values);
                    }
                    else
                    {
                        const temp = acc[curr.type];

                        temp.add(...values);
                        acc[curr.type] = temp;
                    }

                    return acc;
                }, {});

                // Temporarily fix the current issue of GD. Root cause still vague
                for (const info of filteredData)
                {
                    if (types[info.eventType])
                    {
                        const values = [...types[info.eventType]];

                        const color = values.some(v => info.metricsValue?.find(m => m.includes(v))) ? 'red' : '';

                        boxes.push({
                            id: info.eventId,
                            left: info.left,
                            top: info.top,
                            width: info.width,
                            height: info.height,
                            label: `${info.metricsValue[0]}: ${(info.confidence * 100).toFixed(0)}%`,
                            color: (color || colors[info.eventType] || colors['Default']),
                            border: (color || borders[info.eventType] || borders['Default']),
                        });
                    }
                }
            }
        }

        return boxes;
    };
}

decorate(GeneralDetectionStore, {
    appStore: observable,
    tabSelected: observable,
    cameras: observable,
    systems: observable,
    currentPage: observable,
    pageSize: observable,
    totalItem: observable,
    spatialSearch: observable,
    searchState: observable,
    viewMode: observable,
    data: observable,
    detailData: observable,
    selectedId: observable,
    faceInfos: observable,
    choosingDetail: observable,
    metaData: observable,
    setTab: action,
    setCameras: action,
    setSystems: action,
    setPaging: action,
    setViewDetail: action,
    setSearchState: action,
    setSpatialSearch: action,
    getFullSearchState: action,
    setData: action,
    setDataProperty: action,
    setSelectedAllChange: action,
    getDetailIndex: action,
    setDetail: action,
    setSelected: action,
    resetSearch: action,
    addNewFaceInfos: action,
    setSearchData: action,
    deleteSearchData: action,
    setChoosingDetail: action,
    setMetaData: action,
});

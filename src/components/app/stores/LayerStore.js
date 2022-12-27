import { decorate, observable, action, computed } from 'mobx';

import LayerService from 'services/layer.service';
import { AppConstant } from 'constant/app-constant';

export class LayerStore
{
    appStore = null;
    listLayerActive = [];
    rasterSources = [];

    combinedRasterSource = {};
    mapnikLayers = [];
    listAllLayers = [];

    cameraData = {};
    trackingData = {};
    trackingDataTCDB = {};
    layerData = [];
    isShowLabel = false;

    layerService = new LayerService();

    constructor(appStore)
    {
        this.appStore = appStore;

        this.cameraData = {
            Id: 'CAMERA',
            Title: 'Camera',
            checkingType: 1,
        };

        this.cameraData.childes = [
            {
                Id: 'CAMERAGIAOTHONG',
                Title: 'Mjpeg Camera',
                checkingType: 0,
                parent: this.cameraData,
                group: this.cameraData,
            },
            {
                Id: 'CAMERAGT',
                Title: 'Snapshot 5s Camera',
                checkingType: 0,
                parent: this.cameraData,
                group: this.cameraData,
            },
            {
                Id: 'CAMERASTREAM',
                Title: 'Stream Camera',
                checkingType: 0,
                parent: this.cameraData,
                group: this.cameraData,
            },
        ];

        this.trackingData = {
            Id: 'TRACKING',
            Title: 'Giám sát hành trình',
            checkingType: 1,
        };

        this.trackingData.childes = [
            {
                Id: 'TOCDO',
                Title: 'Tốc độ',
                checkingType: 1,
                Type: 'folder',
                Path: '',
                parent: this.trackingData,
                group: this.trackingData,
            },
            {
                Id: 'LOAIPHUONGTIEN',
                Title: 'Loại phương tiện',
                checkingType: 0,
                Type: 'folder',
                Path: '',
                parent: this.trackingData,
                group: this.trackingData,
            },
        ];

        this.trackingData.childes[0].childes = [
            {
                Id: 'XEDANGDICHUYEN',
                Title: 'Xe đang di chuyển',
                checkingType: 1,
                flagStatus: 400,
                parent: this.trackingData.childes[0],
                group: this.trackingData,
            },
            {
                Id: 'XEDUNG',
                Title: 'Xe dừng',
                checkingType: 1,
                flagStatus: 208,
                parent: this.trackingData.childes[0],
                group: this.trackingData,
            },
            {
                Id: 'XEMATTINHIEU',
                Title: 'Xe mất tín hiệu',
                checkingType: 1,
                flagStatus: 16384,
                parent: this.trackingData.childes[0],
                group: this.trackingData,
            },
        ];

        this.trackingData.childes[1].childes = [
            {
                Id: 'XECANHSAT',
                Title: 'Xe cảnh sát',
                checkingType: 0,
                transType: 1,
                parent: this.trackingData.childes[1],
                group: this.trackingData,
            },
            {
                Id: 'XETHEODOI',
                Title: 'Xe theo dõi',
                checkingType: 0,
                transType: 2,
                parent: this.trackingData.childes[1],
                group: this.trackingData,
            },
            {
                Id: 'THIETBIDIDONG',
                Title: 'Thiết bị di động',
                checkingType: 0,
                transType: 4,
                parent: this.trackingData.childes[1],
                group: this.trackingData,
            },
            {
                Id: 'XEMAY',
                Title: 'Xe máy',
                checkingType: 0,
                transType: 8,
                parent: this.trackingData.childes[1],
                group: this.trackingData,
            },
            {
                Id: 'BODYCAMERA',
                Title: 'Body camera',
                checkingType: 0,
                transType: 16,
                parent: this.trackingData.childes[1],
                group: this.trackingData,
            },
        ];

        this.trackingDataTCDB = {
            Id: 'TRACKINGTCDB',
            Title: 'Tổng cục đường bộ',
            checkingType: 1,
        };

        this.trackingDataTCDB.childes = [
            {
                Id: 'TOCDOTCDB',
                Title: 'Tốc độ',
                checkingType: 1,
                Type: 'folder',
                Path: '',
                parent: this.trackingDataTCDB,
                group: this.trackingDataTCDB,
            },
            {
                Id: 'TrackingTCDB', // important for marker show on map
                Title: 'Loại phương tiện',
                checkingType: 0,
                Type: 'folder',
                Path: '',
                parent: this.trackingDataTCDB,
                group: this.trackingDataTCDB,
            },
        ];

        this.trackingDataTCDB.childes[0].childes = [
            {
                Id: 'XEQUATOCTREN35',
                Title: 'Xe quá tốc độ > 35km/h',
                checkingType: 1,
                flagStatus: 128,
                parent: this.trackingDataTCDB.childes[0],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XEQUATOCDUOI35',
                Title: 'Xe quá tốc độ < 35km/h',
                checkingType: 1,
                flagStatus: 32,
                parent: this.trackingDataTCDB.childes[0],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XEDUNGTOCDO',
                Title: 'Xe đúng tốc độ',
                checkingType: 1,
                flagStatus: 256,
                parent: this.trackingDataTCDB.childes[0],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XEDUNG',
                Title: 'Xe dừng',
                checkingType: 1,
                flagStatus: 64,
                parent: this.trackingDataTCDB.childes[0],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XEMATTINHIEU',
                Title: 'Xe mất tín hiệu',
                checkingType: 1,
                flagStatus: 16384,
                parent: this.trackingDataTCDB.childes[0],
                group: this.trackingDataTCDB,
            },
        ];

        this.trackingDataTCDB.childes[1].childes = [
            {
                Id: 'XEBUS',
                Title: 'Xe bus',
                checkingType: 0,
                transType: 1,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XEKHACH',
                Title: 'Xe khách',
                checkingType: 0,
                transType: 2,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XEHOPDONG',
                Title: 'Xe hợp đồng',
                checkingType: 0,
                transType: 4,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XEDULICH',
                Title: 'Xe du lịch',
                checkingType: 0,
                transType: 8,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XETAXI',
                Title: 'Xe taxi',
                checkingType: 0,
                transType: 16,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XETAI',
                Title: 'Xe tải',
                checkingType: 0,
                transType: 32,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XATAXITAI',
                Title: 'Xe taxi tải',
                checkingType: 0,
                transType: 64,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XECONTAINER',
                Title: 'Xe container',
                checkingType: 0,
                transType: 128,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'XEDAUKEO',
                Title: 'Xe đầu kéo',
                checkingType: 0,
                transType: 256,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
            {
                Id: 'KHONGXACDINHTCDB',
                Title: 'Không xác định',
                checkingType: 0,
                transType: 512,
                parent: this.trackingDataTCDB.childes[1],
                group: this.trackingDataTCDB,
            },
        ];
    }

    addLayerData(layer)
    {
        this.layerData.push(layer);
        return this.layerData[this.layerData.length - 1];
    }

    add(layer)
    {
        if (!this.checkExist(layer.id))
        {
            this.listLayerActive = [...this.listLayerActive, layer];

            if (layer.LayerStyle)
            {
                switch (layer.LayerType)
                {
                    case 'MAPNIK':
                        this.mapnikLayers.push({
                            id: layer.id,
                            name: layer.MapName,
                            iconPath: `${AppConstant.vdms.url}/app/render/GetMapnikIcon.ashx?MapName=${layer.MapName}`,
                        });
                        break;
                    case 'OVERLAY':
                        try
                        {
                            let layerName = layer.LayerName;

                            const strokeColor = layer.LayerStyle.StrokeColor ? layer.LayerStyle.StrokeColor.replace('#', '') : 'FF0000';
                            const strokeOpacity = layer.LayerStyle.StrokeOpacity ? layer.LayerStyle.StrokeOpacity.toString(16).toUpperCase() : 'FF';

                            const fillColor = layer.LayerStyle.FillColor ? layer.LayerStyle.FillColor.replace('#', '') : 'FF0000';
                            const fillOpacity = layer.LayerStyle.FillOpacity ? layer.LayerStyle.FillOpacity.toString(16).toUpperCase() : 'A0';

                            const minZoom = layer.LayerStyle.RenderLevelMin || 0;
                            const maxZoom = layer.LayerStyle.RenderLevelMax || 22;

                            // Temporary mark this because it still draw with props
                            // const prop = layer.Props ? layer.Props : 'Location';
                            // props.push(prop);

                            layerName = encodeURIComponent(layerName);
                            const stroke = encodeURIComponent(`#${strokeOpacity}${strokeColor}`);
                            const fill = encodeURIComponent(`#${fillOpacity}${fillColor}`);

                            this.rasterSources.push({
                                id: layer.id,
                                name: layerName,
                                type: 'raster',
                                tiles: [`${AppConstant.vdms.url}/App/Render/Overlay.ashx?Level={z}&X={x}&Y={y}&Layers=${layerName}&Strokes=${stroke}&Fills=${fill}`],
                                minzoom: minZoom,
                                maxzoom: maxZoom,
                                tileSize: 256,

                                // extra: for later use
                                strokeStyle: stroke,
                                fillStyle: fill,
                            });
                        }
                        catch (ex)
                        {
                            console.warn(ex.message);
                        }
                        break;
                    default:
                        return;
                }
            }
        }
    }

    remove(layerId)
    {
        this.listLayerActive = this.listLayerActive.filter((l) => l.id !== layerId);
        this.rasterSources = this.rasterSources.filter((l) => l.id !== layerId);
        this.mapnikLayers = this.mapnikLayers.filter((l) => l.id !== layerId);
    }

    checkExist(layerId)
    {
        const found = this.listLayerActive.find((l) => l.id === layerId);

        return found != null;
    }

    get mapnikSources()
    {
        if (this.mapnikLayers && this.mapnikLayers.length)
        {
            const layerNames = encodeURIComponent(this.mapnikLayers.map((l) => l.name).join('|'));
            return {
                type: 'raster',
                tiles: [`${AppConstant.mapnik.url}/Render/TileRender.ashx?level={z}&x={x}&y={y}&layers=${layerNames}&type=mapnik`],
                tileSize: 256,
            };
        }
        else
        {
            return null;
        }
    }

    get layers()
    {
        return this.listLayerActive;
    }

    getAllLayers()
    {
        this.layerService.getAllLayer().then((rs) =>
        {
            if (rs?.data && rs?.status?.code === 200)
            {
                this.listAllLayers = rs.data;
            }
        });
    }

    setShowLabel()
    {
        this.isShowLabel = !this.isShowLabel;
    }
}

decorate(LayerStore, {
    listLayerActive: observable,
    rasterSources: observable,
    mapnikLayers: observable,
    mapnikSources: computed,
    cameraData: observable,
    trackingData: observable,
    layerData: observable,
    trackingDataTCDB: observable,
    isShowLabel: observable,
    listAllLayers: observable,

    addLayerData: action,
    setShowLabel: action,
    getAllLayers: action,
});

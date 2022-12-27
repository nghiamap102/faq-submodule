import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';

export default class LayerService {
    apiURL = '';

    static layerPropsCache = {};
    http = new HttpClient();

    constructor(apiURL) {
        this.apiURL = apiURL || AppConstant.vdms.url;
    }

    getLayers = (queryRequest = {}) => {
        const body = {
            path: queryRequest?.path || '/root/vdms/hethong/maplayer/default',
            layers: queryRequest?.layers || ['CONTAINER'],
            isInTree: queryRequest?.isInTree || false,
            searchKey: queryRequest?.searchKey || '',
            start: queryRequest?.start || 0,
            count: queryRequest?.count || -1,
            returnFields: queryRequest?.returnFields || ['*'],
            filterQuery: queryRequest?.filterQuery,
            sortOption: queryRequest?.sortOption,
            queryInfo: queryRequest?.queryInfo,
            GeoField: queryRequest?.GeoField,
            GeoJson: queryRequest?.GeoJson,
            Distance: queryRequest?.Distance,
        };

        return this.http.post(`${this.apiURL}/api/v1/query`, body, AuthHelper.getVDMSHeader());
    };

    getAllLayer = () => {
        return this.http.get(`${this.apiURL}/api/v1/layers`, AuthHelper.getVDMSHeader());
    };

    getLayerStyle = (layerName) => {
        return this.http.get(`${this.apiURL}/api/v1/layers/${layerName.toUpperCase()}/style`, AuthHelper.getVDMSHeader());
    };

    getLayerProps = (layerName) => {
        if (LayerService.layerPropsCache[layerName]) {
            return Promise.resolve(LayerService.layerPropsCache[layerName]);
        }

        return this.http.get(`${this.apiURL}/api/v1/layers/${layerName.toUpperCase()}`, AuthHelper.getVDMSHeader()).then((res) => {
            if (res.status.success) {
                LayerService.layerPropsCache[layerName] = res;
            }
            return res;
        });
    };

    getObjectByLatLng = (query) => {
        return this.http.post(`${this.apiURL}/api/v1/nodes/GetObjByLatLng`, query, AuthHelper.getVDMSHeader());
    };

    getNodesLayer = (layerName) => {
        return this.http.get(`${this.apiURL}/api/v1/nodes/${layerName}`, AuthHelper.getVDMSHeader());
    };

    getNodeLayer = (layerName, nodeId) => {
        return this.http.get(`${this.apiURL}/api/v1/nodes/${layerName}/${nodeId}`, AuthHelper.getVDMSHeader());
    };

    getNodeHistory = (layerName, nodeId) => {
        return this.http.get(`${this.apiURL}/api/v1/nodes/${layerName}/history/${nodeId}`, AuthHelper.getVDMSHeader());
    };

    restoreHistory = (layerName, nodeId, historyId) => {
        return this.http.post(`${this.apiURL}/api/v1/nodes/${layerName}/restore/${nodeId}/${historyId}`, AuthHelper.getVDMSHeader());
    };

    addNodeLayer = (layerName, layerData, path) => {
        return this.http.post(`${this.apiURL}/api/v1/nodes/${layerName}`, {
            Path: path,
            LayerData: layerData,
        }, AuthHelper.getVDMSHeader());
    };

    updateNodeLayer = (layerName, id, layerData) => {
        return this.http.put(`${this.apiURL}/api/v1/nodes/${layerName}/${id}`, layerData, AuthHelper.getVDMSHeader());
    };

    deleteNodeLayer = (id) => {
        return this.http.delete(`${this.apiURL}/api/v1/nodes/${id}`, AuthHelper.getVDMSHeader());
    };

    getPropConfig = (layerName, propertyName) => {
        return this.http.get(`${AppConstant.c4i2.url}/api/v2/layer/GetPropConfig?LayerName=${layerName}&PropertyName=${propertyName}`, AuthHelper.getVDMSHeader());
    };

    mapSearchMultiQuery = (dataInfo) => {
        const request = {
            Layers: dataInfo?.layers ? dataInfo.layers : '',
            Distance: dataInfo?.distance ? dataInfo.distance : 100,
            Start: dataInfo?.start ? dataInfo.start : 0,
            Count: dataInfo?.count ? dataInfo.count : -1,
            ReturnFields: dataInfo?.returnFields ? dataInfo.returnFields : ['*'],
            isInTree: dataInfo.isInTree ? dataInfo.isInTree : false,
            ...dataInfo?.queryInfos && { QueryInfos: dataInfo?.queryInfos },
            ...dataInfo?.geoJson && { GeoJson: dataInfo?.geoJson },
            ...dataInfo?.path && { 'Path': dataInfo?.path },
        };

        return this.http.post(`${this.apiURL}/api/v1/mapSearch/multi`, request, AuthHelper.getVDMSHeader());
    };
}

import { LAYERDATARURL, LAYERNAME } from "extends/ognl/constant/LayerInfo";
import { AuthHelper } from "helper/auth.helper";
import { action, decorate, observable } from "mobx";
import LayerService from "services/layer.service";

export const initVideoRequest = {
    path: LAYERDATARURL.VIDEO,
    layers: [LAYERNAME.CONTAINER],
    searchKey: '',
    start: 0,
    count: 10,
    // filterQuery: ["type:(document)"],
    returnFields: ['*'],
    sortOption: { SortInfo: [{ Field: 'CreatedDate', Direction: 1 }] }
}

class VideoPlaylistStore {
    ognlStore;
    data = [];
    layerSvc = new LayerService();
    constructor(ognlStore) {
        this.ognlStore = ognlStore;
    };

    loadData = async (request = {}) => {
        request = { ...initVideoRequest, ...request };
        console.log(request);
        const rs = await this.layerSvc.getLayers(request);
        console.log(rs);
        if (rs?.status?.code === 200 && rs?.data?.length) {
            //set sample data
            let fileData = rs.data.filter((d) => !d.Content);
            let contentData = rs.data.filter((d) => d.Content);
            if (contentData) {
                contentData = contentData.map((cd) => ({ ...cd, ...{ Content: JSON.parse(cd.Content) } }));
                for (let i = 0; i < rs.data.length; i++) {
                    const d = rs.data[i];
                    const changed = contentData.find((cd) => cd.Id === d.Id);
                    if (changed) rs.data[i] = { ...rs.data[i], ...changed };
                }

            }
            if (fileData) {
                const promises = fileData.map((d) => this.getVideoUrl(d.Id));
                const urlResult = await Promise.all(promises);
                if (urlResult) {
                    fileData = fileData.map((d) => ({ ...d, ...{ url: urlResult[fileData.indexOf(d)] } }));
                    for (let i = 0; i < rs.data.length; i++) {
                        const d = rs.data[i];
                        const changed = fileData.find((fd) => fd.Id === d.Id);
                        if (changed) rs.data[i] = { ...rs.data[i], ...changed };
                    }
                }
            }

            this.data = rs.data;
        }
        return {
            data: rs.data,
            total: rs.total
        };
    };

    getVideoUrl = async (id) => {
        // const response = await fetch(`${AppConstant.vdms.url}/api/v1/file?fileid=${id}`, { method: 'GET', headers: AuthHelper.getVDMSHeader() });
        const response = await fetch(`http://localhost/OGNL/api/v1/file?fileid=${id}`, { method: 'GET', headers: AuthHelper.getVDMSHeader() });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
    }

    uploadVideoFile = async (data) => {
        //TODO: calling POST api/v1/file/AsNode to upload video file to /ognl/video
    };
}
decorate(VideoPlaylistStore, {
    data: observable,

    loadData: action,
    getVideoUrl: action,
    uploadVideoFile: action
});

export default VideoPlaylistStore;
import { LAYERDATARURL, LAYERNAME } from "extends/ognl/constant/LayerInfo";
import { AuthHelper } from "helper/auth.helper";
import { action, decorate, observable } from "mobx";
import LayerService from "services/layer.service";

export const initImageRequest = {
    path: LAYERDATARURL.IMAGE,
    layers: [LAYERNAME.CONTAINER],
    searchKey: '',
    start: 0,
    count: 10,
    // filterQuery: ["type:(document)"],
    returnFields: ['*'],
    sortOption: { SortInfo: [{ Field: 'CreatedDate', Direction: 1 }] }
}

class ImageSliderStore {
    ognlStore;
    data = [];
    layerSvc = new LayerService();
    constructor(ognlStore) {
        this.ognlStore = ognlStore;
    };

    loadData = async (request = {}) => {
        request = { ...initImageRequest, ...request };
        let urls = [];
        console.log(request);
        const rs = await this.layerSvc.getLayers(request);
        console.log(rs);
        if (rs?.status?.code === 200 && rs?.data?.length) {
            //set sample data
            const promises = rs.data.map((d) => this.getImageUrl(d.Id));
            const urlResult = await Promise.all(promises);
            if (urlResult) { urls = urlResult; this.data = urls }
        }
        return {
            data: rs.data,
            urls: urls,
            total: rs.total
        };
    };

    loadDataByPostId = async (postId) => {
        const { postStore } = this.ognlStore;
        let urls = [];
        try {
            const post = await postStore.getPostById(postId);
            console.log(post);
            if (post?.noiDung) {
                const imgIds = post?.noiDung.split(',');
                if (imgIds?.length) {
                    const promises = imgIds.map((i) => this.getImageUrl(i));
                    const urlResult = await Promise.all(promises);
                    if (urlResult) { urls = urlResult; this.data = urls }
                }
            }
        } catch (error) {
            console.log('loadDataByPostId', error);
        }
        return urls;
    };

    getImageUrl = async (id) => {
        // const response = await fetch(`${AppConstant.vdms.url}/api/v1/file?fileid=${id}`, { method: 'GET', headers: AuthHelper.getVDMSHeader() });
        try {
            const response = await fetch(`http://localhost/OGNL/api/v1/file?fileid=${id}`, { method: 'GET', headers: AuthHelper.getVDMSHeader() });
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            return url;
        } catch (error) {
            console.log('getImageUrl', error);
            return null;
        }
    }

    uploadImageFile = async (data) => {
        //TODO: calling POST api/v1/file/AsNode to upload image file to /ognl/image
    };
}
decorate(ImageSliderStore, {
    data: observable,

    loadData: action,
    getImageUrl: action,
    uploadImageFile: action
});

export default ImageSliderStore;
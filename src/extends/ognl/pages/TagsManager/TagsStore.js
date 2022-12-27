import { LAYERDATARURL, LAYERNAME } from "extends/ognl/constant/LayerInfo";
import { action, computed, decorate, observable } from "mobx";
import LayerService from "services/layer.service";

// export interface TAG {
//     Title: string,
//     Description: string,
//     slug: string
// }

class TagsStore {
    ognlStore;
    data = [];
    layerSvc = new LayerService();
    columns = [
        {
            hidden: false,
            id: 'Title',
            displayAsText: 'Tên',
        },
        {
            hidden: false,
            id: 'slug',
            displayAsText: 'Đường dẫn',
        },
        {
            hidden: false,
            id: 'Description',
            displayAsText: 'Mô tả',
        },
        {
            hidden: false,
            id: 'Analysis',
            displayAsText: 'Số bài viết',
            width: '15rem'
        },
    ];

    constructor(ognlStore) {
        this.ognlStore = ognlStore;
    }

    loadData = async (request = {}) => {
        const rs = await this.layerSvc.getLayers(request);
        if (rs?.status?.code === 200) {
            this.data = rs.data.map((i) => { return { ...i, ...{ Analysis: 0 } } });
        }
        return rs;
    }

    addTag = async (obj) => {
        return await this.layerSvc.addNodeLayer(LAYERNAME.TAG, obj, LAYERDATARURL.TAG);
    };

    editTag = async (obj) => {
        return await this.layerSvc.updateNodeLayer(LAYERNAME.TAG, obj.Id, obj);
    };

    deleteTag = async (id) => {
        return await this.layerSvc.deleteNodeLayer(id);
    };

    getTagById = async (id) => {
        return await this.layerSvc.getNodeLayer(LAYERNAME.TAG, id);
    };

    get tagOptions() {
        console.log(this.data);
        return this.data.map((d) => { return { id: d.slug, label: d.Title } }) || [];
    }
};

decorate(TagsStore, {
    columns: observable,
    data: observable,

    loadData: action,
    addTag: action,
    editTag: action,
    deleteTag: action,
    getTagById: action,

    tagOptions: computed
});

export default TagsStore;
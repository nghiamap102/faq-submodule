import { LAYERDATARURL, LAYERNAME } from "extends/ognl/constant/LayerInfo";
import { action, computed, decorate, observable } from "mobx";
import LayerService from "services/layer.service";
// export interface CATEGORY {
//     Title: string,
//     Description: string,
//     parents_category: string[],
//     slug: string
// }
class CategoriesStore {
    ognlStore;
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
            width: 100,
        }
    ];
    data = [];
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

    addCategory = async (obj) => {
        return await this.layerSvc.addNodeLayer(LAYERNAME.CATEGORY, obj, LAYERDATARURL.CATEGORY);
    };

    editCategory = async (obj) => {
        return await this.layerSvc.updateNodeLayer(LAYERNAME.CATEGORY, obj.Id, obj);
    };

    deleteCategory = async (id) => {
        return await this.layerSvc.deleteNodeLayer(id);
    };

    getCategoryById = async (id) => {
        return await this.layerSvc.getNodeLayer(LAYERNAME.CATEGORY, id);
    };

    get categoriesOptions() {
        return this.data.map((d) => { return { id: d.slug, label: d.Title } }) || [];
    }
}

decorate(CategoriesStore, {
    columns: observable,
    data: observable,

    loadData: action,
    addCategory: action,
    editCategory: action,
    deleteCategory: action,
    getCategoryById: action,

    categoriesOptions: computed
});

export default CategoriesStore;
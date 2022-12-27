import { LAYERDATARURL, LAYERNAME, POST_STATUS, POST_VISIBILITY, RETURNFIELDS } from "extends/ognl/constant/LayerInfo";
import { action, decorate, observable } from "mobx";
import LayerService from "services/layer.service";
import moment from 'moment';
import FileServices from "extends/ognl/services/FileServices";
import _ from "lodash";
import { AppConstant } from "constant/app-constant";
import { AuthHelper } from "helper/auth.helper";

export const initPostRequest = {
    path: LAYERDATARURL.POST,
    layers: [LAYERNAME.POST],
    searchKey: '',
    start: 0,
    count: 10,
    returnFields: [...['*'], ...RETURNFIELDS.POST],
    sortOption: { SortInfo: [{ Field: 'CreatedDate', Direction: 1 }] }
}
export const initMediaRequest = {
    path: LAYERDATARURL.MEDIA,
    layers: [LAYERNAME.CONTAINER],
    isInTree: true,
    searchKey: '',
    start: 0,
    count: -1,
    returnFields: [...['*']],
    sortOption: { SortInfo: [{ Field: 'CreatedDate', Direction: 1 }] }
}
// export interface POST {
//     [x: string]
//     Title: string,
//     Description: string,
//     trangThai: number,
//     noiDung: string,
//     visibility: number,
//     featured_image,
//     allow_comments: boolean,
//     categories: string[],
//     tags: string[],
//     ModifiedDate: string,
//     type: number //Index of POST_TYPE
// }
export const initPostObj = {
    Title: '',
    Description: '',
    noiDung: '',
    ModifiedDate: '',
    trangThai: POST_STATUS.DRAFT,
    visibility: POST_VISIBILITY.PUBLIC,
    featured_image: null,
    allow_comments: false,
    categories: [],
    tags: [],
    type: 0
}
class PostStore {
    ognlStore;
    data = [];
    layerSvc = new LayerService();
    fileSvc = new FileServices('http://localhost/OGNL');
    columns = [
        {
            hidden: false,
            id: 'Title',
            displayAsText: 'Tiêu đề',
        },
        {
            hidden: false,
            id: 'categoriesDisplay',
            displayAsText: 'Chuyên mục',
            // schema: 'select',
        },
        {
            hidden: false,
            id: 'tagsDisplay',
            displayAsText: 'Thẻ',
            // schema: 'select',
        },
        {
            hidden: false,
            id: 'ModifiedDate',
            displayAsText: 'Thời gian',

        },
        {
            hidden: false,
            id: 'trangThai',
            displayAsText: 'Trạng thái',
            schema: 'select',
            isSortable: true,
            defaultSortDirection: 'desc',
            options: [
                { label: 'Phát hành', id: POST_STATUS.PUBLISH, color: 'green' },
                { label: 'Bản mẫu', id: POST_STATUS.DRAFT, color: 'orange' },
            ],
        },
        {
            hidden: false,
            id: 'visibility',
            displayAsText: 'Hiển thị',
            schema: 'select',
            isSortable: true,
            defaultSortDirection: 'desc',
            options: [
                { label: 'Công khai', id: POST_VISIBILITY.PUBLIC, color: 'green' },
                { label: 'Riêng tư', id: POST_VISIBILITY.PRIVATE, color: 'orange' },
            ],
        },
    ];
    constructor(ognlStore) {
        this.ognlStore = ognlStore;
    }
    loadData = async (request = {}) => {
        const rs = await this.layerSvc.getLayers(request);
        if (rs?.status?.code === 200) {
            this.data = rs.data.map((d) => {
                let postObj = { ...{}, ...d };
                if (d.categories && d.categories.length) {
                    postObj.categories = JSON.parse(d.categories);
                    postObj.categoriesDisplay = postObj.categories.join(', ');
                }
                if (d.tags && d.tags.length) {
                    postObj.tags = JSON.parse(d.tags);
                    postObj.tagsDisplay = postObj.tags.join(', ');
                }
                // TODO:Chuyển sang query khi edit hoặc view từng post
                // if (d.type === 1 && d.noiDung) {
                //     const mediaIds = d.noiDung.split(',');
                //     const mediaRequest = { ...initMediaRequest, ...{ filterQuery: [`(${mediaIds.join(' OR ')})`] } };
                //     const media = this.getMedia(mediaRequest);
                // }
                postObj.ModifiedDate = moment(d.ModifiedDate).format('DD/MM/YYYY hh:mm A')
                return postObj;
            });
        }
        return rs;
    }

    addPost = async (obj) => {
        return await this.layerSvc.addNodeLayer(LAYERNAME.POST, obj, LAYERDATARURL.POST);
    };

    editPost = async (obj) => {
        return await this.layerSvc.updateNodeLayer(LAYERNAME.POST, obj.Id, obj);
    };

    addMediaPost = async (obj, fileUploads) => {
        if (fileUploads?.length) {
            const noiDung = [];
            const uploadResult = await this.uploadFiles(fileUploads);
            uploadResult.forEach(ur => {
                if (ur?.status?.success) {
                    noiDung.push(ur.data.Id);
                }
            });
            obj.noiDung = noiDung.join(',');
            return await this.layerSvc.addNodeLayer(LAYERNAME.POST, obj, LAYERDATARURL.POST);
        }
        console.error('File upload is empty!!');
        return null;
    };

    editMediaPost = async (obj, fileUploads) => {
        if (fileUploads?.length) {
            let files = fileUploads;
            if (obj.noiDung) {
                const noiDung = [];
                const ids = obj.noiDung.split(',');
                files = fileUploads.filter((fu) => !ids.includes(fu.Id));
                //Xóa những file không có trong list fileUpload
                //let removeIds = ids.filter((id: string) => fileUploads.findIndex((fu) => fu.Id === id) === -1);                
                //if (removeIds?.length) await Promise.all(removeIds.map((rId: string) => this.layerSvc.deleteNodeLayer(rId)));

                //Có file mới thì upload + update noiDung
                if (files?.length) {
                    const uploadResult = await this.uploadFiles(files);
                    uploadResult.forEach(ur => {
                        if (ur?.status?.success) {
                            noiDung.push(ur.data.Id);
                        }
                    });
                    obj.noiDung = noiDung.join(',');
                }
                return await this.layerSvc.updateNodeLayer(LAYERNAME.POST, obj.Id, obj);
            }
        }
        console.error('File upload is empty!!');
        return null;
    };

    deletePost = async (id) => {
        return await this.layerSvc.deleteNodeLayer(id);
    };

    getPostById = async (id) => {
        return await this.layerSvc.getNodeLayer(LAYERNAME.POST, id);
    };

    uploadFiles = async (fileUploads) => {
        const promises = fileUploads.map((fu) => {
            if (fu.file) {
                const path = fu.type.includes('image') ? LAYERDATARURL.IMAGE : LAYERDATARURL.VIDEO;
                return this.fileSvc.uploadFileNode(fu.file, path, fu.fileName, fu.type);
            } else {
                return this.layerSvc.addNodeLayer(LAYERNAME.CONTAINER, { Title: fu.fileName, Description: fu.type, Content: JSON.stringify(fu.source), Type: 'document' }, LAYERDATARURL.VIDEO);
            }
        });
        return await Promise.all(promises);
    }

    getPostMedias = async (query) => {
        const request = { ...initMediaRequest, ...query };
        const rs = await this.layerSvc.getLayers(request);
        let result = [];
        if (rs?.status?.success) {
            let filesMedia = rs.data.filter((d) => _.isEmpty(d.Content) && d.FileSize > 0);
            let linksMedia = rs.data.filter((d) => !_.isEmpty(d.Content) && d.FileSize === 0);
            if (filesMedia?.length) {
                const promises = filesMedia.map((fm) => (this.getFileUrl(fm.Id)));
                const fileMediaResult = await Promise.all(promises);
                for (let i = 0; i < filesMedia.length; i++) {
                    filesMedia[i] = { ...filesMedia[i], ...{ type: filesMedia[i].Description, fileName: filesMedia[i].Title, url: fileMediaResult[i] } };
                }
            }
            if (linksMedia?.length) {
                linksMedia = linksMedia.map((lm) => {
                    const source = JSON.parse(!_.isEmpty(lm.Content) ? lm.Content : "{}");
                    return { ...lm, ...{ type: lm.Description, fileName: lm.Title, source: source } };
                });
            }
            result = rs.data.map((d) => {
                let index = filesMedia.findIndex((fm) => fm.Id === d.Id);
                if (index > -1) return { ...d, ...filesMedia[index] };

                index = linksMedia.findIndex((lm) => lm.Id === d.Id);
                if (index > -1) return { ...d, ...linksMedia[index] };
                return d;
            });
        }
        return result;
    }

    getFileUrl = async (id) => {
        const response = await fetch(`${AppConstant.vdms.url}/api/v1/file?fileid=${id}`, { method: 'GET', headers: AuthHelper.getVDMSHeader() });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
    }
}
decorate(PostStore, {
    columns: observable,
    data: observable,

    loadData: action,
    addPost: action,
    editPost: action,
    addMediaPost: action,
    editMediaPost: action,
    deletePost: action,
    getPostById: action,
    uploadFiles: action,
    getPostMedias: action
});

export default PostStore;
import { LAYERDATARURL, LAYERNAME, RETURNFIELDS } from "extends/ognl/constant/LayerInfo";
import { action, decorate, observable } from "mobx";
import LayerService from "services/layer.service";
import moment from 'moment';
import FileServices from "extends/ognl/services/FileServices";
import { AppConstant } from "constant/app-constant";
import { AuthHelper } from "helper/auth.helper";

export const initDocumentRequest = {
    path: LAYERDATARURL.DOCUMENT,
    layers: [LAYERNAME.DOCUMENT],
    searchKey: '',
    start: 0,
    count: 10,
    returnFields: [...['*'], ...RETURNFIELDS.DOCUMENT],
    sortOption: { SortInfo: [{ Field: 'CreatedDate', Direction: 1 }] }
}

// export interface DOCUMENT {
//     [x: string]
//     Title: string,
//     Description: string,
//     file,
//     loaiVanBan: number,
//     donVi: number,
//     soHieu: string,
//     trichYeu: string,
//     hieuLucTuNgay,
//     hieuLucDenNgay
// }

export const initDocument = {
    Title: '',
    Description: '',
    file: null,
    loaiVanBan: 0,
    donVi: 0,
    soHieu: '',
    trichYeu: '',
    hieuLucTuNgay: moment(),
    hieuLucDenNgay: moment().add(30, 'days')
}

class DocumentStore {
    ognlStore;
    data = [];
    layerSvc = new LayerService();
    fileSvc = new FileServices('http://localhost/OGNL');
    refresh = true;

    columns = [
        {
            hidden: false,
            id: 'soHieu',
            displayAsText: 'Số / kí hiệu',
        },
        {
            hidden: false,
            id: 'trichYeu',
            displayAsText: 'Trích yếu'
        },
        {
            hidden: false,
            id: 'hieuLucTuNgayDisplay',
            displayAsText: 'Ngày ban hành'
        }
    ];
    constructor(ognlStore) {
        this.ognlStore = ognlStore;
    }
    setRefresh = (refresh) => {
        this.refresh = refresh;
    }

    loadData = async (request = {}) => {
        const rs = await this.layerSvc.getLayers(request);
        if (rs?.status?.code === 200) {
            //set sample data
            // rs.data = sampleData;
            this.data = rs.data.map((d) => {
                let documentObj = { ...{}, ...d };
                documentObj.ModifiedDate = moment(d.ModifiedDate).format('DD/MM/YYYY hh:mm A');
                documentObj.hieuLucTuNgayDisplay = moment(d.hieuLucTuNgay).format('DD/MM/YYYY hh:mm A');
                documentObj.hieuLucDenNgayDisplay = moment(d.hieuLucDenNgay).format('DD/MM/YYYY hh:mm A');
                return documentObj;
            });
        }
        return rs;
    }

    uploadDocumentFile = async (data) => {
        if (data) {
            const result = await this.fileSvc.uploadFileDirect(data);
            if (result?.status?.success) {
                return result.data;
            }
        }
        return null;
    };

    addDocument = async (obj) => {
        if (obj.file) {
            const fileInfo = await this.uploadDocumentFile(obj.file);
            if (fileInfo) {
                obj = { ...obj, ...{ Title: obj.soHieu, file: JSON.stringify(fileInfo) } };
            }
        }
        const result = await this.layerSvc.addNodeLayer(LAYERNAME.DOCUMENT, obj, LAYERDATARURL.DOCUMENT);
        return result;
    };

    editDocument = async (obj) => {
        if (obj.file) {
            const fileInfo = await this.uploadDocumentFile(obj.file);
            if (fileInfo) {
                obj = { ...obj, ...{ Title: obj.soHieu, file: JSON.stringify(fileInfo) } };
            }
        }
        const result = await this.layerSvc.updateNodeLayer(LAYERNAME.DOCUMENT, obj.Id, obj);
        return result;
    };

    deleteDocument = async (id) => {
        const result = await this.layerSvc.deleteNodeLayer(id);
        return result;
    };

    getDocumentById = async (id) => {
        const result = await this.layerSvc.getNodeLayer(LAYERNAME.DOCUMENT, id);
        return result;
    };

    getDocumentUrl = async (file) => {
        const response = await fetch(`${AppConstant.vdms.url}/api/v1/file?fileid=${file.guid}&mimeType=${file.mimetype}`, { method: 'GET', headers: AuthHelper.getVDMSHeader() });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
    }
}
decorate(DocumentStore, {
    columns: observable,
    data: observable,
    refresh: observable,

    loadData: action,
    addDocument: action,
    editDocument: action,
    deleteDocument: action,
    getDocumentById: action,
    setRefresh: action
});

export default DocumentStore;
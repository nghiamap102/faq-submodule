import { decorate, observable, action } from 'mobx';
import moment from 'moment';

import { IMPORT_STATUS } from 'extends/ffms/constant/ffms-enum';
import { FileHelper } from 'helper/file.helper';
import UploadService from 'extends/ffms/components/Import/UploadService';

export class UploadStore
{
    appStore = null;
    files = [];
    paging = {
        total: null,
        currentPage: 1,
        pageSize: 10,
    };
    isShow = false;
    totalCount = 0;
    fileContentFilterState = {};
    currentPageIndex = 1;
    fileColumns = [];
    isImporting = null;

    fileFilter = {};
    urlParams = {
        'CUSTOMER': {},
        'JOB': {},
        'EMPLOYEE': {},
    }; // store the urlParams when switching tabs

    currentFileContents = {
        rows: [],
        fileName: '',
        userName: '',
        totalItems: 0,
        processedRow: 0,
        currentPage: 1,
        pageSize: 20,
    };

    importStatus = {
        notImported: 'Chưa xử lý',
        success: 'Thành công',
        update: 'Đã có dữ liệu',
        dataFailed: 'Lỗi dữ liệu',
        importFailed: 'Lỗi nhập liệu',
        geoCodeFailed: 'Lỗi Geocode',
    };

    constructor(fieldForceStore)
    {

        this.appStore = fieldForceStore.appStore;
        this.i18n = fieldForceStore?.appStore?.contexts?.i18n;
        this.modalContext = fieldForceStore?.appStore?.contexts?.modal;

        this.comSvc = fieldForceStore?.comSvc;
        this.uploadSvc = new UploadService(fieldForceStore?.appStore?.contexts);

        this.files = [];
        this.isShow = false;
        this.currentPageIndex = 1;

        this.resetFileContentFilterState();
        this.resetFileFilterState();
        this.resetCurrentFileContents();
        this.isImporting = false;
        this.isLoading = false;
    }
    getImportStatusColor = (statusId) =>
    {
        switch (statusId)
        {
            case IMPORT_STATUS.success:
                return {
                    status: this.importStatus.success,
                    color: 'var(--success-color)',
                };
            case IMPORT_STATUS.dataFailed:
                return {
                    status: this.importStatus.dataFailed,
                    color: 'var(--danger-color)',
                };
            case IMPORT_STATUS.geoCodeFailed:
                return {
                    status: this.importStatus.geoCodeFailed,
                    color: 'var(--danger-color)',
                };
            case IMPORT_STATUS.importFailed:
                return {
                    status: this.importStatus.importFailed,
                    color: 'var(--danger-color)',
                };
            case IMPORT_STATUS.update:
                return {
                    status: this.importStatus.update,
                    color: 'var(--warning-color)',
                };
            default:
                return {
                    status: this.importStatus.notImported,
                    color: 'var(--contrast-highlight)',
                };
        }
    }

    getImportStatusCount = (status) =>
    {
        const statuses = Object.keys(status);
        let statusId = 1;
        let statusOverview = 'Nhập liệu thành công';
        let totalItems = undefined;
        let totalFails = undefined;
        let totalNotImported = undefined;
        let totalUpdate = undefined;

        if (statuses.length === 0)
        {
            statusOverview = this.importStatus.notImported;
            statusId = parseInt(IMPORT_STATUS.notImported);
        }
        else
        {
            totalItems = 0;
            totalItems += status[IMPORT_STATUS.success] || 0;
            totalItems += status[IMPORT_STATUS.dataFailed] || 0;
            totalItems += status[IMPORT_STATUS.geoCodeFailed] || 0;
            totalItems += status[parseInt(IMPORT_STATUS.notImported)] || 0;
            totalItems += status[IMPORT_STATUS.importFailed] || 0;
            totalItems += status[IMPORT_STATUS.update] || 0;

            statusId = IMPORT_STATUS.success;

            if (status[parseInt(IMPORT_STATUS.notImported)] >= 0)
            {
                totalNotImported = status[parseInt(IMPORT_STATUS.notImported)] || 0;
                statusOverview = this.importStatus.notImported;
                statusId = parseInt(IMPORT_STATUS.notImported);
            }

            if (status[IMPORT_STATUS.update] >= 0)
            {
                totalUpdate = status[IMPORT_STATUS.update] || 0;
                statusOverview = this.importStatus.update;
                statusId = IMPORT_STATUS.update;
            }

            if (status[IMPORT_STATUS.dataFailed] >= 0 || status[IMPORT_STATUS.geoCodeFailed] >= 0 || status[IMPORT_STATUS.importFailed] >= 0)
            {
                totalFails = 0;
                totalFails += status[IMPORT_STATUS.dataFailed] || 0;
                totalFails += status[IMPORT_STATUS.geoCodeFailed] || 0;
                totalFails += status[IMPORT_STATUS.importFailed] || 0;
                statusId = IMPORT_STATUS.dataFailed;
                statusOverview = 'Nhập liệu thất bại';
            }
        }
        return { statusOverview, totalItems, totalFails, totalNotImported, totalUpdate, statusId };
    };

    setFileColumns = (fileColumn) =>
    {
        if (fileColumn)
        {
            this.fileColumns = fileColumn;
        }
        else
        {
            this.fileColumns = [];
        }
    };

    setLoading = (isLoading) =>
    {
        this.isLoading = isLoading;
    };

    setFileContentFilterState = (key, value) =>
    {
        this.fileContentFilter[key] = value;
    }

    setFileFilterState = (key, value) =>
    {
        this.fileFilter[key] = value;
    };

    setAllFileFilterState = (filter = {}, isReplace) =>
    {
        if (isReplace)
        {
            this.fileFilter = filter;
        }
        else
        {
            for (const key in filter)
            {
                if (filter.hasOwnProperty(key))
                {
                    this.fileFilter[key] = filter[key];
                }
            }
        }
    };

    resetFileContentFilterState = () =>
    {
        this.fileContentFilter = {
            'Title': '',
            'Status': [],
            'job_created': undefined,
        };
    };

    resetAllFileFilterState = () =>
    {
        const fileFilter = {
            'CreatedDate': undefined,
            'uploader': '',
            'Status': '',
            'fileSearchKey': this.fileFilter['fileSearchKey'] ?? '',
        };
        this.fileFilter = fileFilter;
    };

    resetFileFilterState = () =>
    {
        const fileFilter = {
            'CreatedDate': undefined,
            'uploader': '',
            'Status': '',
            'fileSearchKey': '',
        };
        this.fileFilter = fileFilter;
    }

    applyFileFilter = (filters) =>
    {
        const { page, pageSize, ...filter } = filters;
        if (this.files)
        {
            this.files = this.files.map((row) =>
            {
                let UserNameCorrect = true;
                let StatusCorrect = true;
                let CreatedDateCorrect = true;
                let SearchKeyCorrect = true;
                const filters = Object.keys(filter);
                if (filters && filters.length)
                {
                    filters.forEach((key) =>
                    {
                        const value = filter[key] !== undefined && filter[key] !== '' ? filter[key] : null;
                        if (value !== null)
                        {
                            if (key === 'uploader')
                            {
                                UserNameCorrect = value ? row.Username.includes(value) : true;
                            }
                            else if (key === 'Status')
                            {
                                if (row.statusId === undefined && value === 'undefined')
                                {
                                    StatusCorrect = true;
                                }
                                else
                                {
                                    StatusCorrect = row.statusId === value;
                                }
                            }
                            else if (key === 'CreatedDate')
                            {
                                const createdDate = moment(row.CreatedDate);
                                const minDate = moment(value).startOf('date');
                                const maxDate = moment(value).endOf('date');

                                CreatedDateCorrect = (createdDate >= minDate && createdDate <= maxDate);
                            }
                            else if (key === 'fileSearchKey')
                            {
                                SearchKeyCorrect = row.Description.includes(value);
                            }
                        }
                    });
                }
                row.isVisible = SearchKeyCorrect && UserNameCorrect && StatusCorrect && CreatedDateCorrect;
                return row;
            });
        }
        this.paging.currentPage = page || 1;
        this.paging.pageSize = pageSize || 10;
    }

    applyFileContentFilter = (filters) =>
    {
        const { page, pageSize, ...filter } = filters;
        if (this.currentFileContents.rows)
        {
            this.currentFileContents.rows = this.currentFileContents.rows.map((row) =>
            {
                let TitleCorrect = true;
                let StatusCorrect = true;
                let CreatedDateCorrect = true;
                const filters = Object.keys(filter);
                if (filters && filters.length)
                {
                    filters.forEach((key) =>
                    {
                        const value = filter[key] !== undefined && filter[key] !== '' ? filter[key] : null;
                        if (value !== null)
                        {
                            if (key === 'Title')
                            {
                                TitleCorrect = value ? row.Title.includes(value) : true;
                            }
                            else if (key === 'Status')
                            {
                                if ((row.Status === undefined && value === 'undefined') || (Array.isArray(value) && value.length === 0))
                                {
                                    StatusCorrect = true;
                                }
                                else
                                {
                                    StatusCorrect = value === row.Status || (Array.isArray(value) && value.indexOf(row.Status) > -1);
                                }
                            }
                            else if (key === 'job_created')
                            {
                                const jobCreatedDate = moment(row.job_created);
                                const minDate = moment(value).startOf('date');
                                const maxDate = moment(value).endOf('date');

                                CreatedDateCorrect = (jobCreatedDate >= minDate && jobCreatedDate <= maxDate);
                            }
                        }
                    });
                }
                row.isVisible = TitleCorrect && StatusCorrect && CreatedDateCorrect;
                return row;
            });
        }
        this.currentFileContents.currentPage = page || 1;
        this.currentFileContents.pageSize = pageSize || 20;
        // this.currentFileContents.totalItems = Math.ceil(this.currentFileContents.rows.length / this.currentFileContents.pageSize);
    }

    togglePanel = () =>
    {
        this.isShow = !this.isShow;
    }

    setFiles = (files = []) =>
    {
        this.files = files;
    }

    loadExcelFiles = async (layerName) =>
    {
        const files = await this.uploadSvc.getImportFilesByLayerName(layerName);

        this.files = Array.isArray(files.data) ? files.data.map((d) =>
        {
            const { statusOverview, totalItems, totalNotImported, totalFails, statusId } = this.getImportStatusCount(d.Status);
            d = {
                ...d,
                statusOverview,
                totalItems,
                totalNotImported,
                totalFails,
                statusId,
                isVisible: true,
            };
            return d;
        }).sort((a, b) =>
        {
            return b.CreatedDate - a.CreatedDate;
        }) : [];
        this.fileFilter = {};
        this.paging.total = this.files.length;
    }

    loadExcelFileContent = async (layerName, userName, dataId, limit) =>
    {
        // const layerName = 'JOB';
        const { data, total, status } = await this.uploadSvc.getImportedFileData(layerName, userName, dataId, 0, limit);
        // const rowData = returnData ? returnData : data;
        // console.log(returnData);
        if (status && status.success)
        {
            this.currentFileContents = {
                rows: data.map((d)=>
                {
                    d.rowKey = `${d._id || d.Name}`;
                    d.Error = d.ImportStatus ? JSON.parse(d.ImportStatus) : null;
                    return d;
                }),
                fileName: dataId,
                userName: userName,
                totalItems: total,
                currentPage: 1,
                processedRow: data.filter(row => row.Status !== IMPORT_STATUS.notImported && row.Status !== Number.parseInt(IMPORT_STATUS.notImported)).length,
                pageSize: this.currentFileContents.pageSize || 20,
            };


            // Update current file import status
            // this.loadExcelFiles(layerName);
            this.uploadSvc.getImportFilesByLayerName(layerName).then((res) =>
            {
                if (res && res.data)
                {
                    let file = res.data.find((x) => x.Username === userName && x.Description === dataId);
                    const { statusOverview, totalItems, totalNotImported, totalFails, statusId } = this.getImportStatusCount(file.Status);
                    file = {
                        ...file,
                        statusOverview,
                        totalItems,
                        totalNotImported,
                        totalFails,
                        statusId,
                    };
                    this.files = this.files.map((x) =>
                    {
                        if (x.Username === file.Username && x.Description === file.Description)
                        {
                            return {
                                ...file,
                                isVisible: x.isVisible,
                            };
                        }
                        return x;
                    });
                }
            });
        }
        else
        {
            this.resetCurrentFileContents();
        }
        this.fileContentFilter = {};
    }

    refreshAfterImport = (data, dataId, userName, total) =>
    {
        this.currentFileContents = {
            rows: data.map((d)=>
            {
                d.rowKey = `${d._id || d.Name}`;
                return d;
            }),
            fileName: dataId,
            userName: userName,
            totalItems: total,
            currentPage: 1,
            processedRow: this.currentFileContents.processedRow || 0,
            pageSize: this.currentFileContents.pageSize || 20,
        };
    }

    searchFileLocal = (keyword) =>
    {
        // this.fileSearchKey = keyword;
        this.files = this.files.map((f) =>
        {
            f.isVisible = keyword && keyword !== '' ? f.Description.includes(keyword) : true;
            return f;
        });
    }

    deleteFile = async (layerName, userName, dataId) =>
    {
        const delResult = await this.uploadSvc.delete(layerName, userName, dataId);
        if (delResult.status.code === 200)
        {
            await this.loadExcelFiles(layerName);
            this.applyFileFilter(this.fileFilter);

            this.modalContext.toast({ type: 'success', message: `${this.i18n.t('Xóa file thành công')}. ${this.i18n.t('Chi tiết')}: ${delResult.status.message}` });
            if (this.currentFileContents.fileName === dataId)
            {
                this.resetCurrentFileContents();
            }
        }
        else
        {
            this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Có lỗi xảy ra, vui lòng thử lại sau.')}. ${this.i18n('Chi tiết')}: ${delResult.status.message}` });
        }
    }

    resetCurrentFileContents = () =>
    {
        this.currentFileContents = {
            rows: [],
            fileName: '',
            userName: '',
            currentPage: 1,
            totalItems: 0,
            processedRow: 0,
            pageSize: this.currentFileContents.pageSize || 20,
        };
    }

    downloadFile = async (layerName, userName, dataId) =>
    {
        this.comSvc.getImportedFile(layerName, { fileName: dataId, userName: userName, limit: 1000 });
    }

    setContentPageIndex = (pageIndex) =>
    {
        this.paging.currentPageIndex = pageIndex;
    }

    setPageSize = (size) =>
    {
        this.paging.pageSize = size;
    }


}

decorate(UploadStore, {
    files: observable,
    paging: observable,
    isShow: observable,
    currentFileContents: observable,
    setFileColumns: action,
    fileColumns: observable,
    togglePanel: action,
    setFiles: action,
    isImporting: observable,
    pageSize: observable,
    currentPageIndex: observable,
    setContentPageIndex: action,
    setPageSize: action,

    loadExcelFiles: action,
    fileContentFilter: observable,
    applyFileContentFilter: action,
    setFileContentFilterState: action,

    fileFilter: observable,
    applyFileFilter: action,
    setFileFilterState: action,
    resetAllFileFilterState: action,
    resetFileFilterState: action,
    setAllFileFilterState: action,

    loadExcelFileContent: action,
    refreshAfterImport: action,
    searchFileLocal: action,
    urlParams: observable,
    setLoading: action,
    isLoading: observable,
});

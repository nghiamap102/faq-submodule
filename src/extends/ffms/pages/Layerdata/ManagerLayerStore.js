import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { decorate, observable, action, runInAction } from 'mobx';
import LayerService from 'services/layer.service';
import { CommonHelper } from 'helper/common.helper';
import { LAYERS } from 'extends/ffms/constant/models';
import { isEmpty } from 'helper/data.helper';

export const defaultLayerGridPageSize = 10;
export class ManagerLayerStore
{
    layerSvc = new LayerService();

    currentLayer = {};
    currentLayerItem = {};
    currentOrg = {};

    isShow = false;
    action = 'create';
    currentNodes = [];
    isShow = false;
    isCheck = false;
    pageSize = defaultLayerGridPageSize;
    page = 1;
    totalNodes = 0;
    isLoading = false;

    sortingColumns = [];

    sorters = undefined;
    filterState = {};

    urlParams = {};

    // data of PHOTO_TYPE layer
    photoTypeData = [];
    systemValidation = {};

    showConfig = false;
    currentConfig = {};
    isDirty = false;

    showDetail=false;

    hashParam = {};
    mainTab = 1;

    setMainTab = (tabIndex) =>
    {
        this.mainTab = tabIndex;
    };

    setHashParam = (hash) =>
    {
        this.hashParam = hash;
    }

    setSorters = (columns) =>
    {
        if (columns)
        {
            this.sortingColumns = columns;
        }
    }

    setFilterState = (key, value) =>
    {
        this.filterState[key] = value;
    };

    setAllFilterState = (filter = {}, isReplace) =>
    {
        if (isReplace)
        {
            this.filterState = filter;
        }
        else
        {
            for (const key in filter)
            {
                if (filter.hasOwnProperty(key))
                {
                    this.filterState[key] = filter[key];
                }
            }
        }
    };
    resetFilterState = () =>
    {
        this.filterState = {};
    };

    getFullFilterState = async () =>
    {
        const filterState = {};

        const { employee_type_id, jobtype_id, ...filters } = this.filterState;

        switch (this.currentLayer.LayerName)
        {
            case 'JOB_TYPE':
                filters['employee_type_id'] = employee_type_id;
                break;
            case 'EMPLOYEE_TYPE':
                filters['jobtype_id'] = jobtype_id;
                break;
        }

        for (const key in filters)
        {
            const value = filters[key];
            if (value && (!Array.isArray(value) || value.length > 0))
            {
                switch (key)
                {
                    case 'searchKey':
                    case 'team_organization_id':
                        filterState[key] = value;
                        break;
                    default:
                        filterState[key] = Array.isArray(value) && value.length === 1 ? value[0] : { inq: value };
                        break;
                }
            }
        }
        filterState.skip = (this.pageIndex - 1) * this.pageSize;
        filterState.take = this.pageSize;

        // add sorter(s)

        if (this.sortingColumns)
        {
            const fields = this.currentLayer.Properties ? CommonHelper.toDictionary(this.currentLayer.Properties, 'ColumnName', 'sortId') : {};
            const sorters = this.sortingColumns.filter((x) => x.id && x.direction).map((col) =>
            {
                return {
                    Field: fields[col.id] ? fields[col.id] : col.id,
                    Direction: col.direction.toUpperCase(),
                };
            });

            filterState.sortBy = sorters;
        }
        else
        {
            delete filterState.sortBy;
        }

        filterState['includeRelations'] = false;
        return filterState;
    };

    constructor(fieldForceStore)
    {
        this.appStore = fieldForceStore?.appStore;
        this.comSvc = fieldForceStore?.comSvc;

        this.isShow = false;
        this.action = 'create';

        this.showConfig = false;
        this.currentConfig = {};
        this.isDirty = false;
        this.mainTab = 1;
    }

    setShowForm = (isShow, action) =>
    {
        if (isShow !== undefined)
        {
            this.isShow = isShow;
        }

        if (action !== undefined)
        {
            this.action = action;
        }
    };

    setLayerItem = (mode, layerItem) =>
    {
        this.currentLayerItem = layerItem;
    };

    getDataGridColumns = async (layerInfo, properties) =>
    {
        const columns = await this.comSvc.getDataGridColumns('', [], properties);
        return columns.map((x) =>
        {
            // remove jobtype_config from grid
            if (layerInfo.LayerName === 'JOB_TYPE')
            {
                if (x.ColumnName === 'jobtype_config')
                {
                    x.hidden = true;
                    x.IsView = false;
                }
            }
            // config for team
            if (layerInfo.LayerName === 'TEAM')
            {
                if (x.ColumnName === 'Description')
                {
                    x.DataType = 6;
                }
                if (x.ColumnName === 'team_organization_id')
                {
                    x.IsReadOnly = true;
                }
                if (x.ColumnName === 'Title')
                {
                    x.IsRequire = true;
                }
            }

            return x;
        });
    };

    handleCustomLayer = async (layerInfo, properties, data) =>
    {
        if (layerInfo.LayerName === 'JOB_TYPE' || layerInfo.LayerName === 'EMPLOYEE_TYPE')
        {
            const modelInfo = await this.getModelInfo(layerInfo.LayerName);
            const employeeTypeProps = this.comSvc.layerInfo['JOBTYPE_EMPLOYEETYPE'] ? this.comSvc.layerInfo['JOBTYPE_EMPLOYEETYPE'].Properties : await this.comSvc.getLayerProperties('JOBTYPE_EMPLOYEETYPE');
            const prop = employeeTypeProps.find((x) => x.ColumnName === modelInfo.linkField);
            const fieldOptions = await this.comSvc.getLayerListOptions('JOBTYPE_EMPLOYEETYPE', modelInfo.linkField, prop.Config);

            const columns = await this.getDataGridColumns(layerInfo, [...properties, { ...prop, Order: 10001, IsRequire: layerInfo.LayerName === 'JOB_TYPE' ? true : false }]);
            Object.assign(columns[columns.length - 1], {
                schema: 'multi-select',
                multi: true,
                options: fieldOptions.map((o) =>
                {
                    o.color = 'var(--default-color)';
                    return o;
                }),
                width: 300,
            });

            await this.getMappingTypes(data, modelInfo);
            properties = columns;
        }

        return { properties, currentNodes: data };

    };

    // Get Layer info with properties' definition
    setCurrentLayer = async (layerInfo) =>
    {
        if (layerInfo)
        {
            this.isLoading = true;
            const model = this.comSvc.getModelName(layerInfo.LayerName);
            const properties = layerInfo.Properties;
            const columns = await this.getDataGridColumns(layerInfo, properties);

            runInAction(() =>
            {
                this.currentNodes = null;
                this.currentLayer = Object.assign(layerInfo, {
                    path: layerInfo.path,
                    Properties: columns,
                });
            });

            const filterState = await this.getFullFilterState();
            const dataRes = await this.comSvc.queryData(model, filterState);
            const data = dataRes?.data || undefined;
            const layerData = await this.handleCustomLayer(layerInfo, properties, data);

            // prevent case when data take long time to get data and apply old data to current data
            if (!this.urlParams.layer || this.urlParams.layer === layerInfo.LayerName)
            {
                runInAction(() =>
                {
                    this.currentLayer.Properties = layerData.properties;
                    this.currentNodes = layerData.currentNodes;
                    this.totalNodes = dataRes?.total || 0;
                });
            }

            this.isLoading = false;
        }
    };

    getLayerItemEdit = (layerName, nodeId) =>
    {
        return this.comSvc.getRawData(LAYERS[layerName],nodeId);
    };

    // helper
    getMappingTypes = async (primaryData, modelInfo = {}) =>
    {
        if (primaryData && primaryData.length)
        {
            const { mappingModelName, primaryField, linkField, primary, link } = modelInfo;
            const linkDataDict = await this.comSvc.getReferenceDictionary(link.modelName, link.displayField, link.idField);
            const mappingData = await this.comSvc.queryData(mappingModelName, { [primaryField]: { inq: primaryData.map((x) => x[primary.idField]) } });
            const mappingTypeDict = CommonHelper.toDictionaryAsList(mappingData?.data || [], primaryField, linkField);

            for (const data of primaryData)
            {
                data[linkField] = mappingTypeDict[data[primary.displayField]]?.map((value) => `${linkDataDict[value]}`) || [];
            }
        }
        return primaryData;
    };

    getModelInfo = async (layerName) =>
    {
        const config = {
            'JOB_TYPE': {
                modelName: 'job-types',
                idField: 'jobtype_id',
                displayField: 'jobtype_name',
            },
            'EMPLOYEE_TYPE': {
                modelName: 'employee-types',
                idField: 'employeetype_id',
                displayField: 'employeetype_name',
            },
        };

        if (layerName === 'JOB_TYPE')
        {
            return {
                mappingModelName: 'job-types-employee-types',
                primaryField: 'jobtype_id',
                linkField: 'employee_type_id', // !!OMG
                primary: config[layerName],
                link: config['EMPLOYEE_TYPE'],
            };

        }
        else if (layerName === 'EMPLOYEE_TYPE')
        {
            return {
                mappingModelName: 'job-types-employee-types',
                primaryField: 'employee_type_id',
                linkField: 'jobtype_id',
                primary: config[layerName],
                link: config['JOB_TYPE'],
            };
        }

        return {};
    };

    // Get layer data with filter, paging, sorter
    reload = async () =>
    {
        this.isLoading = true;

        const model = this.comSvc.getModelName(this.currentLayer.LayerName);
        const filterState = await this.getFullFilterState();
        const res = await this.comSvc.queryData(model, filterState);

        const data = res?.data;
        if (this.currentLayer.LayerName === 'JOB_TYPE' || this.currentLayer.LayerName === 'EMPLOYEE_TYPE')
        {
            const modelInfo = await this.getModelInfo(this.currentLayer.LayerName);
            await this.getMappingTypes(data, modelInfo);
        }

        runInAction(() =>
        {
            this.currentNodes = data;
            this.totalNodes = res?.total;
            this.isLoading = false;
        });

        return res;
    };

    reloadDebounce = AwesomeDebouncePromise(this.reload.bind(this), 200);

    setPhotoTypeData = (id, field, value) =>
    {
        if (this.photoTypeData)
        {
            var foundIndex = this.photoTypeData.findIndex(x => x.phototype_id == id);
            if (foundIndex > -1)
            {
                this.photoTypeData[foundIndex][field] = value;
            }
        }
    };

    setPaging = (page, size = 20) =>
    {
        this.pageIndex = page;
        if (size)
        {
            this.pageSize = size;
        }
    };

    setGridOptions = (filter = {}, paging, sorters, data) =>
    {
        this.setAllFilterState(filter, Object.keys(filter).length === 0 ? true : false);
        this.setPaging(paging.page || 1, paging.pageSize || 20);
        this.setSorters(sorters);

        if (data && (!this.currentLayer || this.currentLayer.LayerName !== data.LayerName))
        {
            this.setCurrentLayer(data);
        }
        else if (this.currentLayer?.LayerName) // init
        {
            this.reload();
        }
    }

    setCurrentConfig = (itemConfig) =>
    {
        this.currentConfig = itemConfig;
    };

    setShowConfig = (isShow) =>
    {
        this.showConfig = isShow;
    };
    setIsDirty = (dirty) =>
    {
        this.isDirty = dirty;
    };

    setShowDetail = (isShow) =>
    {
        this.showDetail = isShow;
    };

    setCurrentOrg = (org) =>
    {
        this.currentOrg = org;
    };
}

decorate(ManagerLayerStore, {
    currentLayer: observable,
    currentNodes: observable,
    pageSize: observable,
    pageIndex: observable,
    totalNodes: observable,
    isLoading: observable,
    sortingColumns: observable,

    onChangePage: action,
    onChangeItemsPerPage: action,
    reload: action,
    reloadDebounce: action,
    setCurrentLayer: action,

    isShow: observable,
    action: observable,
    setShowForm: action,

    currentLayerItem: observable,
    setLayerItem: action,
    photoTypeData: observable,

    getLayerItemEdit: action,
    setPhotoTypeData: action,

    filterState: observable,
    sorters: observable,
    setSorters: action,
    setFilterState: action,
    getFullFilterState: action,
    resetFilterState: action,
    setAllFilterState: action,
    setPaging: action,
    setGridOptions: action,

    showConfig: observable,
    setShowConfig: action,
    currentConfig: observable,
    setCurrentConfig: action,
    isDirty: observable,
    setIsDirty: action,
    mainTab: observable,
    hashParam: observable,
    setMainTab: action,
    setHashParam: action,

    showDetail: observable,
    setShowDetail: action,

    currentOrg: observable,
    setCurrentOrg: action,
});

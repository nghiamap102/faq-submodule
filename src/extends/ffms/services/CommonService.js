
import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';
import { CommonHelper } from 'helper/common.helper';
import { toDisplaySchemaProps } from 'helper/data.helper';

import { LAYERS } from 'extends/ffms/constant/models';
import { SOLR_LIST_SUFFIX } from 'extends/ffms/constant/ffms-enum';
import { Constants } from 'constant/Constants';
import LayerService from 'services/layer.service';
import { FileHelper } from 'helper/file.helper';

const requestLimitData = 50;
export default class CommonService
{
    http = new HttpClient();
    apiURL = AppConstant.vdms.url;
    layerInfo = {};
    static DataRefs = {};
    layerSvc = new LayerService();

    constructor(contexts, apiURL)
    {
        this.apiURL = apiURL || this.apiURL;
        this.contexts = contexts;
    }

    getRawData = (layerName, nodeId) =>
    {
        const model = this.getModelName(layerName);
        const url = `/api/ffms/${model}/${nodeId}/detail`;
        return this.http.get(url, AuthHelper.getVDMSHeader());
    };

    /* QUERY DATA */
    getLayerData = (layerName, searchKey) =>
    {
        const model = this.getModelName(layerName);
        const filter = { skip: 0, take: Math.max(requestLimitData || 0, 100) };

        if (searchKey)
        {
            filter.searchKey = searchKey;
        }

        const url = `/api/ffms/${model}?filter=${encodeURIComponent(JSON.stringify(filter))}`;
        return this.http.get(url, AuthHelper.getVDMSHeader());
    };

    getDataReferences = (names = [], searchKey) =>
    {
        if (names && names.length > 0)
        {
            if (!Array.isArray(names) && typeof (names) === 'string')
            {
                names = [names];
            }

            names = names.map((n)=> this.getModelName(n));

            const filtered = searchKey !== undefined ? names : names.filter((x) => Object.keys(CommonService.DataRefs).indexOf(x) === -1);
            if (filtered.length > 0)
            {
                return Promise.all(filtered.map((model) =>
                {
                    return this.getLayerData(model, searchKey);
                })).then((responses) =>
                {
                    filtered.forEach((name, ind) =>
                    {
                        CommonService.DataRefs[name] = responses[ind] || [];
                    });

                    return CommonService.DataRefs;
                });
            }
        }

        return Promise.resolve(CommonService.DataRefs);
    };

    updateDataReferences = (names = []) =>
    {
        if (!Array.isArray(names) && typeof (names) === 'string')
        {
            names = [names];
        }
        
        names = names.map((n)=> this.getModelName(n));

        if (names.length > 0)
        {
            return Promise.all(names.map((layerName) => this.getLayerData(layerName))).then((responses) =>
            {
                names.forEach((name, ind) =>
                {
                    CommonService.DataRefs[name] = responses[ind] || [];
                });
            });
        }
    };

    getReferenceDictionary = async (layerName, keyField, valueField) =>
    {
        const dataRefs = await this.getDataReferences([layerName]);
        if (dataRefs[layerName])
        {
            return CommonHelper.toDictionary(dataRefs[layerName], keyField, valueField);
        }
        return {};
    };


    queryData = (layerName, filter, silent = false) =>
    {
        if (!layerName)
        {
            return null;
        }
        const model = this.getModelName(layerName);
        if (!filter)
        {
            filter = {};
        }
        if (filter.take === undefined || filter.take === null)
        {
            filter.take = requestLimitData || 20;
        }
        return this.http.post(`/api/ffms/${model}/search`,filter, AuthHelper.getSystemHeader()).then((rs) =>
        {
            if (!rs && !silent && this.contexts?.modal)
            {
                this.contexts.modal.toast({ type: 'error', message: rs ? rs.errorMessage : 'Không có dữ liệu' });
            }
            return rs;
        });
    };

    queryCount = (layerName, filter = {}) =>
    {
        const model = this.getModelName(layerName);
        filter.skip = 0;
        filter.take = 0;
        return this.http.get(`/api/ffms/${model}/count?where=${encodeURIComponent(JSON.stringify(filter))}`, filter, AuthHelper.getSystemHeader()).then((rs) =>
        {
            return rs.count;
        });
    }

    getById = (layerName, id) =>
    {
        const model = this.getModelName(layerName);
        return this.http.get(`/api/ffms/${model}/${id}`);
    };

    /* IMPORT Service */
    getImportTemplate = async (layerName) =>
    {
        const body = {
            layerName: layerName.toUpperCase(),
            start: 0,
            count: 1,
            returnFields: ['FileId'],
            layers: ['CONTAINER'],
            isInTree: true,
        };

        return this.http.postFileStream('/api/ffms/vdms-files/download-import-template', body, AuthHelper.getVDMSHeader()).then((response) =>
        {
            FileHelper.saveExportFileAs(layerName, response);
        });
    };

    getExportQueryFile = async (layerName, query) =>
    {
        const layer = layerName.toUpperCase();
        const body = {
            layers: [layer],
            isInTree: true,
            returnFields: ['*'],
            start: query?.start || 0,
            count: query?.count || -1,
            searchKey: query?.searchKey || '',
            sortOption: {
                sortInfo: query?.sortInfo,
            },
            filterQuery: query?.filterQuery,
        };
        return this.http.postFileStream('/api/ffms/vdms-files/download-by-query', body, AuthHelper.getVDMSHeader()).then((response) =>
        {
            FileHelper.saveExportFileAs(layerName, response);
        });
    };

    getImportedFile = (layerName, filter) =>
    {
        const body = {
            limit: -1,
            layerName: layerName.toUpperCase(),
            ...filter,
        };
        return this.http.postFileStream('/api/ffms/vdms-files/download-imported-file', body, AuthHelper.getVDMSHeader()).then((response) =>
        {
            FileHelper.saveExportFileAs(filter.fileName?.split('.')[0] || layerName, response);
        });
    };

    /* OTHERS */
    getModelName = (layerName) =>
    {
        if (layerName)
        {
            layerName = layerName.replace(`${this.contexts?.tenant?.sysId}_`,'');
            const model = LAYERS[layerName.toUpperCase()] || layerName;
            return model.toLowerCase();
        }
        return null;
    };
    getLayerConfig = async (layerName) =>
    {
        if (this.layerInfo[layerName])
        {
            return this.layerInfo[layerName];
        }

        const model = this.getModelName(layerName);
        const result = await this.http.get(`/api/ffms/${model}/layer-config`);
        if (result && result.status && result.status.success)
        {
            this.layerInfo[layerName] = result.data;
        }

        return this.layerInfo[layerName];
    };

    getLayerProperties = async (layerName) =>
    {
        const layerInfo = await this.getLayerConfig(layerName);
        return layerInfo
            ? layerInfo.Properties.map((p) =>
            {

                if (p.DataType === 10 && p.Config && typeof (p.Config) === 'string')
                {
                    p.Config = JSON.parse(p.Config);
                }
                return p;
            })
            : [];
    };

    getIndexedValue = (layerName, field, value) =>
    {
        return this.getLayerProperties(layerName).then((props) =>
        {
            return this.getValueByType(props, field, value, 'indexed');
        });
    };

    getDatabaseValue = (layerName, field, value) =>
    {
        return this.getLayerProperties(layerName).then((props) =>
        {
            return this.getValueByType(props, field, value);
        });
    };

    getValueByType = (props, field, value, type) =>
    {
        const dictProps = CommonHelper.toDictionary(props, 'ColumnName', 'Config');
        let config = dictProps[field] || {};

        if (typeof (config) === 'string')
        {
            config = JSON.parse(config);
        }

        if (!config.content)
        {
            return value;
        }

        const { mode, source, valueField, displayField, defaultField } = config.content;
        const keyField = type === 'indexed' ? valueField : displayField;
        const returnField = type === 'indexed' ? displayField : valueField;
        switch (mode)
        {
            case 'predefine':
            {
                const listData = CommonHelper.toDictionary(typeof (source) === 'string' ? JSON.parse(source) : source, keyField, returnField);
                return Promise.resolve(listData[`${value}`]);
            }
            case 'layer':
            {
                const model = this.getModelName(source);

                return this.getDataReferences([model]).then((dataRefs) =>
                {
                    const listData = CommonHelper.toDictionary(dataRefs[model], keyField, returnField);
                    return listData[`${value}`];
                });
            }
        }
        return value !== null && value !== undefined ? value : defaultField;
    };

    getLayerListOptions = async (model, field, config, searchKey) =>
    {
        if (!config)
        {
            const props = await this.getLayerProperties(model);
            const dictProps = CommonHelper.toDictionary(props, 'ColumnName', 'Config');

            config = dictProps[field] || {};
        }

        if (typeof (config) === 'string')
        {
            config = JSON.parse(config);
        }

        if (config.content)
        {
            const { mode, valueField, displayField, defaultField } = config.content;
            let source = config.content?.source;
            switch (mode)
            {
                case 'predefine':
                {
                    if (typeof (source) === 'string')
                    {
                        source = JSON.parse(source);
                    }
                    return source.map((d) =>
                    {
                        return {
                            id: `${d[valueField]}`,
                            indexed: d[displayField],
                            label: d[displayField],
                            color: 'var(--primary-color)',
                            ...d,
                        };
                    });
                }
                case 'layer':
                {
                    const model = this.getModelName(source);

                    return this.getDataReferences([model], searchKey).then((dataRefs) =>
                    {
                        return dataRefs && Array.isArray(dataRefs[model])
                            ? dataRefs[model].map((d) =>
                            {
                                return {
                                    id: `${d[valueField]}`,
                                    indexed: d[displayField],
                                    label: d[displayField],
                                    color: 'var(--primary-color)',
                                    ...d,
                                };
                            })
                            : [];
                    });
                }
            }
        }
        return [];
    };

    addLayerData = (layerName, obj) =>
    {
        const model = this.getModelName(layerName);
        return this.http.post(`/api/ffms/${model}`, obj, AuthHelper.getVDMSHeader());
    };

    updateLayerData = (layerName, id, obj) =>
    {
        const model = this.getModelName(layerName);
        return this.http.patch(`/api/ffms/${model}/${id}`, obj, AuthHelper.getVDMSHeader());
    };

    updateLayerDataByNodeId = (layerName, nodeId, obj) =>
    {
        const model = this.getModelName(layerName);
        return this.http.patch(`/api/ffms/${model}?filter=${encodeURIComponent(JSON.stringify({ Id: nodeId }))}`, obj, AuthHelper.getVDMSHeader());
    };

    deleteLayerData = (layerName, id, obj) =>
    {
        const model = this.getModelName(layerName);
        return this.http.delete(`/api/ffms/${model}/${id}`, obj, AuthHelper.getVDMSHeader());
    };

    deleteLayerDataByNodeId = (layerName, nodeIds, obj) =>
    {
        const model = this.getModelName(layerName);
        return this.http.post(`/api/ffms/${model}/delete-by-node`, { nodeIds: nodeIds }, AuthHelper.getVDMSHeader());
    };

    getDataGridColumns = async (layerName, hiddenCols, properties) =>
    {
        const layerProperties = properties ? properties : await this.getLayerProperties(layerName);
        const width = 200;
        let columns = layerProperties.filter((prop) => prop.IsView && prop.DataType !== 9).sort((a,b) => a.Order > b.Order ? 1 : -1);
        const lastColumnFullWidth = (columns.length * width) <= window.innerWidth;
        const lastWidth = window.innerWidth - ((columns.length - 1) * width) - 8;

        columns = columns.filter((col) => col.IsView).map((col, index) =>
        {
            const schema = toDisplaySchemaProps(col.DataType);
            const isMapField = col.DataType === 7 || col.DataType === 11;

            return {
                ...col,
                hidden: hiddenCols.indexOf(col.ColumnName) > -1,
                id: col.ColumnName,
                displayAsText: col.DisplayName,
                width: lastColumnFullWidth && index === (columns.length - 1) ? lastWidth : width,
                isSortable: !isMapField,
                sortId: col.DataType === 10 ? `${col.ColumnName}${SOLR_LIST_SUFFIX}` : col.ColumnName,
                ...schema,
            };
        });
        return columns;
    };

    getAdministrativeValues = async (data, stateField, districtField, tehsilField) =>
    {
        if (data && Array.isArray(data))
        {
            const states = CommonHelper.getUniqueValues(data, stateField);
            const districts = CommonHelper.getUniqueValues(data, districtField);
            const tehsils = CommonHelper.getUniqueValues(data, tehsilField);

            const filterQuery = [
                `(TYPE:("${Constants.TYPE_PROVINCE}") AND ${states.map((s) => `UniqueName:(${s})`).join(' OR ')})`,
                `(TYPE:("${Constants.TYPE_DISTRICT}") AND ${districts.map((d) => `UniqueName:(${d})`).join(' OR ')})`,
                `(TYPE:("${Constants.TYPE_WARD}") AND ${tehsils.map((t) => `UniqueName:(${t})`).join(' OR ')})`,
            ].join(' OR ');

            const rs = await this.layerSvc.getLayers({
                path: '/root/vdms/tangthu/data',
                start: 0,
                count: 100,
                filterQuery: [filterQuery],
                returnFields: ['*'],
                layers: ['ADMINISTRATIVE'],
                isInTree: true,
            });

            if (rs?.status?.code === 200 && rs?.data?.length)
            {
                try
                {
                    const rStates = [];
                    const rDistricts = [];
                    const rTehsils = [];

                    if (rs && rs.data)
                    {
                        rs.data.forEach((d) =>
                        {
                            switch (d.TYPE)
                            {
                                case Constants.TYPE_PROVINCE:
                                    rStates.push(d);
                                    break;
                                case Constants.TYPE_DISTRICT:
                                    rDistricts.push(d);
                                    break;
                                case Constants.TYPE_WARD:
                                    rTehsils.push(d);
                                    break;
                            }
                        });
                    }
                    const stateDict = rStates && rStates.length ? CommonHelper.toDictionary(rStates, 'UniqueName', 'AdministrativeID') : {};
                    const districtDict = rDistricts && rDistricts.length ? CommonHelper.toDictionary(rDistricts, 'UniqueName', 'AdministrativeID') : {};
                    const tehsilDict = rTehsils && rTehsils.length ? CommonHelper.toDictionary(rTehsils, 'UniqueName', 'AdministrativeID') : {};

                    return data.map((d) =>
                    {
                        const stateId = d[stateField];
                        const districtId = d[districtField];
                        const tehsilId = d[tehsilField];

                        if (stateId && stateDict[stateId])
                        {
                            d[stateField] = stateDict[stateId];
                        }

                        if (districtId && districtDict[districtId])
                        {
                            d[districtField] = districtDict[districtId];
                        }

                        if (tehsilId && tehsilDict[tehsilId])
                        {
                            d[tehsilField] = tehsilDict[tehsilId];
                        }
                        return d;
                    });
                }
                catch (e)
                {
                    console.error(e);
                }
            }
        }
        return Promise.resolve(data);
    };

    statByField = (layerName, filter, statField) =>
    {
        return this.statByFields(layerName, [statField], filter).then((rs) => rs[statField]);
    };

    statByFieldWithDomain = (layerName, statField,filter, domain) =>
    {
        return this.statByFieldsWithDomain(layerName, [statField], filter, domain).then((rs) => rs[statField]);
    };

    statByFields = (layerName, statFields, filters) =>
    {
        const body = {
            layers: [layerName],
            start: 0,
            count: 0,
            filterQuery: filters,
            statInfo: statFields.map((field) =>
            {
                return {
                    statType: 'term',
                    statName: field.name || field,
                    statField: field.id || field,
                };
            }),
        };

        return this.http.post('/api/ffms/containers/stat', body, AuthHelper.getVDMSHeader()).then((rs) =>
        {
            const result = {};

            for (const field of statFields)
            {
                const name = field.name || field;
                result[name] = {};

                if (rs[name] && Array.isArray(rs[name].buckets) && rs[name].buckets.length)
                {
                    result[name] = CommonHelper.toDictionary(rs[name].buckets, 'val', 'count');
                }
            }

            return result;
        });
    };

    /**
     *
     * @param {string} layerName The layer of stat data (Ex: JOB)
     * @param {array} statFields Fields to stat (Ex: ['job_status_id', 'employee_type_id'])
     * @param {array} filters The filters on stat data
     * @param {object} domain
     * {field: 'employee_team_id', fromLayer: 'EMPLOYEE', from: 'employee_username', to: 'job_assignee_guid', filter: ''}
     * @returns
     */
    statByFieldsWithDomain = (layerName, statFields, filters, domain) =>
    {
        const layers = [layerName];

        const statInfo = statFields.map((field) =>
        {
            const fromLayer = domain?.layerName; // EMPLOYEE

            if (fromLayer && layers.indexOf(fromLayer) === -1)
            {
                layers.push(fromLayer);
            }

            return {
                statType: 'term',
                statName: field.name || field,
                statField: field.id || field,
                domain: domain && domain.layerName
                    ? {
                            graph: {
                                from: domain.from,
                                to: domain.to,
                                traversalFilter: domain.filter && Array.isArray(domain.filter) ? domain.filter.join(' AND ') : undefined,
                            },
                        }
                    : undefined,
            };
        });

        const body = {
            layers: layers, // ["JOB", "EMPLOYEE"]
            filterQuery: filters,
            statInfo: statInfo,
            start: 0,
            count: 0,
        };

        return this.http.post('/api/ffms/containers/stat', body, AuthHelper.getVDMSHeader()).then((rs) =>
        {
            const result = {};

            for (const field of statFields)
            {
                const name = field.name || field;
                result[name] = {};

                if (rs[name] && Array.isArray(rs[name].buckets) && rs[name].buckets.length)
                {
                    result[name] = CommonHelper.toDictionary(rs[name].buckets, 'val', 'count');
                }
            }

            return result;
        });
    };
}

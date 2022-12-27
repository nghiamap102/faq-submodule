import * as _ from 'lodash';
import { toJS } from 'mobx';
import moment from 'moment';
import { buildLookup, toExtendedJSON, getProjectEx } from './pipeLineBuilder';
import { getMongoFunc } from './constants';
import { LAYER_DATA_TYPE } from './constants';


export const buildCategoriesTree = (data, categories) =>
{
    const result = _.map(data, category =>
    {
        const newItems = _.map(category.items, item =>
        {
            const index = _.find(categories, config => item.id === config.id);
            const newItem = { ...item, checked: index ? true : false, value: { label: _.get(data, 'ValueFilter') } };
            return newItem;
        });
        return { ...category, items: newItems };
    });
    return result;
};
export const buildCalculationTree = (data, categories) =>
{
    const result = _.map(data, category =>
    {
        const newItems = _.map(category.items, item =>
        {
            const index = _.find(categories, config => item.id === config.id);
            if (!_.isEmpty(index))
            {
                const newItem = { ...item, function: index.function };
                return newItem;
            }
            else
            {
                return item;
            }
        });
        return { ...category, items: newItems };
    });
    return result;
};

export const categoriesItemCheck = (categories, item) =>
{
    if (item.checked)
    {
        categories.push(item);
    }
    else
    {
        _.remove(categories, category => category.id === item.id);
    }
    return categories;
};

export const addOrUpdateItemValue = (categories, item) =>
{
    if (!item.checked)
    {
        _.remove(categories, category => category.id === item.id);
        return categories;
    }

    let hasItem = false;
    categories = _.map(categories, category =>
    {
        if (category.id === item.id)
        {
            hasItem = true;
            return item;
        }
        else
        {
            return category;
        }
    });
    if (!hasItem)
    {
        categories.push(item);
    }
    return categories;
};

const getProject = (record, project) =>
{
    const key = _.get(record, 'ColumnName');
    const fieldName = _.get(record, 'ColumnName');
    const fieldFunction = _.get(record, 'FieldFunction');
    switch (fieldFunction)
    {
        case 'day':
            project[key] = '{"$dayOfMonth": {date: "$' + fieldName + '", timezone: "+07"}}';
            break;
        case 'month':
            project[key] = '{"$month": {date: "$' + fieldName + '", timezone: "+07"}}';
            break;
        case 'year':
            project[key] = '{"$year": {date: "$' + fieldName + '", timezone: "+07"}}';
            break;
        case 'age':
            project[key] = '{"$divide": [{"$subtract": [new Date(), "$' + fieldName + '"]}, 31556952000]}';
            break;
        case 'length':
            project[key] = '{"$strLenCP": {"$ifNull": ["$' + fieldName + '", ""]}}';
            break;
        case 'left':
            project[key] = '{"$substrCP": ["$' + fieldName + '", 0, ' + record.get('num') + ']}';
            break;
        default:
            project[`${key}${_.get(record, 'Function') !== 'GROUPBY' ? '_' + _.get(record, 'Function') : ''}`] = `'$${fieldName}'`;
            break;
    }
};
const getGroup = (record, group) =>
{
    const key = _.get(record, 'ColumnName');
    const func = _.get(record, 'Function');

    group[key] = `{${getMongoFunc(func)}: "$${key}"}`;

    if (func === 'COUNT')
    {
        group[key] = '{"$sum": 1}';
    }
};

const getGroupInCaseGroupBy = (key, group, refData) =>
{
    const ref = refData !== undefined ? `${refData}.` : '';
    if (!group['_id'])
    {
        group['_id'] = {};
    }

    group['_id'][key] = `'$${ref}${key}'`;
};
const getProjectInCaseGroupBy = (key, func, project) =>
{
    if (func === 'COUNT_DIS')
    {
        project[key] = `{'$size': '$_i.$d${key}'}`;
    }
    else
    {
        project[key] = `'$_id.${key}'`;
    }
};

const getMatch = (record) =>
{
    const stage = {};
    const op = _.get(record, 'Condition');
    const col = _.get(record, 'ColumnName');
    let value = _.get(record, 'ValueFilter');
    const dataType = _.get(record, 'DataType');
    if (dataType === 5)
    {
        value = moment.utc(value, 'DD/MM/YYYY').format();
        value = `ISODate("${value}")`;
    }
    switch (op)
    {
        case '$eq':
            stage[col] = value;
            break;
        case '$like':
            stage[col] = `{ '$regex': ' ${value} ', '$options': 'i' }`;
            break;
        case '$notlike':
            stage[col] = '{ "$not": /' + value.replace(/\//g, '\\/') + '/i }'; // /root/app -> \/root\/app
            break;
        case '$null':
            stage[col] = value == 'true' ? '{"$eq": null}' : '{"$ne": null}';
            break;
        default:
            stage[col] = {};
            stage[col][op] = value;
            break;
    }
    return stage;
};

const getLookupMatch = (record, match) =>
{
    const func = _.get(record, 'Condition');
    const col = _.get(record, 'ColumnName');
    let value = _.get(record, 'ValueFilter');
    const dataType = _.get(record, 'DataType');
    const stage = {};
    switch (dataType)
    {
        case LAYER_DATA_TYPE.TIMESTAMP:
            value = moment.utc(value, 'DD/MM/YYYY').format();
            value = `ISODate("${value}")`;
            break;
        case LAYER_DATA_TYPE.INT:
        case LAYER_DATA_TYPE.FLOAT8:
        case LAYER_DATA_TYPE.LONG_TEXT:
            value = Number(value);
            break;
    }
    
    switch (func)
    {
        case '$eq':
            stage[col] = value;
            break;
        case '$like':
            stage[col] = { '$regex': value, '$options': 'i' };
            break;
        case '$notlike':
            stage[col] = { '$not': +value.replace(/\//g, '\\/') + '/i' }; // /root/app -> \/root\/app
            break;
        case '$null':
            stage[col] = value == 'true' ? { '$eq': null } : { '$ne': null };
            break;
        default:
            stage[col] = {};
            stage[col][func] = value;
            break;
    }
    return stage;
};

export const getStages = (originalFields, filters, sorters, isTotal = false) =>
{
    const fields = _.cloneDeep(originalFields);
    const stages = [];
    const filter = [];
    const lookups = [];

    if (!_.isEmpty(filters))
    {
        _.map(filters, fil =>
        {
            // internal
            const refKey = _.get(fil, 'RefKey');
            if (_.isEmpty(refKey))
            {
                const stage = getMatch(fil);
                filter.push(stage);
            }
            else // external
            {
                fields.push(fil);
            }
        });
    }
    
    const projectAll = {};
    const group = {};
    const finalProject = {};
    const refFields = _.groupBy(fields, field => field.RefKey);
    group['_id'] = null;
    _.map(refFields, refField =>
    {
        if (_.isEmpty(refField[0].RefKey))// internal
        {
            _.map(refField, (record) =>
            {
                const key = _.get(record, 'ColumnName');
                const func = _.get(record, 'Function');

                getProject(record, projectAll);
                if (func === 'GROUPBY')
                {
                    if (!isTotal)
                    {
                        getGroupInCaseGroupBy(key, group);
                        getProjectInCaseGroupBy(key, func, finalProject);
                    }
                }
                else
                {
                    getGroup(record, group);
                    getProject(record, finalProject);
                }
            });
        }
        else // external
        {
            const projectLookup = {};
            const filterLookup = [];
            projectAll[refField[0].RefKey] = `'$${refField[0].RefKey}'`;
            const layerName = refField[0].LayerName;
            const RefKey = refField[0].RefKey;
            const fK = refField[0].FK;
            const refData = `${_.lowerCase(layerName)}_info`;
            _.map(refField, (record) =>
            {
                const value = _.get(record, 'ValueFilter');
                if (_.isEmpty(value)) // groupby - caculator
                {
                    getProjectEx(record, projectLookup);
                    const key = _.get(record, 'ColumnName');
                    const func = _.get(record, 'Function');
                    if (func === 'GROUPBY')
                    {
                        if (!isTotal)
                        {
                            if (!group['_id'])
                            {
                                group['_id'] = {};
                            }
                            group['_id'][key] = `'$${refData}.${key}'`;
                            getGroupInCaseGroupBy(key, group, refData);
                            getProjectInCaseGroupBy(key, func, finalProject);
                        }

                    }
                }
                else // match in lookup
                {
                    const match = getLookupMatch(record);
                    filterLookup.push(match);
                }

            });

            lookups.push({
                lookup: buildLookup(layerName, RefKey, fK, refData, projectLookup, filterLookup),
                unwind: refData
            });

        }
    });

    if (!_.isEmpty(filter))
    {
        stages.push(toExtendedJSON({ '$match': { $and: filter } }, '    '));
    }

    if (!_.isEmpty(projectAll))
    {
        const jsonString = toExtendedJSON({ '$project': projectAll }, '    ');
        stages.push(jsonString);
    }
    if (!_.isEmpty(lookups))
    {
        _.map(lookups, lookup =>
        {
            stages.push(JSON.stringify(lookup.lookup));
            stages.push(JSON.stringify({ $unwind: `$${lookup.unwind}` }));
        });
    }
    if (!_.isEmpty(group))
    {
        const jsonString = toExtendedJSON({ '$group': group }, '    ');
        stages.push(jsonString);
    }

    if (!isTotal)
    {
        if (!_.isEmpty(finalProject))
        {
            const jsonString = toExtendedJSON({ '$project': finalProject }, '    ');
            stages.push(jsonString);
        }
        if (!_.isEmpty(sorters))
        {
            const sort = {};
            _.forEach(sorters, item =>
            {
                sort[item.id] = item.direction === 'asc' ? 1 : -1;
            });
            const jsonString = toExtendedJSON({ '$sort': sort }, '    ');
            stages.push(jsonString);
        }
    }

    return stages;
};

export const camelCaseObjectDeep = value =>
{
    if (Array.isArray(value))
    {
        return value.map(camelCaseObjectDeep);
    }

    if (value && typeof value === 'object' && value.constructor === Object)
    {
        const obj = {};
        const keys = Object.keys(value);
        const len = keys.length;

        for (let i = 0; i < len; i += 1)
        {
            obj[_.camelCase(keys[i])] = camelCaseObjectDeep(value[keys[i]]);
        }

        return obj;
    }

    return value;
};

export const convertArrayToObject = (data)=>
{
    const objectData = {};
    _.forEach(data.items, item =>
    {
        if (item.dataType == LAYER_DATA_TYPE.LIST)
        {
            objectData[`${item.propertyId}`] = {
                options: item.data,
                schema: 'select',
            };
            objectData[`${item.propertyId}_id`] = {
                options: item.data,
                schema: 'select',
            };
        }
        else
        {
            objectData[item.propertyId] = {
                config: item.config,
                format: item.format
            };
        }
    });
    return objectData;
};
export const getDataTypeFormat = (column, dataListType) =>
{
    const type = dataListType[column.ColumnName];
    const data = {
        schema: type?.schema,
        options: type?.options,
        format: type?.format,
        displayName: type?.displayName
    };

    if (column?.Function !== 'GROUPBY')
    {
        column.DataType = (column?.Function === 'COUNT' || column.ColumnName === 'index') ? LAYER_DATA_TYPE.INT : LAYER_DATA_TYPE.FLOAT8;
    }
    else if (type?.options && column?.Function === 'GROUPBY')
    {
        return data;
    }

    switch (column.DataType)
    {
        case LAYER_DATA_TYPE.BOOLEAN:
            _.set(data , 'schema','boolean');
            break;
        case LAYER_DATA_TYPE.INT:
            _.set(data , 'schema','numeric');
            break;
        case LAYER_DATA_TYPE.FLOAT8:
            _.set(data , 'schema','numeric');
            _.set(data , 'format','#,##');
            break;
        case LAYER_DATA_TYPE.TEXT:
            break;
        case LAYER_DATA_TYPE.TIMESTAMP:
            _.set(data , 'schema','date');
            break;
        case LAYER_DATA_TYPE.LONG_TEXT:
            break;
        case LAYER_DATA_TYPE.UUID:
            break;
        case LAYER_DATA_TYPE.WORDS:
            break;
        case LAYER_DATA_TYPE.LIST:
            break;
        default:
            break;
    }
    return data;
};


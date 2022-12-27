import * as _ from 'lodash';
import { DATA_TYPE, LAYER_DATA_TYPE, MongoOperator } from './constants';
import moment from 'moment';

const getType = (type) =>
{
    switch (type)
    {
        case LAYER_DATA_TYPE.TEXT:
        case LAYER_DATA_TYPE.LONG_TEXT:
        case LAYER_DATA_TYPE.WORDS:
            return DATA_TYPE.STRING;
        case LAYER_DATA_TYPE.LIST:
            return DATA_TYPE.LIST;
        case LAYER_DATA_TYPE.BOOLEAN:
            return DATA_TYPE.BOOLEAN;
        case LAYER_DATA_TYPE.TIMESTAMP:
            return DATA_TYPE.TIMESTAMP;
        case LAYER_DATA_TYPE.INT:
        case LAYER_DATA_TYPE.FLOAT8:
            return DATA_TYPE.NUMBER;
        default:
            return DATA_TYPE.STRING;
    }
};
const convertToAdvanceSelectOption = (arr) =>
{
    if (_.isEmpty(arr))
    {
        return;
    }
    return _.map(arr, item =>
    {
        return {
            id: item.id ?? item,
            label: item.value ?? item
        };
    });
};
const convertToAggregationItem = (object, key, refKey, foreignKey, parentLayer) =>
{
    return _.pickBy({
        id: `${key}_${_.get(object,'key')}`,
        key: _.get(object,'key'),
        layer: key,
        propertyId: _.get(object,'key'),
        dataType: object.type,
        name: _.get(object,'title'),
        type: getType(object.type),
        refKey,
        foreignKey,
        parentLayer,
        data: convertToAdvanceSelectOption(_.get(object, 'data')),
        operator: convertToAdvanceSelectOption(_.get(object, 'operator')),
        format: _.get(object,'format')
    },_.identity);
};

const createLayer = (data, title, key, refKey, foreignKey, parentLayer) =>
{
    const items = _.map(data, item =>
    {
        return convertToAggregationItem(item, key, refKey, foreignKey, parentLayer);
    });

    return {
        title: title,
        key: key,
        items
    };
};

export const convertToAggregation = (origin, layerName, title) =>
{
    const aggregations = [];
    var internal = _.get(origin, 'internal');
    aggregations.push(createLayer(internal, title || layerName, layerName));

    var externals = _.get(origin, 'external');
    _.map(externals, external =>
    {
        var fields = _.get(external, 'field');
        const exLayerName = _.get(external, 'layer');
        const refKey = _.get(external, 'FK');
        const foreignKey = _.get(external, 'REF');
        aggregations.push(createLayer(fields, _.get(external, 'title') || exLayerName, exLayerName, refKey, foreignKey, layerName));
    });
    return aggregations;
};

export const convertFieldToConfig = (object) =>
{

    let value = object.ValueFilter;
    if (object.DataType === LAYER_DATA_TYPE.INT ||
        object.DataType === LAYER_DATA_TYPE.FLOAT8 ||
        object.DataType === LAYER_DATA_TYPE.LONG_TEXT)
    {
        value = Number(value);
    }
    return {
        id: `${object.LayerName}_${object.ColumnName}`,
        text: object.DisplayName,
        layer: object.LayerName,
        key: object.ColumnName,
        propertyId: object.ColumnName,
        name: object.DisplayName,
        type: getType(object.DataType),
        refKey: object.RefKey,
        foreignKey: object.FK,
        dataType: object.DataType,
        combine: object.Combine,
        function: object.Function,
        condition: object.Condition,
        value: {
            label: value
        }
    };
};

export const convertFilterToConfig = (object) =>
{
    const firstObj = object[0];
    const filter = convertFieldToConfig(firstObj);

    if (firstObj.DataType === LAYER_DATA_TYPE.TIMESTAMP)
    {
        const value = {};
        if (object.length > 1)
        {
            if (object[0].Condition === MongoOperator.gt || object[0].Condition === MongoOperator.gte)
            {
                value.from = object[0].ValueFilter.replace('|', '');
                value.to = object[1].ValueFilter.replace('|', '');
            }
            else
            {
                value.from = object[1].ValueFilter.replace('|', '');
                value.to = object[0].ValueFilter.replace('|', '');
            }
        }
        else
        {
            value.from = object[0].ValueFilter.replace('|', '');
            value.to = moment.utc().format('DD/MM/YYYY');
        }

        filter.value.label = value;
    }
    return filter;

};
export const convertFilterToParameter = (object) =>
{
    return {
        ColumnName: object.propertyId,
        Combine: '$and',
        Condition: object.condition,
        DataType: object.dataType,
        DisplayName: object.text,
        ValueFilter: object.value.label,
        LayerName: object.layer,
        RefKey: object.refKey,
        FK: object.foreignKey,
        ParentLayer: object.parentLayer,
    };
};

export const convertGroupByToFields = (object) =>
{
    const displayName = `${object.name}`;
    return {
        PropertyId: object.propertyId,
        DataType: object.dataType,
        DisplayName: displayName ,
        ColumnName: object.propertyId,
        LayerCaption: object.layer,
        LayerName: object.layer,
        RefKey: object.refKey,
        FK: object.foreignKey,
        ParentLayer: object.parentLayer,
        Function: !_.isEmpty(object.function) ? object.function : 'GROUPBY'
    };
};


export const convertDateUtc = (dateTime) =>
{
    const date = moment.utc(dateTime, 'DD/MM/YYYY');
    return date;
};

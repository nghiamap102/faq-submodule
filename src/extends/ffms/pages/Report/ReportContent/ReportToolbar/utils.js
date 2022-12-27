import * as _ from 'lodash';
import moment from 'moment';

export const formatExcelCols = (json) =>
{
    if (_.size(json) == 0)
    {
        return {};
    }
    const widthArr = Object.keys(json[0]).map(key =>
    {
        return { width: key.length + 2 };
    });
    for (let i = 0; i < json.length; i++)
    {
        const value = Object.values(json[i]);
        for (let j = 0; j < value.length; j++)
        {
            if (value[j] !== null && widthArr[j] && value[j].length > widthArr[j].width)
            {
                widthArr[j].width = value[j].length;
            }
        }
    }
    return widthArr;
};

export const parseExcelData = (data, fields, dataTypes) =>
{
    for (let i = 0; i < data.length; i++)
    {
        const keyDatas = Object.keys(data[i]);
        const dataTypeKey = Object.keys(dataTypes);
        for (let j = 0; j < dataTypeKey.length; j++)
        {
            if (keyDatas.indexOf(dataTypeKey[j]) != -1)
            {
                const key = dataTypeKey[j];
                if (dataTypes[key].format != undefined)
                {
                    data[i] = _.extend(data[i], { [key]: data[i][key] != null ? moment(data[i][key]).format(dataTypes[key].format) : null });
                }
                if (dataTypes[key].options != undefined)
                {
                    const value = _.filter(dataTypes[key].options, item =>
                    {
                        return item.id == data[i][key];
                    });
                    data[i] = _.extend(data[i], { [key]: value.length > 0 ? value[0]['label'] : null });
                }
            }
        }
    }

    let result = null;
    if (data.length)
    {
        const fieldKeys = fields.map(f =>
        {
            return `${f.ColumnName}${f.Function != 'GROUPBY' ? '_' + f.Function : '' }`;
        });

        data = JSON.parse(JSON.stringify(data, fieldKeys));
        
        const replaces = fields.map(item =>
        {
            if (['SUM', 'COUNT', 'AVERAGE', 'MIN', 'MAX'].indexOf(item.Function) != -1)
            {
                return `${item.DisplayName} - ${item.Function}`;
            }
            else
            {
                return item.DisplayName;
            }
        });

        const keys = Object.keys(data[0]);

        const keysMap = {};
        for (let i = 0; i < keys.length; i++)
        {
            keysMap[keys[i]] = replaces[i];
        }

        result = renameKeysDeep(data, keysMap);
    }
    else
    {
        const tmp = fields.map(item => item.DisplayName);
        result = [arrayToObjectKey(tmp)];
    }

    return result;
};

export const renameKey = (obj, key, newKey) =>
{
    if (_.includes(_.keys(obj), key))
    {
        obj[newKey] = _.clone(obj[key], true);

        delete obj[key];
    }

    return obj;
};

export const renameKeysDeep = (obj, keysMap) =>
{
    return _.transform(obj, function (result, value, key)
    {
        const currentKey = keysMap[key] || key;
        result[currentKey] = _.isObject(value) ? renameKeysDeep(value, keysMap) : value;
    });
};

export const arrayToObjectKey = (arr) =>
{
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
    {
        rv[arr[i]] = '';
    }
    return rv;
}
    ;

import * as _ from 'lodash';

export const parseDashboardData2Excel = (data, title) =>
{
    const result = [];
    if (!data)
    {
        return;
    }

    const arrKey = _.map(data.types, type => type.typeName);
    for (let i = 0; i < data.labels.length; i++)
    {
        const newItem = {};
        _.set(newItem, `${title}`, data.labels[i]);
        for (let j = 0; j < arrKey.length; j++)
        {
            _.set(newItem, `${arrKey[j]}`, data.values[i][j] ?? 0);
        }
        result.push(newItem);
    }

    return result;
};


import * as _ from 'lodash';
export const getProjectEx = (record, project) =>
{
    const key = _.get(record, 'ColumnName');
    const fieldName = _.get(record, 'ColumnName');
    project[key] = `$${fieldName}`;

};

export const buildLookup = (layerName, refKey, foreignKey, refData, projectLookup, filterLookup) =>
{
    const dataName = `go_${_.lowerCase(layerName)}_data`;
    const project = {};
    project[`${refKey}`] = `$${refKey}`;

    const pipeline = [
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: [`$${foreignKey}`, `$$${refKey}`] }
                    ]
                }
            }
        },
    ];

    if (!_.isEmpty(filterLookup))
    {
        pipeline.push({ $match: { $and: filterLookup } });
    }
    pipeline.push({ $project: projectLookup });
    const lookup = {
        $lookup: {
            from: dataName,
            let: project,
            pipeline,
            as: refData
        }
    };
    return lookup;
};

export const toExtendedJSON = function (object, space) // chỉ là mô phỏng, k dùng cho mục đích khác
{
    var tab = '    ';
    space = space || '';
    var builder = [];

    if (object instanceof Array)
    {

        for (var i = 0; i < object.length; i++)
        {
            builder.push(toExtendedJSON(object[i], space + tab));
        }

        return '[' + builder.join(',') + ('' + space + ']');
    }

    if (object instanceof Object)
    {
        for (var key in object)
        {
            if (object.hasOwnProperty(key))
            {
                var value = object[key];
                if (value instanceof Object)
                {
                    value = toExtendedJSON(value, space + tab);
                }
                builder.push(space + tab + '"' + key + '": ' + value);
            }
        }

        return '{' + builder.join(',') + ('' + space + '}');
    }

    return space + object;
};

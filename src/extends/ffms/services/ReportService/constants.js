// Use Filter
export const PERIOD_DEFAULT = 'Last30d';

export const TAB = {
    SYSTEM: 1,
    CUSTOMIZE: 2
};

export const DATA_TYPE = {
    BOOLEAN: 1,
    NUMBER: 2,
    STRING: 3,
    DATE_TIME: 4,
    LIST: 5,
    TIMESTAMP: 6
};
export const OperatorMapping = {
    searchKey: 'like',
    like: 'like',
    inq: '=',
    // nin: '=',
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    and: 'AND',
    or: 'OR'
};

export const MongoOperator = {
    like: '$like',
    inq: '$inq',
    eq: '$eq',
    // nin: '=',
    gt: '$gt',
    gte: '$gte',
    lt: '$lt',
    lte: '$lte',
    and: '$and',
    or: '$or',
    in: '$in',
};

export const LAYER_DATA_TYPE = {
    BOOLEAN: 1,// INT2
    INT: 2,
    TEXT: 3,
    FLOAT8: 4,
    TIMESTAMP: 5,
    LONG_TEXT: 6,// CHUỖI LỚN
    UUID: 7,// BẢN ĐỒ
    WORDS: 8, // VĂN BẢN
    BYTEA: 9,// TẬP TIN
    LIST: 10,
    GeoJSON: 11 // BẢN ĐỒ VN 2000
};

export const getMongoFunc = (func) =>
{
    switch (func)
    {
        case 'AVG':
            return '$avg';
        case 'COUNT':
            return '$sum';

        case 'COUNT_DIS':
            return '$addToSet';

        case 'MIN':
            return '$min';

        case 'MAX':
            return '$max';

        case 'SUM':
            return '$sum';

        case 'FIRST':
            return '$first';

        case 'LAST':
            return '$last';

        // case 'GROUPBY':
        //     if (!group['_id'])
        //     {
        //         group['_id'] = {};
        //     }

        //     group['_id'][key] = '"$' + key + '"';

    }
};

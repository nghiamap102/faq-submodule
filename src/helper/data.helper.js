// Used in DataToolbar
export const DATA_TYPE = {
    boolean: 1,
    integer: 2,
    string: 3,
    float: 4,
    datetime: 5,
    text: 6,
    location: 7,
    document: 8,
    array: 10,
};

// Used in DataGrid
export const SCHEMAS = [
    'boolean',
    'currency',
    'datetime',
    'date',
    'numeric',
    'select',
    'multi-select',
    'image',
    'link',
    'json',
    'react-node',
    'chart',
    'text',
];

/**
 * Functions
 */

export const getOperators = (dataTypeId) =>
{
    let operators = [];
    switch (dataTypeId)
    {
        case DATA_TYPE.integer:
        case DATA_TYPE.float:
        case DATA_TYPE.datetime:
            operators = [
                { id: '=', label: '=' },
                { id: '>', label: '>' },
                { id: '<', label: '<' },
                { id: '>=', label: '>=' },
                { id: '<=', label: '<=' },
                { id: 'between', label: 'Giữa' },
            ];
            break;
        case DATA_TYPE.string:
        case DATA_TYPE.text:
        case DATA_TYPE.document:
            operators = [
                { id: '=', label: 'Bằng' },
                { id: 'like', label: 'Giống' },
                { id: 'is null', label: 'Rỗng' },
                { id: 'is not null', label: 'Không rỗng' },
            ];
            break;
        case DATA_TYPE.boolean:
        case DATA_TYPE.array:
            operators = [
                { id: '=', label: 'Bằng' },
                { id: 'like', label: 'Giống' },
            ];
            break;
    }
    return operators;
};

export const getDataType = (schema) =>
{
    switch (schema)
    {
        case 'currency':
        case 'numeric':
            return DATA_TYPE.integer;

        case 'datetime':
        case 'date':
            return DATA_TYPE.datetime;

        case 'boolean':
            return DATA_TYPE.boolean;

        case 'select':
        case 'multi-select':
            return DATA_TYPE.array;

        case 'react-node':
        case 'chart':
            return '';

        case 'image':
        case 'link':
        case 'json':
        default:
            return DATA_TYPE.string;
    }
};

export const isFilterActive = (filter) =>
{
    if (!filter)
    {
        return false;
    }

    const keys = Object.keys(filter);
    if (
        !keys.includes('columnName') ||
        !keys.includes('dataType') ||
        !keys.includes('operator') ||
        !keys.includes('value')
    )
    {
        return false;
    }

    switch (filter.dataType)
    {
        case DATA_TYPE.integer:
        case DATA_TYPE.float:
        case DATA_TYPE.datetime:
            if (filter.operator === 'between')
            {
                if (isEmpty(filter.value))
                {
                    return false;
                }

                const valueArr = filter.value.split('AND', 2);
                if (valueArr.length < 2)
                {
                    return false;
                }

                return !isEmpty(valueArr[0]) && !isEmpty(valueArr[1]);
            }
            return !isEmpty(filter.operator) && !isEmpty(filter.value);
        case DATA_TYPE.string:
        case DATA_TYPE.text:
        case DATA_TYPE.document:
        case DATA_TYPE.boolean:
        case DATA_TYPE.array:
            if (filter.operator === 'is null' || filter.operator === 'is not null')
            {
                return true;
            }

            return !isEmpty(filter.value);
        default:
            return false;
    }
};

export const isEmpty = (value) =>
{
    if (value === undefined || value === null || value === '')
    {
        return true;
    }
    if (typeof value === 'boolean')
    {
        return false;
    }

    if (typeof value === 'object')
    {
        return Object.keys(value).length === 0;
    }
};

export const DataTypes = {
    Boolean: 1,
    Number: 2,
    String: 3,
    Real: 4,
    DateTime: 5,
    BigString: 6,
    Map: 7,
    Text: 8,
    File: 9,
    List: 10,
    MapVN2000: 11,
};

export const DisplaySchema = {
    Boolean: 'boolean',
    Currency: 'currency',
    DateTime: 'datetime',
    Date: 'date',
    Numeric: 'numeric',
    Select: 'select',
    MultiSelect: 'multi-select',
    Image: 'image',
    Link: 'link',
    JSON: 'json',
    ReactNode: 'react-node',
};

export function toDisplaySchemaProps(dataType)
{
    if (!dataType)
    {
        return {};
    }
    switch (dataType)
    {
        case DataTypes.Boolean:
            return {
                schema: DisplaySchema.Boolean,
            };
        case DataTypes.Number:
        case DataTypes.Real:
            return {
                schema: DisplaySchema.Numeric,
            };
        case DataTypes.DateTime:
            return {
                schema: DisplaySchema.DateTime,
            };
        case DataTypes.List:
            return {
                schema: DisplaySchema.Select,
            };
        default:
            return {};
    }
}



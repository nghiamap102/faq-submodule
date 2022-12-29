import { getOperators } from 'components/bases/DataToolBar/helpers';

export const mapColumnSchemaToDataType = (schema) =>
{
    switch (schema)
    {
        case 'image':
        case 'link':
        case 'json':
            return 'string';

        case 'currency':
        case 'numeric':
            return 'integer';

        case 'datetime':
        case 'date':
            return 'datetime';

        case 'boolean':
            return 'boolean';

        case 'select':
        case 'multi-select':
            return 'array';

        default:
            return;
    }
};

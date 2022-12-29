export namespace DATA_TYPE {
    const boolean: number;
    const integer: number;
    const string: number;
    const float: number;
    const datetime: number;
    const text: number;
    const location: number;
    const document: number;
    const array: number;
}
export const SCHEMAS: string[];
export function getOperators(dataTypeId: any): any[];
export function getDataType(schema: any): number | "";
export function isFilterActive(filter: any): boolean;
//# sourceMappingURL=data.helper.d.ts.map
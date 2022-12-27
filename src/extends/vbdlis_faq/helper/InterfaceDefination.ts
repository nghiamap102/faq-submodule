export interface SortOption {
    sortInfo: SortInfo[]
}

export interface SortInfo {
    Field: string,
    Direction: number
}

export interface VDMSQuery {
    path?: string,
    layers?: string[],
    searchKey?: string,
    start?: number,
    count?: number,
    filterQuery?: string[],
    returnFields?: string[],
    sortOption?: SortOption
}
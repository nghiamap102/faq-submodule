export declare enum DataTypes {
    Boolean = 1,
    Currency = 2,
    Datetime = 3,
    Numeric = 4,
    Real = 5,
    Date = 6,
    Select = 7,
    MultiSelect = 8,
    Image = 9,
    Link = 10,
    JSON = 11,
    Chart = 12,
    Text = 13,
    Map = 14,
    File = 15,
    List = 16,
    MapVN2000 = 17,
    ReactNode = 18,
    MultiLine = 19,
    RichText = 20
}
export declare enum VDMSDataTypes {
    Boolean = 1,
    Number = 2,
    String = 3,
    Real = 4,
    Datetime = 5,
    BigString = 6,
    Map = 7,
    Text = 8,
    File = 9,
    List = 10,
    MapVN2000 = 11
}
export declare const MapVDMSDataTypesToDataTypes: {
    1: DataTypes;
    2: DataTypes;
    3: DataTypes;
    4: DataTypes;
    5: DataTypes;
    6: DataTypes;
    7: DataTypes;
    8: DataTypes;
    9: DataTypes;
    10: DataTypes;
    11: DataTypes;
};
export declare enum DisplaySchema {
    Boolean = "boolean",
    Currency = "currency",
    Datetime = "datetime",
    Date = "date",
    Numeric = "numeric",
    Select = "select",
    MultiSelect = "multi-select",
    Image = "image",
    Link = "link",
    JSON = "json",
    ReactNode = "react-node",
    RenderNode = "render-node"
}
export declare const MapDisplaySchemaToDisplayTypes: {
    boolean: DataTypes;
    currency: DataTypes;
    date: DataTypes;
    datetime: DataTypes;
    numeric: DataTypes;
    select: DataTypes;
    "multi-select": DataTypes;
    image: DataTypes;
    link: DataTypes;
    json: DataTypes;
    "react-node": DataTypes;
};
//# sourceMappingURL=DataTypes.d.ts.map
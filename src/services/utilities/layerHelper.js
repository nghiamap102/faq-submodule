import { CommonHelper } from '../../helper/common.helper';
import LayerService from '../layer.service';
import { AppConstant } from '../../constant/app-constant';

export class LayerHelper
{
    static dataRefs = {};
    static layerProps = {};
    static layerService = new LayerService(AppConstant.c4i2.url);
    static propsToOption = async (props, field, config, displayFieldAsIdField) =>
    {
        if (!config)
        {
            const dictProps = CommonHelper.toDictionary(props, 'ColumnName', 'Config');
            config = dictProps[field] || {};
        }

        if (typeof (config) === 'string')
        {
            config = JSON.parse(config);
        }

        if (config.content)
        {
            const { mode, source, valueField, displayField, defaultField } = config.content;
            switch (mode)
            {
                case 'predefine': {
                    return source?.map((d) =>
                    {
                        return {
                            id: d[displayFieldAsIdField ? displayField : valueField],
                            indexed: d[valueField],
                            label: d[displayField],
                            color: 'var(--primary)',
                            ...d,
                        };
                    }) || [];
                }
                case 'layer': {
                    const dataRefs = await LayerHelper.getDataReferences([source]);
                    return dataRefs[source].data.map((d) =>
                    {
                        return {
                            id: d[displayFieldAsIdField ? displayField : valueField],
                            indexed: d[valueField],
                            label: d[displayField],
                            color: 'var(--primary)',
                            ...d,
                        };
                    });

                }
            }

            return [];
        }
    };

    static getDataReferences = async (names = []) =>
    {
        if (names && names.length > 0)
        {
            if (!Array.isArray(names) && typeof (names) === 'string')
            {
                names = [names];
            }
            const filtered = names.filter((x) => Object.keys(LayerHelper.dataRefs).indexOf(x) === -1);
            if (filtered.length > 0)
            {
                for (let i = 0; i < filtered.length; i++)
                {
                    LayerHelper.dataRefs[filtered[i]] = await LayerHelper.layerService.getNodesLayer(filtered[i]) || [];
                }
            }
        }
        return LayerHelper.dataRefs;
    };

    static getLayerProps = async (layerName) =>
    {
        if (LayerHelper.layerProps[layerName])
        {
            return LayerHelper.layerProps[layerName];
        }
        const layerPropsRs = await LayerHelper.layerService.getLayerProps(layerName);
        if (layerPropsRs?.status?.success && layerPropsRs?.data?.Properties.length)
        {
            const layerProps = {};
            layerPropsRs.data.Properties.forEach(prop =>
            {
                layerProps[prop.ColumnName] = prop;
            });
            LayerHelper.layerProps[layerName] = layerProps;
            return layerProps;
        }
        return null;
    };

    static getOptions = async (layerName) =>
    {
        const layerProps = await LayerHelper.getLayerProps(layerName);
        if (layerProps)
        {
            const options = {};
            const keys = Object.keys(layerProps);
            for (let i = 0; i < keys.length; i++)
            {
                if (layerProps[keys[i]].DataType === 10)
                {
                    options[keys[i]] = await LayerHelper.propsToOption(layerProps, '', layerProps[keys[i]].Config, false);
                }
            }
            return options;
        }
        return null;
    };
    static removeStringArr = (data) =>
    {
        if (data)
        {
            Object.keys(data).forEach(key=>
            {
                if (typeof data[key] === 'string' && data[key].startsWith('[') && data[key].endsWith(']'))
                {
                    const val = JSON.parse(data[key]);
                    data[key] = val.length === 1 ? val[0] : val.join(', ');
                }
            });
        }
        return data;
    };
    static formatNodeData = async (layerName, data) =>
    {
        const layerProps = await LayerHelper.getLayerProps(layerName);
        for (let i = 0; i < Object.keys(data).length; i++)
        {
            const key = Object.keys(data)[i];
            if (data[key] === '0001-01-01T00:00:00')
            {
                data[key] = null;
            }
            else if (typeof data[key] === 'string' && data[key].startsWith('[') && data[key].endsWith(']'))
            {
                const val = JSON.parse(data[key]);
                data[key] = val.length === 1 ? val[0] : val.join(', ');
            }
            if (layerProps)
            {
                const exist = layerProps[key];
                if (exist)
                {
                    let value = data[key];
                    // if (exist.DataType === 5 && value) {
                    //     value = new Date(value).toLocaleDateString();
                    // }
                    // d[key] = value;

                    if (exist.DataType === 10)
                    {
                        try
                        {
                            let config = exist.Config;
                            if (config)
                            {
                                if (typeof config === 'string')
                                {
                                    config = JSON.parse(config);
                                    const { mode, source, valueField, displayField, defaultField } = config.content;
                                    switch (mode)
                                    {
                                        case 'predefine': {
                                            const match = source.find(s => s[valueField] === value);
                                            if (match)
                                            {
                                                value = match[displayField];
                                            }
                                        }
                                        // case 'layer': {
                                        //     const dataRefs = await this.getDataReferences([source]);
                                        //     return dataRefs[source].data.map((d) =>
                                        //     {
                                        //         // return {
                                        //         //     id: d[displayFieldAsIdField ? displayField : valueField],
                                        //         //     indexed: d[displayField],
                                        //         //     label: d[displayField],
                                        //         //     color: 'var(--primary)',
                                        //         //     ...d,
                                        //         // };
                                        //     });
                                        //
                                        // }
                                    }
                                }
                            }
                        }
                        catch (e)
                        {
                            console.error(e.message);
                        }
                    }

                    data[key] = {
                        DisplayName: exist.DisplayName,
                        ColumnName: exist.ColumnName,
                        DataType: exist.DataType,
                        Order: exist.Order,
                        Value: value,
                    };
                }
            }
        }
        return data;
        // let geoData;
        // try
        // {
        //     geoData = JSON.parse(d.Location);
        // }
        // catch (e)
        // {
        //     console.error(e.message);
        // }
        //
        // return {
        //     ...d,
        //     id: d.Id,
        //     title: d.Title,
        //     x: geoData?.coordinates[1],
        //     y: geoData?.coordinates[0],
        // };
    }
}

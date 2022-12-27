import moment from 'moment';

import { CommonHelper } from 'helper/common.helper';
import { DataTypes, isEmpty } from 'helper/data.helper';

export class RouterParamsHelper
{
    /**
     *
     * @param {*} search
     * @param {*} filterType {intFilters, dateFilters, arrayFilters, stringFilters}
     * @returns
     */
    static getParams(search, filterType = {})
    {
        const filterState = {};
        
        if (search && filterType && !isEmpty(filterType))
        {
            const { intFilters = [], dateFilters = [], arrayFilters = [], stringFilters = [] } = filterType;
            const searchParams = new URLSearchParams(search);

            for (const type in filterType)
            {
                if (filterType.hasOwnProperty(type))
                {
                    if (Array.isArray(filterType[type]))
                    {
                        filterType[type].forEach(async (key) =>
                        {
                            const searchValue = searchParams.get(key);
                            if (searchValue)
                            {
                                if (dateFilters.indexOf(key) > -1)
                                {
                                    // date filter
                                    try
                                    {
                                        filterState[key] = moment(new Date(parseInt(searchValue)));
                                    }
                                    catch (e)
                                    {
                                        filterState[key] = searchValue;
                                    }
                                }
                                else if (intFilters.indexOf(key) > -1)
                                {
                                    // number filters
                                    // ?key=1,2 => [1,2]
                                    filterState[key] = JSON.parse(`[${searchValue}]`);
                                }
                                else
                                {
                                    const parts = searchValue.split(',');
                                    if (arrayFilters.indexOf(key) > -1)
                                    {
                                        filterState[key] = parts;
                                    }
                                    else
                                    {
                                        filterState[key] = Array.isArray(parts) && parts.length > 1 ? parts : searchValue;
                                    }
                                }
                            }
                            else
                            {
                                filterState[key] = '';
                            }
                        });
                    }
                    else
                    {
                        const searchValue = searchParams.get(type);
                        if (isEmpty(searchValue))
                        {
                            filterState[type] = undefined;
                        }
                        else
                        {
                            switch (filterType[type])
                            {
                                case DataTypes.Number:
                                    filterState[type] = parseInt(searchValue);
                                    break;
                                case DataTypes.Boolean:
                                    filterState[type] = searchValue === 'false' || searchValue === '0' ? false : !!searchValue;
                                    break;
                                case DataTypes.DateTime:
                                    filterState[type] = moment(new Date(searchValue));
                                    break;
                                case DataTypes.Real:
                                    filterState[type] = parseFloat(searchValue);
                                    break;
                                case DataTypes.List:
                                case DataTypes.String:
                                case DataTypes.BigString:
                                case DataTypes.Text:
                                default:
                                {
                                    filterState[type] = searchValue;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        return filterState;
    }

    static setParam(urlParams, searchParams, key, value)
    {
        let action = 'set';
        if (value === '' || CommonHelper.isFalsyValue(value))
        {
            action = 'del';
            value = null;
        }

        if (key === 'sort')
        {
            this.setParam(urlParams, searchParams, 'orderBy', Array.isArray(value) && value.length === 1 ? value[0].id : value);
            this.setParam(urlParams, searchParams, 'order', Array.isArray(value) && value.length === 1 ? (value[0].direction || '') : value, action);
        }
        else
        {
            if (action === 'set')
            {
                let paramValue = `${isEmpty(value) ? '' : value}`;
                if (moment.isMoment(value))
                {
                    paramValue = `${value.format('x') || ''}`;
                }
                searchParams.set(key, paramValue);
            }
            if (action === 'del')
            {
                searchParams.delete(key);
            }
            if (urlParams)
            {
                urlParams[key] = value;
            }
        }
    }

    static setParams(urlParams, props, object = {})
    {
        RouterParamsHelper.setParamsWithPathName(null, urlParams, props, object);
    }

    static setParamsWithPathName(pathName, urlParams, props, object = {})
    {
        const { location, history } = props;
        const searchParams = new URLSearchParams(location.search);
        for (const key in object)
        {
            if (object.hasOwnProperty(key))
            {
                this.setParam(urlParams, searchParams, key, object[key]);
            }
        }
        if (pathName)
        {
            history.push({ pathname: pathName, search: searchParams.toString() });
        }
        else
        {
            history.push({ search: searchParams.toString() });
        }
        return searchParams;
    }

    static groupParamsByKey = (params) => [...params.entries()].reduce((acc, tuple) =>
    {
        // getting the key and value from each tuple
        const [key, val] = tuple;
        if (acc.hasOwnProperty(key))
        {
            // if the current key is already an array, we'll add the value to it
            if (Array.isArray(acc[key]))
            {
                acc[key] = [...acc[key], val];
            }
            else
            {
                // if it's not an array, but contains a value, we'll convert it into an array
                // and add the current value to it
                acc[key] = [acc[key], val];
            }
        }
        else
        {
            // plain assignment if no special case is present
            acc[key] = val;
        }

        return acc;
    }, {});

    static getChangedRoute = (search, prevSearch) =>
    {

        const params = new URLSearchParams(search);
        const prevParams = new URLSearchParams(prevSearch);

        const o1 = RouterParamsHelper.groupParamsByKey(prevParams);
        const o2 = RouterParamsHelper.groupParamsByKey(params);

        const diff = Object.keys(o2).reduce((diff, key) =>
        {
            if (o1[key] === o2[key])
            {
                return diff;
            }
            return {
                ...diff,
                [key]: o2[key],
            };
        }, {});

        return diff && !isEmpty(diff) ? diff : null;
    };

    static shouldLocationChanged = (currLocation, prevLocation) =>
    {
        const locationChanged = currLocation?.search !== prevLocation?.search;
        if (locationChanged)
        {
            const diff = RouterParamsHelper.getChangedRoute(currLocation?.search?.substring(1), prevLocation?.search?.substring(1));
            if (diff)
            {
                return `?${new URLSearchParams(diff).toString()}`;
            }
            else
            {
                const removed = RouterParamsHelper.getChangedRoute(prevLocation?.search?.substring(1), currLocation?.search?.substring(1));
                if (removed)
                {
                    Object.keys(removed).forEach((k) =>
                    {
                        removed[k] = '';
                    });
                    return `?${new URLSearchParams(removed).toString()}`;
                }
            }
        }
        return '';
    };

    static getModeAction = (location) =>
    {
        let mode = '';
        const searchParam = new URLSearchParams(location?.search || {});

        if (location?.hash)
        {
            mode = location.hash.substring(1);
        }
        else
        {
            mode = searchParam.get('mode');
        }
        return mode;
    };

    static getPreviousPath = (path) =>
    {
        const arrPath = path.split('/');
        const nodePath = arrPath.slice(0, arrPath.length - 1).join('/');
        return nodePath;
    };

    static getRouteFeature = (path, baseUrl) =>
    {
        if (!path || !baseUrl)
        {
            return null;
        }
        const feature = path.replace(baseUrl, '');
        return feature;
    };
}

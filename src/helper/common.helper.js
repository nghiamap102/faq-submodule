import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isEmpty } from './data.helper';
import CountryCode from 'data/country-code';

export class CommonHelper
{
    static isFalsyValue(value)
    {
        if (!Array.isArray(value) && typeof value === 'number')
        {
            return isNaN(value);
        }
        return value === null || value === undefined || typeof value === 'undefined';
    }

    static clone(item)
    {
        if (!item)
        {
            return item;
        } // null, undefined values check

        // tslint:disable-next-line: prefer-const
        const types = [Number, String, Boolean];
        let result;

        // normalizing primitives if someone did new String('aaa'), or new Number('444');
        types.forEach(function (type)
        {
            if (item instanceof type)
            {
                result = type(item);
            }
        });

        // tslint:disable-next-line: triple-equals
        if (typeof result == 'undefined')
        {
            if (Object.prototype.toString.call(item) === '[object Array]')
            {
                result = [];
                item.forEach((child, index) =>
                {
                    result[index] = CommonHelper.clone(child);
                });
            }
            else if (typeof item === 'object')
            {
                // testing that this is DOM
                if (item.nodeType && typeof item.cloneNode === 'function')
                {
                    result = item.cloneNode(true);
                }
                else if (!item.prototype)
                {
                    // check that this is a literal
                    if (item instanceof Date)
                    {
                        result = new Date(item);
                    }
                    else
                    {
                        // it is an object literal
                        result = {};

                        for (const i in item)
                        {
                            result[i] = CommonHelper.clone(item[i]);
                        }
                    }
                }
                else
                {
                    result = item;
                }
            }
            else
            {
                result = item;
            }
        }

        return result;
    }

    static coordsDecode(str, precision)
    {
        let index = 0;
        let lat = 0;
        let lng = 0;
        const coordinates = [];
        let shift = 0;
        let result = 0;
        let byte = null;
        let latitude_change, longitude_change;
        const factor = Math.pow(10, Number.isInteger(precision) ? precision : 6);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length)
        {
            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;

            do
            {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            }
            while (byte >= 0x20);

            latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

            shift = result = 0;

            do
            {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            }
            while (byte >= 0x20);

            longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

            lat += latitude_change;
            lng += longitude_change;

            coordinates.push([lat / factor, lng / factor]);
        }

        return coordinates;
    }

    static coordsEncode(coordinates, precision)
    {
        // convert poins to coords
        if (coordinates && coordinates[0] && coordinates[0].Latitude)
        {
            for (let i = 0; i < coordinates.length; i++)
            {
                coordinates[i] = [coordinates[i].Latitude, coordinates[i].Longitude];
            }
        }

        function py2_round(value)
        {
            // Google's polyline algorithm uses the same rounding strategy as Python 2, which is different from JS for negative values
            return Math.floor(Math.abs(value) + 0.5) * (value >= 0 ? 1 : -1);
        }

        function encode(current, previous, factor)
        {
            current = py2_round(current * factor);
            previous = py2_round(previous * factor);
            let coordinate = current - previous;
            coordinate <<= 1;
            if (current - previous < 0)
            {
                coordinate = ~coordinate;
            }
            let output = '';
            while (coordinate >= 0x20)
            {
                output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
                coordinate >>= 5;
            }
            output += String.fromCharCode(coordinate + 63);
            return output;
        }

        if (!coordinates.length)
        {
            return '';
        }

        const factor = Math.pow(10, Number.isInteger(precision) ? precision : 6);
        let output = encode(coordinates[0][0], 0, factor) + encode(coordinates[0][1], 0, factor);

        for (let i = 1; i < coordinates.length; i++)
        {
            const a = coordinates[i];
            const b = coordinates[i - 1];
            output += encode(a[0], b[0], factor);
            output += encode(a[1], b[1], factor);
        }

        return output;
    }

    static uuid()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
        {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    static removeItemInArray(array, index)
    {
        const result = [];
        for (let i = 0; i < array.length; i++)
        {
            if (i !== index)
            {
                result.push(array[i]);
            }
        }
        return result;
    }

    static getFontAwesomeStringFromClassName = (className, type = 'light') =>
    {
        if (!this.cachedIcon)
        {
            this.cachedIcon = {};
        }

        const key = `${className}-${type}`;

        if (this.cachedIcon[key])
        {
            return this.cachedIcon[key];
        }
        else
        {
            let prefix = '';

            switch (type)
            {
                case 'solid':
                    prefix = 'fas';
                    break;
                case 'regular':
                    prefix = 'far';
                    break;
                default:
                case 'light':
                    prefix = 'fal';
                    break;
            }

            const element = document.createElement('i');
            element.className = `${prefix} fa-${className}`;
            element.style.display = 'none';

            document.body.appendChild(element);
            const contentValue = window.getComputedStyle(element, ':before').getPropertyValue('content');
            document.body.removeChild(element);

            this.cachedIcon[key] = contentValue;

            return contentValue;
        }
    };

    static copyToClipboard(str)
    {
        if (!str)
        {
            return null;
        }

        createTextArea(str);
        selectText();
        copyToClipboard();

        function isOS()
        {
            return navigator.userAgent.match(/ipad|iphone/i);
        }

        function createTextArea(text)
        {
            str = document.createElement('textArea');
            str.value = text;
            document.body.appendChild(str);
        }

        function selectText()
        {
            let range,
                selection;

            if (isOS())
            {
                range = document.createRange();
                range.selectNodeContents(str);
                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                str.setSelectionRange(0, 999999);
            }
            else
            {
                str.select();
            }
        }

        function copyToClipboard()
        {
            document.execCommand('copy');
            document.body.removeChild(str);
        }
    }

    static arrayIntersection = (array1, array2) =>
    {
        if (array1)
        {
            return array1.filter(function (n)
            {
                return array2.indexOf(n) !== -1;
            });
        }
    };

    static getCentroid = (geoJson) =>
    {

        if (typeof (geoJson) === 'string')
        {
            geoJson = JSON.parse(geoJson);
        }
        const bounds = new mapboxgl.LngLatBounds();

        if (geoJson.type === 'Label' || geoJson.type === 'Point')
        {
            bounds.extend(geoJson.coordinates);
        }
        else if (geoJson.type === 'LineString')
        {
            geoJson.coordinates.forEach((c) =>
            {
                bounds.extend(c);
            });
        }
        else if (geoJson.type === 'MultiPolygon')
        {
            geoJson.coordinates.forEach((arrCoords) =>
            {
                arrCoords[0].forEach((c) =>
                {
                    bounds.extend(c);
                });
            });
        }
        else
        {
            geoJson.coordinates[0].forEach((c) =>
            {
                bounds.extend(c);
            });
        }

        return bounds.getCenter();
    };

    static getUniqueValues = (array, key) =>
    {
        const unique = [];
        const distinct = [];
        for (let i = 0; i < array.length; i++)
        {
            const value = array[i][key];
            if (!unique[value])
            {
                distinct.push(value);
                unique[value] = 1;
            }
        }

        return distinct.filter((x) => x);
    };

    static toDictionary = (array = [], key, value) =>
    {
        const dict = {};
        if (!isEmpty(array) && Array.isArray(array))
        {
            array.forEach((item) =>
            {
                if (item[key])
                {
                    dict[`${item[key]}`] = value ? item[value] : item;
                }
            });
        }
        return dict;
    };

    // Return dict with list values
    static toDictionaryAsList = (array = [], key, value) =>
    {
        const dict = {};

        if (Array.isArray(array))
        {
            array.forEach((item) =>
            {
                if (item[key])
                {
                    if (!(item[key] in dict))
                    {
                        dict[item[key]] = value ? [item[value]] : [item];
                    }
                    else
                    {
                        dict[item[key]].push(value ? item[value] : item);
                    }
                }
            });
        }

        return dict;
    };

    static arrayToTree = (array, options, onChildAdded) =>
    {
        options = options || {};
        const ID_KEY = options.idKey || 'path';
        const PARENT_KEY = options.parentKey || 'parentPath';
        const CHILDREN_KEY = options.childrenKey || 'children';
        const ROOT = (options.rootId || 0) + '';

        const tree = [];
        const childrenOf = {};
        let item, id, parentId;

        for (let i = 0, length = array.length; i < length; i++)
        {
            item = array[i];
            id = item[ID_KEY];
            parentId = item[PARENT_KEY] || ROOT;

            // every item may have children
            childrenOf[id] = childrenOf[id] || [];

            // init its children
            item[CHILDREN_KEY] = childrenOf[id];

            if (parentId != ROOT)
            {
                // init its parent's children object
                childrenOf[parentId] = childrenOf[parentId] || [];

                // push it into its parent's children object
                childrenOf[parentId].push(item);
            }
            else
            {
                tree.push(item);
            }
        }

        return tree;
    };

    static removeAccents = (str) =>
    {
        if (!str)
        {
            return str;
        }

        const AccentsMap = [
            'aàảãáạăằẳẵắặâầẩẫấậ',
            'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
            'dđ', 'DĐ',
            'eèẻẽéẹêềểễếệ',
            'EÈẺẼÉẸÊỀỂỄẾỆ',
            'iìỉĩíị',
            'IÌỈĨÍỊ',
            'oòỏõóọôồổỗốộơờởỡớợ',
            'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
            'uùủũúụưừửữứự',
            'UÙỦŨÚỤƯỪỬỮỨỰ',
            'yỳỷỹýỵ',
            'YỲỶỸÝỴ',
        ];

        for (let i = 0; i < AccentsMap.length; i++)
        {
            const re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
            const char = AccentsMap[i][0];
            str = str.replace(re, char);
        }

        return str;
    };

    // point: [lng, lat]
    // polygon: [[lng, lat], [lng, lat],...]
    static checkPointInsidePolygon(point, polygon)
    {
        const x = point[0];
        const y = point[1];
        let inside = false;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++)
        {
            const xi = polygon[i][0];
            const yi = polygon[i][1];
            const xj = polygon[j][0];
            const yj = polygon[j][1];

            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect)
            {
                inside = !inside;
            }
        }

        return inside;
    }

    static getGeoJsonFromObject = (o) =>
    {
        for (const key of Object.keys(o))
        {
            try
            {
                const e = JSON.parse(o[key]);
                if (typeof e === 'object' && e.coordinates)
                {
                    return e;
                }
            }
            catch (error)
            {
            }
        }
    };

    static useStateCallback = (initialState) =>
    {
        const [state, setState] = useState(initialState);
        const cbRef = useRef(null); // mutable ref to store current callback

        const setStateCallback = useCallback((state, cb) =>
        {
            cbRef.current = cb; // store passed callback to ref
            setState(state);
        }, []);

        useEffect(() =>
        {
            // cb.current is `null` on initial render, so we only execute cb on state *updates*
            if (cbRef.current)
            {
                cbRef.current(state);
                cbRef.current = null; // reset callback after execution
            }
        }, [state]);

        return [state, setStateCallback];
    };

    static importAll = (r) =>
    {
        const images = {};

        r.keys().map((item, index) =>
        {
            images[item.replace('./', '')] = r(item);
        });

        return images;
    };

    static getCountryName = (code) =>
    {
        if (code)
        {
            const country = CountryCode.Data.find((x) => x.code === code.toLowerCase());
            return country ? `${country.name} (${country.code.toUpperCase()})` : '';
        }
        return '';
    };

    static isPostalCode = (code) =>
    {
        if (code)
        {
            const arr = ['IN'];
            return arr.includes(code.toUpperCase());
        }
        return false;
    };
}

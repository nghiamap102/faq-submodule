import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { Constants } from 'constant/Constants';
import { CommonHelper } from 'helper/common.helper';
import { LocationService } from './location.service';
import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class DirectionService
{
    http = new HttpClient();

    getAddress(item)
    {
        let address = [
            [item.floor, item.building, item.number].filter((s) => s && s !== '').join(', '),
            [item.street, item.ward, item.district, item.province].filter((s) => s && s !== '').join(', '),
        ].filter((s) => s && s !== '').join(' ');

        if (!address.trim() && item.longitude && item.latitude)
        {
            address = `${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`;
        }

        return address;
    }

    getShortAddress(item)
    {
        let shortAddress = [item.number, item.street].filter((s) => s && s !== '').join(' ');

        if (!shortAddress.trim())
        {
            shortAddress = this.getAddress(item);
        }

        return shortAddress;
    }

    getThumbnail(thumbnail)
    {
        if (thumbnail && thumbnail !== 'UPLOADFOLDER/icon.bmp')
        {
            return 'http://vietbando.com/' + thumbnail;
        }
        else
        {
            return '';
        }
    }

    searchAll = (text, bounds) => this.http.getWithParams('/api/locations/search', {
        keyword: text,
        lx: bounds.west,
        ly: bounds.north,
        rx: bounds.east,
        ry: bounds.south,
        skip: 0,
        limit: 20,
    }, AuthHelper.getVDMSHeader()).then((data) =>
    {
        if (data && data.docs && data.docs.length)
        {
            data.docs.forEach((loc) =>
            {
                loc.address = this.getAddress(loc);
                loc.shortAddress = this.getShortAddress(loc);
                loc.oriThumbnail = loc.thumbnail;
                loc.thumbnail = this.getThumbnail(loc.thumbnail);
                loc.provider = loc.providerType;
                if (!loc.name)
                {
                    loc.name = loc.address || Constants.UNKNOWN_LOCATION;
                    loc.address = loc.shortAddress = '';
                }
            });
        }

        return data;
    });

    reverseGeocode = (lng, lat) => new LocationService().getLocationDataByGeo(lng, lat).then((loc) =>
    {
        loc = loc.data;

        if (lng && lat)
        {
            const geo = {
                ...loc,
                longitude: lng, // use the position from request, not what return from server
                latitude: lat,
            };

            geo.address = this.getAddress((loc && Object.keys(loc).length) ? loc : geo);
            geo.shortAddress = this.getShortAddress((loc && Object.keys(loc).length) ? loc : geo);

            geo.name = geo.name || geo.shortAddress || Constants.UNKNOWN_LOCATION;

            return geo;
        }

        return null;
    });

    addBarrier = (user, type, loc) => this.http.get(`/api/barrier?user=${user}&type=${type}&loc=${loc}`, AuthHelper.getVDMSHeader()).then((res) =>
    {
        return res && res.status === 200 && res.barrier_id !== null && res.barrier_id !== '';
    });

    removeBarrier = (user) => this.http.get(`/api/barrier?user=${user}&clr=true`, AuthHelper.getVDMSHeader()).then((res) =>
    {
        return res && res.status === 200;
    });

    getRouteAvoidBarrier = (locs, veh, crit, user, isAvoidBarrier, step = 1) =>
    {
        return this.http.get(`/api/viaroute?locs=${CommonHelper.coordsEncode(locs, 6)}&veh=${veh}&crit=${crit}&geom=1&steps=${step}&user=${user}&barr=${isAvoidBarrier ? 1 : 0}`, AuthHelper.getVDMSHeader()).then((res) =>
        {
            if (res.status !== 200)
            {
                return res;
            }
            else
            {
                const replaceAt = function (text, index, replacement)
                {
                    return text.substr(0, index) + replacement + text.substr(index + replacement.length);
                };

                const cv = function (oj)
                {
                    for (const key in oj)
                    {
                        if (typeof (oj[key]) === 'object' && !Array.isArray(oj[key]))
                        {
                            cv(oj[key]);
                        }
                        let newKey = replaceAt(key, 0, key[0].toUpperCase());
                        let i = key.indexOf('_');
                        if (i !== -1 && i !== key.length - 1)
                        {
                            newKey = replaceAt(newKey, i + 1, newKey[i + 1].toUpperCase());
                        }
                        oj[newKey] = oj[key];
                        delete oj[key];
                        i = -1;
                    }
                };

                // decode Geometry
                if (res.routes && res.routes.length)
                {
                    let oriOrder = 1;
                    for (const route of res.routes)
                    {
                        cv(route);
                        if (route && route.Geometry)
                        {
                            route.Geometry = CommonHelper.coordsDecode(route.Geometry, 6);
                            // need reformat [lat, lng] => [lng, lat]
                            route.Geometry.forEach((coord) =>
                            {
                                coord.reverse();
                            });

                            route.oriOrder = oriOrder;
                            oriOrder++;
                        }
                    }
                }
                return res.routes;
            }
        });
    };

    getRouteAvoidBarrierDebounced = AwesomeDebouncePromise(this.getRouteAvoidBarrier, 50);
    getSuggestsDebounced = AwesomeDebouncePromise(this.getSuggests, 200);
    searchAllDebounced = AwesomeDebouncePromise(this.searchAll, 200);
}


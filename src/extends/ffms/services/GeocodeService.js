import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Constants } from 'constant/Constants';

export default class GeocodeService
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

    reverseGeocode = (coordsArray = []) =>
    {
        if (coordsArray.length === 0)
        {
            return [];
        }

        const body = coordsArray.map((coord) => ({ Longitude: coord[0], Latitude: coord[1] }));

        return this.http.post(`${AppConstant.vdms.url}/api/v1/maps/reversegeocode/india`, body, AuthHelper.getVDMSHeader()).then((rs) =>
        {
            if (rs && rs.data)
            {
                rs.data = rs && rs.data.map((d)=>
                {
                    if (d.PinCode && typeof (d.PinCode) === 'object')
                    {
                        d.PinCode = d.PinCode?.Value;
                    }
                    d.provider = 'Vietbando';
                    return d;
                }) || [];
            }
            else
            {
                // trying another wait to rev geocode
                return this.http.post('/api/ffms/geo-locations/reverse-geocode', {
                    latitude: body[0].Latitude,
                    longitude: body[0].Longitude,
                }, AuthHelper.getVDMSHeader()).then((rs) =>
                {
                    if (rs && rs.data)
                    {
                        return {
                            status: { code: 200 },
                            data: [{
                                State: rs.data.province,
                                District: rs.data.district,
                                Tehsil: rs.data.ward,
                                PinCode: rs.data.postalCode,
                                provider: rs.data.provider,
                            }],
                        };
                    }
                });
            }
            return rs;
        });
    };

    geocodeSearch = (searchKey, bounds) =>
    {
        const data = {
            searchKey,
            bounds: bounds && {
                lx: bounds.west,
                ly: bounds.north,
                rx: bounds.east,
                ry: bounds.south,
            },
            skip: 0,
            take: 5,
        };
        return this.http.post('/api/ffms/geo-locations/search', data, AuthHelper.getVDMSHeader()).then((data) =>
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
    }

    geocodeSearchDebounced = AwesomeDebouncePromise(this.geocodeSearch, 200);
}

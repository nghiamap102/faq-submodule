import HttpClient from 'helper/http.helper';
import { CommonHelper } from 'helper/common.helper';

export class PlateDetectionService
{
    httpClient = new HttpClient();

    getRoute = (loc, times) =>
    {
        let url = '/api/match?locs=' + CommonHelper.coordsEncode(loc, 6) + '&veh=4&crit=dur&geom=1&steps=0&dist=0&dur=0&gp=30';

        if (times)
        {
            url += `&times=${times}`;
        }

        return this.httpClient.get(url).then((res) =>
        {
            if (res.status !== 200)
            {
                return null;
            }
            else
            {
                const replaceAt = function(text, index, replacement)
                {
                    return text.substr(0, index) + replacement + text.substr(index + replacement.length);
                };

                const cv = function(oj)
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
                if (res.matchings && res.matchings.length)
                {
                    let oriOrder = 1;
                    for (const match of res.matchings)
                    {
                        cv(match);
                        if (match && match.Geometry)
                        {
                            match.Geometry = CommonHelper.coordsDecode(match.Geometry, 6);
                            // need reformat [lat, lng] => [lng, lat]
                            match.Geometry.forEach((coord) =>
                            {
                                coord.reverse();
                            });

                            match.oriOrder = oriOrder;
                            oriOrder++;
                        }
                    }
                }
                return res.matchings;
            }
        });
    };
}

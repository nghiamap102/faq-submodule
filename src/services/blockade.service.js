import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export class BlockadeService
{
    http = new HttpClient();

    getFlagpoles = (loc, radius, euclid, criteria) =>
    {
        const [longitude, latitude] = loc;
        return this.http.get(`/api/flagpole?loc=${latitude},${longitude}&euclid=${euclid}&maxr=${radius}&crit=${criteria}`, AuthHelper.getSystemHeader());
    };

    getFlagpolesDebounced = AwesomeDebouncePromise(this.getFlagpoles, 200);
}

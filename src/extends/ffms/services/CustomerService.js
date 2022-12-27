import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import CommonService from 'extends/ffms/services/CommonService';
import { CommonHelper } from 'helper/common.helper';
import { Constants } from 'constant/Constants';

export default class CustomerService extends CommonService
{
    LAYER_NAME = 'CUSTOMER';
    model = 'customers';
    http = new HttpClient();

    constructor(contexts)
    {
        super(contexts);

        this.contexts = contexts;
        this.comSvc = new CommonService(contexts);
    }

    gets = (where = null, valueType = '') =>
    {
        const filter = where ? { where, valueType: valueType } : null;
        if (filter)
        {
            return this.http.get(`/api/ffms/customers?filter=${encodeURIComponent(JSON.stringify(filter))}`, AuthHelper.getVDMSHeader());
        }

        return this.http.get('/api/ffms/customers', AuthHelper.getVDMSHeader());
    };

    get = (customerGuid) =>
    {
        return this.http.get(`/api/ffms/customers/${customerGuid}`, AuthHelper.getVDMSHeader());
    };

    getData = (nodeId) =>
    {
        return this.getRawData(this.LAYER_NAME, nodeId);
    };

    create = (customerObj) =>
    {
        return this.http.post(
            '/api/ffms/customers',
            customerObj,
            AuthHelper.getVDMSHeader(),
        );
    };

    edit = (customerGuid, customerObj) =>
    {
        return this.http.put(
            `/api/ffms/customers/${customerGuid}`,
            customerObj,
            AuthHelper.getVDMSHeader(),
        );
    };

    delete = (customerGuid) =>
    {
        return this.http.delete(
            `/api/ffms/customers/${customerGuid}`, {},
            AuthHelper.getVDMSHeader(),
        );
    };

    checkPhoneExist = async (value, exceptIds) =>
    {
        if (value)
        {
            const filter = {
                customer_contact_no: value.trim(),
                skip: 0,
                take: 0,
            };

            if (exceptIds && exceptIds.length)
            {
                filter.customer_guid = { nin: exceptIds };
            }

            const result = await this.comSvc.queryCount(this.LAYER_NAME, filter);

            if (result > 0)
            {
                return true;
            }
        }
        return false;
    };
}

import pluralize from 'pluralize';

import { isEmpty } from 'helper/data.helper';
import { RouterParamsHelper } from 'helper/router.helper';

export class FFMSCommonHelper
{
    static shouldHandlePageLoad = (search, params) =>
    {
        if (!search)
        {
            return true;
        }
        const queryString = RouterParamsHelper.getParams(search, params);
        const { mode, select, pageSize, page, order, orderBy, ...filterState } = queryString;

        let forcePageLoad = (!isEmpty(filterState) && !isEmpty(Object.keys(filterState).map((k) => filterState[k]).join(''))) || page || pageSize;

        if (order && orderBy)
        {
            forcePageLoad = true;
        }

        
        if (search)
        {
            const sParam = RouterParamsHelper.groupParamsByKey(new URLSearchParams(search));

            Object.keys(sParam).forEach((k) =>
            {
                if (filterState.hasOwnProperty(k) || ['page', 'pageSize', 'order', 'orderBy'].indexOf(k) > -1)
                {
                    forcePageLoad = true;
                    return;
                }
            });
        }

        return forcePageLoad;
    };

    static pluralizeMe = (tenant, value, count) =>
    {
        const locale = localStorage.getItem('locale') || tenant.locale || 'en';
        if (locale.startsWith('en'))
        {
            return pluralize(value, count);
        }
        return value;
    }
}

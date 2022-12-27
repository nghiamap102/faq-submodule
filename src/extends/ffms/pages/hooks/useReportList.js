

import { useState } from 'react';
import { inject, observer } from 'mobx-react';
import * as _ from 'lodash';
import { useQueryPara } from 'extends/ffms/pages/hooks/useQueryPara';
import { useHistory } from 'react-router-dom';
import reportService from 'extends/ffms/services/ReportService';

const useReportList = () =>
{
    const [loading, setLoading] = useState(false);
    // const reportStore = _.get(fieldForceStore, 'reportStore');
    const param = useQueryPara();
    const history = useHistory();

    const getReportList = async (obj, type)=>
    {
        // setLoading(true);
        // const filter = {
        //     type: reportStore.mainTab == 1 ? 'system' : 'user',
        //     pageIndex: reportStore.pageIndex,
        //     pageSize: reportStore.pageSize,
        //     textSearch: reportStore.textSearch,
        //     layer: reportStore.layerReport.layer
        // };

        // const reportList = await reportService.gets(filter);
        // reportStore.setReportList(reportList.data.data);
        // reportStore.setTotal(reportList.data.total);
        // if (type == 'D')
        // {
        //     const item = _.get(reportList.data.data, 0);
        //     reportStore.setOriginalTemplate(item);
        //     param.set('id', item.Id);
        //     history.push(`${history.location.pathname}?${param.toString()}`);
        // }
        // else
        // {
        //     reportStore.setOriginalTemplate(obj);
        //     param.set('id', obj.Id);
        //     history.push(`${history.location.pathname}?${param.toString()}`);
        // }
        setLoading(false);
    };
  
    return [getReportList];
};

export default inject('fieldForceStore', 'appStore')(observer(useReportList));

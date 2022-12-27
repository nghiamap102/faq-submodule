import { action, decorate, observable, toJS } from 'mobx';
import * as _ from 'lodash';
import { convertArrayToObject } from 'extends/ffms/services/ReportService/util';

export class ReportStore
{
    appStore = null;
    mainTab = null;
    layerName = null;
    configTemplate = null;
    configList = [];
    originalTemplate = null;
    reportList = [];
    textSearch = '';
    jobs = [];
    filter = [];// searching

    groupBy = [];
    calculation = [];
    reportIndex = 0;
    total = 0;
    pageIndex = 1;
    pageSize = 10;
    loading = false;
    
    pagingData ={
        pageIndex: 1,
        pageSize: 50,
        hasMore: true,
    };
    sorters=null;

    layerReport =null;

    systemReport = null;
    customizeReport = null;

    dataListType = {};

    reportTotal={};

    constructor(appStore)
    {
        this.appStore = appStore;
        const paras = new URLSearchParams(window.location.search);
        this.textSearch = paras.get('s') ?? '';
        this.pageIndex = (paras.get('page') ?? 1) * 1;
    }

    setMainTab(tabIndex)
    {
        this.mainTab = tabIndex;
        this.originalTemplate = null;
    }

    setConfigTemplate(configTemplate)
    {
        this.filterConfig = configTemplate.filterConfig;
        this.groupByConfig = configTemplate.groupByConfig;
        this.calculationConfig = configTemplate.calculationConfig;
        this.dateTimeColumn = configTemplate.dateTimeColumn;
        // Handle List type 10
        _.forEach(configTemplate.filterConfig, group =>
        {
            this.dataListType = _.merge(this.dataListType, convertArrayToObject(group));
        });
    }

    setReportIndex(index)
    {
        this.reportIndex = index;
        if (_.size(this.reportList) > 0)
        {
            this.originalTemplate = toJS(this.reportList[index]);
        }
        else
        {
            this.originalTemplate = null;
        }
    }

    setReportList(reportList)
    {
        this.reportList = _.cloneDeep(reportList);
        this.setDefaultCurrentTemplate(this.reportList);
    }

    setTextSearch(textSearch)
    {
        this.textSearch = textSearch;
    }

    setFilter(filter)
    {
        if (filter)
        {
            this.filter = filter;
        }
        if (this.textSearch.length !== 0)
        {
            this.filter.push({ textSearch: `${this.textSearch}` });
        }

        // window.localStorage && window.localStorage.setItem('filter', JSON.stringify(filter));
    }

    clearFilter()
    {
        this.textSearch = '';
    }

    setTotal(total)
    {
        this.total = total;
    }

    setPageIndex(pageIndex)
    {
        this.pageIndex = pageIndex;
    }

    setOriginalTemplate(template, isDirty = false)
    {
        if (isDirty)
        {
            this.setFieldFilter({ ...this.fieldFilter,fields: [] });
            this.setReportData(null);
            this.setPagingData({ ...this.pagingData, hasMore: true });
        }
        this.originalTemplate = template;
    }
    setReportStages(reportStages)
    {
        this.reportStages = _.cloneDeep(reportStages);
    }

    setStages(stages)
    {
        this.stages = _.cloneDeep(stages);
    }
    
    setTotalStages(totalStages)
    {
        this.totalStages = _.cloneDeep(totalStages);
    }
    setTemplateStages(templateStages)
    {
        this.templateStages = _.cloneDeep(templateStages);
    }

    setReportData(reportData)
    {
        this.reportData = _.cloneDeep(reportData);
    }

    setReportParams(parameters)
    {
        this.parameters = _.cloneDeep(parameters);
    }

    setLayerName(layerName)
    {
        this.layerName = _.cloneDeep(layerName);
    }

    setReportTemplate(reportTemplate)
    {
        this.reportTemplate = _.cloneDeep(reportTemplate);
    }

    setFieldFilter(fieldFilter)
    {
        this.fieldFilter = _.cloneDeep(fieldFilter);
    }

    saveReportIndex(reportType = 'systemReport', reportItem)
    {
        this[reportType] = reportItem;
        // if (reportType === 'systemReport')
        // {
        //     this.systemReport = reportItem;
        // }
        // if (reportType === 'customizeReport')
        // {
        //     this.customizeReport = reportItem;
        // }
    }

    setDefaultCurrentTemplate(reportList)
    {
        const paras = new URLSearchParams(window.location.search);
        const id = paras.get('id');
        if (this.originalTemplate && this.originalTemplate.Id == id)
        {
            return;
        }
        else if (id && _.size(reportList) > 0)
        {
            this.originalTemplate = _.cloneDeep(toJS(_.find(reportList, item => item.Id == id)));
        }
        else
        {
            this.originalTemplate = null;
        }
    }

    setTemplateContent(content)
    {
        this.templateContent = _.cloneDeep(content);
    }

    setLoading(loading)
    {
        this.loading = loading;
    }
    setDefaultDateFilter(defaultDateFilter, isDirty = false)
    {
        if (isDirty)
        {
            this.setFieldFilter({ ...this.fieldFilter,fields: [] });
            this.setReportData(null);
            this.setPagingData({ ...this.pagingData, hasMore: true });
        }
        this.defaultDateFilter = _.cloneDeep(defaultDateFilter);
    }

    setReportFiltersTemplate(filtersTemplate)
    {
        this.filtersTemplate = _.cloneDeep(filtersTemplate);
    }

    setPagingData(paging)
    {
        this.pagingData = _.cloneDeep(paging);
    }

    setSorters(columns)
    {
        this.sorters = columns;
    }

    setConfigList(configList)
    {
        this.configList = configList;
        const paras = new URLSearchParams(window.location.search);
        const layer = paras.get('layer');
        if (layer && !this.layerReport)
        {
            this.layerReport = _.cloneDeep(toJS(_.find(configList, item => item.layer.toLowerCase() == layer.toLowerCase())));
        }
        else
        {
            this.layerReport = _.size(configList) > 0 ? configList[0] : null;
        }
    }

    setLayerReport(layerReport, isDirty = false)
    {
        if (isDirty && _.get(this.layerReport,'layer') != _.get(layerReport,'layer'))
        {
            this.setFieldFilter({ ...this.fieldFilter,fields: [] });
            this.setReportData(null);
            this.setPagingData({ ...this.pagingData, hasMore: true });
        }
        this.layerReport = layerReport;
    }

    setReportTotal(reportTotal)
    {
        this.reportTotal = reportTotal;
    }
    
}

decorate(ReportStore, {
    appStore: observable,
    mainTab: observable,
    layerName: observable,
    filterConfig: observable,
    groupByConfig: observable,
    calculationConfig: observable,
    configTemplate: observable,
    reportIndex: observable,
    reportList: observable,
    textSearch: observable,
    total: observable,
    pageIndex: observable,
    pageSize: observable,
    originalTemplate: observable,
    reportStages: observable,
    // stages: observable,
    // templateStages: observable,
    // totalStages: observable,
    reportParams: observable,
    reportData: observable,
    reportTemplate: observable,
    fieldFilter: observable,
    templateContent: observable,
    loading: observable,
    defaultDateFilter: observable,
    filtersTemplate: observable,
    pagingData: observable,
    sorters: observable,
    configList: observable,
    layerReport: observable,
    reportTotal: observable,
    systemReportIndex: observable,
    customizeReportIndex: observable,
    saveReportIndex: action,
    setLoading: action,
    setTextSearch: action,
    setOriginalTemplate: action,
    setReportList: action,
    clearFilter: action,
    setFilter: action,
    setTotal: action,
    setPageIndex: action,
    setReportIndex: action,
    setPagingData: action,
    setSorters: action,
    setConfigList: action,
    setLayerReport: action,
    setReportTotal: action,
});

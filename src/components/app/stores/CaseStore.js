import React from 'react';
import { decorate, observable, action } from 'mobx';
import moment from 'moment';

import { TB1 } from '@vbd/vui';

import LayerService from 'services/layer.service';
import { AppConstant } from 'constant/app-constant';

import { SpatialSearchStore } from '../SpatialSearch/SpatialSearchStore';

const LAYER_NAME = 'CHITIETVUVIEC';
const DEFAULT_FIELDS = ['Id', 'Title', 'DIACHI', 'NGAYTAO', 'PHANLOAI', 'NGUYCAP'];

export class CaseStore
{
    spatialSearchStore = new SpatialSearchStore();
    layerService = new LayerService(AppConstant.c4i2.url);

    minDate = moment.utc('0001-01-01');

    tabSelected = 'case-report';

    cases = [];
    primaryField = ['Title', 'NGUYCAP', 'PHANLOAI'];
    defaultFields = DEFAULT_FIELDS;
    fieldsShow = DEFAULT_FIELDS;
    classifyProps = null;
    caseProps = {};
    dataRefs = {};

    paging = {
        total: null,
        currentPage: 1,
        pageSize: 20,
    };

    isShowMapPopup = false;

    caseObject = null;
    isShowCaseDetail = false;

    keySearch = '';
    sortInfo = null;
    filterInfo = null;

    init = () =>
    {
        this.getCaseData();
        this.getClassifyPropConfig();
        this.getcaseProps();
    };

    setTab = (tab) =>
    {
        this.tabSelected = tab;
    };

    getClassifyPropConfig = () =>
    {
        this.layerService.getPropConfig(LAYER_NAME, 'phanloai').then((rs) =>
        {
            if (rs?.status?.success && rs?.data && rs.data?.source.length > 0)
            {
                this.classifyProps = rs.data.source;
            }
        });
    };

    clearCaseObject = () =>
    {
        this.caseObject = null;
    };

    setCaseData = (rs) =>
    {
        this.cases = rs.data;
        this.setPaging({ total: rs.total });
    };

    getCaseData = (page = 1) =>
    {
        this.setPaging({ currentPage: page });

        const queryObject = {
            path: '/root/vdms/tangthu/data/c4i2-app/chitietvuviec',
            isInTree: true,
            layers: ['CHITIETVUVIEC'],
            returnFields: this.fieldsShow,
            count: this.paging.pageSize,
            start: page * this.paging.pageSize - this.paging.pageSize,
            ...this.keySearch && { searchKey: `Title:(${this.keySearch})` },
            ...this.sortInfo && {
                sortOption: {
                    sortInfo: this.sortInfo,
                },
            },
            ...this.filterInfo && {
                queryInfo: {
                    fields: this.filterInfo,
                },
            },
        };

        this.layerService.getLayers(queryObject).then((rs) =>
        {
            if (rs?.status?.success && rs?.data?.length > 0)
            {
                this.setCaseData(rs);
            }
            else if (rs?.data?.length === 0)
            {
                this.setCaseData({});
            }
        });
    };

    setcaseProps = (props) =>
    {
        this.caseProps = props;
    };

    getcaseProps = () =>
    {
        this.layerService.getLayerProps(LAYER_NAME).then((rs) =>
        {
            const props = {};

            if (rs.status?.success && rs?.data && rs.data?.Properties?.length > 0)
            {
                rs.data.Properties.forEach((item) =>
                {
                    if (item.ColumnName)
                    {
                        props[item.ColumnName] = item;
                    }
                });
            }

            this.setcaseProps(props);
        });
    };

    setLayerDetailData = (caseId) =>
    {
        this.layerService.getNodeLayer(LAYER_NAME, caseId).then((rs) =>
        {
            if (rs?.status?.success && rs?.data)
            {
                this.caseObject = rs.data;
            }
        });
    };

    setPaging = ({ total, currentPage, pageSize }) =>
    {
        this.paging = {
            ...this.paging,
            ...total && { total },
            ...currentPage && { currentPage },
            ...pageSize && { pageSize },
        };
    };

    setFieldsShow = (fields) =>
    {
        this.fieldsShow = fields;
    };

    setKeySearch = (key) =>
    {
        this.keySearch = key;
    };

    setSortInfo = (sortInfo) =>
    {
        this.sortInfo = sortInfo;
    };

    setFilterInfo = (filterInfo) =>
    {
        this.filterInfo = filterInfo;
    };

    showCaseDetail = () =>
    {
        if (!this.isShowCaseDetail)
        {
            this.isShowCaseDetail = true;
        }
    };

    hideCaseDetail = () =>
    {
        if (this.isShowCaseDetail)
        {
            this.isShowCaseDetail = false;
        }
    };

    showCaseMap = () =>
    {
        if (!this.isShowMapPopup)
        {
            this.isShowMapPopup = true;
        }
    };

    hideCaseMap = () =>
    {
        if (this.isShowMapPopup)
        {
            this.isShowMapPopup = false;
        }
    };

    // "dataInfo = ['A','B', 'C']" -> (caseProps) -> D E F
    convertCaseFieldData = (fieldValue, fieldName) =>
    {
        if (!fieldValue)
        {
            return '';
        }

        const field = this.caseProps[fieldName];

        if (field?.DataType === 5)
        {
            const d = moment(fieldValue);
            if (!moment.utc(fieldValue).isAfter(this.minDate))
            {
                fieldValue = <TB1 secondary>Không có dữ liệu</TB1>;
            }
            else
            {
                fieldValue = d.format('L LT');
            }
        }

        if (field?.DataType === 10)
        {
            try
            {
                const values = JSON.parse(fieldValue);
                const options = JSON.parse(field?.Config).content.source;

                if (fieldName.includes('ID'))
                {
                    fieldValue = values[0];
                }
                else
                {
                    const listDataDisplay = [];

                    values.forEach((value) =>
                    {
                        const option = options.find((option) => option.Value === value);

                        if (option)
                        {
                            listDataDisplay.push(option.Display);
                        }
                        else
                        {
                            listDataDisplay.push(value);
                        }
                    });

                    fieldValue = listDataDisplay.join(', ');
                }
            }
            catch (e)
            {
                console.error('convert', fieldValue, e);
            }
        }

        return fieldValue;
    };
}

decorate(CaseStore, {
    tabSelected: observable,
    cases: observable,
    caseProps: observable,
    caseObject: observable,
    isShowCaseDetail: observable,
    paging: observable,
    isShowMapPopup: observable,
    fieldsShow: observable,
    keySearch: observable,
    sortInfo: observable,
    filterInfo: observable,

    init: action,
    setTab: action,
    getCaseData: action,
    setCaseData: action,
    clearCaseObject: action,
    getClassifyPropConfig: action,
    setcaseProps: action,
    setLayerDetailData: action,
    showCaseDetail: action,
    hideCaseDetail: action,
    getClassifyData: action,
    showCaseMap: action,
    hideCaseMap: action,
    setPaging: action,
    searchQuery: action,
    setFieldsShow: action,
    sortQuery: action,
    setKeySearch: action,
    setSortInfo: action,
    setFilterInfo: action,
    convertCaseFieldData: action,
});

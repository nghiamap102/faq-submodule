import './FilterBoard.scss';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import _ from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import Filter from './Filter/Filter';
import FilterBar from './FilterBar';
import SearchTag from './SearchTagBar/SearchTag';
import Setting from 'components/app/Dashboard/FilterBoard/Setting';
import dashboardService from 'services/DashboardService';
import { convertToQueryInfo } from 'services/DashboardService/util';
import { parseDashboardData2Excel } from '../DetailBoard/utils';
import { toJS } from 'mobx';

const FilterBoard = ({ dashboardStore }) =>
{
    // const dashboardStore = _.get(fieldForceStore, 'dashboardStore');
    const [loading, setLoading] = useState(false);

    const exportToExcel = async (fileName) =>
    {
        setLoading(true);

        const layer = dashboardStore.layers[dashboardStore.masterIndex];
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const wb = { Sheets: {}, SheetNames: [] };

        // Create Sheet Master Summary
        const detail = layer.detail;
        let ws = XLSX.utils.json_to_sheet(_.map(detail.items, item => _.pick(item, ['name', 'value', 'percent'])));
        ws['!cols'] = formatExcelCols(detail.items);
        wb.Sheets[detail.title] = _.clone(ws);
        wb.SheetNames.push(detail.title);

        const config = toJS(dashboardStore.config);
        const filter = toJS(dashboardStore.filters);
        const queryInfo = convertToQueryInfo(config.filters);
        const masterIndex = dashboardStore.masterIndex;
        const apiOutput = await dashboardService.getDashboardStat(filter, queryInfo, toJS(dashboardStore), config.masterCharts[masterIndex], masterIndex, true);

        _.forOwn(apiOutput.detailsChart, function (detail)
        {
            const rows = parseDashboardData2Excel(detail, detail.title);
            ws = XLSX.utils.json_to_sheet(rows);
            ws['!cols'] = _.clone(formatExcelCols(rows));
            wb.Sheets[detail.title] = _.clone(ws);
            wb.SheetNames.push(detail.title);
        });

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + `-${detail.title}` + fileExtension);
        setLoading(false);
    };

    const formatExcelCols = (json) =>
    {
        if (_.size(json) == 0)
        {
            return {};
        }
        const widthArr = Object.keys(json[0]).map(key =>
        {
            return { width: key.length + 2 }; // plus 2 to account for short object keys
        });
        for (let i = 0; i < json.length; i++)
        {
            const value = Object.values(json[i]);
            for (let j = 0; j < value.length; j++)
            {
                if (value[j] !== null && widthArr[j] && value[j].length > widthArr[j].width)
                {
                    widthArr[j].width = value[j].length;
                }
            }
        }
        return widthArr;
    };

    return (
        <>
            <FilterBar>
                <Filter
                    icon="filter"
                    title="Bộ lọc"
                />
                <Setting
                    icon="user-cog"
                    title="Tùy chỉnh"
                />
                <div
                    icon="download"
                    title={`${loading ? 'Đang xuất excel...' : 'Xuất excel'}`}
                    className="export-excel"
                    isPopover={false}
                    onClick={() => !loading && exportToExcel(moment().format('YYYY-MM-DD-HHMMSS'))}
                />
            </FilterBar>
            <SearchTag />
        </>
    );
};

FilterBoard.propTypes = {
    fieldForceStore: PropTypes.any,
};

export default inject('dashboardStore')(observer(FilterBoard));

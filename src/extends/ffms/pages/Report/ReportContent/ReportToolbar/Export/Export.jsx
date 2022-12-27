import React, { useState } from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { inject, observer } from 'mobx-react';
import { Button } from '@vbd/vui';
import { parseExcelData, formatExcelCols } from '../utils';
import ReportService from 'extends/ffms/services/ReportService';
import { toJS } from 'mobx';

const Export = ({ fieldForceStore, disabled }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const [loading, setLoading] = useState(false);

    const exportToExcel = async () =>
    {
        setLoading(true);
        const reportData = await ReportService.getReportData(reportStore.reportStages.stages, reportStore.layerReport.layer);
        let list = [];
        if (!_.isEmpty(reportData) && _.size(reportData.data) > 0)
        {
            list = reportData.data;
        }
        
        const dataTypes = reportStore.dataListType;
        const source = toJS(_.get(reportStore,'templateContent.source')) ;
        const fileName = source.title;
        const fields = _.filter(source.fields, item => item.DisplayName !== 'DefaultSort');
        const suffix = moment().format('YYYY-MM-DD-HHMMSS');
        
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const wb = { Sheets: {}, SheetNames: [] };
        
        list = parseExcelData(list, fields, dataTypes);
        // console.log(`list: ${JSON.stringify(list)}`);
        const ws = XLSX.utils.json_to_sheet(list);
        ws['!cols'] = formatExcelCols(list);
        wb.Sheets[fileName] = _.clone(ws);
        wb.SheetNames.push(fileName);

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `${fileName}-${suffix}` + fileExtension);
        
        setLoading(false);
    };

    return (
        <Button
            icon='arrow-to-bottom'
            text={'Export'}
            className='custom-button'
            color={'primary-color'}
            bled={loading}
            disabled={loading || disabled}
            onClick={exportToExcel}
        />
    );
};

Export.propTypes = {
    fieldForceStore: PropTypes.any,
    disabled: PropTypes.bool,
};

export default inject('fieldForceStore')(observer(Export));

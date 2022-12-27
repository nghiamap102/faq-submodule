import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { AdvanceSelect } from '@vbd/vui';

import { isEmpty } from 'helper/data.helper';
import { IMPORT_STATUS } from 'extends/ffms/constant/ffms-enum';

export class ImportDataFilter extends Component
{
    uploadStore = this.props.fieldForceStore.uploadStore;
    
    importStatusOptions = Object.keys(this.uploadStore.importStatus).map((key) =>
    {
        return {
            id: parseInt(IMPORT_STATUS[key]),
            label: this.uploadStore.importStatus[key],
        };
    });

    handleChangeFilter = (key, value) =>
    {
        this.uploadStore.setFileContentFilterState(key, value);

        if (typeof this.props.onFilterChange === 'function')
        {
            this.props.onFilterChange(this.uploadStore.fileContentFilter);
        }
    };

    render()
    {
        const { Status } = this.uploadStore.fileContentFilter;
        return (
            <AdvanceSelect
                width={'20rem'}
                placeholder={'Trạng thái nhập liệu'}
                options={this.importStatusOptions}
                value={Status}
                multi
                clearable
                onChange={(value) =>
                {
                    if (isEmpty(value))
                    {
                        value = [];
                    }

                    this.handleChangeFilter('Status', Array.isArray(value) ? value : [value]);
                }}
            />
        );
    }
}

ImportDataFilter = inject('appStore', 'fieldForceStore')(observer(ImportDataFilter));
export default ImportDataFilter;

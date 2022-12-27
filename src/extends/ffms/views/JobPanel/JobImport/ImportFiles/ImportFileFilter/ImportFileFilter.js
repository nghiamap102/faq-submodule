import './ImportFileFilter.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { PopOver } from '@vbd/vui';

import ImportFileFilterPopup from 'extends/ffms/views/JobPanel/JobImport/ImportFiles/ImportFileFilter/ImportFileFilterPopup';
import { Button } from '@vbd/vui';

export class ImportFileFilter extends Component
{
    jobUploadStore = this.props.fieldForceStore.jobUploadStore;
    filterRef = React.createRef();

    state = {
        isActive: false,
    };

    render()
    {
        return (
            <>
                <Button
                    color={'primary'}
                    className={'btn-empty'}
                    icon={'filter'}
                    tooltip={'Lọc danh sách file nhập liệu'}
                    innerRef={this.filterRef}
                    onlyIcon
                    onClick={() =>
                    {
                        this.setState({ isActive: !this.state.isActive });
                    }}
                />
                {
                    this.state.isActive &&
                    <PopOver
                        anchorEl={this.filterRef}
                        onBackgroundClick={() =>
                        {
                            this.setState({ isActive: !this.state.isActive });
                        }}
                    >
                        <ImportFileFilterPopup
                            onFilterChange={this.props.onFilterChange}
                        />
                    </PopOver>
                }
            </>
        );
    }
}

ImportFileFilter = inject('appStore', 'fieldForceStore')(observer(ImportFileFilter));
export default ImportFileFilter;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { PopOver, Button, EmptyButton } from '@vbd/vui';

import ImportFileFilterPopup from 'extends/ffms/components/Import/ImportFiles/ImportFileFilter/ImportFileFilterPopup';

export class ImportFileFilter extends Component
{
    filterRef = React.createRef();

    state = {
        isActive: false,
    };

    render()
    {
        return (
            <>
                <EmptyButton
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
                    this.state.isActive && (
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
                    )}
            </>
        );
    }
}

ImportFileFilter = inject('appStore', 'fieldForceStore')(observer(ImportFileFilter));
export default ImportFileFilter;

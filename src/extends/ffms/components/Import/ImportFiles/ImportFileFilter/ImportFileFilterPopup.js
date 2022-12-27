import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    Row, Expanded, AdvanceSelect, FormControlLabel, FormGroup,
    EmptyButton, DateTimePicker, ClearableInput,
} from '@vbd/vui';

import { isEmpty } from 'helper/data.helper';
import { RouterParamsHelper } from 'helper/router.helper';

class ImportFileFilterPopup extends Component
{
    uploadStore = this.props.fieldForceStore.uploadStore;
    importStatusOptions = [
        {
            id: 1,
            label: 'Thành công',
        },
        {
            id: 0,
            label: 'Chưa xử lý',
        },
        {
            id: -256,
            label: 'Nhập liệu thất bại',
        },
    ]

    filterRef = React.createRef();

    handleChangeFilter = (key, value) =>
    {
        this.uploadStore.setFileFilterState(key, value);

        let paramValue = `${isEmpty(value) ? '' : value}`;
        if (moment.isMoment(value))
        {
            paramValue = `${value.format('x') || ''}`;
        }

        if (typeof this.props.onFilterChange === 'function')
        {
            this.props.onFilterChange(key, paramValue);
        }
    };

    handleClearAllFilter = () =>
    {
        this.uploadStore.resetAllFileFilterState();

        const filter = {
            'uploader': '',
            'Status': '',
            'CreatedDate': '',
        };
  
        RouterParamsHelper.setParams(this.uploadStore.urlParams, this.props, filter);
    };

    render()
    {
        const { uploader, Status, CreatedDate } = this.uploadStore.fileFilter;

        return (
            <FormGroup>
                <FormControlLabel
                    label={'Tên người dùng'}
                    control={
                        <ClearableInput
                            type={'input'}
                            className={'form-control'}
                            placeholder={'Tên người dùng'}
                            value={uploader}
                            clearable
                            onChange={(value) =>
                            {
                                this.handleChangeFilter('uploader', value);
                            }}
                        />
                    }
                />
                <FormControlLabel
                    label={'Trạng thái nhập liệu'}
                    control={
                        <AdvanceSelect
                            placeholder={'Trạng thái nhập liệu'}
                            options={this.importStatusOptions}
                            value={Status}
                            clearable
                            onChange={(value) =>
                            {

                                this.handleChangeFilter('Status', value);
                            }}
                        />
                    }
                />
                <FormControlLabel
                    label={'Ngày tải lên'}
                    control={
                        <DateTimePicker
                            value={CreatedDate}
                            placeholder={'Chọn ngày tải tập tin lên'}
                            clearable
                            onChange={(value) =>
                            {
                                this.handleChangeFilter('CreatedDate', value);
                            }}
                        />
                    }
                />

                <Row>
                    <Expanded />
                    <EmptyButton
                        color={'info'}
                        text={'Xóa tất cả bộ lọc'}
                        onClick={() =>
                        {
                            this.handleClearAllFilter();
                        }}
                    />
                </Row>
            </FormGroup>
        );
    }
}
ImportFileFilterPopup.propTypes = {
    onFilterChange: PropTypes.func,
};
ImportFileFilterPopup = withRouter(inject('appStore', 'fieldForceStore')(observer(ImportFileFilterPopup)));
export default ImportFileFilterPopup;

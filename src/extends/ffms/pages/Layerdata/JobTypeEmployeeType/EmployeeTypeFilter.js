import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AdvanceSelect, FormControlLabel } from '@vbd/vui';

export class EmployeeTypeFilter extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    managerLayerStore = this.props.fieldForceStore.managerLayerStore;

    state = {
        value: [],
    }
    async componentDidMount()
    {
        await this.fieldForceStore.loadDataReferences(['employee-types']);
    }

    render()
    {
        const { currentLayer, filterState } = this.managerLayerStore;
        const options = this.fieldForceStore.getDataReferenceOptions('employee-types', 'employeetype_id','employeetype_name').sort((a, b) => a.Title.localeCompare(b.Title)) ?? [];

        return (
            currentLayer && currentLayer.LayerName === 'JOB_TYPE' &&
            <FormControlLabel
                label={'Loại nhân viên'}
                labelWidth={'6rem'}
                control={
                    <AdvanceSelect
                        placeholder={'Chọn một giá trị'}
                        options={options.map((x) =>
                        {
                            x.id = `${x.id}`; return x;
                        })}
                        value={filterState.employee_type_id}
                        width={'20rem'}
                        multi
                        clearable
                        onChange={(value) =>
                        {
                            this.setState({ value: value ? value : [] });
                            this.props.onChange('employee_type_id', value ? (Array.isArray(value) ? value.map((v) => `${v}`) : [`${value}`]) : []);
                        }}
                    />
                }
            />
        );
    }
}

EmployeeTypeFilter.propTypes = {
    onChange: PropTypes.func,
};

EmployeeTypeFilter = inject('appStore', 'fieldForceStore')(observer(EmployeeTypeFilter));
EmployeeTypeFilter = withRouter(EmployeeTypeFilter);
export default EmployeeTypeFilter;

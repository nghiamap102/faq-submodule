import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AdvanceSelect, FormControlLabel } from '@vbd/vui';

export class JobTypeFilter extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    managerLayerStore = this.props.fieldForceStore.managerLayerStore;

    state = {
        options: [],
        value: [],
    }
    
    async componentDidMount()
    {
        await this.fieldForceStore.loadDataReferences(['job-types']);
    }

    render()
    {
        const { currentLayer, filterState } = this.managerLayerStore;
        const options = this.fieldForceStore.getDataReferenceOptions('job-types', 'jobtype_id','jobtype_name').sort((a, b) => a.Title.localeCompare(b.Title)) ?? [];

        return (
            currentLayer && currentLayer.LayerName === 'EMPLOYEE_TYPE' &&
                <FormControlLabel
                    label={'Loại công việc'}
                    labelWidth={'6rem'}
                    control={
                        <AdvanceSelect
                            placeholder={'Chọn một giá trị'}
                            options={options.map((x) =>
                            {
                                x.id = `${x.id}`; return x;
                            })}
                            value={filterState.jobtype_id}
                            width={'20rem'}
                            multi
                            clearable
                            onChange={(value) =>
                            {
                                this.setState({ value: value ? value : [] });
                                this.props.onChange('jobtype_id', value ? (Array.isArray(value) ? value.map((v) => `${v}`) : [`${value}`]) : []);
                            }}
                        />
                    }
                />
        );
    }
}

JobTypeFilter.propTypes = {
    onChange: PropTypes.func,
};

JobTypeFilter = inject('appStore', 'fieldForceStore')(observer(JobTypeFilter));
JobTypeFilter = withRouter(JobTypeFilter);
export default JobTypeFilter;

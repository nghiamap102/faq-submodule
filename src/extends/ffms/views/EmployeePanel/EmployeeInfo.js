import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import moment from 'moment';

import {
    Panel, PanelBody, PanelFooter, Expanded,
    InputGroup, InputPrepend, Sub2, DateTimePicker,
    withI18n, Row, AdvanceSelect, Input, Button, FormControlLabel, FormGroup, withModal,
} from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import { ValidationHelper } from 'helper/validation.helper';
import { isEmpty } from 'helper/data.helper';
import DataEnum from 'extends/ffms/constant/ffms-enum';

export class EmployeeInfo extends Component
{
    validationHelper = new ValidationHelper({ t: this.props.t })

    fieldForceStore = this.props.fieldForceStore;
    empStore = this.props.fieldForceStore.empStore;

    teamOptions = this.props.teamOptions;
    typeOptions = this.props.typeOptions;
    orgOptions = this.props.orgOptions;
    shiftOptions = this.props.shiftOptions;

    state = {
        formErrors: {},
        formData: {},
        editable: false,
        formValid: false,
        formAction: 'create',
        errorTextEmail: '',
        loading: false,
        
        teamOptions: [],
        typeOptions: [],
        orgOptions: [],
        shiftOptions: [],

        isDirty: false,
        unSavedChanges: {},
        errorSummary: {},
    };

    defaultValidators = {
        'employee_email': {
            required: true,
            pattern: ValidationHelper.emailPattern,
        },
        'employee_phone': {
            required: true,
            pattern: ValidationHelper.numberOnlyPattern,
        },
        'employee_type_id': {
            required: true,
        },
        'employee_full_name': {
            required: true,
            // pattern: ValidationHelper.fullNamePattern,
        },
        'employee_team_id': {
            required: true,
        },
        'employee_shift_id': {
            required: true,
        },
        'employee_organization_id': {
            required: true,
        },
    };

    vdmsValidator = this.validationHelper.mappingValidators(this.props.properties)
    validators ={ ...this.defaultValidators,... this.vdmsValidator }

    componentDidMount()
    {
        const { data, formAction } = this.props;

        this.setState({
            formData: data,
            originData: { ...data },
            formAction: formAction,
            editable: formAction === 'create' || data?.employee_status !== DataEnum.EMPLOYEE_STATUS.disabled,
            loading: true,
        });

        this.fieldForceStore.loadDataReferences(['teams', 'employee-types', 'organizations', 'shifts']).then((dataRefs) =>
        {
            this.setState({ loading: false });
            if (dataRefs)
            {
                const teamOptions = this.fieldForceStore.getDataReferenceOptions('teams', 'team_id','Title') ?? [];
                const typeOptions = this.fieldForceStore.getDataReferenceOptions('employee-types', 'employeetype_id','employeetype_name') ?? [];
                const orgOptions = this.fieldForceStore.getDataReferenceOptions('organizations', 'organization_id','organization_name') ?? [];
                const shiftOptions = this.fieldForceStore.getDataReferenceOptions('shifts', 'shift_id','shift_from').map((opt) =>
                {
                    return {
                        ...opt,
                        label: `${opt.shift_from}h - ${opt.shift_to}h`,
                    };
                }) ?? [];
                

                this.setState({
                    teamOptions,
                    typeOptions,
                    orgOptions,
                    shiftOptions,
                });
            }
        });

        if (formAction !== 'create')
        {
            this.validateForm(data, formAction).then((validation) =>
            {
                this.setState({
                    formErrors: formAction === 'create' ? {} : validation.formErrors,
                    formValid: validation.formValid,
                });
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState)
    {
        if (nextProps.formAction !== prevState.formAction)
        {
            return {
                formAction: nextProps.formAction ,
                editable: nextProps.formAction === 'create' || prevState.formData?.employee_status !== DataEnum.EMPLOYEE_STATUS.disabled,
            }; // return new state
        }

        return null; // don't change state
    }

    handleSubmit = async () =>
    {
        const { formData, formAction, loading, formValid } = this.state;
        if (loading || !formValid)
        {
            return;
        }
        
        this.setState({ loading: true });

        const validation = await this.validateForm(formData, formAction);

        if (!validation.formValid)
        {
            this.setState({
                formErrors: validation.formErrors,
                formValid: validation.formValid,
                loading: false,
            });
            return;
        }

        let result;
        if (formAction !== 'create')
        {
            result = await this.empStore.edit(
                formData.employee_guid,
                formData,
            );
        }
        else
        {
            result = await this.empStore.add(formData);
        }
        
        if (result && result.errorMessage)
        {
            const errMsg = `${this.props.t('Xác thực dữ liệu không thành công')}. ${this.props.t('Vui lòng xem lý do cụ thể ở từng ô nhập dữ liệu')}.`;
            if (result.details)
            {
                this.setState({
                    formErrors: result.details,
                });
                this.props.toast({ type: 'error', message: errMsg });
            }
            else
            {
                try
                {
                    const errorFields = JSON.parse(result.errorMessage);
                    const _formError = this.state.formErrors;
                    errorFields.forEach((field) =>
                    {
                        _formError[field.validation] = field.message;
                    });
                    this.setState({
                        formErrors: _formError,
                        formValid: false,
                    });
                    
                    this.props.toast({ type: 'error', message: errMsg });
                }
                catch (error)
                {
                    this.props.toast({ type: 'error', message: result.errorMessage });
                }
            }
        }
        else
        {
            let _employee = result;
            if (_employee)
            {
                _employee = Array.isArray(_employee) ? _employee[0] : _employee;
                if (formAction === 'create')
                {
                    RouterParamsHelper.setParams(this.empStore.urlParams, this.props, { mode: 'edit', select: _employee.Id });
                }
                this.setState({
                    originData: { ..._employee },
                });

                if (this.props.onDataChanged)
                {
                    this.props.onDataChanged(_employee);
                }
            }
            this.props.toast({ type: 'success', message: formAction === 'create' ? 'Thêm mới thành công' : 'Đã cập nhật nhân viên' });
            
            this.setState({
                isDirty: false,
                unSavedChanges: {},
            });
        }
        
        this.setState({ loading: false });
    };

    validateForm = async (data, formAction) =>
    {
        const formData = data ? data : this.state.formData;

        const result = this.validationHelper.validateForm(formData, this.validators);

        const formErrors = result.formErrors;
        let formValid = result.formValid;
        
        if (formValid)
        {
            const customs = ['employee_email', 'employee_phone'];
            for (const field of customs)
            {
                const value = formData[field];
                const validation = await this.validateField(field, value, formAction);

                if (!validation.isValid)
                {
                    formValid = false;
                }

                formErrors[field] = validation.errorMessage;
            }
        }
        return { formErrors, formValid };
    };

    handleFieldValidation = async (field, value) =>
    {
        let errorSummary = this.state.errorSummary;
        const { formErrors } = this.state;

        let { formValid, formData } = this.state;
        this.setState({ formValid: false });
        const validation = await this.validateField(field, value);
        
        // this field is INVALID => form is NOT valid, set errorMessage for this field
        // this field is VALID => validate form again to make sure this form is VALID also or not. It works incase this field is the last invalid field
        if (!validation.isValid)
        {
            formValid = false;

            formErrors[field] = validation.errorMessage;
            errorSummary[field] = validation.errorMessage;
        }
        else
        {
            errorSummary = {};
            delete formErrors[field];
            const vForm = this.validationHelper.validateForm(formData, this.validators);
            formValid = vForm.formValid;
            if (!formValid)
            {
                Object.keys(vForm.formErrors).forEach((f) =>
                {
                    if (vForm.formErrors[f])
                    {
                        errorSummary[f] = vForm.formErrors[f];
                    }
                });
                
                if (vForm.formErrors[field])
                {
                    formErrors[field] = vForm.formErrors[field];
                }
            }
        }

        formValid = formValid && Object.keys(formErrors).map((err) => formErrors[err]).join('').length === 0;

        this.setState({
            formErrors: formValid ? {} : formErrors,
            formValid: formValid,
        });
    };

    handleFieldValidationDebounced = AwesomeDebouncePromise(this.handleFieldValidation.bind(this), 300);

    validateField = async (field, value) =>
    {
        const formAction = this.state.formAction;
        let errorMessage = '';

        const validation = this.validationHelper.validateField(this.validators, field, value);

        errorMessage = validation?.errors?.length ? validation.errors.join('\r\n') : '';
        let isValid = !!validation?.isValid;

        if (isValid && value)
        {
            // only check email exist on on new employee
            if (formAction === 'create' && field === 'employee_email')
            {
                const existed = await this.empStore.checkEmailExist(value, formAction === 'create' ? null : [this.state.formData['employee_guid']]);
                if (existed)
                {
                    errorMessage = 'Email này đã tồn tại';
                    isValid = false;
                }
            }

            if (field === 'employee_phone')
            {
                const existed = await this.empStore.checkPhoneExist(value, formAction === 'create' ? null : [this.state.formData['employee_guid']]);
                if (existed)
                {
                    errorMessage = 'Số điện thoại này đã tồn tại';
                    isValid = false;
                }
            }
        }

        return { errorMessage, isValid };
    };

    handleValueChange = (name, value, data) =>
    {
        this.changeAttr(name, value, data);

        this.handleFieldValidationDebounced(name, value);

        this.markDirty(false);
    };

    changeAttr = async (attr, value, obj) =>
    {
        const { formData } = this.state;

        formData[attr] = value;

        this.setState({
            formData,
        });
    };

    markDirty = (silent) =>
    {
        let isDirty = false;
        const unSavedChanges = {};
        let baseData = this.state.originData;
        let compareData = this.state.formData;
        const formAction = this.state.formAction;
        if (formAction === 'create')
        {
            baseData = this.state.formData;
            compareData = this.state.originData || {};
        }

        Object.keys(baseData).forEach((key) =>
        {
            const value1 = baseData[key] ;
            const value2 = compareData[key] ;

            if (value1 || value2)
            {
                const sameValue = JSON.stringify({ value: value1 }) === JSON.stringify({ value: value2 });
                if (!sameValue)
                {
                    isDirty = true;
                    if (!silent)
                    {
                        unSavedChanges[key] = {
                            previous: formAction === 'create' ? value2 : value1,
                            current: formAction === 'create' ? value1 : value2,
                        };
                    }
                }
            }
        });

        this.setState({ isDirty, unSavedChanges });
    };

    render()
    {
        const { formData, editable, formAction, loading, formValid, unSavedChanges, errorSummary,formErrors } = this.state;
        const formDisabled = loading || !formValid || !editable;
        let strTooltip = null;
        if (!isEmpty(errorSummary))
        {
            strTooltip = Object.keys(errorSummary).map((key, index) => `${key.replace('employee_','').replace(/_/g,' ')}: ${this.props.t(errorSummary[key])}`).join('\r\n');
        }

        return (
            <Panel>
                <PanelBody scroll>
                    <FormGroup className={'emp-info-form'}>
                        <Sub2>{this.empStore.mess}</Sub2>
                        <FormControlLabel
                            dirty={unSavedChanges && !!unSavedChanges['employee_full_name']}
                            label={'Họ tên'}
                            control={(
                                <Input
                                    name={'employee_full_name'}
                                    placeholder={'Ashok Kumar'}
                                    value={formData['employee_full_name'] || ''}
                                    disabled={!editable}
                                    autoFocus
                                    onBlur={(e) => this.handleFieldValidation('employee_full_name', e.target.value)}
                                    onChange={(value) => this.handleValueChange('employee_full_name', value)}
                                />
                            )}
                            errorText={formErrors.employee_full_name}
                            required = {!!this.validators.employee_full_name?.required}
                            rules={[{}]}
                        />
                        <FormControlLabel
                            dirty={unSavedChanges && !!unSavedChanges['employee_email']}
                            label={'Email'}
                            control={(
                                <Input
                                    placeholder={'ashok@abcdeliveries.com'}
                                    name={'employee_email'}
                                    type={'email'}
                                    value={formData['employee_email'] || ''}
                                    disabled={!editable || formAction !== 'create'}
                                    onChange={(value) => this.handleValueChange('employee_email', value)}
                                    onBlur={(e) => this.handleFieldValidation('employee_email', e.target.value)}
                                />
                            )}
                            errorText={formErrors.employee_email}
                            required = {!!this.validators.employee_email?.required}
                            rules={[{}]}
                        />
                        <FormControlLabel
                            dirty={unSavedChanges && !!unSavedChanges['employee_phone']}
                            label={'Số điện thoại'}
                            control={(
                                <InputGroup>
                                    {/* <InputPrepend>+91</InputPrepend> */}
                                    <Input
                                        placeholder={'0000000000'}
                                        name={'employee_phone'}
                                        value={formData['employee_phone'] || ''}
                                        disabled={!editable}
                                        onChange={(value) => this.handleValueChange('employee_phone', value)}
                                        onBlur={(e) => this.handleFieldValidation('employee_phone', e.target.value)}
                                    />
                                </InputGroup>
                            )}
                            required = {!!this.validators.employee_phone?.required}
                            errorText={formErrors.employee_phone}
                            rules={[{}]}
                        />
                        <FormControlLabel
                            dirty={unSavedChanges && !!unSavedChanges['employee_dob']}
                            label={'Ngày sinh'}
                            control={(
                                <DateTimePicker
                                    placeholder={'Chọn ngày sinh'}
                                    name={'employee_dob'}
                                    type={'date'}
                                    value={formData['employee_dob']}
                                    disabled={!editable}
                                    maxDate={moment()}
                                    onChange={(value) => this.handleValueChange('employee_dob', moment(value))}
                                />
                            )}
                            required = {!!this.validators.employee_dob?.required}
                            errorText={formErrors.employee_dob}
                            rules={[{}]}
                        />
                        <FormControlLabel
                            key={'employee_type_id'}
                            label={'Kiểu'}
                            dirty={unSavedChanges && !!unSavedChanges['employee_type_id']}
                            control={(
                                <AdvanceSelect
                                    value={formData['employee_type_id'] || ''}
                                    placeholder={'Chọn loại nhân viên...'}
                                    options={this.state.typeOptions}
                                    disabled={!editable || formAction !== 'create'}
                                    clearable={editable}
                                    onChange={(e) => this.handleValueChange('employee_type_id', e)}
                                />
                            )}
                            required = {!!this.validators.employee_type_id?.required}
                            errorText={formErrors.employee_type_id}
                            rules={[{}]}
                        />
                        <FormControlLabel
                            key={'employee_team_id'}
                            label={'Đội'}
                            dirty={unSavedChanges && !!unSavedChanges['employee_team_id']}
                            control={(
                                <AdvanceSelect
                                    value={formData['employee_team_id'] || ''}
                                    placeholder={'Chọn đội cho nhân viên...'}
                                    options={this.state.teamOptions}
                                    disabled={!editable}
                                    clearable={editable}
                                    onChange={(e) => this.handleValueChange('employee_team_id', e)}
                                />
                            )}
                            required = {!!this.validators.employee_team_id?.required}
                            errorText={formErrors.employee_team_id}
                            rules={[{}]}
                        />
                        <FormControlLabel
                            key={'employee_shift_id'}
                            label={'Ca'}
                            dirty={unSavedChanges && !!unSavedChanges['employee_shift_id']}
                            control={(
                                <AdvanceSelect
                                    value={formData['employee_shift_id'] || ''}
                                    placeholder={'Chọn ca cho nhân viên...'}
                                    options={this.state.shiftOptions}
                                    disabled={!editable}
                                    clearable={editable}
                                    onChange={(e) => this.handleValueChange('employee_shift_id', e)}
                                />
                            )}
                            required = {!!this.validators.employee_shift_id?.required}
                            errorText={formErrors.employee_shift_id}
                            rules={[{}]}
                        />
                        <FormControlLabel
                            key={'employee_organization_id'}
                            label={'Tổ chức'}
                            dirty={unSavedChanges && !!unSavedChanges['employee_organization_id']}
                            control={(
                                <AdvanceSelect
                                    value={formData['employee_organization_id'] || ''}
                                    placeholder={'Chọn tổ chức cho nhân viên...'}
                                    options={this.state.orgOptions}
                                    disabled={!editable}
                                    clearable={editable}
                                    onChange={(e) => this.handleValueChange('employee_organization_id', e)}
                                />
                            )}
                            required = {!!this.validators.employee_organization_id?.required}
                            errorText={formErrors.employee_organization_id}
                            rules={[{}]}
                        />
                        <FormControlLabel
                            key={'employee_vehicle_id'}
                            label={'Phương tiện'}
                            dirty={unSavedChanges && !!unSavedChanges['employee_vehicle_id']}
                            control={(
                                <Input
                                    placeholder={'Phương tiện'}
                                    name={'employee_vehicle_id'}
                                    value={formData['employee_vehicle_id'] || ''}
                                    disabled={!editable}
                                    onChange={(value) => this.handleValueChange('employee_vehicle_id', value)}
                                    onBlur={(e) => this.handleFieldValidation('employee_vehicle_id', e.target.value)}
                                />
                            )}
                            required = {!!this.validators.employee_vehicle_id?.required}
                            errorText={formErrors.employee_vehicle_id}
                            rules={[{}]}
                        />
                        <FormControlLabel
                            label={'Mô tả'}
                            dirty={unSavedChanges && !!unSavedChanges['Description']}
                            control={(
                                <Input
                                    placeholder={'Mô tả'}
                                    value={formData['Description'] || ''}
                                    disabled={!editable}
                                    onChange={(value) => this.handleValueChange('Description', value)}
                                />
                            )}
                            required = {!!this.validators.Description?.required}
                            errorText={formErrors.Description}
                        />
                    </FormGroup>
                </PanelBody>
                <PanelFooter>
                    <Row mainAxisAlignment={'space-between'}>
                        <Expanded />
                        <Button
                            icon={'save'}
                            iconType={'solid'}
                            color={'primary'}
                            text={formAction === 'create' ? 'Tạo' : 'Cập nhật'}
                            disabled={formDisabled}
                            isLoading={loading}
                            tooltip={strTooltip}
                            onClick={this.handleSubmit}
                        />
                        <Expanded />
                    </Row>
                </PanelFooter>
            </Panel>
        );
    }
}

EmployeeInfo = inject('fieldForceStore')(observer(EmployeeInfo));
EmployeeInfo = withModal(withI18n((withRouter(EmployeeInfo))));

export default EmployeeInfo;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { withRouter } from 'react-router-dom';

import {
    Popup, PopupFooter, Section, 
    InputGroup, InputPrepend, AdvanceSelect, Input, Button, FormControlLabel, FormGroup, 
    withI18n, withModal, HD6
} from '@vbd/vui';
import DynamicFormField from 'extends/ffms/pages/base/Form/DynamicFormField';


import { RouterParamsHelper } from 'helper/router.helper';
import { isEmpty } from 'helper/data.helper';
import { ValidationHelper } from 'helper/validation.helper';

import { JOB_STATUS } from 'extends/ffms/constant/ffms-enum';
import AdministrativeFormControl from 'extends/ffms/views/JobPanel/Administrative/AdministrativeFormControl';
import QuickAddCustomer from 'extends/ffms/views/JobPanel/Customer/QuickAddCustomer';
import GeocodeService from 'extends/ffms/services/GeocodeService';
import { PlainListItem } from 'extends/ffms/components/ListItem/PlainListItem';

class JobForm extends Component
{
    jobStore = this.props.fieldForceStore.jobStore;
    fieldForceStore = this.props.fieldForceStore;
    customerStore = this.props.fieldForceStore.customerStore;
    abStore = this.props.appStore.adminBoundariesStore;

    geocodeSvc = new GeocodeService();
    comSvc = this.props.fieldForceStore.comSvc;
    validationHelper = new ValidationHelper({ t: this.props.t });

    jobStatusOptions = [];
    jobTypeOptions = [];

    state = {
        formData: {},
        editable: true,
        formErrors: {},
        formValid: false,
        formAction: 'create',
        errorSummary: {},
        loading: false,
        validating: false,
        jobBefore: [],
        formOptions: {},
        properties: [],

        isDirty: false,
        unSavedChanges: {},
        assigneeSearchKey: '',
    };

    defaultValidators = {
        'job_destination_contact_no': {
            required: true,
            pattern: ValidationHelper.numberOnlyPattern,
        },
        'job_destination_contact_name': {
            required: true,
        },
        'Title': {
            required: true,
        },
        'job_type_id': {
            required: true,
        },
        'job_destination_address_state': {
            required: true,
        },
        'job_destination_address_district': {
            required: true,
        },
        'job_destination_location': {
            required: true,
        }
    };
    vdmsValidator = this.validationHelper.mappingValidators(this.props.properties)
    validators ={ ...this.defaultValidators,... this.vdmsValidator }

    componentDidMount = async () =>
    {
        this.jobStore.appStore = this.props.appStore;
        const { formData, formAction, properties } = this.props;

        const editable = formAction === 'create' || parseInt(formData.job_status_id) === JOB_STATUS.new;
        const validation = this.validateForm(formData);

        properties.forEach(async (prop) =>
        {
            if (prop.IsRequire)
            {
                let config = prop.Config ? prop.Config : { custom: { isID: false, isSystem: false } };
                if (typeof (config) === 'string')
                {
                    config = JSON.parse(prop.Config);
                }

                if (!config.custom || (!config.custom.isId && !config.custom.isAutoId))
                {
                    this.validators[prop.ColumnName] = {... this.validators[prop.ColumnName], required: true };
                }
            }

            if (prop.DataType === 10)
            {
                const result = await this.comSvc.getLayerListOptions('JOB', prop.ColumnName, prop.Config);
                const formOptions = this.state.formOptions;
                formOptions[prop.ColumnName] = result ?? [];                    
                this.setState({ formOptions: formOptions });
            }

            const config = prop.Config ? (typeof (prop.Config) === 'string' ? JSON.parse(prop.Config) : prop.Config) : { custom: { isID: false, isSystem: false } };
            if (config && config.custom && config.custom.isSystem)
            {
                prop.IsSystem = true;
            }
        });

        const dynamicProps = properties.filter((p) => p.ColumnName && !p.IsSystem);

        this.setState({
            formAction: formAction,
            formData: { ...formData } ?? {},
            properties: dynamicProps,
            editable: editable,
            formErrors: formAction === 'create' ? {} : validation.formErrors,
            formValid: validation.formValid,
        });

        this.bindAssignees(formData && formData['job_type_id'], this.state.assigneeSearchKey);

        const dataRefs = await this.fieldForceStore.loadDataReferences(['job-types']);
        this.jobTypeOptions = this.fieldForceStore.getDataReferenceOptions('job-types', 'jobtype_id', 'jobtype_name') ?? [];
        // Preload first 20 customers
        this.getCustomerOptions();

        // Preload first 20 jobs
        this.getJobBeforeOptions();

        if (!this.abStore.countryRegion)
        {
            this.abStore.init();
        }
    };

    bindAssignees = async (jobTypeId, searchKey) =>
    {
        // load assignee list base on job_type_id
        let assignees = [];
        if (jobTypeId)
        {
            assignees = await this.loadAssignees(jobTypeId, searchKey);

            const formData = this.state.formData;
            if (formData && formData['job_assignee_guid'] && isEmpty(assignees?.find((x) => x.employee_guid === formData['job_assignee_guid'])))
            {
                const emp = await this.comSvc.getById('EMPLOYEE', formData['job_assignee_guid']);
                assignees.push({
                    id: emp.employee_guid,
                    label: `${emp.employee_full_name ? emp.employee_full_name : ''}${emp.employee_username ? ` (${emp.employee_username})` : ''}`,
                    ...emp,
                });
            }
        }
        this.setState({
            assignableEmployees: assignees,
        });
    }

    getJobBeforeOptions = async (searchKey) =>
    {
        const filter = { skip: 0, take: 20 };
        if (searchKey && searchKey.length)
        {
            filter['searchKey'] = searchKey;
        }
        let jobBefore = await this.comSvc.queryData('jobs', filter).then((res) => res && res.data);

        if (jobBefore)
        {
            jobBefore = jobBefore.map((job) =>
            {
                let display = '';
                if (job.Title)
                {
                    display += job.Title;
                }
                else
                {
                    display += job.job_destination_contact_name;
                }
                return {
                    id: job.job_guid,
                    label: display || '-- Empty name --',
                    ...job,
                };
            });
        }

        this.jobStore.setJobBefore(jobBefore);
    };
    getJobBeforeOptionsDebounced = new AwesomeDebouncePromise(this.getJobBeforeOptions.bind(this), 300);

    getCustomerOptions = async (searchKey) =>
    {
        const filter = { skip: 0, take: 20 };
        if (searchKey && searchKey.length)
        {
            filter['searchKey'] = searchKey;
        }
        const _customers = await this.comSvc.queryData('customers', filter).then((res) => res && res.data);

        const customerOptions = [{
            id: 'new-customer',
            label: (
                <PlainListItem
                    className={'advance-select-button'}
                    iconClass={'plus'}
                    label={'Thêm khách hàng mới...'}
                />
            ),
        }];
        if (_customers && _customers.length)
        {
            customerOptions.push(..._customers?.map((data) =>
            {
                let display = '';
                if (data.customer_fullname)
                {
                    display += data.customer_fullname;
                }
                if (data.customer_contact_no)
                {
                    display += ` (${data.customer_contact_no})`;
                }

                return {
                    id: data.customer_guid,
                    label: display || '-- Empty name --',
                    ...data,
                };
            }));
        }

        this.customerStore.setCustomerOptions(customerOptions);
    };
    getCustomerOptionsDebounced = new AwesomeDebouncePromise(this.getCustomerOptions.bind(this), 300);

    validateForm = (data) =>
    {
        let formValid = true;
        const formData = data ? data : this.state.formData;
        const formErrors = {};

        for (const field in this.validators)
        {
            const value = formData[field];
            const validation = this.validateField(field, value);

            if (!validation.isValid)
            {
                formValid = false;
            }

            formErrors[field] = validation.errorMessage;
        }

        return { formErrors, formValid };
    };

    handleFieldValidation = (field, value) =>
    {
        let errorSummary = this.state.errorSummary;
        const { formErrors } = this.state;

        let formValid = this.state.formValid;
        const validation = this.validateField(field, value);

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

            const vForm = this.validateForm();
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

            Object.keys(formErrors).forEach((err) =>
            {
                if (!vForm.formErrors || !vForm.formErrors[err])
                {
                    formErrors[err] = '';
                }
            });
        }

        // formValid = formValid && Object.keys(formErrors).map((err) => formErrors[err]).join('').length === 0;

        this.setState({
            formErrors: formValid ? {} : formErrors,
            formValid: formValid,
            errorSummary,
        });
    };
    handleFieldValidationDebounced = AwesomeDebouncePromise(this.handleFieldValidation.bind(this), 300);

    validateField = (field, value) =>
    {
        let errorMessage = '';

        const validation = this.validationHelper.validateField(this.validators, field, value);
        errorMessage = validation?.errors?.length ? validation.errors.join('\r\n') : '';
        const isValid = !!validation?.isValid;

        return { errorMessage, isValid };
    };

    handleSubmit = async () =>
    {
        const { formData, formAction, loading, formValid } = this.state;
        if (loading || !formValid)
        {
            return;
        }

        this.setState({ loading: true });

        const validation = this.validateForm(formData);

        if (!validation.formValid)
        {
            this.setState({
                formErrors: validation.formErrors,
                formValid: validation.formValid,
                loading: false,
            });

            return;
        }

        if (formAction !== 'create')
        {
            this.jobStore.edit(
                formData.job_guid,
                formData,
            ).then(this.handleAfterChangeData);
        }
        else
        {
            this.jobStore.add(formData).then(this.handleAfterChangeData);
        }

        this.setState({ loading: false });
        this.closeMe();
    };

    handleAfterChangeData = (result) =>
    {
        if (result && result.errorMessage)
        {
            const errMsg = `${this.props.t('Xác thực dữ liệu không thành công')}. ${this.props.t('Vui lòng xem lý do cụ thể ở từng ô nhập dữ liệu')}.`;
            if (result.details)
            {
                this.setState({
                    formErrors: result.details,
                    errorSummary: result.details,
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
                        errorSummary: _formError,
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
            // this.props.toast({ type: 'success', message: formAction === 'create' ? 'Đã tạo công việc' : 'Chỉnh sửa thành công' });
            // this.closeMe();
        }
    }

    handleCustomerSelect = async (value, location) =>
    {
        if (value === 'new-customer')
        {
            this.customerStore.setCustomer();
            // this.customerStore.togglePanel();
            this.customerStore.setCustomerFormState(true, 'create');
        }
        else
        {
            this.handleCustomerTextChange('');
            const data = this.customerStore.customerOptions?.find((c) => c.id === value);

            const formData = this.state.formData ?? {};

            formData['job_customer_guid'] = data?.customer_guid;
            formData['job_destination_contact_name'] = data?.customer_fullname;
            formData['job_destination_contact_no'] = data?.customer_contact_no;
            formData['job_destination_address_street'] = data?.customer_address_street;
            formData['job_destination_address_pincode'] = data?.customer_address_pincode;

            let customerData = undefined;
            if (data)
            {
                customerData = await this.comSvc.getAdministrativeValues([data], 'customer_address_state', 'customer_address_district', 'customer_address_tehsil').then((newData) => newData[0]);

                this.jobStore.setRegionOptions(0, this.abStore.countryRegion);

                await this.jobStore.bindRegionOptions('AdministrativeID', customerData?.customer_address_state, customerData?.customer_address_district);
            }

            formData['job_destination_address_state'] = customerData?.customer_address_state;
            formData['job_destination_address_district'] = customerData?.customer_address_district;
            formData['job_destination_address_tehsil'] = customerData?.customer_address_tehsil;
            const geoJsonLocation = location && typeof (location) === 'string' ? JSON.parse(location) : undefined;
            formData['job_destination_location'] = geoJsonLocation || (customerData && typeof (customerData.location) === 'string' && customerData.location ? JSON.parse(customerData.location) : undefined);

            this.jobStore.shouldMapRerender = true;
            const validation = this.validateForm(formData);
            this.setState({
                formData,
                formErrors: this.state.formAction === 'create' ? {} : validation.formErrors,
                formValid: validation.formValid,
            });
            this.jobStore.shouldMapRerender = false;
        }
    };

    handleValueChange = async (name, value, data) =>
    {
        const formData = await this.changeAttr(name, value, data);

        this.handleFieldValidationDebounced(name, formData[name]);

        this.validateDirty(false);
    };

    handleSelectChange = async (name, value, data) =>
    {
        const formData = await this.changeAttr(name, value, data);

        this.handleFieldValidation(name, formData[name]);

        if (name === 'job_type_id')
        {

            const options = await this.loadAssignees(value);
            this.setState({
                assignableEmployees: options,
            });
        }

        this.validateDirty(false);
    };

    validateDirty = (silent) =>
    {
        let isDirty = false;
        const unSavedChanges = {};
        let baseData = this.props.formData;
        let compareData = this.state.formData;
        const formAction = this.state.formAction;
        if (formAction === 'create')
        {
            baseData = this.state.formData;
            compareData = this.props.formData || {};
        }
        Object.keys(baseData).forEach((key) =>
        {
            let value1 = baseData[key];
            let value2 = compareData[key];

            // special fields
            const fields = ['job_destination_address_state', 'job_destination_address_district', 'job_destination_address_tehsil'];
            if (fields.indexOf(key) > -1)
            {
                if (!isNaN(parseInt(value1)))
                {
                    value1 = parseInt(value1);
                }
                if (!isNaN(parseInt(value2)))
                {
                    value2 = parseInt(value2);
                }
            }
            // END special fields

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

    loadAssignees = async (jobTypeId, searchKey) =>
    {
        const options = await this.jobStore.getAssignableEmployeeOptions([jobTypeId], { searchKey });
        return options;
    }

    handleQuickAddCustomerSubmit = (newCustomer) =>
    {
        // this.mapCustomersToDropdownList([newCustomer, ...CommonService.DataRefs['customers']]);
        let display = '';
        if (newCustomer.customer_fullname)
        {
            display += newCustomer.customer_fullname;
        }
        if (newCustomer.customer_contact_no)
        {
            display += ` (${newCustomer.customer_contact_no})`;
        }

        const newOption = {
            id: newCustomer.customer_guid,
            label: display || '-- Empty name --',
            ...newCustomer,
        };
        this.customerStore.customerOptions.splice(1, 0, newOption);
        this.handleCustomerSelect(newCustomer.customer_guid, newCustomer.location);
    }

    changeAttr = async (attr, value, obj) =>
    {
        const { formData } = this.state;
        formData[attr] = value;

        if (attr === 'job_destination_location' || attr === 'job_origin_location')
        {
            if (typeof (value) == 'string')
            {
                try
                {
                    value = JSON.parse(value);
                }
                catch (e)
                {
                    return;
                }
            }
            if (value && value.coordinates)
            {
                formData[attr] = value;

                const geocodeResult = await this.geocodeSvc.reverseGeocode([formData[attr].coordinates]);

                if (geocodeResult && geocodeResult.status && geocodeResult.status.code === 200 && !geocodeResult.status.message)
                {
                    const { State, District, Tehsil, PinCode, Road } = geocodeResult.data[0];

                    await this.jobStore.bindRegionOptions('Title', State, District);
                    const result = this.jobStore.getAdministrativeIds(State, District, Tehsil);

                    switch (attr)
                    {
                        case 'job_destination_location':
                            formData['job_destination_address_state'] = result.state;
                            formData['job_destination_address_district'] = result.district;
                            formData['job_destination_address_tehsil'] = result.tehsil;
                            formData['job_destination_address_pincode'] = PinCode;
                            // formData['job_destination_address_street'] = Road;
                            break;
                        case 'job_origin_location':
                            formData['job_origin_address_state'] = result.state;
                            formData['job_origin_address_district'] = result.district;
                            formData['job_origin_address_tehsil'] = result.tehsil;
                            formData['job_origin_address_pincode'] = PinCode;
                            // formData['job_origin_address_street'] = Road;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        else if (attr === 'job_type_id')
        {
            formData['job_assignee_guid'] = '';
        }

        this.setState({
            formData,
        });
        return formData;
    };

    handleBeforeClose = () =>
    {
        if (this.state.isDirty)
        {
            this.props.confirm({
                title: 'Thoát khỏi tính năng này?',
                message: <HD6>Bạn có thay đổi chưa lưu</HD6>,
                cancelText: 'Bỏ thay đổi',
                onCancel: this.closeMe,
                okText: 'Tiếp tục chỉnh sửa',
            });
            return false;
        }

        return true;
    };

    closeMe = () =>
    {
        this.jobStore.setJobFormState(false);
        RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { mode: '', select: '' });
    }

    handleCustomerTextChange = async (searchKey) =>
    {
        await this.getCustomerOptions(searchKey);
    };
    handleCustomerTextChangeDebounced = new AwesomeDebouncePromise(this.handleCustomerTextChange.bind(this), 300);

    handleJobBeforeTextChange = async (searchKey) =>
    {
        await this.getJobBeforeOptions(searchKey);
    };
    handleJobBeforeTextChangeDebounced = new AwesomeDebouncePromise(this.handleJobBeforeTextChange.bind(this), 300);

    handleJobAssigneeTextChange = async (searchKey) =>
    {
        this.setState({
            assigneeSearchKey: searchKey,
        });

        await this.bindAssignees(this.state.formData['job_type_id'], searchKey);
    };
    handleJobAssigneeTextChangeDebounced = new AwesomeDebouncePromise(this.handleJobAssigneeTextChange.bind(this), 300);

    renderDynamicField = (prop, value) =>
    {
        const { formData, formOptions, formErrors, formAction } = this.state;
        const { ColumnName, DisplayName } = prop;

        const disabled = formData['job_status_id'] === JOB_STATUS.done || formData['job_status_id'] === JOB_STATUS.cancel;
        return (
            <DynamicFormField
                property={prop}
                label={DisplayName}
                className={'form-control'}
                name={ColumnName}
                value={value}
                readOnly={formAction === 'create' ? false : prop.IsReadOnly}
                disabled={disabled}
                options={formOptions[ColumnName]}
                rules={[{}]}
                onChange={(value) => this.handleValueChange(ColumnName, value)}
                onBlur={(e) => this.handleFieldValidation(ColumnName, e.target.value)}
                errorText={formErrors[`${ColumnName}`]}
                required={this.validators[ColumnName]?.required}
            />
        );
    }

    render()
    {
        const { isShowJobForm } = this.jobStore;
        const { formData, formAction, editable, assignableEmployees, loading, formValid, unSavedChanges, properties, formErrors } = this.state;
        const defaultRules = [{}];
        const formDisabled = loading || !formValid;
        const strTooltip = Object.keys(this.state.errorSummary).map((key, index) => `${key.replace('job_','').replace(/_/g,' ')}: ${this.props.t(this.state.errorSummary[key])}`).join('\r\n');

        return (
            <>
                {
                    this.customerStore.isShowForm &&
                    <QuickAddCustomer
                        onSubmit={this.handleQuickAddCustomerSubmit}
                        formData={this.customerStore.currentCustomer}
                        formAction={this.customerStore.customerFormAction}
                        history={this.props.history}
                        isRoot={false}
                    />
                }
                {
                    isShowJobForm &&
                    <Popup
                        title={formAction === 'create' ? 'Tạo công việc mới' : 'Thay đổi thông tin công việc'}
                        width={'50rem'}
                        onBeforeClose={this.handleBeforeClose}
                        onClose={this.closeMe}
                        escape={false}
                    >
                        <Section header={'Thông tin khách hàng'}>
                            <FormGroup>
                                {
                                    (editable || formData['job_customer_guid']) &&
                                    <FormControlLabel
                                        dirty={unSavedChanges && unSavedChanges['job_customer_guid']}
                                        rules={defaultRules}
                                        key={'job_customer_guid'}
                                        label={'Khách hàng'}
                                        control={
                                            <AdvanceSelect
                                                value={formData['job_customer_guid'] || ''}
                                                options={this.customerStore.customerOptions}
                                                placeholder={'Chọn một khách hàng...'}
                                                disabled={!editable}
                                                hasSearch
                                                searchMode={'remote'}
                                                onRemoteFetch={this.handleCustomerTextChangeDebounced}
                                                onChange={(e) => this.handleCustomerSelect(e)}
                                                clearable
                                                onClear={() => this.handleCustomerSelect()}
                                            />
                                        }
                                        required={!!this.validators.job_customer_guid?.required}
                                        errorText={formErrors['job_customer_guid'] && 'Customer ' + formErrors['job_customer_guid']}
                                    />
                                }
                                <FormControlLabel
                                    dirty={unSavedChanges && unSavedChanges['job_destination_contact_name']}
                                    rules={defaultRules}
                                    key={'job_destination_contact_name'}
                                    label={'Tên khách hàng'}
                                    control={
                                        <Input
                                            autoFocus
                                            placeholder={'Ashok Kumar'}
                                            name={'job_destination_contact_name'}
                                            value={formData['job_destination_contact_name'] || ''}
                                            disabled={!editable}
                                            onBlur={(e) => this.handleFieldValidation('job_destination_contact_name', e.target.value)}
                                            onChange={(e) => this.handleValueChange('job_destination_contact_name', e)}
                                        />
                                    }
                                    required={!!this.validators.job_destination_contact_name?.required}
                                    errorText={formErrors['job_destination_contact_name']}
                                />
                                <FormControlLabel
                                    dirty={unSavedChanges && unSavedChanges['job_destination_contact_no']}
                                    rules={defaultRules}
                                    key={'job_destination_contact_no'}
                                    label={'Số điện thoại'}
                                    control={
                                        <InputGroup>
                                            {/* <InputPrepend>+91</InputPrepend> */}
                                            <Input
                                                placeholder={'0000000000'}
                                                name={'job_destination_contact_no'}
                                                value={formData['job_destination_contact_no'] || ''}
                                                disabled={!editable}
                                                onBlur={(e) => this.handleFieldValidation('job_destination_contact_no', e.target.value)}
                                                onChange={(val) => this.handleValueChange('job_destination_contact_no', val)}
                                            />
                                        </InputGroup>
                                    }
                                    required={!!this.validators.job_destination_contact_no?.required}
                                    errorText={formErrors['job_destination_contact_no']}
                                />
                            </FormGroup>
                        </Section>
                        <Section header={'Thông tin công việc'}>
                            <FormGroup>
                                {
                                    (editable || formData['job_before']) &&
                                    <FormControlLabel
                                        rules={defaultRules}
                                        dirty={unSavedChanges && unSavedChanges['job_before']}
                                        key={'job_before'}
                                        label={'Công việc trước'}
                                        control={
                                            <AdvanceSelect
                                                value={formData['job_before'] || ''}
                                                options={this.jobStore.jobBefore}
                                                placeholder={'Chọn một công việc...'}
                                                disabled={!editable}
                                                hasSearch
                                                searchMode={'remote'}
                                                onRemoteFetch={this.handleJobBeforeTextChangeDebounced}
                                                onChange={(val) => this.handleSelectChange('job_before', val)}
                                                clearable
                                                onClear={() => this.handleValueChange('job_before', null)}
                                            />
                                        }
                                        required={!!this.validators.job_before?.required}
                                        errorText={formErrors['job_before']}
                                    />
                                }
                                <FormControlLabel
                                    dirty={unSavedChanges && unSavedChanges['Title']}
                                    rules={defaultRules}
                                    key={'Title'}
                                    label={'Tên công việc'}
                                    control={
                                        <Input
                                            placeholder={'Nhập tên công việc'}
                                            name={'Title'}
                                            value={formData['Title']}
                                            onBlur={(e) => this.handleFieldValidation('Title', e.target.value)}
                                            onChange={(val) => this.handleValueChange('Title', val)}
                                            disabled={!editable}
                                        />
                                    }
                                    required={!!this.validators.Title?.required}
                                    errorText={formErrors['Title']}
                                />
                                <FormControlLabel
                                    dirty={unSavedChanges && unSavedChanges['job_type_id']}
                                    rules={defaultRules}
                                    key={'job_type_id'}
                                    label={'Loại công việc'}
                                    control={
                                        <AdvanceSelect
                                            value={formData['job_type_id'] || ''}
                                            options={this.jobTypeOptions}
                                            placeholder={'Chọn loại công việc...'}
                                            disabled={!editable}
                                            hasSearch
                                            onChange={(val) => this.handleSelectChange('job_type_id', val)}
                                            clearable
                                            onClear={() => this.handleValueChange('job_type_id', null)}
                                        />
                                    }
                                    required={!!this.validators.job_type_id?.required}
                                    errorText={formErrors['job_type_id']}
                                />
                                <FormControlLabel
                                    rules={defaultRules}
                                    dirty={unSavedChanges && unSavedChanges['job_assignee_guid']}
                                    label={'Phân công cho'}
                                    key={'job_assignee_guid'}
                                    control={
                                        <AdvanceSelect
                                            value={formData['job_assignee_guid'] || ''}
                                            options={assignableEmployees || []}
                                            placeholder={'Chọn một nhân viên để phân công'}
                                            disabled={!editable || !formData['job_type_id']}
                                            onChange={(val) => this.handleSelectChange('job_assignee_guid', val)}

                                            hasSearch
                                            searchMode={'remote'}
                                            onRemoteFetch={this.handleJobAssigneeTextChangeDebounced}

                                            clearable
                                            onClear={() => this.handleValueChange('job_assignee_guid', null)}
                                        />
                                    }
                                    required={!!this.validators.job_assignee_guid?.required}
                                    errorText={formErrors['job_assignee_guid']}
                                />
                                <FormControlLabel
                                    rules={defaultRules}
                                    dirty={unSavedChanges && unSavedChanges['job_note']}
                                    key={'job_note'}
                                    label={'Ghi chú'}
                                    control={
                                        <Input
                                            placeholder={'Ghi chú công việc'}
                                            name={'job_note'}
                                            value={formData['job_note']}
                                            disabled={formData['job_status_id'] === JOB_STATUS.done || formData['job_status_id'] === JOB_STATUS.cancel}
                                            onChange={(val) => this.handleValueChange('job_note', val)}
                                        />
                                    }
                                    required={!!this.validators.job_note?.required}
                                    errorText={formErrors['job_note']}
                                />
                            </FormGroup>
                        </Section>
                        {
                            properties && properties.length > 0 &&
                            <Section header={'Thông tin khác'}>
                                <FormGroup>
                                    {properties.map((prop) => this.renderDynamicField(prop, formData[prop.ColumnName]))}
                                </FormGroup>
                            </Section>
                        }
                        <Section header={'Địa điểm làm việc'}>
                            <FormGroup>
                                <AdministrativeFormControl
                                    data={formData}
                                    isReadOnly={!editable}
                                    dirtyFields={unSavedChanges}
                                    onChange={this.handleSelectChange}
                                    inputNames={
                                        {
                                            state: 'job_destination_address_state',
                                            district: 'job_destination_address_district',
                                            tehsil: 'job_destination_address_tehsil',
                                            location: 'job_destination_location',
                                            street: 'job_destination_address_street',
                                            pincode: 'job_destination_address_pincode',
                                            village: 'job_destination_address_village',
                                        }
                                    }
                                    validators = {this.validationHelper.mergeErrorTextsToValidators(formErrors, this.validators)}
                                    store={this.jobStore}
                                />
                            </FormGroup>
                        </Section>
                        <PopupFooter>
                            <Button
                                icon={'save'}
                                iconType={'solid'}
                                color={'primary-color'}
                                text={formAction === 'create' ? 'Tạo' : 'Cập nhật'}
                                onClick={this.handleSubmit}
                                disabled={formDisabled}
                                isLoading={loading}
                                tooltip={strTooltip}
                            />
                        </PopupFooter>
                    </Popup>
                }
            </>
        );
    }
}


JobForm = inject('appStore', 'fieldForceStore')(observer(JobForm));
JobForm = withModal(withI18n(withRouter(JobForm)));
export default JobForm;

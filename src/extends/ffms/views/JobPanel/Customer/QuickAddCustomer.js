import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import {
    Popup, PopupFooter, Section, DateTimePicker,
    InputGroup, AdvanceSelect,
    withI18n, Button, Input, FormControlLabel, FormGroup, withModal, HD6,
} from '@vbd/vui';
import DynamicFormField from 'extends/ffms/pages/base/Form/DynamicFormField';

import { ValidationHelper } from 'helper/validation.helper';
import { RouterParamsHelper } from 'helper/router.helper';

import GeocodeService from 'extends/ffms/services/GeocodeService';
import AdministrativeFormControl from 'extends/ffms/views/JobPanel/Administrative/AdministrativeFormControl';

class QuickAddCustomer extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    jobStore = this.props.fieldForceStore.jobStore;
    customerStore = this.props.fieldForceStore.customerStore;
    comSvc = this.props.fieldForceStore.comSvc;
    geocodeSvc = new GeocodeService();
    validationHelper = new ValidationHelper({ t: this.props.t });

    state = {
        formOptions: {},
        formErrors: {},
        formData: this.props.formData ?? {},
        formValid: false,
        formAction: 'create',
        includeSecondaryAddress: false,
        loading: false,

        isDirty: false,
        unSavedChanges: {},
        customerTypes: [],
        errorSummary: {},
    };

    defaultValidators = {
        'customer_contact_no': {
            required: true,
            pattern: ValidationHelper.numberOnlyPattern,
        },
        'customer_fullname': {
            required: true,
            // pattern: ValidationHelper.fullNamePattern,
        },
        'customer_type_id': {
            required: true,
        },
        'customer_address_state': {
            required: true,
        },
        'customer_address_district': {
            required: true,
        },
        'location': {
            required: true,
        },
    };

    vdmsValidator = this.validationHelper.mappingValidators(this.props.properties)

    validators ={ ...this.defaultValidators,... this.vdmsValidator }

    componentDidMount = async () =>
    {
        this.customerStore.appStore = this.props.appStore;

        const { formData, formAction } = this.props;

        this.bindFormOptions();

        const validation = await this.validateForm(formAction, formData);
        this.setState({
            formAction: formAction,
            formValid: validation.formValid,
            formErrors: formAction === 'create' ? {} : validation.formErrors,
        });
    }

    bindFormOptions = async () =>
    {
        const props = [];
        const excludingProps = ['customer_address_state', 'customer_address_district', 'customer_address_tehsil'];
        let properties = this.props.properites;
        if (!properties)
        {
            properties = await this.customerStore.comSvc.getLayerProperties(this.customerStore.LAYER_NAME);
        }
        for (let index = 0; index < properties.length; index++)
        {
            const prop = properties[index];
            const config = prop.Config ? (typeof (prop.Config) === 'string' ? JSON.parse(prop.Config) : prop.Config) : { custom: { isID: false, isSystem: false } };
            
            if (prop.IsRequire)
            {
                if (!(config.custom?.isId || config.custom?.isAutoId))
                {
                    this.validators[prop.ColumnName] = { ... this.validators[prop.ColumnName], required: true };
                }
            }

            if (prop.DataType === 10 && !excludingProps.includes(prop.ColumnName))
            {
                props.push(prop);
            }

            if (config && config.custom && config.custom.isSystem)
            {
                prop.IsSystem = true;
            }
        }
        const formOptions = {};
        await Promise.all(
            props.map((prop) => this.comSvc.getLayerListOptions('CUSTOMER', prop.ColumnName, prop.Config).then((result) =>
            {
                formOptions[prop.ColumnName] = result ?? [];
                return result;
            })),
        );
        const dynamicProps = properties.filter((p) => p.ColumnName && !p.IsSystem);

        this.setState({
            dynamicProps,
            formOptions: formOptions,
        });
    }
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
        this.customerStore.setCustomerFormState(false);
        
        if (this.props.isRoot)
        {
            RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, { mode: '', select: '' });
        }
    };

    markDirty = (silent) =>
    {
        let isDirty = false;
        let baseData = this.props.formData;
        let compareData = this.state.formData;
        const formAction = this.state.formAction;
        if (formAction === 'create')
        {
            baseData = this.state.formData;
            compareData = this.props.formData || {};
        }

        const unSavedChanges = {};
        Object.keys(baseData).forEach((key) =>
        {
            let value1 = baseData[key];
            let value2 = compareData[key];

            // special fields
            const fields = ['customer_address_state', 'customer_address_district', 'customer_address_tehsil'];
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

    handleSubmit = async () =>
    {
        const { formData, formAction, formValid, loading } = this.state;
        if (loading || !formValid)
        {
            return;
        }

        this.setState({ loading: true });

        const validation = await this.validateForm(formAction, formData);

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
            this.customerStore.edit(
                formData.customer_guid,
                formData,
            ).then(this.handleAfterChangeData);
        }
        else
        {
            this.customerStore.add(formData).then(this.handleAfterChangeData);
        }

        if (!this.props.onSubmit)
        {
            this.setState({ loading: false });
        }
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
                });
                this.props.toast({ type: 'error', message: errMsg });
            }
            else
            {
                try
                {
                    const errorFields = typeof result.errorMessage === 'string' ? JSON.parse(result.errorMessage) : result.errorMessage;
                    const _formError = this.state.formErrors;

                    errorFields.forEach((err) =>
                    {
                        Object.keys(err).forEach((field) =>
                        {
                            _formError[field] = err[field];
                        });
                    });
                    this.setState({
                        formErrors: _formError,
                        formValid: false,
                    });
                    this.props.toast({ type: 'error', message: errMsg });
                }
                catch (error)
                {
                    this.props.toast({ type: 'error', message: Array.isArray(result.errorMessage) ? JSON.stringify(result.errorMessage) : result.errorMessage });
                }
            }
        }
        else
        {
            if (this.props.onSubmit)
            {
                this.props.onSubmit(result);
                this.setState({ loading: false });
            }
            this.closeMe();
        }
    };

    validateForm = async (formAction, data, excludeFields) =>
    {
        let formValid = true;
        const formData = data ? data : this.state.formData;
        const formErrors = {};

        for (const field in this.validators)
        {
            if (!excludeFields || !excludeFields.includes(field))
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

    validateField = async (field, value, formAction) =>
    {
        let errorMessage = '';

        const validation = this.validationHelper.validateField(this.validators, field, value);
        errorMessage = validation.errors.length ? validation.errors.join('\r\n') : '';
        let isValid = !!validation?.isValid;

        if (field === 'customer_contact_no')
        {
            const existed = await this.customerStore.customerSvc.checkPhoneExist(value, formAction === 'create' ? null : [this.state.formData['customer_guid']]);
            if (existed)
            {
                errorMessage = 'Số điện thoại này đã tồn tại';
                console.log(field, value, formAction);
                isValid = false;
            }
        }
        
        return { errorMessage, isValid };
    };

    handleFieldValidation = async (field, value) =>
    {
        let errorSummary = this.state.errorSummary;
        const { formErrors, formAction, formData } = this.state;
        
        let formValid = this.state.formValid;
        const validation = await this.validateField(field, value, formAction);

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
            errorSummary,
        });
    }

    handleFieldValidationDebounced = AwesomeDebouncePromise(this.handleFieldValidation.bind(this), 300);

    handleValueChange = async (name, value, data) =>
    {
        const formData = await this.changeAttr(name, value, data);

        this.handleFieldValidationDebounced(name, formData[name]);

        this.markDirty(false);
    };

     handleSelectChange = async (name, value, data) =>
     {
         const formData = await this.changeAttr(name, value, data);

         this.handleFieldValidation(name, formData[name]);

         this.markDirty(false);
     };

    changeAttr = async (attr, value) =>
    {
        const { formData } = this.state;
        formData[attr] = value;

        if (attr === 'location')
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
                    const { State, District, PinCode, Tehsil } = geocodeResult.data[0];

                    await this.customerStore.bindRegionOptions('Title', State, District);
                    const result = this.customerStore.getAdministrativeIds(State, District, Tehsil);

                    formData['customer_address_state'] = result.state;
                    formData['customer_address_district'] = result.district;
                    formData['customer_address_tehsil'] = result.tehsil;
                    formData['customer_address_pincode'] = PinCode;
                }
            }
        }

        this.setState({
            formData,
        });
        return formData;
    };

    onIncludeSecondaryAddress = (e) =>
    {
        this.setState({
            includeSecondaryAddress: !this.state.includeSecondaryAddress,
        });
    }

    renderDynamicField = (prop, value) =>
    {
        const { formOptions, formErrors, formAction } = this.state;
        const { ColumnName, DisplayName } = prop;
        const defaultRules = [{}];

        return (
            <DynamicFormField
                property={prop}
                label={DisplayName}
                className={'form-control'}
                name={ColumnName}
                rules={defaultRules}
                value={value}
                readOnly={formAction === 'create' ? false : prop.IsReadOnly}
                options={formOptions[ColumnName]}
                errorText={formErrors[`${ColumnName}`]}
                required={this.validators[ColumnName]?.required}
                onChange={(value) => this.handleValueChange(ColumnName, value)}
                onBlur={(e) => this.handleValueChange(ColumnName, e.target.value)}
            />
        );
    }

    render()
    {
        const defaultRules = [{}];
        const { formAction, formData, unSavedChanges , formOptions, dynamicProps, formErrors } = this.state;

        const formDisabled = this.state.loading || !this.state.formValid;
        const strTooltip = Object.keys(this.state.errorSummary).map((key, index) => `${key.replace('customer_','').replace(/_/g,' ')}: ${this.props.t(this.state.errorSummary[key])}`).join('\r\n');
        return (
            <Popup
                title={formAction === 'create' ? 'Tạo khách hàng mới' : 'Thay đổi thông tin khách hàng'}
                width={'60vw'}
                height={'80vh'}
                escape={false}
                onBeforeClose={this.handleBeforeClose}
                onClose={this.closeMe}
            >
                <Section header={'Thông tin cơ bản'}>
                    <FormGroup>
                        <FormControlLabel
                            key={'customer_fullname'}
                            rules={defaultRules}
                            dirty={unSavedChanges && unSavedChanges['customer_fullname']}
                            label={'Tên khách hàng'}
                            control={(
                                <Input
                                    className={formErrors.customer_fullname?.length > 0 ? 'invalid-field' : ''}
                                    placeholder={'Ashok Kumar'}
                                    name={'customer_fullname'}
                                    value={formData['customer_fullname']}
                                    autoFocus
                                    onBlur={(e) => this.handleFieldValidation('customer_fullname', e.target.value)}
                                    onChange={(e) => this.handleValueChange('customer_fullname', e)}
                                />
                            )}
                            required={!!this.validators.customer_fullname?.required}
                            errorText={formErrors['customer_fullname']}
                        />
                        <FormControlLabel
                            key={'customer_dob'}
                            rules={defaultRules}
                            dirty={unSavedChanges && unSavedChanges['customer_dob']}
                            label={'Ngày sinh'}
                            control={(
                                <DateTimePicker
                                    placeholder={'Chọn ngày sinh'}
                                    className={formErrors.customer_dob?.length > 0 ? 'invalid-field' : ''}
                                    name={'customer_dob'}
                                    value={formData['customer_dob']}
                                    maxDate={moment()}
                                    onBlur={(e) => this.handleFieldValidation('customer_dob', e.target.value)}
                                    onChange={(e) => this.handleValueChange('customer_dob', e)}
                                />
                            )}
                            required={!!this.validators.customer_dob?.required}
                            errorText={formErrors['customer_dob']}
                        />
                        <FormControlLabel
                            key={'customer_contact_no'}
                            rules={defaultRules}
                            dirty={unSavedChanges && unSavedChanges['customer_contact_no']}
                            label={'Số liên lạc'}
                            control={(
                                <InputGroup>
                                    {/* <InputPrepend>+91</InputPrepend> */}
                                    <Input
                                        className={formErrors.customer_contact_no?.length > 0 ? 'invalid-field' : ''}
                                        placeholder={'000000000'}
                                        name={'customer_contact_no'}
                                        value={formData['customer_contact_no']}
                                        onBlur={(e) => this.handleFieldValidation('customer_contact_no', e.target.value)}
                                        onChange={(val) => this.handleValueChange('customer_contact_no', val)}
                                    />
                                </InputGroup>
                            )}
                            required={!!this.validators.customer_contact_no?.required}
                            errorText={formErrors['customer_contact_no']}
                        />
                        <FormControlLabel
                            key={'customer_type_id'}
                            rules={defaultRules}
                            dirty={unSavedChanges && unSavedChanges['customer_type_id']}
                            label={'Loại khách hàng'}
                            control={(
                                <AdvanceSelect
                                    value={formData['customer_type_id']}
                                    options={formOptions?.hasOwnProperty('customer_type_id') ? formOptions['customer_type_id'] : []}
                                    placeholder={'Chọn kiểu khách hàng...'}
                                    clearable
                                    onChange={(e) => this.handleSelectChange('customer_type_id', e)}
                                    onClear={() => this.handleValueChange('customer_type_id', null)}
                                />
                            )}
                            required={!!this.validators.customer_type_id?.required}
                            errorText={formErrors['customer_type_id']}
                        />
                    </FormGroup>
                </Section>

                {
                    dynamicProps && dynamicProps.length > 0 && (
                        <Section header={'Thông tin khác'}>
                            <FormGroup>
                                {dynamicProps.map((prop) => this.renderDynamicField(prop, formData[prop.ColumnName]))}
                            </FormGroup>
                        </Section>
                    )}


                <Section header={'Địa điểm khách hàng'}>
                    <FormGroup>
                        <AdministrativeFormControl
                            data={formData}
                            dirtyFields={unSavedChanges}
                            inputNames={
                                {
                                    state: 'customer_address_state',
                                    district: 'customer_address_district',
                                    tehsil: 'customer_address_tehsil',
                                    location: 'location',
                                    street: 'customer_address_street',
                                    pincode: 'customer_address_pincode',
                                    village: 'customer_address_village',
                                }
                            }
                            validators = {this.validationHelper.mergeErrorTextsToValidators(formErrors, this.validators)}
                            store={this.customerStore}
                                   
                            onChange={(name, value) =>
                            {
                                this.handleSelectChange(name, value);
                            }}
                        />
                    </FormGroup>
                </Section>

                <PopupFooter>
                    <Button
                        icon={'save'}
                        iconType={'solid'}
                        color={'primary-color'}
                        text={formAction === 'create' ? 'Tạo' : 'Cập nhật'}
                        disabled={formDisabled}
                        tooltip={strTooltip}
                        isLoading={this.state.loading}
                        onClick={this.handleSubmit}
                    />
                </PopupFooter>
            </Popup>
        );
    }
}
QuickAddCustomer.propTypes = {
    onSubmit: PropTypes.func,
    formData: PropTypes.object,
    formAction: PropTypes.string,
    isRoot: PropTypes.bool,
    properties: PropTypes.array,
};

QuickAddCustomer.defaultProps = {
    formAction: 'create',
    isRoot: true,
    properties: [],
};

QuickAddCustomer = inject('appStore', 'fieldForceStore')(observer(QuickAddCustomer));
QuickAddCustomer = withI18n(withModal(withRouter(QuickAddCustomer)));
export default QuickAddCustomer;

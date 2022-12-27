import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { PropTypes } from 'prop-types';

import {
    Popup, PopupFooter, FormGroup, Button,
    withI18n, withTenant, withModal,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import { RouterParamsHelper } from 'helper/router.helper';
import { ValidationHelper } from 'helper/validation.helper';

import DynamicFormField from 'extends/ffms/pages/base/Form/DynamicFormField';

export class LayerFormAction extends Component
{
    managerLayerStore = this.props.fieldForceStore.managerLayerStore;

    comSvc = this.props.fieldForceStore.comSvc;
    validationHelper = new ValidationHelper({ t: this.props.t });

    state = {
        checked: false,
        formAction: 'create',
        loading: false,
        formOptions: {},
        formData: {},
        formErrors: {},
        formValid: false,
        validators: {},
        idField: null,
    };

    validators = this.validationHelper.mappingValidators(this.props.properties);

    async componentDidMount()
    {
        const { formData, formAction, properties, layerName } = this.props;
        const validation = this.validateForm(formData);

        this.setState({
            formData: { ...formData } ?? {},
            formErrors: formAction === 'create' ? {} : validation.formErrors,
            formAction,
        });
        if (properties && properties.length)
        {
            let idField = 'Id';
            properties.forEach((prop) =>
            {
                if (prop.ColumnName === 'Title')
                {
                    prop.IsRequire = true;
                }
                if (prop.IsRequire)
                {
                    this.validators[prop.ColumnName] = { required: true };
                }
                if (prop.DataType === 10)
                {
                    this.comSvc.getLayerListOptions(layerName, prop.ColumnName, prop.Config).then((result) =>
                    {
                        const formOptions = this.state.formOptions;
                        formOptions[prop.ColumnName] = result ?? [];
                        this.setState({ formOptions: formOptions });
                    });
                }

                let config = prop.Config ? prop.Config : { custom: { isID: false, isSystem: false } };
                if (typeof (config) === 'string')
                {
                    config = JSON.parse(prop.Config);
                }

                if (config.custom && (config.custom.isId || config.custom.isAutoId))
                {
                    idField = prop.ColumnName;
                }
            });

            if (idField)
            {
                properties.forEach(function(item,i)
                {
                    if (item.ColumnName === idField)
                    {
                        properties.splice(i, 1);
                        properties.unshift(item);
                    }
                });

                this.setState({
                    idField,
                    properties,
                });
            }
        }
    }

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
        const { formErrors } = this.state;

        let formValid = this.state.formValid;
        const validation = this.validateField(field, value);

        // this field is INVALID => form is NOT valid, set errorMessage for this field
        // this field is VALID => validate form again to make sure this form is VALID also or not. It works incase this field is the last invalid field
        if (!validation.isValid)
        {
            formValid = false;
            formErrors[field] = validation.errorMessage;
        }
        else
        {
            delete formErrors[field];

            const vForm = this.validateForm();
            formValid = vForm.formValid;
            if (!formValid)
            {
                formErrors[field] = vForm.formErrors[field];
            }
        }

        formValid = formValid && Object.keys(formErrors).map((err) => formErrors[err]).join('').length === 0;

        this.setState({
            formErrors: formValid ? {} : formErrors,
            formValid: formValid,
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

    handleClose = () =>
    {
        RouterParamsHelper.setParams(this.managerLayerStore.urlParams, this.props, { mode: '', select: '' });
        this.managerLayerStore.setShowForm(false);
        this.props.onCloseForm(null);
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

        let result;
        if (this.props.onFormSubmit)
        {
            result = await this.props.onFormSubmit(formData);
        }
        else
        {
            if (formAction !== 'create' && formData.Id)
            {
                result = await this.comSvc.updateLayerData(this.props.layerName, formData[this.state.idField], formData);
            }
            else
            {
                result = await this.comSvc.addLayerData(this.props.layerName, formData);
            }
        }

        if (!result || result.errorMessage)
        {
            const errMsg = `${this.props.t('Có lỗi xảy ra, vui lòng thử lại sau.')}. ${result ? this.props.t(result.errorMessage) : ''}`;
            this.props.toast({ type: 'error', message: errMsg });
        }
        else
        {
            this.props.toast({ type: 'success', message: formAction === 'create' ? 'Đã tạo dữ liệu thành công' : 'Chỉnh sửa dữ liệu thành công' });

            if (this.props.onAfterFormSubmit)
            {
                this.props.onAfterFormSubmit(result, formAction);
            }
            else
            {
                this.handleClose();
            }
        }

        this.setState({ loading: false });
    };

    handleValueChange = (key, value) =>
    {
        this.changeAttr(key, value);

        this.handleFieldValidationDebounced(key, value);
    };

    handleRemoteValueChange = (key, searchKey) =>
    {
        const { layerName, properties } = this.props;
        const { formOptions } = this.state;

        const configDict = CommonHelper.toDictionary(properties, 'ColumnName', 'Config');

        this.comSvc.getLayerListOptions(layerName, key, configDict[key], searchKey).then((result) =>
        {
            formOptions[key] = result ?? [];
            this.setState({ formOptions: formOptions });
        });
    }

    changeAttr = async (key, value) =>
    {
        const { formData } = this.state;

        formData[key] = value;

        this.setState({
            formData,
        });
    };

    renderDynamicField = (prop, value, autoFocus) =>
    {
        const { formOptions, formErrors, formAction, idField } = this.state;
        const { ColumnName, DisplayName } = prop;

        // let isReadOnly = formAction === 'create' && this.props.layerName === 'JOB_TYPE' ? false : prop.IsReadOnly;
        let isReadOnly = prop.IsReadOnly;

        if (prop.ColumnName === idField)
        {
            if (formAction === 'create')
            {
                return null;
            }

            isReadOnly = true;
        }

        return (
            prop.IsView
                ? (
                        <DynamicFormField
                            key={prop.ColumnName}
                            property={prop}
                            label={DisplayName}
                            labelWidth={'100px'}
                            className={'form-control'}
                            name={ColumnName}
                            value={value}
                            readOnly={isReadOnly}
                            options={formOptions[ColumnName]}
                            autoFocus={autoFocus}
                            rules={[{}]}
                            errorText={formErrors[`${ColumnName}`]}
                            required={this.validators[ColumnName]?.required}
                            onChange={(value) => this.handleValueChange(ColumnName, value)}
                            onRemoteChange={(value) => this.handleRemoteValueChange(ColumnName, value)}
                            onBlur={(e) => this.handleFieldValidation(ColumnName, e.target.value)}
                        />
                    )
                : undefined
        );
    }

    updateTitle = () =>
    {
        const { formData } = this.props;
        let fieldName = '';
        if (formData)
        {
            fieldName = formData['Title'] || formData['Id'];
        }
        return this.props.t(fieldName ? 'Chỉnh sửa %0%' : 'Chỉnh sửa', [fieldName]);
    };

    render()
    {
        const { isShow } = this.managerLayerStore;
        const { formData, loading, formValid, formAction, properties, idField } = this.state;
        const formDisabled = loading || !formValid;
        let firstIdx = 0;
        return (
            <>
                {
                    isShow && (
                        <Popup
                            title={formAction === 'create' ? this.props.t('Tạo dữ liệu cho lớp %0%', [this.props.layerCaption || this.props.layerName]) : this.updateTitle()}
                            width={'50rem'}
                            escape={false}
                            onClose={this.handleClose}
                        >
                            <FormGroup>
                                {
                                    properties && properties.map((prop, index) =>
                                    {
                                        if (index === firstIdx && prop.ColumnName === idField)
                                        {
                                            firstIdx += 1;
                                        }
                                        return this.renderDynamicField(prop, formData[prop.ColumnName], index === firstIdx);
                                    })
                                }
                            </FormGroup>
                            <PopupFooter>
                                <Button
                                    icon={'save'}
                                    iconType={'solid'}
                                    color={'primary-color'}
                                    text={formAction === 'create' ? 'Tạo' : 'Cập nhật'}
                                    disabled={formDisabled}
                                    isLoading={loading}
                                    onClick={this.handleSubmit}
                                />
                            </PopupFooter>
                        </Popup>
                    )}
            </>
        );
    }
}

LayerFormAction.propTypes = {
    layerName: PropTypes.string,
    properties: PropTypes.array,
    formData: PropTypes.object,
    formAction: PropTypes.string,
    layerCaption: PropTypes.string,

    onCloseForm: PropTypes.func,
    onFormSubmit: PropTypes.func, // dùng khi muốn tự xử lý khi nhấn submit, không truyền thì xử lý như hiện tại
    onAfterFormSubmit: PropTypes.func,
};

LayerFormAction = inject('appStore', 'fieldForceStore')(observer(LayerFormAction));
LayerFormAction = withTenant(withModal(withI18n(withRouter(LayerFormAction))));
export default LayerFormAction;

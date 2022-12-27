import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { withI18n, Popup, PanelBody, Row, FormControlLabel, Button, Input, withModal, HD6 } from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ValidationHelper } from 'helper/validation.helper';

class RoleFormAction extends Component
{
    roleStore = this.props.fieldForceStore.roleStore;
    validationHelper = new ValidationHelper({ t: this.props.t })
    roleNameFormatGuide = 'Chỉ bao gồm ký tự chữ, số và dấu _ (không bao gồm khoảng trắng)';

    validators = {
        'Name': {
            required: true,
            minLength: 3,
            // pattern: /^[a-zA-Z0-9]([_](?![_])|[a-zA-Z0-9])+[a-zA-Z0-9]$/,
            // pattern: /^[a-zA-Z0-9_]$/,
            pattern: {
                value: ValidationHelper.nameIdPattern,
                message: this.roleNameFormatGuide,
            },
        },
    };
    state = {
        formData: {},
        formAction: 'create',
        loading: false,

        formError: {},
        formValid: false,

        isDirty: false,
        unSaved: {},
    };

    componentDidMount = async () =>
    {
        const { data, formAction } = this.props;

        this.setState({
            formData: data,
            originData: { ...data },
            formAction: formAction,

            formError: {},
            formValid: false,
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

    validateForm = async (data) =>
    {
        const formData = (data ? data : this.state.formData) || {};
        const formError = {};
        let formValid = true;

        if (formData)
        {
            for (const field in this.validators)
            {
                const value = formData[field];
                const validation = await this.validateField(field, value);
                if (!validation.isValid)
                {
                    formValid = false;
                }
                formError[field] = validation.errorMessage;
            }
        }
        return { formError, formValid };
    };

    validateField = async (field, value) =>
    {
        const validation = this.validationHelper.validateField(this.validators, field, value);

        let errorMessage = '';
        errorMessage = validation?.errors?.length ? validation.errors.join('\r\n') : '';
        let isValid = !!validation?.isValid;
        if (isValid)
        {
            if (field === 'Name' && value)
            {
                const existed = await this.roleStore.checkRoleExists(value);
                if (existed)
                {
                    isValid = false;
                    errorMessage = 'Tên vai trò này đã tồn tại';
                }
            }
        }

        return { errorMessage, isValid };
    }

    handleFieldValidation = async (field, value) =>
    {
        const { formError } = this.state;
        let formValid = true;

        const validation = await this.validateField(field, value);

        if (!validation.isValid)
        {
            formValid = false;
            formError[field] = validation.errorMessage;
        }
        else
        {
            delete formError[field];
            const vForm = await this.validateForm();
            formValid = vForm.formValid;
        }
        this.setState({
            formError: formValid ? {} : formError,
            formValid: formValid,
        });
    };

    handleFieldValidationDebounced = AwesomeDebouncePromise(this.handleFieldValidation.bind(this), 300);

    handleValueChange = async (key, value) =>
    {
        const { formData } = this.state;
        formData[key] = value;
        this.setState({
            formData,
        });

        this.handleFieldValidationDebounced(key, value);
        this.markDirty(false);
    };

    markDirty = (silent) =>
    {
        let isDirty = false;
        const unSaved = {};
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
                        unSaved[key] = {
                            previous: formAction === 'create' ? value2 : value1,
                            current: formAction === 'create' ? value1 : value2,
                        };
                    }
                }
            }
        });
        this.setState({ isDirty, unSaved });
    };

    handleSubmit = async () =>
    {
        const { formData, formAction, loading, formValid } = this.state;
        if (loading || !formValid && formAction === 'create')
        {
            return;
        }
        this.setState({ loading: true });

        let result;
        if (formAction !== 'create')
        {
            const data = {
                display_name: formData['Title'],
            };
            this.roleStore.edit(formData['Name'], data).then(this.handleAfterSubmit);
        }
        else
        {
            const data = {
                role_name: formData['Name'],
                display_name: formData['Title'],
            };
            this.roleStore.add(data).then(this.handleAfterSubmit);
        }
        this.setState({ loading: false });
    };

    handleAfterSubmit = (result) =>
    {
        // const { formAction } = this.state;
        if (result)
        {
            this.closeMe();
        }
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
        this.roleStore.setFormAction(false);
        RouterParamsHelper.setParams(this.roleStore.urlParams, this.props, { mode: '', select: '' });
    }

    render()
    {
        const { formData, formAction, formValid, unSaved , loading } = this.state;

        return (
            <Popup
                className={'role-manager-form'}
                width={'50rem'}
                padding={'2rem'}
                title={formAction === 'create' ? 'Thêm vai trò mới' : 'Thay đổi thông tin vai trò'}
                onBeforeClose={this.handleBeforeClose}
                onClose={this.closeMe}
                escape={false}
            >
                <PanelBody>
                    <FormControlLabel
                        required
                        dirty={unSaved && unSaved['Name']}
                        key={'Name'}
                        label={'Tên vai trò'}
                        control={
                            <Input
                                autoFocus
                                placeholder={'Nhập tên vai trò'}
                                name={'Name'}
                                value={formData['Name'] || ''}
                                disabled={this.roleStore.isEdit}
                                onChange={(val) => this.handleValueChange('Name', val)}
                                onBlur={async (e) => await this.handleFieldValidation('Name', e.target.value)}
                            />
                        }
                        rules={this.state.formError.Name || [{}]}
                        errorText={this.state.formError.Name}
                    />
                    <FormControlLabel
                        dirty={unSaved && unSaved['Title']}
                        key={'Title'}
                        label={'Mô tả vai trò'}
                        control={
                            <Input
                                placeholder={'Nhập mô tả vai trò'}
                                name={'Title'}
                                value={formData['Title'] || ''}
                                onChange={(val) => this.handleValueChange('Title', val)}
                                // onBlur={async (e) => await this.handleFieldValidation('Title', e.target.value)}
                            />
                        }
                        // rules={[{}]}
                        // errorText={this.state.formError.Title}
                    />
                    <Row
                        itemMargin={'md'}
                        mainAxisAlignment={'center'}
                    >
                        <Button
                            iconType={'solid'}
                            type={formAction === 'create' ? 'default' : 'primary'}
                            icon={formAction === 'create' ? '' : 'save'}
                            text={formAction === 'create' ? 'Tạo' : 'Cập nhật'}
                            onClick={this.handleSubmit}
                            disabled={formAction === 'create' ? !formValid : false}
                            isLoading={loading}
                        />
                    </Row>
                </PanelBody>
            </Popup>
        );
    }
}
RoleFormAction = inject('appStore', 'fieldForceStore')(observer(RoleFormAction));
RoleFormAction = withModal(withI18n(withRouter(RoleFormAction)));
export default RoleFormAction;

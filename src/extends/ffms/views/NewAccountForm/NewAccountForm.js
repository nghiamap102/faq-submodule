import './NewAccountForm.scss';

import React, { Component } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { PropTypes } from 'prop-types';

import {
    Expanded,
    EmptyButton, InputAppend, InputGroup,
    withI18n, T, Row, Button, Input, FormControlLabel, FormGroup,
} from '@vbd/vui';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

import { ValidationHelper } from 'helper/validation.helper';

export class NewAccountForm extends Component
{
    validationHelper = new ValidationHelper({ t: this.props.t });
    validators = {
        'username': {
            required: true,
            minLength: 4,
            // pattern: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
            pattern: /^[a-z0-9]([._](?![._])|[a-z0-9])+[a-z0-9]$/,
        },
        'email': {
            required: true,
            pattern: ValidationHelper.emailPattern,
        },
        'password': {
            required: true,
            minLength: 6,
            pattern: /^(?=.*\d)[a-zA-Z0-9!@#$%^&*]{6,}$/,
        },
        'confirmPassword': {
            required: true,
        },
    };

    emailFormatGuide = '';
    passwordFormatGuide = '';
    userNameFormatGuide = '';

    state = {
        formError: {},
        formValid: false,
        activeForm: false,
        isLoading: false,
    };

    componentDidMount = () =>
    {
        // this.validators.password.minLength
        this.emailFormatGuide = "Email hợp lệ chỉ có thể chứa: chữ cái latin, số, '@' và '.'";
        this.passwordFormatGuide = 'Chỉ các chữ cái (A-Z, a-z), chứa ít nhất một số, và các ký tự đặc biệt sau:!@#$%^&*. Tối thiểu 6 ký tự và phải chứa ít nhất 1 ký tự số.';
        this.userNameFormatGuide = 'Chỉ các chữ cái (A-z, a-z), số (0-9), dấu chấm câu (.) và ít nhất 4 ký tự trở lên.';

        this.setState({
            formError: {},
            formValid: false,
            formData: this.props.data || {},
        });

        this.validateForm().then((validation) =>
        {
            this.setState({
                formValid: validation.formValid,
            });
        });
    }

    handleCreateUser = async () =>
    {
        if (this.props.onSubmit)
        {
            this.setState({ isLoading: true });
            await this.props.onSubmit(this.state.formData);

            this.setState({ isLoading: false });

        }
    };

    handleCancelCreate = () =>
    {
        this.setState({ activeForm: false });
        this.props.onCancel && this.props.onCancel();
    }
    validateForm = async (data) =>
    {
        let formValid = true;
        const formData = (data ? data : this.state.formData) || {};
        const formErrors = {};

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

                formErrors[field] = validation.errorMessage;
            }
        }
        return { formErrors, formValid };
    };

    validateField = async (field, value) =>
    {
        const { password, confirmPassword } = this.state.formData || {};
        const cfmPwdCheck = field === 'confirmPassword';
        const pwdCheck = field === 'password';
        const pwd = password;
        const cfmPwd = confirmPassword;

        let errorMessage = '';

        const validation = this.validationHelper.validateField(this.validators, field, value);

        errorMessage = validation?.errors?.length ? validation.errors.join('\r\n') : '';
        let isValid = !!validation?.isValid;
        const controls = this.props.controls;

        if (isValid)
        {
            if ((cfmPwdCheck || pwdCheck) && (pwd && pwd !== cfmPwd))
            {
                isValid = false;
                if (cfmPwdCheck)
                {
                    errorMessage = 'Mật khẩu xác nhận không trùng khớp';
                }
                else if (cfmPwd)
                {
                    this.state.formError['confirmPassword'] = 'Mật khẩu xác nhận không trùng khớp';
                }
            }
            if (!(controls[field] && !controls[field].editable))
            {
                if (field === 'username' && value)
                {
                    const valid = await this.props.validateUserName(value);
                    if (!valid)
                    {
                        isValid = false;
                        errorMessage = 'Tên người dùng này đã tồn tại';
                    }
                }

                if (field === 'email' && value)
                {
                    const valid = await this.props.validateEmail(value);
                    if (!valid)
                    {
                        isValid = false;
                        errorMessage = 'Địa chỉ email này đã tồn tại';
                    }
                }
            }

        }

        return { errorMessage, isValid };
    };

    handleFieldValidation = async (field, value) =>
    {
        const { formError } = this.state;
        let formValid = true;

        const validation = await this.validateField(field, value);

        // this field is INVALID => form is NOT valid, set errorMessage for this field
        // this field is VALID => validate form again to make sure this form is VALID also or not. It works incase this field is the last invalid field
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

    handleValueChange = (field, value) =>
    {
        this.changeAttr(field, value);

        this.handleFieldValidationDebounced(field, value);
    };

    changeAttr = (field, value) =>
    {
        const formData = this.state.formData;
        formData[field] = value;
        this.setState({ formData });
    };

    render()
    {
        const formData = this.state.formData;
        return (
            <>
                <FormGroup className="form-group-container">
                    <FormControlLabel
                        label={'Tên người dùng'}
                        errorText={this.state.formError.username}
                        rules={[{}]}
                        control={(
                            <InputGroup
                                className={this.state.formError.username?.length ? 'invalid-field' : ''}
                            >
                                <Input
                                    placeholder={'Nhập người dùng'}
                                    disabled={this.props.controls && this.props.controls['username'] && !this.props.controls['username'].editable}
                                    name={'username'}
                                    value={formData ? formData.username : ''}
                                    autoFocus
                                    onChange={(value) => this.handleValueChange('username', value)}
                                    onBlur={async (e) => await this.handleFieldValidation('username', e.target.value)}
                                />
                                <InputAppend className={'input-tooltip'}>
                                    <PopperTooltip
                                        tooltip={<T params={[this.validators.username.minLength]}>{this.userNameFormatGuide}</T>}
                                        placement={'bottom'}
                                        trigger={['click', 'hover']}
                                    >?
                                    </PopperTooltip>
                                </InputAppend>
                            </InputGroup>
                        )}
                        required
                    />
                    <FormControlLabel
                        label={'Email'}
                        errorText={this.state.formError.email}
                        rules={[{}]}
                        control={(
                            <InputGroup
                                className={this.state.formError.email?.length ? 'invalid-field' : ''}
                            >
                                <Input
                                    placeholder={'Nhập địa chỉ hộp thư điện tử'}
                                    disabled={this.props.controls && this.props.controls['email'] && !this.props.controls['email'].editable}
                                    value={formData ? formData.email : ''}
                                    onChange={(value) => this.handleValueChange('email', value)}
                                    onBlur={async (e) => await this.handleFieldValidation('email', e.target.value)}
                                />
                                {/* <InputAppend className={'input-tooltip'}>
                                    <PopperTooltip
                                        tooltip={this.emailFormatGuide}
                                        placement={'bottom'}
                                        trigger={['click', 'hover']}
                                    >
                                                ?
                                    </PopperTooltip>
                                </InputAppend> */}
                            </InputGroup>
                        )}
                        required
                    />
                    <FormControlLabel
                        label={'Mật khẩu'}
                        errorText={this.state.formError.password}
                        rules={[{}]}
                        control={(
                            <InputGroup
                                className={this.state.formError.password?.length ? 'invalid-field' : ''}
                            >
                                <Input
                                    placeholder={'Nhập mật khẩu'}
                                    name={'password'}
                                    type={'password'}
                                    value={formData ? formData.password : ''}
                                    onChange={(value) => this.handleValueChange('password', value)}
                                    onBlur={async (e) => await this.handleFieldValidation('password', e.target.value)}
                                />
                                <InputAppend className={'input-tooltip'}>
                                    <PopperTooltip
                                        tooltip={
                                            <T params={[this.validators.password.minLength, this.list]}>{this.passwordFormatGuide}</T>
                                        }
                                        placement={'bottom'}
                                        trigger={['click', 'hover']}
                                    >
                                        ?
                                    </PopperTooltip>
                                </InputAppend>
                            </InputGroup>
                        )}
                        required
                    />
                    <FormControlLabel
                        label={'Xác nhận mật khẩu'}
                        errorText={this.state.formError.confirmPassword}
                        rules={[{}]}
                        control={(
                            <Input
                                placeholder={'Nhập lại mật khẩu'}
                                name={'confirmPassword'}
                                type={'password'}
                                value={formData ? formData.confirmPassword : ''}
                                onChange={(value) => this.handleValueChange('confirmPassword', value)}
                                onBlur={async (e) => await this.handleFieldValidation('confirmPassword', e.target.value)}
                            />
                        )}
                        required
                    />
                </FormGroup>
                <Row
                    itemMargin={'md'}
                >
                    <Expanded />
                    {/* <EmptyButton
                        text={'Hủy bỏ'}
                        onClick={this.handleCancelCreate}
                    /> */}
                    <Button
                        icon={'user-check'}
                        color={'success'}
                        text="Tạo tài khoản"
                        isLoading={this.state.isLoading}
                        disabled={!this.state.formValid}
                        onClick={async () =>
                        {
                            await this.handleCreateUser();
                        }}
                        // tooltip={!this.state.canCreate ? 'Bạn chưa được phân quyền thực hiện tác vụ này' : null}
                    />
                </Row>
            </>
        );
    }
}

NewAccountForm.propTypes = {
    data: PropTypes.shape({
        email: PropTypes.string,
        username: PropTypes.string,
        password: PropTypes.string,
        confirmPassword: PropTypes.string,
    }),
    validateEmail: PropTypes.func.isRequired,
    validateUserName: PropTypes.func.isRequired,
    controls: PropTypes.object,

    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};

NewAccountForm = withI18n(NewAccountForm);
export default NewAccountForm;

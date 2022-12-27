import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import moment from 'moment';

import {
    withI18n, T,
    InputAppend, InputGroup, withModal,
    withTenant, Row, Button, Input, FormControlLabel, FormGroup,
} from '@vbd/vui';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

import { ValidationHelper } from 'helper/validation.helper';

import UserService from 'extends/ffms/services/UserService';
import EmployeeService from 'extends/ffms/services/EmployeeService';
import EmailService from 'extends/ffms/services/EmailService';
import { toastSendMailResult } from 'extends/ffms/services/utilities/helper';

class ChangePassword extends Component
{
    appStore = this.props.appStore;

    employeeService = new EmployeeService(this.appStore.contexts);
    emailSvc = new EmailService();
    userSvc = new UserService();

    validationHelper = new ValidationHelper({ t: this.props.t });
    pwGuide = '';
    validators = {
        'password': {
            required: true,
        },
        'new_password': {
            required: true,
            minLength: 6,
            pattern: /^(?=.*\d)[a-zA-Z0-9!@#$%^&*]{6,}$/,
        },
        'cfm_password': {
            required: true,
        },
    };

    state = {
        formError: {},
        formValid: false,
        userData: {},
    };

    componentDidMount = async () =>
    {
        this.pwGuide = 'Chỉ các chữ cái (A-Z, a-z), chứa ít nhất một số, và các ký tự đặc biệt sau:!@#$%^&*. Tối thiểu 6 ký tự và phải chứa ít nhất 1 ký tự số.';
        const data = this.appStore.profile || {};
        if (data.hasOwnProperty('password', 'new_password', 'cfm_password'))
        {
            data['password'] = '';
            data['new_password'] = '';
            data['cfm_password'] = '';
        }
            
        this.setState({
            formError: {},
            formValid: false,
            userData: data,
        });

        this.validateForm().then((validation) =>
        {
            this.setState({
                formValid: validation.formValid,
            });
        });

    }

    validateForm = async (data) =>
    {
        let formValid = true;
        const userData = (data ? data : this.state.userData) || {};
        const formErrors = {};

        if (userData)
        {
            for (const field in this.validators)
            {
                const value = userData[field];
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
        const { password, new_password, cfm_password, displayName } = this.state.userData || {};

        const opw = password;
        const npw = new_password;
        const npwCheck = field === 'new_password';
        const cfmNpw = cfm_password;
        const cfmNpwCheck = field === 'cfm_password';

        let errorMessage = '';
        const validation = this.validationHelper.validateField(this.validators, field, value);

        errorMessage = validation?.errors?.length ? validation.errors.join('\r\n') : '';
        let isValid = !!validation?.isValid;

        if (isValid)
        {
            if (npwCheck && npw === opw)
            {
                isValid = false;
                errorMessage = 'Mật khẩu mới trùng với mật khẩu cũ';
            }
            
            if ((npwCheck || cfmNpwCheck) && (npw && npw !== cfmNpw))
            {
                isValid = false;
                if (cfmNpwCheck)
                {
                    errorMessage = 'Mật khẩu mới xác nhận không trùng khớp';
                }
                else if (cfmNpw)
                {
                    this.state.formError['cfm_password'] = 'Mật khẩu mới xác nhận không trùng khớp';
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
    };

    changeAttr = (field, value) =>
    {
        const userData = this.state.userData;
        userData[field] = value;
        this.setState({ userData });
    };

    sendEmailPasswordChange = async () =>
    {
        const profile = this.props.appStore.profile;
        const employeeRs = await this.employeeService.search({ employee_email: profile.email });
        let employee = {};

        if (employeeRs?.data && employeeRs.data.length === 1)
        {
            employee = employeeRs.data[0];
        }

        const userName = employee.employee_username || profile.displayName;
        const template = 'PasswordChangeAnnounceEmail';

        const templateData = {
            'employee.employee_full_name': employee.employee_full_name || userName,
            'account.username': userName,
            'last updated password date time': `${moment().format('L')} ${moment().format('LTS')}`,
            
            'tenants.name': '',
            'tenants.domain': '',
        };

        this.emailSvc
            .sendEmail({ toAccount: userName, template, templateData })
            .then((res) => toastSendMailResult(res, this.props.toast));
    }

    handleUserChangePass = async (userObj)=>
    {
        const profile = this.props.appStore.profile;
        const valid = await this.userSvc.authorizePassword(profile?.displayName.split(' ')[0], userObj.password);
        if (valid === true)
        {
            await this.userSvc.changePassword({
                'OldPassword': userObj.password,
                'NewPassword': userObj.new_password,
            }).then(async (data) =>
            {
                if (data.status.code === 200)
                {
                    await this.sendEmailPasswordChange();

                    this.props.toast({
                        type: 'success',
                        message: 'Đổi mật khẩu thành công',
                    });
                    this.props.onClose(false);
                    this.appStore.logOut();

                    return data;
                }
                else
                {
                    return null;
                }
            });
        }
        else
        {
            this.setState({
                formError: { password: 'Mật khẩu cũ không đúng' },
            });
        }
    }

    render()
    {
        const { userData, formError } = this.state;
        return (
            <>
                <FormGroup>
                    <FormControlLabel
                        required
                        label={'Mật khẩu cũ'}
                        labelWidth={'100px'}
                        errorText={formError.password}
                        rules={[{}]}
                        control={
                            <InputGroup >
                                <Input
                                    placeholder={'Nhập mật khẩu cũ'}
                                    name={'password'}
                                    type={'password'}
                                    value={userData ? userData.password : ''}
                                    onChange={(value) => this.handleValueChange('password', value)}
                                />
                            </InputGroup>
                        }
                    />
                    <FormControlLabel
                        required
                        label={'Mật khẩu mới'}
                        labelWidth={'100px'}
                        errorText={formError.new_password}
                        rules={[{}]}
                        control={
                            <InputGroup >
                                <Input
                                    placeholder={'Nhập mật khẩu mới'}
                                    name={'new_password'}
                                    type={'password'}
                                    value={userData ? userData.new_password : ''}
                                    onChange={(value) =>
                                    {
                                        this.handleValueChange('new_password', value);
                                        this.handleFieldValidationDebounced('new_password', value);
                                    }
                                    }
                                    onBlur={async (e) => await this.handleFieldValidation('new_password', e.target.value)}
                                />
                                <InputAppend className={'input-tooltip'}>
                                    <PopperTooltip
                                        tooltip={
                                            <T params={[this.validators.new_password.minLength]}>{this.pwGuide}</T>
                                        }
                                        placement={'bottom'}
                                        trigger={['click', 'hover']}
                                    >
                                        ?
                                    </PopperTooltip>
                                </InputAppend>
                            </InputGroup>
                        }
                    />
                    <FormControlLabel
                        required
                        label={'Xác nhận mật khẩu mới'}
                        labelWidth={'100px'}
                        errorText={formError.cfm_password}
                        rules={[{}]}
                        control={
                            <InputGroup >
                                <Input
                                    placeholder={'Nhập lại mật khẩu mới'}
                                    name={'cfm_password'}
                                    type={'password'}
                                    value={userData ? userData.cfm_password : ''}
                                    onChange={(value) =>
                                    {
                                        this.handleValueChange('cfm_password', value);
                                        this.handleFieldValidationDebounced('cfm_password', value);
                                    }}
                                    onBlur={async (e) => await this.handleFieldValidation('cfm_password', e.target.value)}
                                />
                                <InputAppend className={'input-tooltip'}>
                                    <PopperTooltip
                                        tooltip={
                                            <T params={[this.validators.cfm_password.minLength]}>{this.pwGuide}</T>
                                        }
                                        placement={'bottom'}
                                        trigger={['click', 'hover']}
                                    >
                                        ?
                                    </PopperTooltip>
                                </InputAppend>
                            </InputGroup>
                        }
                    />
                </FormGroup>
                <Row
                    itemMargin={'md'}
                    mainAxisAlignment={'center'}
                >
                    <Button
                        text={'Hủy bỏ'}
                        onClick={()=>this.props.onClose(false)}
                    />
                    <Button
                        text={'Đổi mật khẩu'}
                        type={'success'}
                        disabled={!this.state.formValid}
                        onClick={()=>this.handleUserChangePass(userData)}
                    />
                </Row>
            </>
        );
    }
}

ChangePassword.propTypes = {
    profile: PropTypes.object,
    onClose: PropTypes.func,
};
export default withModal(withI18n(withTenant(inject('appStore', 'fieldForceStore')(observer(ChangePassword)))));

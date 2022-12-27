import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ValidationHelper } from 'helper/validation.helper';
import { isEmpty } from 'helper/data.helper';

import {
    Container, PanelBody, Row,
    EmptyButton, withI18n, withTenant, withModal,
    AdvanceSelect, Input, CheckBox, Button, FormControlLabel, FormGroup,
} from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

class PhotoForm extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    managerLayerStore = this.props.fieldForceStore.managerLayerStore;
    comSvc = this.props.fieldForceStore.comSvc;
    
    validationHelper = new ValidationHelper({ t: this.props.t });

    validators = {
        'Name': {
            required: true,
        },
        'type': {
            required: true,
        },
        'caption': {
            required: true,
        },
        'minQuantity': {
            required: true,
            minValue: 0,
        },
        'maxQuantity': {
            required: true,
            minValue: 0,
        },
    };

    state = {
        data: this.props.data || {},
        typeOptions: [],
        action: this.props.action || 'create',

        formError: {},
        formValid: false,

        baseData: {},
        unSavedChanges: {},
        isDirty: false,
    }

    static getDerivedStateFromProps(nextProps, prevState)
    {
        if (nextProps.action !== prevState.action)
        {
            return { action: nextProps.action };
        }

        return null;
    }

    componentDidMount()
    {
        const { data, action } = this.state;

        this.fieldForceStore.loadDataReferences('photo-types').then((dataRefs) =>
        {
            if (dataRefs)
            {
                const typeOptions = this.fieldForceStore.getDataReferenceOptions('photo-types', 'phototype_id','phototype_name') ?? [];
                this.setState({
                    typeOptions,
                });
            }
        });
        
        this.setState({
            data,
            baseData: { ...data },
            action,
            formError: {},
            formValid: false,
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
        const photoData = (data ? data : this.state.data) || {};
        const formError = {};

        if (photoData)
        {
            for (const field in this.validators)
            {
                const value = photoData[field];
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
        const { minQuantity, maxQuantity } = this.state.data || {};

        const min = minQuantity;
        const minCheck = field === 'minQuantity';

        const max = maxQuantity;
        const maxCheck = field === 'maxQuantity';

        let errorMessage = '';
        const validation = this.validationHelper.validateField(this.validators, field, value);
        errorMessage = validation?.errors?.length ? validation.errors.join('\r\n') : '';
        let isValid = !!validation?.isValid;

        if (isValid)
        {
            if ((minCheck && min > max) || (maxCheck && max < min))
            {
                isValid = false;
                errorMessage = 'Min phải nhỏ hơn hoặc bằng Max';
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

    handlePhotoItemChange = (key, value) =>
    {
        const { data } = this.state;
        data[key] = value;
        
        this.setState({
            data,
        });

        this.markDirty(false);
    };

    markDirty = (silent) =>
    {
        let isDirty = false;
        const unSavedChanges = {};
        const baseData = this.state.baseData;
        const compareData = this.state.data;

        const action = this.state.action;
        if (action === 'create')
        {
            isDirty = false;
        }

        Object.keys(baseData).forEach((key) =>
        {
            const value1 = baseData[key];
            const value2 = compareData[key];

            if (value1 || value2)
            {
                const sameValue = JSON.stringify({ value: value1 }) === JSON.stringify({ value: value2 });
                if (!sameValue)
                {
                    isDirty = true;
                    if (!silent)
                    {
                        unSavedChanges[key] = {
                            previous: action === 'create' ? value2 : value1,
                            current: action === 'create' ? value1 : value2,
                        };
                    }
                }
            }
        });

        this.setState({
            isDirty,
            unSavedChanges,
        }, ()=>
        {
            this.managerLayerStore.setIsDirty(this.state.isDirty);
        });
    };
    
    render()
    {
        const { data, typeOptions, action, isDirty, unSavedChanges } = this.state;

        return (
            <Container
                className={!isDirty ? 'photo-form' : 'photo-form mark-dirty'}
            >
                {
                    isDirty &&
                    <FAIcon
                        className={'icon-unsave'}
                        icon={'save'}
                        size={'0.85rem'}
                        color={'var(--primary)'}
                        type={'solid'}
                    />
                }
                <PanelBody>
                    <FormControlLabel
                        required
                        rules={[{}]}
                        key={'Name'}
                        label={' '}
                        labelWidth={'5px'}
                        className={'gallery-form-name'}
                        control={
                            <Input
                                autoFocus
                                className={'gallery-form-name-input'}
                                placeholder={'Nhập tên thư viện ảnh'}
                                name={'Name'}
                                value={data['Name'] || ''}
                                onChange={(value) =>
                                {
                                    this.handlePhotoItemChange('Name', value);
                                    this.handleFieldValidationDebounced('Name', value);
                                }}
                                onBlur={async (e) => await this.handleFieldValidation('Name', e.target.value)}
                            />
                        }
                        errorText={this.state.formError['Name']}
                    />
                    <FormGroup>
                        <Row>
                            <CheckBox
                                label="Bắt buộc"
                                checked={data['required'] || false}
                                onChange={(value) => this.handlePhotoItemChange('required', value)}
                            />
                            <CheckBox
                                label="Có thể chỉnh sửa"
                                checked={data['canEditInJob'] || false}
                                onChange={(value) => this.handlePhotoItemChange('canEditInJob', value)}
                            />
                        </Row>
                        <FormControlLabel
                            required
                            dirty={unSavedChanges && unSavedChanges['type']}
                            rules={[{}]}
                            key={'type'}
                            label={'Loại hình ảnh'}
                            control={
                                <AdvanceSelect
                                    value={data['type'] || ''}
                                    options={typeOptions}
                                    placeholder={'Chọn loại hình ảnh'}
                                    onChange={(value) =>
                                    {
                                        this.handlePhotoItemChange('type', value);
                                        this.handleFieldValidationDebounced('type', value);
                                    }}
                                    clearable
                                    onClear={() => this.handlePhotoItemChange('type', null)}
                                />
                            }
                            errorText={this.state.formError['type']}
                        />
                        <FormControlLabel
                            required
                            dirty={unSavedChanges && unSavedChanges['caption']}
                            rules={[{}]}
                            key={'caption'}
                            label={'Mô Tả'}
                            control={
                                <Input
                                    placeholder={'Nhập mô tả'}
                                    name={'caption'}
                                    value={data['caption'] || ''}
                                    onChange={(value) =>
                                    {
                                        this.handlePhotoItemChange('caption', value);
                                        this.handleFieldValidationDebounced('caption', value);
                                    }}
                                    onBlur={async (e) => await this.handleFieldValidation('caption', e.target.value)}
                                />
                            }
                            errorText={this.state.formError['caption']}
                        />
                        <FormControlLabel
                            required
                            dirty={unSavedChanges && unSavedChanges['minQuantity']}
                            rules={[{}]}
                            key={'minQuantity'}
                            label={'Nhỏ nhất'}
                            control={
                                <Input
                                    placeholder={'Nhập số lượng hình ảnh tối thiểu'}
                                    name={'minQuantity'}
                                    type={'number'}
                                    value={isEmpty(data['minQuantity']) ? 0 : data['minQuantity']}
                                    onChange={(value) =>
                                    {
                                        this.handlePhotoItemChange('minQuantity', value);
                                        this.handleFieldValidationDebounced('minQuantity', value);
                                    }}
                                    onBlur={async (e) => await this.handleFieldValidation('minQuantity', e.target.value)}
                                />
                            }
                            errorText={this.state.formError['minQuantity']}
                        />
                        <FormControlLabel
                            required
                            dirty={unSavedChanges && unSavedChanges['maxQuantity']}
                            rules={[{}]}
                            key={'maxQuantity'}
                            label={'Tối đa'}
                            control={
                                <Input
                                    placeholder={'Nhập số lượng hình ảnh tối đa'}
                                    name={'maxQuantity'}
                                    type={'number'}
                                    value={isEmpty(data['maxQuantity']) ? 0 : data['maxQuantity']}
                                    onChange={(value) =>
                                    {
                                        this.handlePhotoItemChange('maxQuantity', value);
                                        this.handleFieldValidationDebounced('maxQuantity', value);
                                    }}
                                    onBlur={async (e) => await this.handleFieldValidation('maxQuantity', e.target.value)}
                                />
                            }
                            errorText={this.state.formError['maxQuantity']}
                        />
                    </FormGroup>
                    <Row
                        mainAxisAlignment={'center'}
                        itemMargin={'sm'}
                    >
                        {
                            action === 'create' &&
                            <EmptyButton
                                text={'Huỷ'}
                                onClick={()=>this.props.onClose(true)}
                            />
                        }
                        <Button
                            type={action === 'create' ? 'primary' : 'success'}
                            text={action === 'create' ? 'Tạo mới' : 'Chỉnh sửa'}
                            disabled={!this.state.formValid}
                            onClick={() =>
                            {
                                this.props.onSubmit(data);
                                this.setState({ isDirty: false });
                            }}
                        />
                    </Row>
                </PanelBody>
            </Container>
                            
        );
    }
}

PhotoForm.propTypes = {
    data: PropTypes.object,
    header: PropTypes.any,
    content: PropTypes.any,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
};
PhotoForm.defaultProps = {
    onSubmit: ()=>
    {},
    onClose: ()=>
    {},
};

PhotoForm = inject('appStore', 'fieldForceStore')(observer(PhotoForm));
PhotoForm = withTenant(withModal(withI18n(withRouter(PhotoForm))));
export default PhotoForm;

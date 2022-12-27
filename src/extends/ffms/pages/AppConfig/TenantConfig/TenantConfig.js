import './TenantConfig.scss';
import React,{ useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { FormControlLabel, FormGroup, Input, PanelBody, PanelFooter, PanelHeader, Section, useModal, useTenant } from '@vbd/vui';

import ThemeList from './ThemeList';
import LanguageSelect from 'extends/ffms/components/LanguageSelect/LanguageSelect';
import { UploadImageControl } from 'extends/ffms/components/UploadFileControl/UploadImageControl';
import TenantService from 'extends/ffms/services/TenantService';
import useValidator from 'extends/ffms/pages/hooks/useValidate';
import { isEmpty } from 'helper/data.helper';
import { FileService } from 'extends/ffms/services/FileService';

import { CommonHelper } from 'helper/common.helper';
import { FileHelper } from 'helper/file.helper';

const tenantValidate = {
    title: { required: true },
    language: { required: true },
    favicon: { required: true },
    logo: { required: true },
    theme: { required: true },
};

const tenantObject = {
    title: '',
    subtitle: '',
    language: '',
    locale: '',
    country: '',
    favicon: '',
    logo: '',
    theme: '',
};

const getTenantData = (tenant) =>
{
    const data = {};
    Object.keys(tenantObject).forEach(key =>
    {
        data[key] = tenant[key];
    });

    return data;
};

const languageOptions = [
    { id: 'en, en-in', label: 'English (India)' },
    { id: 'vi, vi', label: 'Tiếng Việt' },
];


const TenantConfig = (props) =>
{
    const { appConfigStore } = props.fieldForceStore;

    const config = useTenant();
    const { toast } = useModal();
    const defaultRules = [{}];

    const fileService = new FileService();
    const tenantService = new TenantService();

    const [tenant, setTenant] = useState(getTenantData(config));
    const [imagesSrc, setImagesSrc] = useState({});

    const { validations, onValidateField, onValidateAllField } = useValidator(tenantValidate);
    useEffect(() =>
    {
        setImagesSrc(() => (
            {
                favicon: { url: getImageSrc('favicon', tenant.favicon) },
                logo: { url: getImageSrc('logo', tenant.logo) },
            }));
    }, []);

    const checkDirty = (tenant)=>
    {
        let isDirty = false;
        const hasImageChange = Object.keys(imagesSrc || {}).some(k => imagesSrc[k].isChange);
        const config = appConfigStore.tenantConfig;
        
        for (const key in tenant)
        {
            if (config.hasOwnProperty.call(config, key))
            {
                const defaultFieldString = JSON.stringify(config[key]);
                const updateFieldString = JSON.stringify(tenant[key]);
                if (defaultFieldString !== updateFieldString)
                {
                    isDirty = true;
                }
            }
        }

        return isDirty || hasImageChange;
    };

    const getImageSrc = (folder, name) =>
    {
        const src = name.startsWith('/') ? name : `/api/media/${folder}?name=${name}`;
        return src;
    };


    const resetImageChange = () =>
    {
        const src = CommonHelper.clone(imagesSrc);
        
        Object.keys(imagesSrc || {}).forEach(key =>
        {
            src[key].isChange = false;
        });

        setImagesSrc(src);
    };

    // get image source in data-cache then save vdms media
    // imagesSrc {logo: <ImageCache>, favicon: <ImageCache>}
    const uploadVdmsImage = async (imagesSrc) =>
    {
        let isSuccess = false;

        if (isEmpty(imagesSrc))
        {
            return isSuccess;
        }

        // [[<folder> : {name, type, url}],]
        const imageArray = Object.entries(imagesSrc);

        for (let index = 0; index < imageArray.length; index++)
        {
            const [folder, imageInfo] = imageArray[index];
            const { name, type, url } = imageInfo ;

            // convert file from url file object
            const imageFile = await FileHelper.urlToFile(url, name, type);
            if (imageFile)
            {
                const rs = await fileService.upload(imageFile, folder, name);
                rs.data.result === 0 && (isSuccess = true);
            }
        }

        return isSuccess;
    };
    
    const updateVdmsImage = async (imagesSrc) =>
    {
        let isSuccess = false;

        if (isEmpty(imagesSrc))
        {
            return isSuccess;
        }

        const imageArray = Object.entries(imagesSrc); // [[<folder> : {name, type, url}],]

        for (let index = 0; index < imageArray.length; index++)
        {
            const [folder, imageInfo] = imageArray[index];
            const { name, type, url } = imageInfo;

            if (url !== undefined && name !== undefined && type !== undefined)
            {
                // convert file from url file object
                const imageFile = await FileHelper.urlToFile(url, name, type);

                if (imageFile)
                {
                    const rs = await fileService.update(imageFile, folder, name);
                    rs.data.result === 0 && (isSuccess = true);
                }
            }
        }
        return isSuccess;
    };

    const handleValidate = (param) =>
    {
        for (const key in param)
        {
            onValidateField(key, param[key]);
        }
    };

    const handleFieldChange = (param, isReplace = false) =>
    {
        let updateConfig;
        
        if (isReplace)
        {
            updateConfig = param;
        }
        else
        {
            updateConfig = { ...tenant, ...param };

        }
        handleValidate(param);
        setTenant(updateConfig);
    };

    const handleLanguageChange = ({ locale, language })=>
    {
        handleFieldChange({ locale, language });
    };

    const handleImageChange = (fieldName, value) =>
    {
        const name = tenant[fieldName];
        const type = fieldName === 'logo' ? 'image/icon' : 'image/png';
        const imageObj = { name, type, url: value.data, isChange: true };

        setImagesSrc(imageSrc => ({ ...imageSrc, [fieldName]: imageObj }));

        // note change name when edit image
        handleFieldChange({ [fieldName]: name });
    };

    const submit = async ()=>
    {
        const hasImageChange = Object.keys(imagesSrc || {}).some(k => imagesSrc[k].isChange);
        const rs = await tenantService.updateTenant(tenant);
        const tenantUpdate = { ...tenant };


        if (rs.result === 0)
        {
            toast({ location: 'top-right', type: 'info', message: 'Chỉnh sửa thành công' });

            if (hasImageChange)
            {
                let success = true;
                if (!await updateVdmsImage(imagesSrc, tenant.sysId))
                {
                    if (!await uploadVdmsImage(imagesSrc, tenant.sysId))
                    {
                        success = false;
                    }
                }

                if (success)
                {
                    if (imagesSrc.logo.isChange)
                    {
                        tenantUpdate.logSrc = imagesSrc.logo.url;
                    }

                    if (imagesSrc.favicon.isChange)
                    {
                        window.location.reload();
                    }
                   
                    resetImageChange();
                }
                else
                {
                    toast({ location: 'top-right', type: 'error', message: 'Chỉnh sửa hình ảnh thất bại' });
                }
            }

            appConfigStore.set('tenantConfig', tenantUpdate);
        }
        
    };

    return (
        <React.Fragment>
            <PanelHeader>
                Thông tin ứng dụng
            </PanelHeader>
            <PanelBody scroll className={'new-system-form-panel'}>

                <FormGroup>
                    <FormControlLabel
                        label={'Tiêu đề'}
                        required={tenantValidate.title?.required}
                        errorText={validations.title?.errorMessage}
                        rules={defaultRules}
                        control={
                            <Input
                                placeholder={'Nhập tiêu đề'}
                                value={tenant.title}
                                onBlur={()=>handleValidate({ title: tenant?.title })}
                                onChange={(value) => handleFieldChange({ title: value })}
                            />
                        }
                    />
                    <FormControlLabel
                        label={'Phụ đề'}
                        required={tenantValidate.subtitle?.required}
                        errorText={validations.subtitle?.errorMessage}
                        rules={defaultRules}
                        control={
                            <Input
                                placeholder={'Nhập phụ đề'}
                                value={tenant.subtitle}
                                onBlur={()=>handleValidate({ subtitle: tenant?.subtitle })}
                                onChange={(value) => handleFieldChange({ subtitle: value })}
                            />
                        }
                    />
                </FormGroup>
                <Section header={'Thông tin hệ thống'}>
                    <FormGroup>
                        <FormControlLabel
                            label={'Quốc gia'}
                            rules={defaultRules}
                            control={
                                <Input
                                    value={CommonHelper.getCountryName(tenant.country)}
                                    readOnly
                                />
                            }
                        />
                        <FormControlLabel
                            label={'Ngôn ngữ'}
                            required={tenantValidate.language?.required}
                            errorText={validations.language?.errorMessage}
                            rules={defaultRules}
                            control={
                                <LanguageSelect
                                    languageOptions={languageOptions}
                                    language={tenant.language}
                                    locale={tenant.locale}
                                    onChange={handleLanguageChange}
                                />
                            }
                        />
                        <FormControlLabel
                            label={'Biểu tượng'}
                            required={tenantValidate.favicon?.required}
                            errorText={validations.favicon?.errorMessage}
                            rules={defaultRules}
                            control={
                                <UploadImageControl
                                    placeholder={'Chọn 1 ảnh...'}
                                    value={tenant.favicon}
                                    src={imagesSrc?.favicon?.url}
                                    onChange={(value) =>handleImageChange('favicon',value)}
                                />
                            }
                        />
                        <FormControlLabel
                            label={'Logo'}
                            required={tenantValidate.logo?.required}
                            errorText={validations.logo?.errorMessage}
                            rules={defaultRules}
                            control={
                                <UploadImageControl
                                    placeholder={'Chọn 1 ảnh...'}
                                    value={tenant.logo}
                                    src={imagesSrc?.logo?.url}
                                    onChange={(value) =>handleImageChange('logo',value)}
                                />
                            }
                        />

                        <FormControlLabel
                            label={'Giao diện'}
                            required={tenantValidate.theme?.required}
                            errorText={validations.theme?.errorMessage}
                            rules={defaultRules}
                            control={
                                <ThemeList
                                    themes={config?.themeList || []}
                                    currentTheme={tenant.theme}
                                    onChange={({ name }) => handleFieldChange({ theme: name })}
                                />}
                        />
                    </FormGroup>
                 
                </Section>
            </PanelBody>
            <PanelFooter
                docked={false}
                actions={[
                    {
                        disabled: !checkDirty(tenant) || !onValidateAllField(),
                        className: 'process-btn',
                        text: 'Cập nhật',
                        onClick: submit,
                    },
                ]}
            />
        </React.Fragment>
    );
};

export default inject('appStore', 'fieldForceStore')(observer(TenantConfig));

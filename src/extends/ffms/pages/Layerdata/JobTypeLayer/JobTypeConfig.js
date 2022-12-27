import './JobTypeConfig.scss';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {
    Container, PanelBody,
    Section, Row,
    withI18n,
    PanelHeaderWithSwitcher,
    Popup, withTenant, Button, CheckBox, withModal, HD6,
} from '@vbd/vui';

import { isEmpty } from 'helper/data.helper';
import { CommonHelper } from 'helper/common.helper';
import { RouterParamsHelper } from 'helper/router.helper';

import PhotoForm from 'extends/ffms/pages/Layerdata/JobTypeLayer/PhotoForm';
import Accordion from 'extends/ffms/pages/base/Accordion/Accordion';
import StatusAlert from 'extends/ffms/pages/base/Status/StatusAlert';

class JobTypeConfig extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    managerLayerStore = this.props.fieldForceStore.managerLayerStore;
    comSvc = this.props.fieldForceStore.comSvc;

    submitData = {
        jobReport: {},
        photos: {
            enable: false,
            items: [],
        },
    }

    state = {
        showCreateBtn: true,
        data: {
            jobReport: {},
            photos: {
                enable: false,
                items: [],
            },
        },
        status: false,
        alert: {},
        temItem: {},
    };

    async componentDidMount()
    {
        const { data } = this.props;
    
        if (!isEmpty(data))
        {
            if (isEmpty(data.photos))
            {
                if (data.photo)
                {
                    data.photos = { items: CommonHelper.clone(data.photo) };
                    delete data.photo;
                }
                else
                {
                    data.photos = { items: [] };
                }
            }

            data.photos['items'] = data.photos['items'].map((item) =>
            {
                item.action = 'edit';
                item.__id = Math.floor(Math.random() * Date.now());
                return item;
            });
            this.submitData = CommonHelper.clone(data);
            this.setState({
                data: data,
            });
        }
    }

    handleValueChange = (obj, key, value) =>
    {
        const { data } = this.state;
        data[obj][key] = value;
        this.setState({ data });

        this.submitData[obj][key] = value;

        this.applyConfig();
    }


    clickCreatePhotoForm = () =>
    {
        const { data, temItem } = this.state;
        data.photos['items'].push({
            Name: '',
            expanded: true,
            action: 'create',
            __id: Math.floor(Math.random() * Date.now()),
            ...temItem,
        });
        this.setState({
            showCreateBtn: false,
        });
    }

    buildJson = (data) =>
    {
        this.submitData = {
            'jobReport': {
                'enable': data?.jobReport?.enable || this.submitData.jobReport.enable,
                'required': data?.jobReport?.required || this.submitData.jobReport.required,
                'canEditInJob': data?.jobReport?.canEditInJob || this.submitData.jobReport.canEditInJob,
            },
            'photos': {
                'enable': data?.photos?.enable || this.submitData.photos?.enable,
                'items': this.submitData?.photos['items']?.filter((x) => x.action !== 'create')?.map(this.getPhotoItem) || [],
            },
        };
        return this.submitData;
    };

    getPhotoItem = (item) =>
    {
        const { type, required, canEditInJob, minQuantity, maxQuantity, Name, caption, __id } = item;
        return {
            type,
            required,
            canEditInJob,
            minQuantity,
            maxQuantity,
            Name,
            caption,
            __id,
        };
    };

    applyConfig = async (data) =>
    {
        const { layerNode } = this.props;

        const config = CommonHelper.clone(this.buildJson(data ? data : this.submitData));
        if (config)
        {
            config.photos.items = config.photos.items.map((x) =>
            {
                delete x.__id; return x;
            });
        }

        layerNode['jobtype_config'] = config;
        
        await this.comSvc.updateLayerDataByNodeId('JOB_TYPE', layerNode.Id, layerNode).then((result) =>
        {
            if (!result || result.errorMessage)
            {
                const errMsg = `${this.props.t('Có lỗi xảy ra, vui lòng thử lại sau.')}. ${result ? this.props.t(result.errorMessage) : ''}`;
                this.showAlert({ type: 'danger', icon: 'exclamation-circle', message: errMsg });
            }
            else
            {
                this.showAlert({ type: 'success', icon: 'save', message: 'Chỉnh sửa dữ liệu thành công' });
                this.managerLayerStore.reload();
            }
        });
    }

    showAlert = (children) =>
    {
        this.setState({
            status: true,
            alert: children,
        });
        setTimeout(() =>
        {
            this.setState({ status: false });
        }, 1500);
    }

    handleSubmitPhotoGallery = async (action, photoItem) =>
    {
        switch (action)
        {
            case 'create':
                photoItem.action = 'edit';
                this.submitData.photos.items.push(this.getPhotoItem(photoItem));
                break;
            case 'delete':
                this.submitData.photos.items = this.submitData.photos.items.filter((x) => x.__id !== photoItem.__id);
                break;
            case 'edit':
                this.submitData.photos.items = this.submitData.photos.items.map((x) =>
                {
                    if (x.__id === photoItem.__id)
                    {
                        return this.getPhotoItem(photoItem);
                    }

                    return x;
                });
                break;
        }

        if (action === 'create')
        {
            this.setState({
                showCreateBtn: true,
            });
        }

        this.applyConfig();
    }

    deletePhotoGallery = (id) =>
    {
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn xóa thư viện ảnh này không?',
            onOk: () =>
            {
                const { data } = this.state;
                
                const index = data.photos['items'].findIndex((x) => x.__id === id);
           
                const photoItem = data.photos['items'][index];
                
                data.photos['items'].splice(index,1);
                
                this.setState({
                    data,
                });
                this.handleSubmitPhotoGallery('delete', photoItem);
            },
        });
    }

    closeAddPhoto = (value, item) =>
    {
        const { data } = this.state;
        data.photos['items'].pop();
        this.setState({
            temItem: item,
            showCreateBtn: value,
        });
    }
    
    handleBeforeClose = () =>
    {
        if (this.managerLayerStore.isDirty)
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
    }

    closeMe = () =>
    {
        this.managerLayerStore.setShowConfig(false);
        this.managerLayerStore.setIsDirty(false);
        RouterParamsHelper.setParams(
            this.managerLayerStore.urlParams,
            this.props,
            { mode: '', select: '' },
        );
    }

    render()
    {
        const { data, showCreateBtn, alert } = this.state;
        const { showConfig } = this.managerLayerStore;

        const photoItems = data.photos['items'] && data.photos['items'].length && data.photos['items'].map((item) =>
        {
            const dataEntry = Object.assign({}, item);
            dataEntry.header = item.Name;
            dataEntry.content = (
                <PhotoForm
                    className={item.action === 'create' ? 'form-create' : 'form-edit'}
                    key={item.__id}
                    data={item}
                    action={item.action ? item.action : 'edit'}
                    onSubmit={(value) => this.handleSubmitPhotoGallery(item.action, value)}
                    onClose={(value)=> this.closeAddPhoto(value, item)}
                />
            );
            return dataEntry;
        });
        return (
            <>
                {
                    showConfig &&
                    <Popup
                        title={'Cấu hình loại công việc'}
                        width={'40rem'}
                        height={'50rem'}
                        className={'jobtype-config-popup'}
                        onBeforeClose={this.handleBeforeClose}
                        onClose={()=>this.props.onClose(false)}
                    >
                        <Container className={'div-status'}>
                            {
                                this.state.status &&
                                <StatusAlert
                                    // onlyIcon
                                    icon={alert.icon}
                                    type={alert.type}
                                    message={alert.message}
                                />
                            }
                        </Container>
                        <Section
                            className={'config-section'}
                        >
                            <PanelHeaderWithSwitcher
                                value={data.jobReport['enable'] ? 1 : 0}
                                onChanged={(value) => this.handleValueChange('jobReport', 'enable', value)}
                            >
                                Báo cáo công việc
                            </PanelHeaderWithSwitcher>
                            <PanelBody>
                                <Row>
                                    <CheckBox
                                        label="Bắt buộc"
                                        checked={data.jobReport['required'] || false}
                                        onChange={(value) => this.handleValueChange('jobReport', 'required', value)}
                                    />
                                    <CheckBox
                                        label="Có thể chỉnh sửa"
                                        checked={data.jobReport['canEditInJob'] || false}
                                        onChange={(value) => this.handleValueChange('jobReport', 'canEditInJob', value)}
                                    />
                                </Row>
                            </PanelBody>
                        </Section>

                        <Section
                            className={'config-section'}
                        >
                            <PanelHeaderWithSwitcher
                                value={data.photos['enable'] ? 1 : 0}
                                onChanged={(value) => this.handleValueChange('photos', 'enable', value)}
                            >
                                Tập Tin Đính Kèm
                            </PanelHeaderWithSwitcher>
                            <PanelBody>
                                {
                                    photoItems.length > 0 &&
                                    <Accordion
                                        items={photoItems}
                                        iconExpand={'edit'}
                                        className={!showCreateBtn ? 'open-create' : ''}
                                        actions ={[
                                            {
                                                icon: 'trash-alt',
                                                onClick: (data) => this.deletePhotoGallery(data.__id),
                                                tooltip: 'Xoá thư viện hình',
                                            },
                                        ]}
                                        active={!showCreateBtn ? photoItems.length - 1 : -1}
                                    />
                                }
                                <Row>
                                    {
                                        showCreateBtn &&
                                        <Button
                                            text={'Tạo thư viện hình mới'}
                                            icon={'plus'}
                                            iconSize={'1rem'}
                                            iconLocation={'left'}
                                            className={'btn-add-fields'}
                                            color={'var(--text-color)'}
                                            backgroundColor={'transparent'}
                                            onClick={this.clickCreatePhotoForm}
                                        />
                                    }
                                </Row>
                            </PanelBody>
                        </Section>
                    </Popup>
                }
            </>
        );
    }
}
JobTypeConfig = inject('appStore', 'fieldForceStore')(observer(JobTypeConfig));
JobTypeConfig = withTenant(withModal(withI18n(withRouter(JobTypeConfig))));
export default JobTypeConfig;

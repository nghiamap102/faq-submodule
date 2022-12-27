import './MarkerMediaStyle.scss';

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Container,
    FormControlLabel,
    Input, InputAppend, InputGroup,
    Button, T,
    Image, Tooltip, FAIcon,
} from '@vbd/vui';

import { Constants } from 'constant/Constants';

class MarkerMediaStyle extends Component
{
    inputRef = React.createRef();

    sketchMapStore = this.props.appStore.sketchMapStore;
    markerPopupStore = this.props.appStore.markerPopupStore;

    state = {
        isIconOverSize: false,
    };

    isVideo(type)
    {
        return type.split('/')[0] === 'video';
    }

    handleFileChange = () =>
    {
        const control = this.sketchMapStore.stylingControl;

        if (!control.showControl.media)
        {
            control.showControl.media = {};
        }

        if (this.inputRef.current.files && this.inputRef.current.files[0])
        {
            const img = document.createElement('img');
            const sketchMapStore = this.sketchMapStore;
            const me = this;

            img.onload = function (e)
            {
                const isOverSize = this.width > 512 || this.height > 512;
                if (!isOverSize)
                {
                    sketchMapStore.setMediaIcon(data, file.type.split('/')[0], file.name);
                }
                else
                {
                    sketchMapStore.onIconImageOverSize(file.type.split('/')[0]);
                }

                me.setState({
                    isIconOverSize: isOverSize,
                });
            };

            const reader = new FileReader();
            const file = this.inputRef.current.files[0];

            if ((file.size / 1024000).toFixed(0) > 10)
            {
                sketchMapStore.onIconImageOverSize(file.type.split('/')[0]);
                me.setState({ isIconOverSize: true });

                return;
            }
            else
            {
                me.setState({ isIconOverSize: false });
            }

            let data = null;
            reader.onload = (e) =>
            {
                data = e.target.result;
                if (file.type.split('/')[0] === 'image')
                {
                    img.src = e.target.result;
                }
                else
                {
                    sketchMapStore.setMediaIcon(data, file.type.split('/')[0], file.name);
                }

                // Set Lock here true. Because when I don't lock in SketchMapManager and function setMarkerType
                this.sketchMapStore.setStylingControl(control, true);
            };

            reader.readAsDataURL(file);
        }
    };

    handleOnInputIconSize = (value) =>
    {
        const control = this.sketchMapStore.stylingControl;

        if (!control.showControl.media)
        {
            control.showControl.media = {};
        }

        control.showControl.media.iconSize = parseFloat(value);

        this.sketchMapStore.setControlProps(control, { iconSize: control.showControl.media.iconSize });
        this.sketchMapStore.setStylingControl(control, true);
    };

    render()
    {
        const control = this.sketchMapStore.stylingControl;

        return (
            <>
                <Container className={'media-upload'}>
                    <FormControlLabel
                        label={(
                            <>
                                Ảnh/video&nbsp;
                                <Tooltip
                                    content={(
                                        <>
                                            <Container><T>Ảnh 512 x 512 px</T></Container>
                                            <Container><T>Video nhỏ hơn 10MB</T></Container>
                                        </>
                                    )}
                                    position={'right'}
                                >
                                    <FAIcon
                                        icon={'info-circle'}
                                        size={'1rem'}
                                    />
                                </Tooltip>
                            </>
                        )}
                        direction={'column'}
                        control={(
                            <InputGroup className={this.state.isIconOverSize ? 'invalid-input' : ''}>
                                <Input
                                    placeholder={this.state.isIconOverSize && control.showControl.markerType === 'image'
                                        ? 'Ảnh quá lớn!'
                                        : this.state.isIconOverSize && control.showControl.markerType === 'video' ? 'Video quá lớn!' : 'Chọn 1 ảnh/video'}
                                    value={control.showControl.media ? control.showControl.media.name : ''}
                                    disabled
                                />

                                <InputAppend>
                                    <Button
                                        icon={'upload'}
                                        backgroundColor={'transparent'}
                                        onlyIcon
                                        onClick={() =>
                                        {
                                            this.inputRef.current.click();
                                        }}
                                    />
                                </InputAppend>
                            </InputGroup>
                        )}
                    />
                    <Input
                        ref={this.inputRef}
                        className={'input-file'}
                        type={'file'}
                        accept={'image/png, image/jpeg, video/mp4, video/x-m4v, video/*'}
                        onChange={this.handleFileChange}
                    />
                </Container>
                <Container>
                    {
                        control.showControl.media && control.showControl.media.type && !this.isVideo(control.showControl.media.type) && (
                            <>
                                <FormControlLabel
                                    label={'Kích thước ảnh'}
                                    direction={'column'}
                                    control={(
                                        <Input
                                            disabled={this.props.disabled}
                                            type="range"
                                            min="0.1"
                                            max="2"
                                            step="0.1"
                                            value={control.showControl && control.showControl.media.iconSize
                                                ? control.showControl.media.iconSize
                                                : Constants.DEFAULT_IMAGE_ICON_SIZE}
                                            onChange={this.handleOnInputIconSize}
                                        />
                                    )}
                                />

                                <Container className={'media-upload-review'}>
                                    <Image
                                        fitMode={'contain'}
                                        background={'#303030'}
                                        src={control.showControl.media.data}
                                        canEnlarge
                                        onLoad={this.onImageLoad}
                                    />
                                </Container>

                            </>
                        )}
                    {
                        control.showControl.media && control.showControl.media.type && this.isVideo(control.showControl.media.type) && (
                            <Container className={'media-upload-review'}>
                                <video
                                    className="video-review-container"
                                    src={control.showControl.media.data}
                                    type={control.showControl.media.type}
                                    controls
                                    autoPlay
                                />
                            </Container>
                        )}
                </Container>
            </>
        );
    }
}

MarkerMediaStyle.propTypes = {
    disabled: PropTypes.bool,
};

MarkerMediaStyle.defaultProps = {
    disabled: false,
};

MarkerMediaStyle = inject('appStore')(observer(MarkerMediaStyle));
export default MarkerMediaStyle;

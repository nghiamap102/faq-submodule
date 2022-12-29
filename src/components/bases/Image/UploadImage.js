import './UploadImage.scss';

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FAIcon } from '@vbd/vicon';

import { Loading, useModal } from 'components/bases/Modal';

import { Image, ImageReader } from './';

const UploadImage = (props) =>
{
    const { width, height, canEnlarge, canDelete, src, className, fitMode, isLoading, onChange, onDelete, multi, limit } = props;
    const inputRef = useRef();
    const containerRef = useRef();
    const imageReader = new ImageReader();

    const { menu, toast } = useModal();

    const handleImageChange = async (event) =>
    {
        if (onChange && event.target.files && event.target.files.length > 0)
        {
            const files = Array.from(event.target.files);
            if (multi && limit && files && files.length > limit)
            {
                files.length = limit;
                toast({ type: 'error', message: `Tải lên tối đa ${limit} ảnh` });
            }

            const list = await Promise.all(files.map(async (file) =>
            {
                const fileName = file.name;
                const { image: data, orientation } = await imageReader.read(file);
                return {
                    fileName: fileName,
                    data,
                    rawData: file,
                    orientation,
                };
            }));

            event.target.value = '';
            onChange(multi ? list : list[0]);
        }
    };

    const handleChangeClick = (event) =>
    {
        event && event.stopPropagation();
        inputRef.current.click();
    };

    const handleDeleteClick = (event) =>
    {
        event && event.stopPropagation();

        if (onDelete)
        {
            onDelete();
        }
    };

    const handleClick = (event) =>
    {
        const position = event.target.getBoundingClientRect();
        const buttons = [{
            label: 'Tải ảnh lên',
            icon: (
                <FAIcon
                    className={'upload-icon'}
                    icon={'cloud-upload-alt'}
                    type={'solid'}
                    color={'var(--success-color)'}
                    size="1rem"
                />
            ),
            onClick: handleChangeClick,
        }];

        canDelete && buttons.push({
            label: 'Xoá',
            icon: (
                <FAIcon
                    className={'remove-icon'}
                    icon={'trash-alt'}
                    type={'solid'}
                    color={'var(--danger-color)'}
                    size="1rem"
                />
            ),
            onClick: handleDeleteClick,
        });

        // click action doesn't close context menu
        menu({
            id: 'click-image',
            position: { x: position.left, y: position.bottom + 3 },
            isTopLeft: true,
            actions: buttons,
            isCloseOnAction: true,
        });
    };

    return (
        <>
            <div
                ref={containerRef}
                className={`upload-image-container ${className}`}
                {...((!isLoading ? { onClick: !src ? handleChangeClick : handleClick } : {}))}
                style={{ width, height }}
            >
                {isLoading
                    ? <Loading spinnerSize={'lg'} />
                    : (
                            <>
                                {src && (
                                    <Image
                                        canEnlarge={canEnlarge}
                                        width={`calc(${width} - 4px)`}
                                        height={`calc(${height} - 4px)`}
                                        fitMode={fitMode}
                                        src={src}
                                    />
                                )}
                                <div className={'upload-image-actions'}>
                                    {!src && (
                                        <FAIcon
                                            className={'add-new-icon'}
                                            icon={'plus'}
                                            type={'solid'}
                                        />
                                    )}
                                </div>
                            </>
                        )
                }
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={'image/png, image/jpeg'}
                multiple={multi}
                hidden
                onChange={handleImageChange}
            />
        </>

    );
};

UploadImage.propTypes = {
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    fitMode: PropTypes.oneOf(['cover', 'contain', '']),
    src: PropTypes.string,
    loading: PropTypes.bool,
    canEnlarge: PropTypes.bool,
    canDelete: PropTypes.bool,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    isLoading: PropTypes.bool,
    multi: PropTypes.bool,
    limit: PropTypes.number,
};

UploadImage.defaultProps = {
    className: '',
};

export { UploadImage };

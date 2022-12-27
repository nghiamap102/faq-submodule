import './UploadImageControl.scss';
import ReactDOM from 'react-dom';

import React, { useRef,useState,useEffect } from 'react';
import { InputGroup, Input, InputAppend, EmptyButton, Row, Line, Popup, Container, Image, Loading } from '@vbd/vui';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import PropTypes from 'prop-types';

export const UploadImageControl = (props) =>
{
    const { disabled, className, placeholder, value, src, accept } = props;
    const inputRef = useRef();
    const [uploadLoading, setUploadLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() =>
    {
        setImagePreview(src);
    },[src]);
 

    const handleImageChange = () =>
    {
        setUploadLoading(true);

        if (props.onChange)
        {
            if (inputRef.current.files && inputRef.current.files[0])
            {
                const file = inputRef.current.files[0];
                const fileName = file.name;
                const reader = new FileReader();

                reader.onload = (e) =>
                {
                    props.onChange({ fileName: fileName, data: e.target.result });
                };

                reader.readAsDataURL(file);
            }
        }

        setTimeout(()=>
        {
            setUploadLoading(false);
        }, 500);
    };

    const handleZoomClick = (event) =>
    {
        const containerId = 'image-view-container';
        let element = document.getElementById(containerId);
        if (!element)
        {
            element = document.createElement('div');
            element.setAttribute('id', containerId);

            const root = document.getElementById('root');
            root.appendChild(element);
        }

        ReactDOM.render(
            <Popup
                isShowContentOnly
                scroll={false}
                onClose={() =>
                {
                    ReactDOM.render(null, element);
                }}
            >
                <Container className={'zoom-upload-image-contanier'}>
                    <TransformWrapper
                        wheel={{ step: 4 }}
                        enablePadding={false}
                        enablePanPadding={false}
                    >
                        <TransformComponent>
                            <Image
                                width='40vw'
                                src={imagePreview}
                            />
                        </TransformComponent>
                    </TransformWrapper>
                </Container>
            </Popup>,
            element,
        );

        event.stopPropagation();
    };


    return (
        <>
            <InputGroup className={`${className} ${disabled ? 'disabled' : ''} upload-image-control`}>
                <Input
                    className={'upload-image-name'}
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    onChange={()=>
                    {}}
                />

                <InputAppend>
                    <Row>
                        <EmptyButton
                            className='upload-button'
                            disabled = {disabled}
                            icon={'upload'}
                            backgroundColor={'transparent'}
                            onlyIcon
                            onClick={() => inputRef?.current.click()}
                        />
                        <Line width={'1px'} color={'var(--border)'} height={'unset'}/>


                        {
                            uploadLoading ? <Loading className={'icon-loading'} spinnerSize='sm' /> :
                                <Image
                                    className={'icon-image'}
                                    width='1.4rem'
                                    disabled = {disabled}
                                    src={imagePreview}
                                    canEnlarge
                                // onClick={handleZoomClick}
                                />
                        }
                       
                       
                    </Row>
                </InputAppend>
            </InputGroup>
            <Input
                ref={inputRef}
                className={'hide'}
                type={'file'}
                accept={accept}
                onChange={handleImageChange}
            />


        </>
    );
};


UploadImageControl.propTypes = {
    value: PropTypes.string,
    src: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.boolean,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    accept: PropTypes.string,
};

UploadImageControl.defaultProps = {
    value: '',
    className: '',
    src: '',
    disabled: false,
    accept: 'image/*',
};

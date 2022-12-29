import './Image.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { Popup } from '../Popup/Popup';
import { T } from 'components/bases/Translate/Translate';
import { FAIcon } from '@vbd/vicon';

export class Image extends Component
{
    state = {
        imgSrcError: false,
        src: '',
    };

    constructor(props)
    {
        super(props);

        this.imageRef = React.createRef();
        this.inputRef = React.createRef();
    }

    static getDerivedStateFromProps = (nextProps, prevState) =>
    {
        if (nextProps.src !== prevState.src)
        {
            return { src: nextProps.src, imgSrcError: false };
        }

        return false;
    };

    componentWillUnmount()
    {
        try
        {
            this.imageRef.current.src = '';
            delete this.imageRef.current.src;
        }
        catch (e)
        {
            console.error(e);
        }
    }

    handleClick = (event) =>
    {
        if (this.props.onClick)
        {
            this.props.onClick(event);
        }
    };

    handleDownloadImage = () =>
    {
        const a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);

        // Set the HREF to a Blob representation of the data to be downloaded
        const src = this.props.src[0] === '/' ? window.location.origin + this.props.src : this.props.src;
        a.href = this.props.src.includes('data:image') || this.props.src[0] === '/' ? src : '/api/download?url=' + src;

        const tzOffset = (new Date()).getTimezoneOffset() * 60000;
        // Use download attribute to set set desired file name
        a.setAttribute('download', new Date(Date.now() - tzOffset).toISOString().slice(0, -5));

        // Trigger the download by simulating click
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    };

    handleZoomClick = (event) =>
    {
        this.handleClick(event);

        if (this.props.canEnlarge)
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
                    scroll={false}
                    headerActions={[
                        { icon: 'arrow-to-bottom', onClick: this.handleDownloadImage },
                    ]}
                    isShowContentOnly
                    onClose={() =>
                    {
                        ReactDOM.render(null, element);
                    }}
                >
                    <TransformWrapper
                        wheel={{ step: 4 }}
                        enablePadding={false}
                        enablePanPadding={false}
                    >
                        <TransformComponent>
                            <img
                                style={{ maxWidth: '90vw', maxHeight: '90vh', minWidth: '400px', minHeight: '400px' }}
                                src={this.props.src}
                                alt={this.props.alt}
                            />
                        </TransformComponent>
                    </TransformWrapper>
                </Popup>,
                element,
            );

            event.stopPropagation();
        }
    };

    handleImageChange = (event) =>
    {
        if (typeof this.props.onChange === 'function')
        {
            if (event.target.files && event.target.files[0])
            {
                const fileName = event.target.files[0].name;
                const reader = new FileReader();
                reader.onload = (e) =>
                {
                    this.props.onChange(this.props.id, {
                        fileName: fileName,
                        data: e.target.result,
                    });
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        }
    };

    handleChangeClick = (event) =>
    {
        this.inputRef.current.click();
        event.stopPropagation();
    };

    handleDeleteClick = (event) =>
    {
        if (typeof this.props.onDelete === 'function')
        {
            this.props.onDelete(this.props.id);
            event.stopPropagation();
        }
    };

    handleImgSrcError = (_error) =>
    {
        this.setState({ imgSrcError: true });
    };

    render()
    {
        const { width, height, background, canEnlarge, src, alt, className, fitMode, label, circle } = this.props;
        const { altSrc } = this.props;
        const { imgSrcError } = this.state;

        return (
            <div
                className={`image-container ${className}`}
                style={{ width, background }}
            >
                <img
                    ref={this.imageRef}
                    crossOrigin="anonymous" // for load image from cors and canvas build from it not being tainted
                    className={'image-content'}
                    src={imgSrcError && altSrc ? altSrc : src}
                    style={{ height, objectFit: fitMode, borderRadius: circle ? '50%' : '' }}
                    alt={alt}
                    onLoad={this.props.onLoad}
                    onError={this.handleImgSrcError}
                    onClick={this.handleClick}
                />
                {
                    canEnlarge && !imgSrcError && (
                        <div
                            className={'image-zoom'}
                            onClick={this.handleZoomClick}
                        >
                            <FAIcon
                                className="icon"
                                icon={'expand'}
                                size={'1.2rem'}
                            />
                        </div>
                    )}

                {
                    label &&
                    <div className={'image-label'}><T>{label}</T></div>
                }
            </div>
        );
    }
}

Image.propTypes = {
    className: PropTypes.string,
    id: PropTypes.any,
    canEnlarge: PropTypes.bool, // set true when you want the image can be open large on click
    width: PropTypes.string,
    height: PropTypes.string,
    src: PropTypes.string.isRequired,
    altSrc: PropTypes.string,
    alt: PropTypes.string,
    onClick: PropTypes.func,
    background: PropTypes.string,
    fitMode: PropTypes.oneOf(['cover', 'contain', '']),
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    onLoad: PropTypes.func,
    label: PropTypes.any,
    circle: PropTypes.bool,
};

Image.defaultProps = {
    className: '',
    canEnlarge: false,
    width: '',
    height: '',
    src: '',
    alt: '',
    background: '',
    fitMode: 'cover',
    circle: false,
    onClick: () =>
    {
    },
    onChange: () =>
    {
    },
    onDelete: () =>
    {
    },
};

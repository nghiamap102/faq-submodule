import React from 'react';
import PropTypes from 'prop-types';

import { Image } from './Image';

class CropImage extends React.Component
{
    state = {
        cropImage: '',
    };

    canvasRef = React.createRef();
    imgRef = React.createRef();

    componentDidMount()
    {
        const { box } = this.props;

        const canvas = this.canvasRef.current;
        const img = this.imgRef.current;

        canvas.width = box.width;
        canvas.height = box.height;
        const ctx = canvas.getContext('2d');

        img.onload = () =>
        {
            let x = box.x;
            let y = box.y;
            let width = box.width;
            let height = box.height;
            if (this.props.unit === '%')
            {
                x = Math.floor(x * img.width);
                y = Math.floor(y * img.height);
                width = Math.ceil(width * img.width);
                height = Math.ceil(height * img.height);
                canvas.width = width;
                canvas.height = height;
            }


            ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

            this.setState({ cropImage: canvas.toDataURL() });
        };
    }

    render()
    {
        return (
            <div style={{ border: `1px solid ${this.props.borderColor || 'transparent'}`, width: 'fit-content', margin: 'auto' }}>
                <div style={{ display: 'none' }}>
                    <canvas ref={this.canvasRef} />
                    <img
                        crossOrigin="anonymous"
                        ref={this.imgRef}
                        alt={'hidden'}
                        src={this.props.imageData}
                    />
                </div>

                <Image
                    src={this.state.cropImage}
                    alt={this.props.alt}
                    {...this.props}
                />
            </div>
        );
    }
}

export { CropImage };

CropImage.propTypes = {
    className: PropTypes.string,
    imageData: PropTypes.string,
    box: PropTypes.object,
    unit: PropTypes.string,
    borderColor: PropTypes.string,
};

CropImage.defaultProps = {
    className: '',
};

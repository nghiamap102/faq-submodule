import React from 'react';
import PropTypes from 'prop-types';

import { Image } from './Image';

class DetectImage extends React.Component
{
    state = {
        image: this.props.imageData
    };

    canvasRef = React.createRef();

    handleImageLoad = (event) =>
    {
        const { boxes } = this.props;

        const canvas = this.canvasRef.current;
        const { width, height } = event.currentTarget;

        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(event.currentTarget, 0, 0);

        for (const box of boxes)
        {
            ctx.beginPath();
            ctx.lineWidth = 6;
            ctx.strokeStyle = box.color;
            ctx.rect(box.left * width, box.top * height, box.width * width, box.height * height);
            ctx.stroke();
        }

        for (const box of boxes)
        {
            ctx.font = '35px Verdana';
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'white';
            ctx.strokeText(box.label, box.left * width, box.top * height - 10);
            ctx.fillStyle = box.color;
            ctx.fillText(box.label, box.left * width, box.top * height - 10);
        }

        this.setState({ image: canvas.toDataURL('image/jpeg', 0.7) });
    };

    render()
    {
        return (
            <div>
                <div style={{ display: 'none' }}>
                    <canvas ref={this.canvasRef} />
                    <img
                        alt={'hidden'}
                        crossOrigin={'anonymous'}
                        src={this.props.imageData}
                        onLoad={this.handleImageLoad}
                    />
                </div>

                <Image
                    src={this.state.image}
                    {...this.props}
                />
            </div>
        );
    }
}

export { DetectImage };

DetectImage.propTypes = {
    className: PropTypes.string,
    imageData: PropTypes.string,
    boxes: PropTypes.array
};

DetectImage.defaultProps = {
    className: ''
};

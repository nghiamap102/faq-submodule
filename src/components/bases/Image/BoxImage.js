import React from 'react';
import PropTypes from 'prop-types';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Image } from 'components/bases/Image/Image';

class BoxImage extends React.Component
{
    borderWidth = 2;

    state = {
        src: '',
        loaded: false,
        boxes: []
    };

    canvasRef = React.createRef();
    currentTarget = null;

    static getDerivedStateFromProps = (nextProps, prevState) =>
    {
        if (prevState.src !== nextProps.imageData)
        {
            return { src: nextProps.imageData, loaded: false };
        }
        else
        {
            return null;
        }
    };

    handleImageLoad = (event) =>
    {
        this.currentTarget = event.currentTarget;

        const canvas = this.canvasRef.current;
        const { naturalWidth, naturalHeight } = event.currentTarget;

        const ctx = canvas.getContext('2d');

        canvas.width = naturalWidth;
        canvas.height = naturalHeight;

        ctx.drawImage(event.currentTarget, 0, 0);

        this.props.onImageLoaded && this.props.onImageLoaded(canvas.toDataURL('image/jpeg', 0.7));

        this.setState({ loaded: true });
    };

    handleOnClick = (box) =>
    {
        this.props.onClick && this.props.onClick(box);
    };

    getMarkupImage = () =>
    {
        const { boxes } = this.props;
        const { naturalWidth, naturalHeight } = this.currentTarget;

        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = naturalWidth;
        canvas.height = naturalHeight;

        ctx.drawImage(this.currentTarget, 0, 0);

        for (const box of boxes)
        {
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = this.props.choosingId === box.id ? this.props.choosingColor || 'yellow' : box.color;
            ctx.rect(box.left * naturalWidth, box.top * naturalHeight, box.width * naturalWidth, box.height * naturalHeight);
            ctx.stroke();
        }

        for (const box of boxes)
        {
            ctx.font = '35px Verdana';
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'white';
            ctx.strokeText(box.label, box.left * naturalWidth, box.top * naturalHeight - 10);
            ctx.fillStyle = this.props.choosingId === box.id ? this.props.choosingColor || 'yellow' : box.color;
            ctx.fillText(box.label, box.left * naturalWidth, box.top * naturalHeight - 10);
        }

        return canvas.toDataURL('image/jpeg', 0.7);
    };

    getBoxStyle = (b) =>
    {
        return {
            position: 'absolute',
            left: `calc(${b.left * 100}% - ${this.borderWidth / 2}px)`,
            top: `calc(${b.top * 100}% - ${this.borderWidth / 2}px)`,
            width: `calc(${b.width * 100}% - ${this.borderWidth / 2}px)`,
            height: `calc(${b.height * 100}% - ${this.borderWidth / 2}px)`,
            // border: `${b.border} solid ${this.props.choosingId === b.id ? this.props.choosingColor || 'yellow' : b.color}`,
            opacity: 0.8
        };
    };

    render()
    {
        return (
            <TransformWrapper
                wheel={{ step: 4 }}
                enablePadding={false}
                enablePanPadding={false}
            >
                <TransformComponent>
                    <div style={{ position: 'relative' }}>
                        <canvas ref={this.canvasRef} style={{ display: 'none' }} />
                        {
                            this.state.loaded ?
                                <Image
                                    src={this.getMarkupImage()}
                                /> :
                                <Image
                                    ref={this.imageRef}
                                    src={this.props.imageData}
                                    onLoad={this.handleImageLoad}
                                />
                        }
                        {
                            this.props.boxes
                                .filter((b) => b.width < 0.7 && b.height < 0.7)
                                .sort((a, b) => b.width * b.height - a.width * a.height)
                                .map((b, i) =>
                                    <div
                                        key={i}
                                        onClick={() => this.handleOnClick(b)}
                                        style={this.getBoxStyle(b)}
                                    />
                                )
                        }
                    </div>
                </TransformComponent>
            </TransformWrapper>
        );
    }
}

export { BoxImage };

BoxImage.propTypes = {
    className: PropTypes.string,
    imageData: PropTypes.string,
    boxes: PropTypes.array,
    width: PropTypes.string,
    height: PropTypes.string,
    onClick: PropTypes.func,
    choosingColor: PropTypes.string,
    choosingId: PropTypes.string,
    onImageLoaded: PropTypes.func
};

BoxImage.defaultProps = {
    className: ''
};

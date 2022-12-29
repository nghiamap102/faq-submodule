import './FSImage.scss';
import unknownFace from 'images/faceImage/unknown-face.png';

import React from 'react';
import PropTypes from 'prop-types';

import { Image } from 'components/bases/Image/Image';
import { CropImage } from 'components/bases/Image/CropImage';
import { T } from 'components/bases/Translate/Translate';

export const FSImage = ({ fitMode, score, accuracy, title, active, onClick, backgroundImage, widthImage, heightImage, src, ...props }) =>
{
    const bestClass = accuracy > 0.6 ? 'fsi-best-match' : '';

    return (
        <div className={`fsi ${bestClass}`}>
            <div
                className={'fsi-container '}
                style={{ width: widthImage }}
                onClick={onClick}
            >
                <div className={`fsi-content ${active ? 'active' : ''}`}>
                    {title && <p className={'fsi-label top'}><T>{title}</T></p>}

                    {
                        typeof src === 'string' ?
                            <Image
                                width={widthImage}
                                height={heightImage}
                                fitMode={fitMode}
                                background={backgroundImage}
                                {...props}
                                src={src}
                                altSrc={unknownFace}
                            /> :
                            <CropImage
                                imageData={src.imageData}
                                box={src.box}
                                width={widthImage}
                                height={heightImage}
                                fitMode={fitMode}
                                background={backgroundImage}
                                altSrc={unknownFace}
                                {...props}
                            />
                    }

                    {score && <p className={'fsi-label bottom'}><T>Score</T> {Math.floor(score * 100)}</p>}

                    {
                        accuracy &&
                        <p className={'fsi-label bottom'}>{(accuracy * 100).toFixed(0) + '%'}</p>
                    }
                </div>

            </div>
        </div>
    );
};

FSImage.propTypes = {
    fitMode: PropTypes.string,
    src: PropTypes.any,
    canEnlarge: PropTypes.bool,
    score: PropTypes.number,
    accuracy: PropTypes.number,
    widthImage: PropTypes.string,
    heightImage: PropTypes.string,
    title: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    backgroundImage: PropTypes.string
};

FSImage.defaultProps = {
    fitMode: 'contain',
    canEnlarge: false,
    score: null,
    accuracy: null,
    title: '',
    widthImage: '',
    heightImage: '',
    active: false,
    backgroundImage: '',
    onClick: () =>
    {
    }

};

export default FSImage;

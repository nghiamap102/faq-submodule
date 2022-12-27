import PropTypes from 'prop-types';
import React from 'react';

import { Image } from '@vbd/vui';
import unknownFace from 'images/faceImage/unknown-face.jpg';

export const FileImage = ({ className, info, altSrc, ...props }) =>
{
    if (info && typeof (info) === 'string')
    {
        try
        {
            info = JSON.parse(info);
        }
        catch (e)
        {
            // do nothing
        }
    }

    return (
        <Image
            className={`ei-avatar ${className || ''}`}
            src={info ? `/api/ffms/containers/file-stream?fileId=${info.guid}&mimeType=${info.mimetype}` : unknownFace}
            altSrc={info?.altSrc ? info.altSrc : unknownFace}
            alt={info ? info.name : ''}
            {...props}
        />
    );
};

FileImage.propTypes = {
    className: PropTypes.string,
    info: PropTypes.any,
    altSrc: PropTypes.string,
};

FileImage.defaultProps = {
    className: '',
};

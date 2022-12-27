import React, { useEffect, useState } from 'react';

import { Image } from '@vbd/vui';

import unknownImage from 'images/ic-default.svg';

import FileService from 'services/file.service';
import { AppConstant } from 'constant/app-constant';
import { AuthHelper } from 'helper/auth.helper';

export const LayerIcon = (props) =>
{
    const { path, layer, width, height } = props;

    const [iconPath, setIconPath] = useState(unknownImage);

    useEffect(() =>
    {
        if (path)
        {
            FileService.getFile(path).then(rs =>
            {
                setIconPath(rs);
            });
        }
        else if (layer)
        {
            setIconPath(`${AppConstant.vdms.url}/app/render/GetLayerIcon.ashx?LayerName=${layer.toUpperCase()}&access_token=${AuthHelper.getVDMSToken()}`);
        }
    }, []);

    return (
        <Image
            src={iconPath}
            width={width}
            height={height}
            altSrc={unknownImage}
        />
    );
};

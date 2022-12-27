import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Field, Info, Label, FAIcon, Link } from '@vbd/vui';

import FileService from 'services/file.service';

export const FileField = ({ fileInfo, onLinkClick }) =>
{
    const [fileContent, setFileContent] = useState(null);
    const [icon, setIcon] = useState(null);

    useEffect(() =>
    {
        const fileService = new FileService();

        fileService.getContent(fileInfo.FileId).then((res) =>
        {
            if (res.data)
            {
                const icon = getIconFromMIME(res.data?.MimeType.MimeType);

                setFileContent(res.data);
                setIcon(icon);
            }
        });
    }, [fileInfo]);


    const getIconFromMIME = (mimeType) =>
    {
        const iconClasses = {
            // Media
            'image': 'file-image',
            'audio': 'file-audio',
            'video': 'file-video',
            // Documents
            'application/pdf': 'file-pdf',
            'application/msword': 'file-word',
            'application/vnd.ms-word': 'file-word',
            'application/vnd.oasis.opendocument.text': 'file-word',
            'application/vnd.openxmlformatsfficedocument.wordprocessingml':
                'file-word',
            'application/vnd.ms-excel': 'file-excel',
            'application/vnd.openxmlformatsfficedocument.spreadsheetml':
                'file-excel',
            'application/vnd.oasis.opendocument.spreadsheet': 'file-excel',
            'application/vnd.ms-powerpoint': 'file-powerpoint',
            'application/vnd.openxmlformatsfficedocument.presentationml':
                'file-powerpoint',
            'application/vnd.oasis.opendocument.presentation': 'file-powerpoint',
            'text/plain': 'file-alt',
            'text/html': 'file-code',
            'application/json': 'file-code',
            // Archives
            'application/gzip': 'file-archive',
            'application/zip': 'file-archive',
        };

        let iconReturn = 'file';

        Object.keys(iconClasses).map((iconKey) =>
        {
            if (iconClasses.hasOwnProperty(iconKey))
            {
                if (mimeType?.includes(iconKey))
                {
                    // Found it
                    iconReturn = iconClasses[iconKey];
                }
            }
        });

        return iconReturn;
    };

    return (
        <Field key={fileInfo?.Id}>
            <Label>
                {
                    icon &&
                    <FAIcon
                        icon={icon}
                        color={'rgb(22, 147, 224)'}
                    />
                }
            </Label>
            <Info>
                <Link
                    onClick={() => onLinkClick(fileContent)}
                >
                    {fileContent?.Title}
                </Link>
            </Info>
        </Field>
    );
};

FileField.propTypes = {
    fileInfo: PropTypes.object,
    onLinkClick: PropTypes.func,
};

FileField.defaultProps = {
    fileInfo: {},
    onLinkClick: () =>
    {
    },
};

import React, { useRef, useState } from 'react';
import { FAIcon } from '@vbd/vicon';

import { InputGroup } from 'components/bases/Form';
import { Input } from 'components/bases/Input';

import './FileInput.scss';
interface FileField {
    onChangeFiles?: Function,
}

export const FileInput = ({ onChangeFiles }: FileField): React.ReactElement =>
{
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    const handleChangeInput = () =>
    {
        const fileList = inputRef.current?.files;
        if (fileList && fileList.length > 0)
        {
            const files: File[] = [];
            fileList.length > 0 && files.push(fileList[0]);
            onChangeFiles && onChangeFiles(files);
            setFiles(files);
        }
    };

    const handleClearValue = (e: Event) =>
    {
        e.stopPropagation();
        if (files && files.length > 0)
        {
            onChangeFiles && onChangeFiles([]);
            setFiles([]);
        }
    };

    const displayValue = files.map((file: File) => file.name).join(', ');

    return (
        <div
            className="file_input"
            onClick={() => inputRef.current && inputRef.current.click()}
        >
            <InputGroup>
                <Input
                    placeholder={'Select file'}
                    value={displayValue}
                    disabled
                />
                <input
                    ref={inputRef}
                    type="file"
                    style={{
                        display: 'none',
                    }}
                    onChange={handleChangeInput}
                />

                {files && files.length > 0 && (
                    <div className="file_input-button">
                        <FAIcon
                            type={'solid'}
                            icon={'times'}
                            size={'14px'}
                            onClick={(e: Event) => handleClearValue(e)}
                        />
                    </div>
                )}

                {(!files || files.length < 1) && (
                    <div className="file_input-button">
                        <FAIcon
                            type={'solid'}
                            icon={'upload'}
                            size={'14px'}
                        />
                    </div>
                )}
            </InputGroup>
        </div>
    );
};

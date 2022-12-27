import React, { useEffect, useRef, useState } from 'react';

import { useModal, AdvanceSelect, Button, FormControlLabel } from '@vbd/vui';

import { PlateWatchListService } from 'services/plate-watch-list.service';

interface PlateImportUploadProps
{
    onLoad: (name: string, excel: string, watchListIds: string[]) => void;
}

const plateWatchListSvc = new PlateWatchListService();

export const PlateImportUploadButton: React.FC<PlateImportUploadProps> = (props) =>
{
    const { toast, confirm } = useModal();
    const [watchListIds, setWatchListIds] = useState<string[]>([]);
    const [watchListOptions, setWatchListOptions] = useState<{id: string, name: string}[]>([]);

    useEffect(() =>
    {
        plateWatchListSvc.getAll().then((watchList) => setWatchListOptions(watchList.data));
    }, []);

    const inputRef = useRef<HTMLInputElement>(null);

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = event.target.files?.[0];
        if (!file)
        {
            toast({ type: 'error', message: 'Không tìm thấy tập tin' });
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = async function (ev: ProgressEvent<FileReader>)
        {
            const excel = (ev.target?.result as string).split(',')[1];
            if (!excel)
            {
                toast({ type: 'error', message: ('Không parse được tập tin ' + file.name) });
                return;
            }
            if (inputRef.current)
            {
                inputRef.current.value = '';
            }
            props.onLoad(file.name, excel, watchListIds);
        };

        fileReader.readAsDataURL(file);
    };

    return (
        <>
            <label
                htmlFor="upload-excel"
                style={{
                    cursor: 'pointer',
                    height: '40px',
                    display: 'inline-block',
                    marginLeft: '0.5rem',
                }}
            >
                <Button
                    text={'Chọn tập tin'}
                    style={{
                        color: 'var(--contrast-color)',
                    }}
                    size='sm'
                    onClick={() =>
                    {
                        confirm({
                            message: (
                                <FormControlLabel
                                    label={'Theo dõi'}
                                    control={(
                                        <AdvanceSelect
                                            options={watchListOptions.map((wl) =>
                                            {
                                                return { id: wl.id, label: wl.name };
                                            })}
                                            value={watchListIds || []}
                                            multi
                                            onChange={(value: any) => Array.isArray(value) && setWatchListIds(value)}
                                        />
                                    )}
                                />
                            ),
                            onOk: () => inputRef.current?.click(),
                        });
                    }}
                />
            </label>
            <input
                ref={inputRef}
                id="upload-excel"
                type="file"
                style={{ display: 'none' }}
                accept='.xls,.xlsx,.csv'
                onChange={onChange}
            />
        </>
    );
};

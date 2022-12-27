import { useContext, useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';

import {
    useModal,
    AdvanceSelect, Button, FormControlLabel,
} from '@vbd/vui';


import { WatchListService } from 'services/watchList.service';

import { FaceImportContext, SessionTypes } from '../FaceImportContext';
import { FaceImportService } from '../FaceImportService';

const watchListSvc = new WatchListService();

let UploadGalleryButton = () =>
{
    const { toast, confirm } = useModal();
    const { reloadSessions, setCurrentSession } = useContext(FaceImportContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const [watchListIds, setWatchListIds] = useState<string[]>([]);
    const [watchListOptions, setWatchListOptions] = useState<{id: string, name: string}[]>([]);

    useEffect(() =>
    {
        watchListSvc.gets().then((watchList) => setWatchListOptions(watchList.data));
    }, []);

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
            const newSessions = await FaceImportService.createSession({ name: file.name, type: SessionTypes.Gallery, file: excel, watchList: watchListIds });
            const sessions = await reloadSessions();
            setCurrentSession(sessions.find((session) => newSessions.id === session.id));
            if (inputRef.current)
            {
                inputRef.current.value = '';
            }
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
                    icon='file-excel'
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

UploadGalleryButton = inject('appStore')(observer(UploadGalleryButton));


export default UploadGalleryButton;

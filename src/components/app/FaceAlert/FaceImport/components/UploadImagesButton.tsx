import React, { useContext, useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import pLimit from 'p-limit';

import {
    Button,
    useModal,
    FormControlLabel, AdvanceSelect,
    ImageReader,
} from '@vbd/vui';

import { WatchListService } from 'services/watchList.service';

import { FaceImportContext, ImportStatus, SessionTypes } from '../FaceImportContext';
import { FaceImportService } from '../FaceImportService';

const limit = pLimit(6);

const watchListSvc = new WatchListService();

let UploadImageFolderButton = () =>
{
    const { toast, confirm } = useModal();
    const imageReader = ImageReader();
    const { setCurrentSession, reloadSessions } = useContext(FaceImportContext);
    const [watchListIds, setWatchListIds] = useState<string[]>([]);
    const [watchListOptions, setWatchListOptions] = useState<{id: string, name: string}[]>([]);

    useEffect(() =>
    {
        watchListSvc.gets().then((watchList) => setWatchListOptions(watchList.data));
    }, []);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() =>
    {
        if (inputRef.current)
        {
            inputRef.current.setAttribute('directory', '');
            inputRef.current.setAttribute('webkitdirectory', '');
        }
    }, []);

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        if (!event.target.files)
        {
            toast({ type: 'error', message: 'Không tìm thấy hình ảnh' });
            return;
        }
        const files = Array.from(event.target.files).filter((file) => file.type.match(/image\/*/));

        if (!files.length)
        {
            toast({ type: 'error', message: 'Không tìm thấy hình ảnh' });
            return;
        }
        toast({ message: 'Đang tải', type: 'info' });
        const sessionName = files[0]?.webkitRelativePath.split('/')[0];

        const session = await FaceImportService.createSession({ name: sessionName, type: SessionTypes.Image, total: files.length });
        const sessionId = session.id;
        const sessions = await reloadSessions();

        setCurrentSession(sessions.find((value) => value.id === session.id));

        const requests = files.map(async (file, index) =>
        {
            const arrayPath = file.webkitRelativePath.split('/');
            const dirName = arrayPath[arrayPath.length - 2];

            const personId = dirName;

            const { image: data, orientation } = await imageReader.read(file);

            const image = data.split(',')[1];
            return limit(() => FaceImportService.uploadImage({ image, sessionId, personId, orientation, watchList: watchListIds }));
        });

        await Promise.allSettled(requests);
        await FaceImportService.setSessionStatus(sessionId, ImportStatus.Uploaded);
        await reloadSessions();

        toast({ type: 'success', message: 'Đã tải xong tất cả hình' });

        if (inputRef.current)
        {
            inputRef.current.value = '';
        }
    };

    return (
        <>
            <label
                htmlFor="multiple-upload"
                style={{
                    cursor: 'pointer',
                    height: '40px',
                    display: 'inline-block',
                }}
            >
                <Button
                    text={'Chọn thư mục'}
                    style={{
                        // pointerEvents: 'none',
                        color: 'var(--contrast-color)',
                    }}
                    icon='folder'
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
                id="multiple-upload"
                type="file"
                style={{ display: 'none' }}
                multiple
                onChange={onChange}
            />
        </>
    );
};

UploadImageFolderButton = inject('appStore')(observer(UploadImageFolderButton));

export default UploadImageFolderButton;
